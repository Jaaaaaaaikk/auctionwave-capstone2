import { defineEventHandler, getCookie, readBody } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read the request body
    const { listing_id, auctioneer_id, rating } = await readBody(event);

    console.log('for rating', listing_id, auctioneer_id, rating);
    // Validate input
    if (!listing_id || !auctioneer_id || !rating) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid input. Required fields are missing.",
        });
    }

    // Retrieve and verify the token
    const token = getCookie(event, "accessToken");
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized: No access token provided.",
        });
    }

    let decodedToken;
    let bidder_id;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        bidder_id = decodedToken.userId;

        // Ensure the user is a Bidder
        if (decodedToken.userType !== 'Bidder') {
            throw createError({
                statusCode: 403,
                statusMessage: "Forbidden: Only Auctioneer can rate Bidder.",
            });
        }
    } catch (error) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized: Invalid or expired token.",
        });
    }

    try {
        // Insert the rating into the AuctioneerRatings table
        const insertRatingQuery = `
            INSERT INTO AuctioneerRatings (auctioneer_id, bidder_id, listing_id, rating)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(insertRatingQuery, [auctioneer_id, bidder_id, listing_id, rating]);


        return {
            success: true,
            message: "Rating submitted successfully.",
        };
    } catch (error) {
        console.error("Error inserting rating:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error: Unable to submit rating.",
        });
    }
});
