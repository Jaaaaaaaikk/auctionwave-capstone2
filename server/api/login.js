import { defineEventHandler, readBody, createError, setHeader } from "h3";
import { getPool } from "../db";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const SECRET_KEY = "hello123z";
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required",
      });
    }

    const pool = await getPool();
    const [results] = await pool.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    const user = results[0];

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    // Generate the access token
    const accessToken = jwt.sign({ userId: user.user_id }, SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    // Generate the refresh token and store it in the database
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);
    await pool.query(
      "INSERT INTO UserTokens (userId, token, expiresAt) VALUES (?, ?, ?)",
      [user.user_id, refreshToken, expiresAt]
    );

    // Set the refresh token as an HTTP-only cookie
    setHeader(event, "Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${REFRESH_TOKEN_EXPIRY / 1000}`);

    // Return the access token and user data to the client
    return {
      message: "Login successful",
      accessToken,
      user: {
        id: user.user_id,
        email: user.email,
        userType: user.user_type,
        userLocation: user.location,  
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid Credentials",
    });
  }
});
