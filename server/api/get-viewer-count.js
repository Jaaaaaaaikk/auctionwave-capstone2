import { defineEventHandler, createError, getQuery } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = getPool();
    const { listing_id } = getQuery(event);

    if (!listing_id) {
        throw createError({ statusCode: 400, message: 'Listing ID is required' });
    }

    // Authenticate JWT token (if required)
    const token = event.req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            jwt.verify(token, 'hello123z');
        } catch (error) {
            throw createError({ statusCode: 401, message: 'Unauthorized' });
        }
    }

    // Query to get the count of viewers for the auction
    const query = `
        SELECT COUNT(*) AS viewer_count
        FROM AuctionParticipants
        WHERE listing_id = ?
    `;

    try {
        const [rows] = await pool.query(query, [listing_id]);
        return { viewer_count: rows[0].viewer_count };
    } catch (error) {
        console.error('Database query failed', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});
