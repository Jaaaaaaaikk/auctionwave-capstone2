import { defineEventHandler, createError, getQuery, getCookie } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {

  const { category = null, biddingType = null, rarity = null, search = null} = getQuery(event);

  // Retrieve the access token from cookies
  const token = getCookie(event, "accessToken");

  if (!token) {
    // No token found, return an unauthorized error
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  let userLocation = '';

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userLocation = decoded.user_Location; // location is stored in the token
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }

  // Create the base query
  let query = `
    SELECT DISTINCT
      al.listing_id, 
      al.name, 
      al.description, 
      al.starting_bid, 
      l.location_name AS location, 
      al.bidding_type, 
      al.rarity, 
      al.uuid,
      GROUP_CONCAT(c.category_name) AS categories,
      GROUP_CONCAT(ai.image_url) AS image_urls 
    FROM 
      AuctionListings al
    INNER JOIN 
      AuctionListingCategories alc ON al.listing_id = alc.listing_id
    INNER JOIN 
      Categories c ON alc.category_id = c.category_id
    INNER JOIN 
      Locations l ON al.location_id = l.location_id
    LEFT JOIN
      AuctionImages ai ON al.listing_id = ai.listing_id 
    WHERE 
      al.status = 'Auction Pending'
  `;

  // Create a list for the query parameters
  const queryParams = [];

  // Filter by location if provided
  if (userLocation) {
    query += ` AND l.location_id = ?`;
    queryParams.push(userLocation);
  }

  // Filter by category if provided
  if (category && category !== 'All') {
    query += ` AND alc.category_id = (
      SELECT category_id FROM Categories WHERE category_name = ?
    )`;
    queryParams.push(category);
  }

  // Filter by rarity if provided
  if (rarity && rarity !== 'All') {
    query += ` AND al.rarity = ?`;
    queryParams.push(rarity);
  }

  // Filter by bidding type if provided
  if (biddingType && biddingType !== 'All') {
    query += ` AND al.bidding_type = ?`;
    queryParams.push(biddingType);
  }

  // Filter by search term if provided
  if (search) {
    query += ` AND al.name LIKE ?`;
    queryParams.push(`%${search}%`);
  }

  // Group by listing_id to aggregate categories and images
  query += ` GROUP BY al.listing_id`;

  // Open a connection to the database
  const pool = await getPool();

  try {
    // Execute the query with the provided parameters
    const [rows] = await pool.query(query, queryParams);

    // Parse categories and image URLs as arrays
    rows.forEach(row => {
      row.categories = row.categories ? row.categories.split(',') : [];
      row.image_urls = row.image_urls ? row.image_urls.split(',') : [];
    });

    return rows;
  } catch (error) {
    console.error('Database query failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
});
