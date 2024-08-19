import { defineEventHandler, createError, getQuery } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    // Extract category and search parameters from query
    const { category = null, search = null } = getQuery(event);

    // Authenticate user if needed (optional)
    const token = event.req.headers['authorization']?.split(' ')[1];
    if (token) {
        try {
            jwt.verify(token, 'hello123z');
        } catch (err) {
            throw createError({
                statusCode: 401,
                message: 'Invalid or expired token'
            });
        }
    }

    // Create the base query
    let query = `
        SELECT al.listing_id, al.name, al.description, al.starting_bid, al.location, al.bidding_type, al.rarity
        FROM AuctionListings al
        INNER JOIN AuctionListingCategories alc ON al.listing_id = alc.listing_id
        WHERE al.status = 'Auction Pending'`;

    // Create a list for the query parameters
    const queryParams = [];

    // If a specific category is selected, filter results by category
    if (category && category !== 'All') {
        query += ` AND alc.category_id = (
            SELECT category_id FROM Categories WHERE category_name = ?
        )`;
        queryParams.push(category);
    }

    // If a search term is provided, filter results by auction name
    if (search) {
        query += ` AND al.name LIKE ?`;
        queryParams.push(`%${search}%`);
    }

    // Open a connection to the database
    const pool = await getPool();

    try {
        // Execute the query with the provided parameters
        const [rows] = await pool.query(query, queryParams);
        
        return rows;
    } catch (error) {
        console.error('Database query failed:', error);
        throw createError({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
});
