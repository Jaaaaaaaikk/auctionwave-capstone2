import { defineEventHandler, readBody, getCookie, getQuery } from 'h3';  // Import getQuery from h3
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    try {
        const token = getCookie(event, "accessToken");
        if (!token) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Get page and limit from query, with defaults if not provided
        const query = getQuery(event);  // Use getQuery instead of useQuery
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;  // Default to 10 notifications per page
        const offset = (page - 1) * limit;

        let notifications;
        let totalNotifications;

        [notifications] = await pool.query(
            `SELECT 
                    n.*, 
                    a.uuid AS auction_uuid,
                    a.listing_id,
                    a.bidding_type, 
                    a.auctioneer_id,
                    COALESCE(CONCAT(sender.firstname, IFNULL(CONCAT(' ', sender.middlename), ''), ' ', sender.lastname), 'AuctionWave System') AS sender_full_name,
                    CONCAT(receiver.firstname, IFNULL(CONCAT(' ', receiver.middlename), ''), ' ', receiver.lastname) AS receiver_full_name
                FROM 
                    Notifications n
                JOIN 
                    AuctionListings a ON n.auction_id = a.listing_id
                LEFT JOIN 
                    Users sender ON n.sender_id = sender.user_id
                JOIN 
                    Users receiver ON n.receiver_id = receiver.user_id
                WHERE 
                    n.receiver_id = ?
                ORDER BY 
                    n.created_at DESC
                LIMIT ? OFFSET ?;`,
            [userId, limit, offset]
        );

        // Fetch total notification count for pagination metadata
        [[{ totalNotifications }]] = await pool.query(
            `SELECT COUNT(*) AS totalNotifications
                FROM Notifications n
                WHERE n.receiver_id = ?;`,
            [userId]
        );

        return {
            success: true,
            notifications,
            pagination: {
                total: totalNotifications,
                page,
                pageSize: limit,
                totalPages: Math.ceil(totalNotifications / limit)
            }
        };

    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw createError({ statusCode: 500, message: 'Internal server error' });
    }
});
