import { defineEventHandler, createError, getCookie, getQuery } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const { auctioneerId } = getQuery(event);

    // Retrieve the access token from cookies
    const token = getCookie(event, "accessToken");

    if (!token) {
        // No token found, return an unauthorized error
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Query to get the auctioneer details
        const query = `
      SELECT 
        CONCAT(u.firstname, ' ', u.lastname) AS auctioneer_name,
        l.location_name,
        upi.profile_image_url AS auctioneer_profile_image
      FROM Users u
      JOIN Locations l ON u.location_id = l.location_id
      LEFT JOIN UserProfileImages upi 
        ON u.user_id = upi.user_id AND upi.is_current_profile_image = TRUE
      WHERE u.user_id = ? AND u.user_type = 'Auctioneer'
    `;

        const pool = getPool();
        const [rows] = await pool.execute(query, [auctioneerId]);

        if (!rows.length) {
            throw createError({
                statusCode: 404,
                statusMessage: "Auctioneer not found",
            });
        }

        return rows[0];
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        });
    }
});
