import { defineEventHandler, getCookie, readBody } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();
    const appSocket = event.context.appSocket;

    // Read request body
    const { offerId } = await readBody(event);

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

    // Fetch bidder_id, listing_id, and auctioneer's full name
    const [offer] = await pool.query(`
        SELECT o.bidder_id, o.listing_id,
               CONCAT(u.firstname, IFNULL(CONCAT(' ', u.middlename), ''), ' ', u.lastname) AS sender_full_name,
               a.name AS auction_name
        FROM Offers AS o
        JOIN Users AS u ON u.user_id = ?
        JOIN AuctionListings AS a ON a.listing_id = o.listing_id
        WHERE o.offer_id = ?
    `, [decodedToken.userId, offerId]);

    if (!offer) {
        throw createError({ statusCode: 404, statusMessage: "Offer not found" });
    }

    const { bidder_id, listing_id, sender_full_name, auction_name } = offer[0];

    // Notification message for accepted offer
    const notificationMessage = `Auctioneer ${sender_full_name} has accepted your offer. You are the new winner of the auction "${auction_name}". Please proceed with the usage fee payment.`;

    // Update offer status and auction status
    try {
        const [updateOffer] = await pool.query(
            'UPDATE Offers SET review_status = ? WHERE offer_id = ?',
            ['Offer Accepted', offerId]
        );

        if (updateOffer.affectedRows === 0) {
            throw createError({ statusCode: 404, statusMessage: "Offer not found" });
        }

        // Insert notification
        await pool.query(`
            INSERT INTO Notifications (receiver_id, auction_id, notification_type, message, is_read)
            VALUES ( ?, ?, ?, ?, ?)
        `, [
            bidder_id,                 // receiver_id (bidder)
            listing_id,                // auction_id
            'AuctionWinner',           // notification_type
            notificationMessage,       // message
            false                      // is_read
        ]);

        // Fetch the inserted notification using WHERE condition
        const [notification] = await pool.query(`
            SELECT created_at 
            FROM Notifications 
            WHERE receiver_id = ? AND auction_id = ? AND notification_type = 'AuctionWinner'
            ORDER BY created_at DESC
            LIMIT 1
            `, [bidder_id, listing_id]);

        const created_at = notification[0]?.created_at;

        // End the auction
        await pool.query(
            `UPDATE AuctionListings SET status = 'Awaiting Bidder Payment' WHERE listing_id = ?`,
            [listing_id]
        );

        // Fetch unread notification count
        const [unreadCount] = await pool.query(
            `SELECT COUNT(*) AS unread_count FROM Notifications WHERE receiver_id = ? AND is_read = false`,
            [bidder_id]
        );

        const winnerNotification = {
            sender_full_name: 'AuctionWave System',
            auction_name: auction_name,
            listing_id: listing_id,
            message: `Congratulations! You are the new winner of the auction "${auction_name}". Please proceed with the cash bond payment.`,
            is_read: false,
            created_at: created_at,
            unreadCount: unreadCount[0]?.unread_count || 0
        };

        // Emit notification through WebSocket
        appSocket.to(`user-${bidder_id}`).emit('response-channel', {
            recipientId: bidder_id,
            notification: winnerNotification
        });

        return { message: "Offer accepted, Awaiting Bidder Payment, and notification sent." };
    } catch (error) {
        console.error("Error processing request:", error);
        throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
});
