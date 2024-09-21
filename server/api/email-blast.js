import { defineEventHandler, readBody, getCookie } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();
    const body = await readBody(event);

    try {
        // Retrieve the access token from cookies
        const token = getCookie(event, "accessToken");

        if (!token) {
            // No token found, return an unauthorized error
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        const { auctionUuid } = body;

        // Fetch auction details by UUID
        const [[auction]] = await pool.query(
            `SELECT listing_id, location_id FROM AuctionListings WHERE uuid = ?`,
            [auctionUuid]
        );

        if (!auction) {
            throw createError({ statusCode: 404, message: 'Auction not found' });
        }

        const listingId = auction.listing_id;
        const location_id = auction.location_id;

        // Fetch categories associated with the auction
        const [categories] = await pool.query(
            `SELECT category_id FROM AuctionListingCategories WHERE listing_id = ?`,
            [listingId]
        );

        const categoryIds = categories.map(cat => cat.category_id);

        // Fetch bidders related to those categories
        const [bidders] = await pool.query(
            `SELECT DISTINCT b.bidder_id, u.email
       FROM Bidders b
       JOIN Users u ON b.bidder_id = u.user_id
       WHERE b.category_id IN (?) AND u.location_id = ?`,
            [categoryIds, location_id]
        );

        if (bidders.length === 0) {
            throw createError({ statusCode: 404, message: 'No bidders found for the selected categories' });
        }

        // Send notifications to the bidders
        const notifications = bidders.map(bidder => ({
            user_id: bidder.bidder_id,
            auction_id: listingId,
            message: `New auction in your interested categories: ${auctionUuid}`,
            is_read: false
        }));

        await pool.query(
            `INSERT INTO Notifications (user_id, auction_id, message, is_read)
       VALUES ?`,
            [notifications.map(notif => [notif.user_id, notif.auction_id, notif.message, notif.is_read])]
        );

        return { success: true, message: 'Notifications sent successfully' };
    } catch (error) {
        console.error('Error processing email blast:', error);
        throw createError({ statusCode: 500, message: 'Internal server error' });
    }
});
