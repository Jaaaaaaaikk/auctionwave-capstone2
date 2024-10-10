import { defineEventHandler, createError, getQuery, getCookie } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {

  // Retrieve the access token from cookies
  const token = getCookie(event, "accessToken");

  if (!token) {
    // No token found, return an unauthorized error
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  let userLocation = null;

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

  // Create the base query to fetch trending auctions based on visit counts
  let query = `
    SELECT
      al.listing_id, 
      al.name, 
      al.description,
      l.location_name AS location,
      al.starting_bid,
      al.bidding_type,
      al.uuid,
      al.rarity,
      GROUP_CONCAT(DISTINCT c.category_name) AS categories,
      COUNT(av.participant_id) AS visit_count
    FROM 
      AuctionListings al 
    INNER JOIN 
      AuctionListingCategories alc ON al.listing_id = alc.listing_id
    LEFT JOIN
      Categories c ON alc.category_id = c.category_id
    LEFT JOIN 
      Locations l ON al.location_id = l.location_id
    LEFT JOIN 
      AuctionVisits av ON al.listing_id = av.listing_id
    WHERE 
      al.status = 'Auction Pending'
  `;

  // Group by listing_id to aggregate visit counts
  query += `
    GROUP BY al.listing_id 
    ORDER BY visit_count DESC
    LIMIT 10; 
  `;

  // Open a connection to the database
  const pool = await getPool();

  try {
    // Execute the query
    const [rows] = await pool.query(query);

    rows.forEach(row => {
      row.categories = row.categories ? row.categories.split(',') : [];
    });

    return {
      success: true,
      allData: rows,
    };
  } catch (error) {
    console.error('Database query failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
});
