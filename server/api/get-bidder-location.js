import { defineEventHandler, createError } from 'h3';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  // Extract token from headers
  const token = event.req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, 'hello123z');
    // Return the location from the decoded token
    return { location: decoded.location };
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    });
  }
});
