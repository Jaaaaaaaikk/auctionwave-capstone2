import { defineEventHandler, createError } from 'h3';
import { getPool } from '../db';

export default defineEventHandler(async (event) => {
    try {
        const pool = await getPool();
        const appSocket = event.context.appSocket;

        // Get auctions that need to be ended
        const [auctions] = await pool.query(
            `SELECT listing_id, name, end_time FROM AuctionListings WHERE end_time <= NOW() AND status = 'Auction Pending'`
        );

        if (auctions.length === 0) {
            return { message: 'No auctions to update.' };
        }

        for (const auction of auctions) {
            const listingId = auction.listing_id;
            const auctionName = auction.name;
            const auctionEndTime = auction.end_time;

            // Mark auction as 'Auction Ended'
            await pool.query(
                `UPDATE AuctionListings SET status = 'Awaiting Bidder Payment' WHERE listing_id = ?`,
                [listingId]
            );

            // Find the lowest bid and mark it as 'Usage Fee Payment Pending'
            const [lowestBid] = await pool.query(
                `SELECT bid_id, bidder_id FROM Bids WHERE listing_id = ? AND status = 'Active' ORDER BY bid_amount ASC LIMIT 1`,
                [listingId]
            );

            let winnerId = null;
            if (lowestBid.length > 0) {
                winnerId = lowestBid[0].bidder_id;
                const winnerBidId = lowestBid[0].bid_id;

                // Mark the winning bid as 'Usage Fee Payment Pending'
                await pool.query(`UPDATE Bids SET status = 'Usage Fee Payment Pending' WHERE bid_id = ?`, [winnerBidId]);

                // Set the response deadline (e.g., 24 hours from auction end)
                const responseDeadline = new Date(auctionEndTime);
                responseDeadline.setHours(responseDeadline.getHours() + 24);  // Add 24 hours

                // Update response_deadline and response_status for the winning bid
                await pool.query(
                    `UPDATE Bids SET response_deadline = ?, response_status = 'Pending' WHERE bid_id = ?`,
                    [responseDeadline, winnerBidId]
                );

                // Format the response deadline into a human-readable string (e.g., "24 hours remaining")
                const remainingTime = formatTimeRemaining(responseDeadline);

                // Send winning message to the winner only
                const winnerMessage = `Congratulations! You are the winning bidder for auction "${auctionName}". Please complete the usage fee payment within the next ${remainingTime}. If you fail to respond within the given time, a new winner will be selected.`;

                // Query unread notifications count for the winner
                const [unreadCountResult] = await pool.query(
                    `SELECT COUNT(*) AS unread_count FROM Notifications WHERE receiver_id = ? AND is_read = false`,
                    [winnerId]
                );
                const unreadCount = unreadCountResult[0]?.unread_count || 0;

                const winnerNotification = {
                    sender_full_name: 'AuctionWave System',
                    auction_name: auctionName,
                    listing_id: listingId,
                    winnerMessage: winnerMessage,
                    message: `Congratulations! You are the new winner of the auction "${auctionName}". Please proceed with the Usage Fee payment.`,
                    is_read: false,
                    created_at: new Date(),
                    unreadCount: unreadCount,
                };

                // Insert the winning notification
                await pool.query(
                    `INSERT INTO Notifications (receiver_id, auction_id, notification_type, message, is_read) 
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        winnerId,
                        winnerNotification.listing_id,
                        'AuctionWinner',
                        winnerNotification.winnerMessage,
                        winnerNotification.is_read,
                    ]
                );

                // Emit the winning notification
                appSocket.to(`user-${winnerId}`).emit('system-channel', {
                    recipientId: winnerId,
                    notification: winnerNotification,
                });

                console.log(`Winner notification sent to user-${winnerId} for auction ${listingId}.`);
            }

            // Notify all non-winners of auction end
            const [bidders] = await pool.query(
                `SELECT DISTINCT bidder_id FROM bids WHERE listing_id = ?`,
                [listingId]
            );

            for (const bidder of bidders) {
                if (bidder.bidder_id === winnerId) continue; // Skip the winner

                const message = `The auction "${auctionName}" has ended. Please check for the Auction Summary.`;

                // Insert notification for non-winner
                await pool.query(
                    `INSERT INTO Notifications (receiver_id, auction_id, notification_type, message, is_read) 
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        bidder.bidder_id,
                        listingId,
                        'AuctionEnded',
                        message,
                        false,
                    ]
                );

                // Emit the notification for non-winner
                appSocket.to(`user-${bidder.bidder_id}`).emit('system-channel', {
                    recipientId: bidder.bidder_id,
                    notification: {
                        sender_full_name: 'AuctionWave System',
                        message,
                        is_read: false,
                    },
                });

                console.log(`Notification sent to user-${bidder.bidder_id} for auction ${listingId}.`);
            }
        }

        return { message: 'Auction statuses updated and notifications sent to bidders.' };
    } catch (error) {
        console.error('Error ending auctions:', error);

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error: ' + error.message,
        });
    }
});

// Helper function to format the remaining time as a readable string
function formatTimeRemaining(deadline) {
    const now = new Date();
    const timeRemaining = deadline - now;

    if (timeRemaining <= 0) {
        return 'expired';
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = '';
    if (hours > 0) {
        timeString += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        if (hours > 0) timeString += ' ';
        timeString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return timeString;
}
