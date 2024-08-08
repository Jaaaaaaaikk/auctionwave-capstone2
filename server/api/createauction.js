import { defineEventHandler, readBody, getHeader } from 'h3';
import { getPool } from '../db'; // Adjust path to your database setup
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  let connection;

  try {
    // Extract token from Authorization header
    const token = getHeader(event, 'Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return { status: 401, json: { message: 'Token is required' } };
    }

    // Validate token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'hello123z');
    } catch (error) {
      return { status: 401, json: { message: 'Invalid token' } };
    }

    const auctioneer_id = decodedToken.userId;

    // Read the request body
    const body = await readBody(event);
    const { name, location, description, starting_bid, bidding_type, categories, rarity } = body;

    // Validate required fields
    if (!name || !location || !description || !starting_bid || !bidding_type || !categories || !rarity) {
      return { status: 400, json: { message: 'All required fields must be provided' } };
    }

    const pool = getPool();
    connection = await pool.getConnection();

    // Check if the auctioneer exists
    const [existingAuctioneer] = await connection.execute(
      'SELECT user_id FROM Users WHERE user_id = ? AND user_type = "Auctioneer"',
      [auctioneer_id]
    );

    if (existingAuctioneer.length === 0) {
      return { status: 404, json: { message: 'Auctioneer not found' } };
    }

    // Insert the new auction listing
    const [result] = await connection.execute(
      'INSERT INTO AuctionListings (auctioneer_id, name, location, description, starting_bid, bidding_type, rarity, status) VALUES (?, ?, ?, ?, ?, ?, ?, "Auction Pending")',
      [auctioneer_id, name, location, description, starting_bid, bidding_type, rarity]
    );

    const auctionId = result.insertId;

    // Insert categories into the AuctionCategories table
    const categoryValues = categories.map(category_id => [auctionId, category_id]);

    if (categoryValues.length > 0) {
      // Use the correct SQL syntax for inserting multiple rows
      await connection.query(
        'INSERT INTO AuctionListingCategories (listing_id, category_id) VALUES ?',
        [categoryValues]
      );
    }
    return { status: 201, json: { message: 'Auction created successfully' } };

  } catch (error) {
    console.error('Error creating auction:', error);
    return { status: 500, json: { message: 'Failed to create auction' } };
  } finally {
    if (connection) connection.release(); // Ensure the connection is released
  }
});
