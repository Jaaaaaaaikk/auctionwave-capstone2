import { defineEventHandler, getCookie, createError } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {

  const listingId = event.req.url?.split('?')[1]?.split('=')[1];

  // Retrieve the access token from cookies
  const token = getCookie(event, "accessToken");

  if (!token) {
    // No token found, return an unauthorized error
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // Verify the JWT token
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  // Connect to the database
  const pool = await getPool();

  // Retrieve the count of bidders for the specified auction
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(DISTINCT participant_id) AS bidder_count
       FROM Bids
       WHERE listing_id = ? AND status = 'Pending'`,
      [listingId] // The auction ID from query parameters
    );

    // If no rows are found, return a count of zero
    const bidderCount = rows.length > 0 ? rows[0].bidder_count : 0;

    return { bidderCount }; // Return the count of bidders
  } catch (error) {
    console.error("Database query error:", error);
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
