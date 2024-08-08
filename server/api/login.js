import { defineEventHandler, readBody, createError } from 'h3';
import { getPool } from '../db';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const SECRET_KEY = 'hello123z';
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email and password are required' });
    }

    const pool = await getPool();
    const [results] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
    const user = results[0];

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

    // Store refresh token in the database
    await pool.query('INSERT INTO UserTokens (userId, token, expiresAt) VALUES (?, ?, ?)', [user.user_id, refreshToken, expiresAt]);

    return { message: 'Login successful', accessToken, refreshToken, user: { id: user.user_id, email: user.email, userType: user.user_type } };
  } catch (error) {
    console.error('Login error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Invalid Credentials' });
  }
});
