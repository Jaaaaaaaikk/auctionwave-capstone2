import { defineEventHandler, createError } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  // Extract listing_id from query parameters
  const id = event.context.params.id;

  // Verify JWT token if provided
  const token = event.req.headers["authorization"]?.split(" ")[1];
  if (token) {
    try {
      jwt.verify(token, "hello123z");
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
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
                listing_id AS id, 
                name, 
                description, 
                location, 
                starting_bid, 
                bidding_type, 
                rarity 
            FROM AuctionListings 
            WHERE uuid = ?`,
      [id],
    );

    console.log("Database Query Results:", results); // Log the query results

    if (results.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Auction not found",
      });
    }

    return results[0]; // Ensure a single object is returned
  } catch (error) {
    console.error("Database query error:", error);
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
