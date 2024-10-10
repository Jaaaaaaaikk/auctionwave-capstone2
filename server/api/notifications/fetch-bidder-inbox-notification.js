// server/api/notifications/fetch-user-notifications.js
import { defineEventHandler, getCookie } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    try {
        const token = getCookie(event, "accessToken");
        if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const userType = decoded.userType;

        let notifications;
        if (userType === 'Auctioneer') {
            [notifications] = await pool.query(
                `SELECT n.* 
                 FROM Notifications n
                 JOIN AuctionListings a ON n.auction_id = a.listing_id
                 WHERE a.auctioneer_id = ? AND n.user_id = ?
                 ORDER BY n.created_at DESC`,
                [userId, userId]
            );
        } else if (userType === 'Bidder') {
            [notifications] = await pool.query(
                `SELECT * FROM Notifications 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC`,
                [userId]
            );
        } else {
            throw createError({ statusCode: 403, statusMessage: "Forbidden" });
        }

        return { success: true, notifications };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw createError({ statusCode: 500, message: 'Internal server error' });
    }
});
