import { defineEventHandler, createError, getQuery } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  // Extract parameters from the query
  const { category = null, search = null, location = null } = getQuery(event);

  // Extract token from headers
  const token = event.req.headers['authorization']?.split(' ')[1];
  let userLocation = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, 'hello123z');
      userLocation = decoded.location; // Assuming location is stored in the token
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }

  // Create the base query
  let query = `
    SELECT DISTINCT al.listing_id, al.name, al.description, al.starting_bid, al.location, al.bidding_type, al.rarity, al.uuid
    FROM AuctionListings al
    INNER JOIN AuctionListingCategories alc ON al.listing_id = alc.listing_id
    WHERE al.status = 'Auction Pending'`;

  // Create a list for the query parameters
  const queryParams = [];

// Filtering by user location
if (location) {
  query += ` AND al.location = ?`;
  queryParams.push(location);
}

  // Filter by category if provided
  if (category && category !== 'All') {
    query += ` AND alc.category_id = (
      SELECT category_id FROM Categories WHERE category_name = ?
    )`;
    queryParams.push(category);
  }

  // Filter by search term if provided
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
      message: 'Internal Server Error',
    });
  }
});
