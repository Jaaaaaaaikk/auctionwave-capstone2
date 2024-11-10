import { defineEventHandler, getCookie, readBody } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read request body
    const { offerId, action } = await readBody(event);

    // Validate input
    if (!offerId || !action || !['Provide More', 'Accept Offer', 'Discard Offer'].includes(action)) {
        throw createError({ statusCode: 400, statusMessage: "Invalid input" });
    }

    // Retrieve and verify token
    const token = getCookie(event, "accessToken");
    console.log('The Token', token);
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    // Decode token and validate auctioneer role
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken.userType !== 'Auctioneer') {
            throw createError({ statusCode: 403, statusMessage: "Forbidden" });
        }
    } catch (error) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    // Determine the new status based on the action
    let newStatus;
    switch (action) {
        case 'Provide More':
            newStatus = 'Provide More';
            break;
        case 'Accept Offer':
            newStatus = 'Offer Accepted';
            break;
        case 'Discard Offer':
            newStatus = 'Offer Discarded';
            break;
        default:
            throw createError({ statusCode: 400, statusMessage: "Invalid action" });
    }

    // Update offer status in the database
    try {
        const [result] = await pool.query(
            'UPDATE Offers SET review_status = ? WHERE offer_id = ?',
            [newStatus, offerId]
        );

        if (result.affectedRows === 0) {
            throw createError({ statusCode: 404, statusMessage: "Offer not found" });
        }

        return { message: `Offer status updated to ${newStatus}` };
    } catch (error) {
        console.error("Error updating offer status:", error);
        throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
});
