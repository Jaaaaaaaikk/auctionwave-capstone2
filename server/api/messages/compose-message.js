import { defineEventHandler, readBody, getCookie, createError } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";
import { wss } from '../../ws-inboxtab';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, "accessToken");

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return { status: 401, json: { message: "Invalid token" } };
    }

    const senderId = decodedToken.userId;
    const body = await readBody(event);
    const { recipientId, subject, messageBody } = body;

    console.log('recipient_id, subject, messageBody', recipientId, subject, messageBody);

    // Validate the required fields
    if (!recipientId || !subject || !messageBody) {
        throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
    }

    const pool = await getPool();

    try {
        // Start a transaction
        await pool.query("START TRANSACTION");

        // Step 1: Insert the new message
        const [result] = await pool.query(
            'INSERT INTO Messages (sender_id, subject, message) VALUES (?, ?, ?)',
            [senderId, subject, messageBody]
        );

        const messageId = result.insertId;

        // Step 2: Insert the participants into MessageParticipants
        await pool.query(
            'INSERT INTO MessageParticipants (message_id, user_id, role, status) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
            [messageId, senderId, 'sender', 'Sent', messageId, recipientId, 'recipient', 'Received']
        );

        // Commit the transaction
        await pool.query("COMMIT");

        // Emit the new message to WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                const message = {
                    messageId,
                    senderId,
                    recipientId,
                    subject,
                    messageBody,
                };
                console.log('Sending message to client:', message);
                client.send(JSON.stringify(message));
            }
        });


        return { status: "success", messageId };
    } catch (error) {
        console.error("Error sending message:", error);
        await pool.query("ROLLBACK"); // Rollback transaction on error
        throw createError({ statusCode: 500, statusMessage: "Failed to send message" });
    }
});
