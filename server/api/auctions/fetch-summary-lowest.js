import { defineEventHandler, getCookie, createError } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    // Extract listing ID from query
    const listingId = event.req.url?.split('?')[1]?.split('=')[1];
    if (!listingId) {
        throw createError({ statusCode: 400, message: 'Listing ID is required' });
    }

    // Decode JWT to retrieve the user ID (assumed as bidder_id)
    let userId;
    try {
        const token = getCookie(event, "accessToken");
        if (!token) {
            throw createError({ statusCode: 401, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
    } catch (error) {
        throw createError({ statusCode: 401, message: 'Invalid token' });
    }

    const pool = getPool();

    try {
        // Retrieve the winning bid information based on the notification being of type 'AuctionWinner'
        const [bidResult] = await pool.query(`
      SELECT 
          b.bid_amount,
          b.bid_time,
          b.status,
          a.cashbond_amount,
          a.name AS auction_name,
          CONCAT(u.firstname, ' ', u.lastname) AS bidder_name,
          b.response_deadline
      FROM 
          Notifications n
      JOIN 
          Bids b ON n.auction_id = b.listing_id AND n.receiver_id = b.bidder_id
      JOIN 
          AuctionListings a ON b.listing_id = a.listing_id
      JOIN 
          Users u ON b.bidder_id = u.user_id
      WHERE 
          n.auction_id = ? 
          AND n.receiver_id = ? 
          AND n.notification_type = 'AuctionWinner' 
          AND b.status = 'CashBond Pending'
      LIMIT 1;
    `, [listingId, userId]);

        if (!bidResult.length) {
            throw createError({ statusCode: 404, message: 'No winning bid notification found for this auction and user.' });
        }

        // Prepare response with the required fields
        const bidData = bidResult[0];
        return {
            winnerBidderData: bidData
        };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Failed to retrieve bid information.' });
    }
});
