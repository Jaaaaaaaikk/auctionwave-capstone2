import { defineEventHandler, readBody, getHeader, createError } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read request body
    const { auctionId, bidAmount } = await readBody(event);

    // Extract token from Authorization header
    const token = getHeader(event, 'Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw createError({ statusCode: 401, message: 'Token is required' });
    }

    // Validate token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'hello123z');
    } catch (error) {
        throw createError({ statusCode: 401, message: 'Invalid token' });
    }

    const bidderId = decodedToken.userId;

    try {
        // Retrieve listing_id from UUID
        const [result] = await pool.query(
            `SELECT listing_id FROM AuctionListings WHERE uuid = ?`,
            [auctionId]
        );

        if (result.length === 0) {
            throw createError({ statusCode: 404, message: 'Auction not found' });
        }

        const listingId = result[0].listing_id;

        // Retrieve participant_id
        const [participantResult] = await pool.query(
            `SELECT participant_id FROM AuctionParticipants WHERE listing_id = ? AND bidder_id = ?`,
            [listingId, bidderId]
        );

        if (participantResult.length === 0) {
            throw createError({ statusCode: 404, message: 'Participant not found' });
        }

        const participantId = participantResult[0].participant_id;

        // Insert bid into Bids table
        await pool.query(
            `INSERT INTO Bids (listing_id, participant_id, bid_amount) 
             VALUES (?, ?, ?)`,
            [listingId, participantId, bidAmount]
        );

        return { status: 'success' };
    } catch (error) {
        // Handle database errors
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});
