import { defineEventHandler, getHeader, createError } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

const secretKey = 'hello123z'; // JWT secret key

export default defineEventHandler(async (event) => {
  const pool = getPool();

  // Extract auctionId from query params
  const auctionId = event.req.url?.split('?')[1]?.split('=')[1];

  if (!auctionId) {
    throw createError({ statusCode: 400, message: 'Auction ID is required' });
  }

  // Verify JWT token
  const authHeader = getHeader(event, 'Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secretKey);
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

  const bidderId = decodedToken.userId;

  try {

    const [rows] = await pool.query(
      `SELECT B.bid_id 
FROM Bids B
JOIN AuctionParticipants AP ON B.participant_id = AP.participant_id
JOIN AuctionListings AL ON B.listing_id = AL.listing_id
JOIN Users U ON AP.bidder_id = U.user_id
WHERE U.user_id = ?
AND AL.listing_id = ?
LIMIT 1;
`,
      [auctionId, bidderId]
    );

    const isParticipant = rows.length > 0;

    return { isParticipant };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Database query failed' });
  }
});
