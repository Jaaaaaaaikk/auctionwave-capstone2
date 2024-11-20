import { defineEventHandler, getCookie, readBody } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read the request body
    const { listing_id, bidder_id, rating } = await readBody(event);

    console.log('for rating', listing_id, bidder_id, rating);
    // Validate input
    if (!listing_id || !bidder_id || !rating) {
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
    let auctioneer_id;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        auctioneer_id = decodedToken.userId;

        // Ensure the user is a Auctioneer
        if (decodedToken.userType !== 'Auctioneer') {
            throw createError({
                statusCode: 403,
                statusMessage: "Forbidden: Only Auctioneer can rate Bidders.",
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
            INSERT INTO BidderRatings (bidder_id, auctioneer_id, listing_id, rating)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(insertRatingQuery, [bidder_id, auctioneer_id, listing_id, rating]);


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
