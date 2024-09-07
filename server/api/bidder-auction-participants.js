import { defineEventHandler, createError } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { listing_id } = query;

  // Validate that listing_id is provided
  if (!listing_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request: Missing listing_id parameter",
    });
  }

  // Retrieve and verify the JWT token from the request headers
  const authorizationHeader = event.node.req.headers["authorization"];
  if (!authorizationHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Missing authorization header",
    });
  }

  const token = authorizationHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "hello123z");
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Invalid token",
    });
  }

  // Get the pool connection
  const pool = getPool();

  try {
    // Query to get the list of bidders for the specific auction
    const [bidders] = await pool.query(
      `SELECT u.user_id, u.firstname, u.lastname 
             FROM AuctionParticipants ap
             JOIN Users u ON ap.bidder_id = u.user_id
             WHERE ap.listing_id = ?`,
      [listing_id],
    );

    // Send the result back
    return {
      bidders,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Internal Server Error: Failed to fetch auction participants",
    });
  }
});
