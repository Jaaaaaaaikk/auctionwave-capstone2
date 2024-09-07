import { defineEventHandler, readBody, getHeader, createError } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read UUID from the request body
    const { auctionId } = await readBody(event);

    // Extract token from Authorization header
    const token = getHeader(event, "Authorization")?.replace("Bearer ", "");

    if (!token) {
        return { statusCode: 401, json: { message: "Token is required" } };
    }

    // Validate token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "hello123z");
    } catch (error) {
        return { statusCode: 401, json: { message: "Invalid token" } };
    }

    const bidderId = decodedToken.userId;

    try {
        // Retrieve listing_id from UUID
        const [result] = await pool.query(
            `SELECT listing_id FROM AuctionListings WHERE uuid = ?`,
            [auctionId]
        );

        if (result.length === 0) {
            return { statusCode: 404, json: { message: 'Auction not found' } };
        }

        const listingId = result[0].listing_id;

        // Insert or update AuctionParticipants table
        await pool.query(
            `INSERT INTO AuctionParticipants (listing_id, bidder_id, initial_joined_at, last_interaction_at) 
             VALUES (?, ?, NOW(), NOW()) 
             ON DUPLICATE KEY UPDATE last_interaction_at = VALUES(last_interaction_at)`,
            [listingId, bidderId]
        );

        return { statusCode: 200, json: { status: 'success' } };
    } catch (error) {
        // Handle database errors
        return { statusCode: 500, json: { message: 'Internal Server Error' } };
    }
});
