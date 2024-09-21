import { defineEventHandler, getCookie, createError } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const pool = getPool();

  // Extract the `id` parameter from the query string
  const listingId = event.req.url?.split('?')[1]?.split('=')[1];

  if (!listingId) {
    throw createError({ statusCode: 400, message: 'Listing ID is required' });
  }

  let decoded;
  try {
    // Retrieve the access token from cookies
    const token = getCookie(event, "accessToken");

    if (!token) {
      // No token found, return an unauthorized error
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    // Decode the token
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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

    // Return bidders and the current user ID
    return { bidders: rows, currentUserId: decoded.userId };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Database query failed' });
  }
});
