import { defineEventHandler, getCookie } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    try {
        // Retrieve the access token from cookies
        const token = getCookie(event, "accessToken");

        if (!token) {
            // No token found, return an unauthorized error
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Fetch notifications for the user
        const [notifications] = await pool.query(
            `SELECT * FROM Notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
            [userId]
        );

        return { success: true, notifications };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw createError({ statusCode: 500, message: 'Internal server error' });
    }
});
