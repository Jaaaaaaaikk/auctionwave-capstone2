import { defineEventHandler, createError } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  // Extract token from Authorization header
  const token = event.req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'No token provided',
    });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, 'hello123z'); // Verify JWT token
    userId = decoded.userId;
    console.log('Decoded User ID:', userId); // Debug: Check decoded user ID
  } catch (err) {
    console.error('JWT Verification Error:', err); // Debug: Check JWT verification errors
    throw createError({
      statusCode: 401,
      message: 'Invalid token',
    });
  }

  // Create the base query
  let query = `
    SELECT 
      al.name AS auctionName,
      b.bid_amount AS amount,
      b.bid_time AS date,
      al.status AS status
    FROM Bids b
    JOIN AuctionListings al ON b.listing_id = al.listing_id
    JOIN AuctionParticipants ap ON b.participant_id = ap.participant_id
    WHERE ap.bidder_id = ?
    ORDER BY b.bid_time DESC
  `;

  const queryParams = [userId];

  // Open a connection to the database
  const pool = await getPool();

  try {
    // Execute the query with the provided parameters
    const [rows] = await pool.query(query, queryParams);

    console.log('Fetched Bids:', rows); // Debug: Check fetched bids

    return rows;
  } catch (error) {
    console.error('Database Query Error:', error); // Debug: Check database query errors
    throw createError({
      statusCode: 500,
      message: 'Error fetching bidding history',
    });
  }
});
