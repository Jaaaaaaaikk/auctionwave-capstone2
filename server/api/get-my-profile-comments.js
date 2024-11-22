import { defineEventHandler, getCookie, createError } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    try {
        // Retrieve the access token from cookies
        const token = getCookie(event, "accessToken");

        if (!token) {
            // No token found, return an unauthorized error
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        // Verify and decode JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your actual secret key

        const user_id = decoded.userId;

        console.log('user_id from get-user-comments', user_id);
        if (!user_id) {
            throw createError({ statusCode: 400, statusMessage: "Missing user_id" });
        }

        // Fetch the comments for the profile_owner_id (user_id) from the UserComments table
        const query = `
            SELECT uc.comment_id, uc.comment_text, uc.created_at, u.firstname, u.lastname, upi.profile_image_url 
            FROM UserComments uc
            LEFT JOIN Users u ON uc.commenter_id = u.user_id
            LEFT JOIN userprofileimages upi ON u.user_id = upi.user_id AND upi.is_current_profile_image = TRUE
            WHERE uc.profile_owner_id = ?
            ORDER BY uc.created_at DESC
        `;

        const [comments] = await getPool().query(query, [user_id]);

        // Respond with the comments data
        return { success: true, comments };
    } catch (error) {
        throw createError({ statusCode: error.statusCode || 500, statusMessage: error.message || "Server Error" });
    }
});
