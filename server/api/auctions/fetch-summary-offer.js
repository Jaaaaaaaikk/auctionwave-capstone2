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
            o.offer_time,
            o.review_status,
            a.name AS auction_name,
            CONCAT(u.firstname, ' ', u.lastname) AS bidder_name
        FROM 
            Notifications n
        JOIN 
            Offers o ON n.auction_id = o.listing_id 
                    AND n.receiver_id = o.bidder_id
        JOIN 
            AuctionListings a ON n.auction_id = a.listing_id
        JOIN 
            Users u ON n.receiver_id = u.user_id
        WHERE 
            n.auction_id = ?
            AND n.receiver_id = ?
            AND n.notification_type = 'AuctionWinner'
            AND o.review_status = 'Offer Accepted'
        LIMIT 1;
    `, [listingId, userId]);

        if (!bidResult.length) {
            throw createError({ statusCode: 404, message: 'No winning Offer notification found for this auction and user.' });
        }

        // Prepare response with the required fields
        const offerData = bidResult[0];
        return {
            winnerBidderData: offerData
        };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Failed to retrieve Offer information.' });
    }
});
