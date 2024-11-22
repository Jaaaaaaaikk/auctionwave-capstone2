import { defineEventHandler, getCookie, readBody } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();
    const appSocket = event.context.appSocket;

    // Read request body
    const { transaction_id } = await readBody(event);

    // Retrieve and verify token
    const token = getCookie(event, "accessToken");
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    // Decode token and validate auctioneer role
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken.userType !== 'Auctioneer') {
            throw createError({ statusCode: 403, statusMessage: "Forbidden" });
        }
    } catch (error) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    // Fetch the transaction details
    const [transaction] = await pool.query(`
        SELECT t.transaction_id, t.listing_id, t.bidder_id, t.auctioneer_id, a.name AS auction_name, u.firstname, u.lastname
        FROM Transactions t
        JOIN AuctionListings a ON a.listing_id = t.listing_id
        JOIN Users u ON u.user_id = t.bidder_id
        WHERE t.transaction_id = ?
    `, [transaction_id]);

    if (!transaction || transaction.length === 0) {
        throw createError({ statusCode: 404, statusMessage: "Transaction not found" });
    }

    const { bidder_id, listing_id, auction_name, firstname, lastname } = transaction[0];

    // Update the transaction status to 'Transaction Completed'
    try {
        const [updateTransaction] = await pool.query(
            'UPDATE Transactions SET transaction_status = ? WHERE transaction_id = ?',
            ['Transaction Completed', transaction_id]
        );

        if (updateTransaction.affectedRows === 0) {
            throw createError({ statusCode: 500, statusMessage: "Failed to update transaction status" });
        }

        // Prepare notification message
        const notificationMessage = `${firstname} ${lastname} auctioneer has marked the transaction as completed for auction "${auction_name}".`;

        // Insert notification for bidder
        await pool.query(`
            INSERT INTO Notifications (receiver_id, auction_id, notification_type, message, is_read)
            VALUES (?, ?, ?, ?, ?)`,
            [bidder_id, listing_id, 'Response', notificationMessage, false]
        );

        // Fetch the created notification's timestamp
        const [notification] = await pool.query(`
            SELECT created_at 
            FROM Notifications 
            WHERE receiver_id = ? AND auction_id = ? AND notification_type = 'TransactionCompleted'
            ORDER BY created_at DESC
            LIMIT 1
        `, [bidder_id, listing_id]);

        const created_at = notification[0]?.created_at;

        // Send WebSocket message to bidder
        const bidderNotification = {
            sender_full_name: `AuctionWave System`,
            auction_name: auction_name,
            message: notificationMessage,
            created_at: created_at,
            is_read: false
        };

        appSocket.to(`user-${bidder_id}`).emit('response-channel', {
            recipientId: bidder_id,
            notification: bidderNotification
        });

        return { success: true, message: "Transaction marked as completed and notification sent to bidder." };
    } catch (error) {
        console.error("Error processing request:", error);
        throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
});
