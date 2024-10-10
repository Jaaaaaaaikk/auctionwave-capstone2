// server/api/fill-in-bidder-participants.js
import { defineEventHandler, getCookie, createError } from 'h3'; 
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const pool = getPool();

  // Extract listing ID from query
  const listingId = event.req.url?.split('?')[1]?.split('=')[1];
  if (!listingId) {
    throw createError({ statusCode: 400, message: 'Listing ID is required' });
  }

  let decoded;
  try {
    // Get JWT token from cookie and verify it
    const token = getCookie(event, "accessToken");
    if (!token) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

  try {
    // Retrieve the latest bid for each distinct bidder, along with their previous bids for tracking
    const [biddersRows] = await pool.query(`
      SELECT 
          u.user_id,
          u.firstname,
          u.lastname,
          b.bid_amount,
          b.bid_time,
          ROW_NUMBER() OVER (PARTITION BY u.user_id ORDER BY b.bid_time DESC) as rn
      FROM 
          Users u
      JOIN 
          AuctionVisits av ON u.user_id = av.bidder_id
      JOIN 
          Bids b ON b.participant_id = av.participant_id
      WHERE 
          av.listing_id = ?
      ORDER BY 
          b.bid_amount ASC;`, [listingId]);

    // Filter to get only the latest bid per user
    const latestBidders = biddersRows.filter(row => row.rn === 1);

    // Retrieve the lowest current bid for the auction
    const [lowestBidRow] = await pool.query(`
      SELECT 
          MIN(b.bid_amount) AS lowest_bid
      FROM 
          Bids b
      JOIN 
          AuctionVisits av ON b.participant_id = av.participant_id
      WHERE 
          av.listing_id = ?;`, [listingId]);

    const lowestBid = lowestBidRow.length > 0 ? lowestBidRow[0].lowest_bid : null;

    return { bidders: latestBidders, currentUserId: decoded.userId, lowestBid };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Database query failed' });
  }
});
