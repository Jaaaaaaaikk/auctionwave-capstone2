import { defineEventHandler, readBody, getCookie } from "h3";
import { getPool } from "../db"; // Adjust path to your database setup
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  let connection;

  try {
    // Retrieve the access token from cookies
    const token = getCookie(event, "accessToken");

    if (!token) {
      // No token found, return an unauthorized error
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return { status: 401, json: { message: "Invalid token" } };
    }

    const auctioneer_id = decodedToken.userId;

    // Read the request body
    const body = await readBody(event);
    const {
      name,
      location_id, // Use location_id instead of location
      description,
      starting_bid,
      bidding_type,
      categories,
      rarity,
    } = body;

    // Validate required fields
    if (
      !name ||
      !location_id || // Validate location_id
      !description ||
      !starting_bid ||
      !bidding_type ||
      !categories ||
      !rarity
    ) {
      return {
        status: 400,
        json: { message: "All required fields must be provided" },
      };
    }

    const pool = getPool();
    connection = await pool.getConnection();

    // Check if the auctioneer exists
    const [existingAuctioneer] = await connection.execute(
      'SELECT user_id FROM Users WHERE user_id = ? AND user_type = "Auctioneer"',
      [auctioneer_id]
    );

    if (existingAuctioneer.length === 0) {
      return { status: 404, json: { message: "Auctioneer not found" } };
    }

    // Generate a UUID
    const auctionUuid = uuidv4();

    // Insert the new auction listing
    const [result] = await connection.execute(
      'INSERT INTO AuctionListings (auctioneer_id, name, location_id, description, starting_bid, bidding_type, rarity, status, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, "Auction Pending", ?)', // Use location_id in the query
      [
        auctioneer_id,
        name,
        location_id, // Insert location_id
        description,
        starting_bid,
        bidding_type,
        rarity,
        auctionUuid, // Insert the generated UUID
      ]
    );

    const auctionId = result.insertId;

    // Insert categories into the AuctionCategories table
    const categoryValues = categories.map((category_id) => [
      auctionId,
      category_id,
    ]);

    if (categoryValues.length > 0) {
      // Use the correct SQL syntax for inserting multiple rows
      await connection.query(
        "INSERT INTO AuctionListingCategories (listing_id, category_id) VALUES ?",
        [categoryValues]
      );
    }
    return { status: 201, json: { message: "Auction created successfully" } };
  } catch (error) {
    console.error("Error creating auction:", error);
    return { status: 500, json: { message: "Failed to create auction" } };
  } finally {
    if (connection) connection.release(); // Ensure the connection is released
  }
});
