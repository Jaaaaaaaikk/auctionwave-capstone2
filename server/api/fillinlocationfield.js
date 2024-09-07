import { defineEventHandler, getHeader, createError } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw createError({ statusCode: 401, message: "No token provided" });
  }

  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(token, "hello123z");

    // Extract userId from decoded token
    const userId = decoded.userId;

    const pool = await getPool();

    // Query to get user profile from the Users table
    const [user] = await pool.query(
      "SELECT location FROM Users WHERE user_id = ?",
      [userId],
    );

    if (!user.length) {
      throw createError({
        statusCode: 404,
        message: "User location not found",
      });
    }

    return {
      auctioneerlocation: {
        location: user[0].location,
      },
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw createError({ statusCode: 401, message: "Invalid or expired token" });
  }
});
