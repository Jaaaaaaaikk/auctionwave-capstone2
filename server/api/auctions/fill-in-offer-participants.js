// server/api/fill-in-offer-participants.js
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
        // Retrieve offers made by users for the specified auction listing
        const [offersRows] = await pool.query(`
            WITH LatestOffers AS (
                SELECT 
                    u.user_id,
                    u.firstname,
                    u.lastname,
                    o.comment,
                    COUNT(o.offer_id) OVER (PARTITION BY u.user_id) AS offer_count,
                    ROW_NUMBER() OVER (PARTITION BY u.user_id ORDER BY o.offer_time DESC) AS rn
                FROM Offers o
                JOIN Users u ON o.bidder_id = u.user_id
                WHERE o.listing_id = ?
            )
            SELECT 
                user_id,
                firstname,
                lastname,
                comment,
                offer_count
            FROM LatestOffers
            WHERE rn = 1
            ORDER BY offer_count DESC;
        `, [listingId]);

        return { offers: offersRows, currentUserId: decoded.userId };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Database query failed' });
    }
});
