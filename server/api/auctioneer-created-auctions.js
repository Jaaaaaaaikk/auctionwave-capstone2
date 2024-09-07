import { defineEventHandler, createError } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const token = event.req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "hello123z");
    console.log("Decoded Token:", decoded);
    const auctioneerId = decoded.userId; // Ensure this matches the token field

    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT listing_id, name, location, description, bidding_type FROM AuctionListings WHERE auctioneer_id = ?",
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
