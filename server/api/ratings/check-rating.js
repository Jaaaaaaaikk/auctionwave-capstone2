import { defineEventHandler, getCookie, readBody } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read the request body
    const { listing_id, auctioneer_id } = await readBody(event);
    console.log('Checking rating status for auction:', listing_id, auctioneer_id);

    // Validate input
    if (!listing_id || !auctioneer_id) {
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

    try {
        // Decode the token to get the user ID (bidder_id or auctioneer_id)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decodedToken.user_id; // Assuming the token contains user_id

        // Check if the auction has been rated by this user (check both tables)
        const [bidderRatingResult] = await pool.query(
            'SELECT * FROM BidderRatings WHERE listing_id = ? AND auctioneer_id = ?',
            [listing_id, user_id]
        );

        const [auctioneerRatingResult] = await pool.query(
            'SELECT * FROM AuctioneerRatings WHERE listing_id = ? AND bidder_id = ?',
            [listing_id, auctioneer_id]
        );

        // If a rating is found for either bidder or auctioneer, return an error
        if (bidderRatingResult.length > 0 || auctioneerRatingResult.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: "This auction has already been rated by this user.",
            });
        }

        // If no rating exists, return success
        return {
            statusCode: 200,
            statusMessage: "This auction can be rated.",
        };
    } catch (error) {
        console.error('Error verifying token or checking rating:', error);
        throw createError({
            statusCode: 500,
            statusMessage: "An error occurred while checking rating status.",
        });
    }
});
