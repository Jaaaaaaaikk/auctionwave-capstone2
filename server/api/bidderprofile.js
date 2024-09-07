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
    const decoded = jwt.verify(token, "hello123z"); // Use your actual secret key

    // Extract userId from decoded token
    const userId = decoded.userId;

    const pool = await getPool();

    // Query to get user profile from the Users table
    const [user] = await pool.query(
      "SELECT firstname, middlename, lastname, email, location, about FROM Users WHERE user_id = ?",
      [userId],
    );

    if (!user.length) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    // Query to get categories associated with the bidder
    const [categories] = await pool.query(
      `SELECT c.category_name
       FROM Bidders b
       JOIN Categories c ON b.category_id = c.category_id
       WHERE b.bidder_id = ?`,
      [userId],
    );

    // Construct the response
    return {
      profile: {
        fullname: `${user[0].firstname} ${user[0].middlename ? user[0].middlename + " " : ""}${user[0].lastname}`,
        email: user[0].email,
        location: user[0].location,
        categories: categories.map((c) => c.category_name),
        about: user[0].about,
      },
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw createError({ statusCode: 401, message: "Invalid or expired token" });
  }
});
