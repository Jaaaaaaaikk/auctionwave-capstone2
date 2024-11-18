import { getPool } from '../db';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return { status: 400, success: false, message: 'Email and password are required.' };
  }

  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    await connection.beginTransaction(); // Start a transaction

    // Check if the email exists in the database
    const [user] = await connection.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (user.length === 0) {
      await connection.rollback(); // Rollback if user is not found
      return { status: 404, success: false, message: 'Email not found.' };
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await connection.execute(
      'UPDATE Users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    // Delete OTP
    await connection.execute(
      "DELETE FROM OTPs WHERE email = ?",
      [email]
    );

    await connection.commit(); // Commit the transaction

    connection.release();

    return { status: 200, success: true, message: "Password updated successfully." };  // Update the structure here
  } catch (error) {
    console.error('Error:', error);
    await connection.rollback(); // Rollback in case of an error
    return { status: 500, success: false, message: "Internal server error" };
  }
});
