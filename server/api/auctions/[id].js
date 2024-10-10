import { defineEventHandler, getCookie, createError } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  // Extract listing_id from query parameters
  const uuid = event.context.params.id;

  // Retrieve the access token from cookies
  const token = getCookie(event, "accessToken");

  if (!token) {
    // No token found, return an unauthorized error
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid || !uuidRegex.test(uuid)) {
    throw createError({
      statusCode: 400,
      message: "Invalid auction UUID",
    });
  }

  // Query to get auction details by listing_id
  const pool = await getPool();

  try {
    const [results] = await pool.query(

      `SELECT 
    al.listing_id AS id, 
    al.name, 
    al.description, 
    l.location_name AS location, 
    al.starting_bid, 
    al.bidding_type, 
    al.rarity,
    al.status,
    al.email_blast_sent,
    GROUP_CONCAT(c.category_name ORDER BY c.category_name SEPARATOR ', ') AS categories,
    ai.image_url AS image_url
FROM 
    AuctionListings al
INNER JOIN 
    Locations l ON al.location_id = l.location_id
LEFT JOIN 
    AuctionListingCategories alc ON al.listing_id = alc.listing_id
LEFT JOIN 
    Categories c ON alc.category_id = c.category_id
LEFT JOIN 
    AuctionImages ai ON al.listing_id = ai.listing_id
WHERE 
    al.uuid = ?
GROUP BY 
    al.listing_id;
`
      ,
      [uuid],
    );

    console.log("Database Query Results:", results); // Log the query results

    if (results.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Auction not found",
      });
    }

    const auctionData = results[0];

    if (auctionData.image_url) {
      auctionData.image_url = `http://localhost:3000${auctionData.image_url}`; // Path of image, refer from createauction.js for image url
    } else {
      auctionData.image_url = '/images/no-image.jpg'; // or set to a default image URL
    }

    return auctionData; // Ensure a single object is returned

  } catch (error) {
    console.error("Database query error:", error);
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
