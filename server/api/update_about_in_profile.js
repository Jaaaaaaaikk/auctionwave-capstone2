import { defineEventHandler, getHeader, createError } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw createError({ statusCode: 401, message: 'No token provided' });
  }

  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(token, 'hello123z'); // Use your actual secret key

    // Extract userId from decoded token
    const userId = decoded.userId;
    const { about } = await readBody(event);

    if (!about) {
      throw createError({ statusCode: 400, message: 'About section cannot be empty' });
    }

    const pool = await getPool();

    // Update the 'about' field in the Users table
    await pool.query('UPDATE Users SET about = ?, updated_at = NOW() WHERE user_id = ?', [about, userId]);

    return { message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error:', error.message);
    throw createError({ statusCode: 401, message: 'Invalid or expired token' });
  }
});
