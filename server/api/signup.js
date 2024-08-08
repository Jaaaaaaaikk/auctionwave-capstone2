import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcryptjs';
import { getPool } from '../db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { firstname, middlename, lastname, email, location, password, userType, categories } = body;

    if (!firstname || !lastname || !email || !password || !userType) {
        return { status: 400, json: { message: 'All fields are required' } };
    }

    if (userType === 'Bidder' && (!categories || categories.length === 0)) {
        return { status: 400, json: { message: 'At least one category is required for Bidder' } };
    }

    try {
        const pool = getPool();
        const connection = await pool.getConnection();

        // Check if the user already exists based on email
        const [existingEmailUsers] = await connection.execute(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (existingEmailUsers.length > 0) {
            connection.release();
            return { status: 409, json: { message: 'User already exists with the provided email' } };
        }

        // Check if the user already exists based on firstname and lastname
        const [existingNameUsers] = await connection.execute(
            'SELECT * FROM Users WHERE firstname = ? AND lastname = ?',
            [firstname, lastname]
        );

        if (existingNameUsers.length > 0) {
            connection.release();
            return { status: 409, json: { message: 'User already exists with the provided firstname and lastname' } };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const query = `
            INSERT INTO Users (firstname, middlename, lastname, email, location, password, user_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.execute(query, [firstname, middlename, lastname, email, location, hashedPassword, userType]);

        const userId = result.insertId;

        // Insert into Bidders table if user is a Bidder
        if (userType === 'Bidder') {
            for (const categoryName of categories) {
                // Check if the category name exists in the Categories table
                const [categoryExists] = await connection.execute(
                    'SELECT 1 FROM Categories WHERE category_name = ?',
                    [categoryName]
                );

                if (categoryExists.length === 0) {
                    connection.release();
                    return { status: 400, json: { message: `Category '${categoryName}' does not exist` } };
                }

                // Get the category ID for the name
                const [categoryIdResult] = await connection.execute(
                    'SELECT category_id FROM Categories WHERE category_name = ?',
                    [categoryName]
                );
                const categoryId = categoryIdResult[0]?.category_id;

                if (!categoryId) {
                    connection.release();
                    return { status: 400, json: { message: `Could not find ID for category '${categoryName}'` } };
                }

                // Insert each selected category into Bidders table
                const categoryQuery = `
                    INSERT INTO Bidders (bidder_id, category_id)
                    VALUES (?, ?)
                `;
                await connection.execute(categoryQuery, [userId, categoryId]);
            }
        }

        connection.release();

        return { status: 201, json: { message: 'User created successfully' } };
    } catch (error) {
        console.error('Error inserting user:', error); // Log the error for debugging
        if (error.code === 'ER_DUP_ENTRY') {
            return { status: 409, json: { message: 'Email already exists' } };
        }

        return { status: 500, json: { message: 'Internal server error' } };
    }
});
