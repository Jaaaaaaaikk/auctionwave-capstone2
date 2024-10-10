import { defineEventHandler, createError, getCookie } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // Retrieve the access token from cookies
    const token = getCookie(event, "accessToken");

    if (!token) {
      // No token found, return an unauthorized error
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

     // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    const auctioneerId = decoded.userId; // Ensure this matches the token field

    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT al.listing_id, al.name, l.location_name, al.description, al.bidding_type, al.uuid, al.status FROM AuctionListings al JOIN Locations l ON al.location_id = l.location_id WHERE al.auctioneer_id = ?',
      [auctioneerId],
    );
    //console.log('Fetched Auctions:', rows);
    return { auctions: rows };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
