import { defineEventHandler, getCookie, createError } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    // Retrieve the access token from cookies
    const token = getCookie(event, "accessToken");

    if (!token) {
        // No token found, return an unauthorized error
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw createError({ statusCode: 401, statusMessage: "Invalid token" });
    }

    // Get the user ID from the decoded token
    const userId = decodedToken.userId; // Adjust based on your token structure

    // Connect to the database
    const pool = getPool();

    try {
        // Query to get messages for the inbox of the recipient
        const [messages] = await pool.query(`
            SELECT 
                m.message_id,
                m.sender_id,
                CONCAT(u.firstname, 
                       IFNULL(CONCAT(' ', u.middlename), ''), 
                       ' ', 
                       u.lastname) AS sender_name,
                m.subject,
                m.message,
                mp.is_read,
                m.created_at,
                (SELECT upi.profile_image_url FROM UserProfileImages upi LEFT JOIN Users u ON upi.user_id = u.user_id WHERE upi.is_current_profile_image = true LIMIT 1) AS user_profile_image
            FROM Messages m
            JOIN MessageParticipants mp ON m.message_id = mp.message_id
            JOIN Users u ON m.sender_id = u.user_id 
                WHERE mp.user_id = ? AND mp.role = 'recipient' AND mp.status = 'Received'
            ORDER BY m.created_at DESC
        `, [userId]);


        messages.forEach(row => {
            row.user_profile_image = row.user_profile_image ? row.user_profile_image.split(',') : [];
        });

        // Return messages
        return { messages };
    } catch (error) {
        console.error("Database query error:", error);
        throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
});