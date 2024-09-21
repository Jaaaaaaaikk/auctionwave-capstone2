import { defineEventHandler, getCookie, createError } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // Retrieve the access token from cookies
    const token = getCookie(event, "accessToken");

    if (!token) {
      // No token found, return an unauthorized error
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    
    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract userId from decoded token
    const userId = decoded.userId;

    const pool = await getPool();

    // Query to get user profile and location from the Users and Locations tables
    const [user] = await pool.query(
      `SELECT u.firstname, u.middlename, u.lastname, u.email, u.about, l.location_name 
       FROM Users u 
       JOIN Locations l ON u.location_id = l.location_id 
       WHERE u.user_id = ?`,
      [userId]
    );

    if (!user.length) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    // Prepare profile data to return
    return {
      profile: {
        fullname: `${user[0].firstname} ${user[0].middlename ? user[0].middlename + " " : ""}${user[0].lastname}`,
        email: user[0].email,
        location: user[0].location_name, // Use location_name from Locations table
        about: user[0].about,
      },
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw createError({ statusCode: 401, message: "Invalid or expired token" });
  }
});
