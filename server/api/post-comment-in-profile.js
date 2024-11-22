import { defineEventHandler, getCookie, createError, readBody } from "h3";
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

        // Extract userId from decoded token
        const commenterId = decoded.userId;

        // Retrieve the data from the request body
        const { user_id, commentText } = await readBody(event);

        console.log('user_id, commenttext', user_id, commentText);
        // Validate the request data
        if (!user_id || !commentText) {
            throw createError({ statusCode: 400, statusMessage: "Invalid request" });
        }

        // Insert the comment into the database
        const query = `
      INSERT INTO UserComments (commenter_id, profile_owner_id, comment_text)
      VALUES (?, ?, ?)
    `;

        const [result] = await getPool().query(query, [commenterId, user_id, commentText]);

        // Respond with the result
        return { success: true, commentId: result.insertId };
    } catch (error) {
        throw createError({ statusCode: error.statusCode || 500, statusMessage: error.message || "Server Error" });
    }
});
