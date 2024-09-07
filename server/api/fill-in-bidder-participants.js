import { defineEventHandler, getHeader, createError } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

const secretKey = 'hello123z'; // JWT secret key

export default defineEventHandler(async (event) => {
  const pool = getPool();

  // Extract the `id` parameter from the query string
  const listingId = event.req.url?.split('?')[1]?.split('=')[1];

  if (!listingId) {
    throw createError({ statusCode: 400, message: 'Listing ID is required' });
  }

  // Verify JWT token
  const authHeader = getHeader(event, 'Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, secretKey);
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

  try {
    // Retrieve bidder details
    const [rows] = await pool.query(`
SELECT 
    u.user_id,
    u.firstname,
    u.lastname
FROM Users u
JOIN AuctionParticipants ap ON u.user_id = ap.bidder_id
WHERE ap.listing_id = ?
AND (
    EXISTS (
        SELECT 1
        FROM Bids b
        WHERE b.participant_id = ap.participant_id
        AND b.listing_id = ap.listing_id
    )
    OR
    EXISTS (
        SELECT 1
        FROM Offers o
        WHERE o.bidder_id = ap.bidder_id
        AND o.listing_id = ap.listing_id
    )
);
    `, [listingId]);

    return { bidders: rows };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Database query failed' });
  }
});
