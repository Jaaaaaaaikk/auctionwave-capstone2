import { defineEventHandler, createError, readBody } from 'h3';
import { getPool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const refreshToken = event.req.headers['x-refresh-token']; // Read from headers

    if (!refreshToken) {
      console.error('No refresh token provided');
      throw createError({ statusCode: 400, statusMessage: 'Refresh token is required' });
    }

    console.log('Received refresh token:', refreshToken);

    const pool = await getPool();

    // Check if the token exists
    const [rows] = await pool.query('SELECT * FROM UserTokens WHERE token = ?', [refreshToken]);

    if (rows.length === 0) {
      console.error('Token not found:', refreshToken);
      throw createError({ statusCode: 404, statusMessage: 'Token not found' });
    }

    const tokenData = rows[0];
    console.log('Token data:', tokenData);

    // Check if the token is already revoked
    if (tokenData.revokedAt !== null) {
      console.log('Token already revoked:', refreshToken);
      return { message: 'Token already revoked' };
    }

    // Set the revokedAt column to the current timestamp
    const currentDateTime = new Date();
    console.log('Updating token revoke time to:', currentDateTime);
    await pool.query('UPDATE UserTokens SET revokedAt = ? WHERE token = ?', [currentDateTime, refreshToken]);

    console.log('Token revoked successfully:', refreshToken);
    return { message: 'Logout successful' };
  } catch (error) {
    console.error('Logout error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' });
  }
});
