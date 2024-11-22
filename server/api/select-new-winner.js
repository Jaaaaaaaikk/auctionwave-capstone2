import { defineEventHandler, createError } from 'h3';
import { getPool } from '../db';

export default defineEventHandler(async (event) => {
    try {
        const pool = await getPool();
        const appSocket = event.context.appSocket;

        // Step 1: Get bidders who are outbid or expired (Failed to respond) and their auctions
        const [bidders] = await pool.query(`
            SELECT b.listing_id, b.bid_id, b.bidder_id, b.status AS bid_status, a.name AS auction_name
            FROM Bids b
            JOIN AuctionListings a ON a.listing_id = b.listing_id
            WHERE b.status IN ('Outbid', 'Expired') AND a.end_time <= NOW() AND a.status = 'Auction Pending'
        `);

        if (bidders.length === 0) {
            return { message: 'No bids need to be updated.' };
        }

        // Step 2: Loop through bidders to find the expired one and the outbid bidder
        for (const bidder of bidders) {
            const { listing_id, bid_id, bidder_id, bid_status, auction_name } = bidder;

            // Step 3: Find the next bidder to be promoted to "Usage Fee Payment Pending" (the next outbid bidder)
            if (bid_status === 'Expired') {
                // Step 4: Find the next bidder (outbid) who will be promoted
                const [nextBidder] = await pool.query(
                    `SELECT bid_id, bidder_id FROM Bids WHERE listing_id = ? AND status = 'Outbid' ORDER BY bid_amount ASC LIMIT 1`,
                    [listing_id]
                );

                if (nextBidder.length > 0) {
                    const nextBidderId = nextBidder[0].bidder_id;
                    const nextBidId = nextBidder[0].bid_id;

                    // Set the response deadline for the new winner (24 hours from now)
                    const responseDeadline = new Date();
                    responseDeadline.setHours(responseDeadline.getHours() + 24);  // Add 24 hours
                    const remainingTime = formatTimeRemaining(responseDeadline);
                    // Step 5: Update the next bidder to "Usage Fee Payment Pending"
                    await pool.query(
                        `UPDATE Bids SET status = 'Usage Fee Payment Pending', response_deadline = ? WHERE bid_id = ?`,
                        [responseDeadline, nextBidId]
                    );

                    // Step 6: Send notification to the next bidder (new winner)
                    await pool.query(
                        `INSERT INTO Notifications (receiver_id, auction_id, notification_type, message, is_read)
                        VALUES (?, ?, ?, ?, ?)`,
                        [
                            nextBidderId,
                            listing_id,
                            'AuctionWinner',
                            `Congratulations! You are the winning bidder for auction "${auction_name}". Please complete the usage fee within the next ${remainingTime}. If you fail to respond within the given time, a new winner will be selected.`,
                            false
                        ]
                    ); remainingTime

                    // Emit notification to the new winner
                    appSocket.to(`user-${nextBidderId}`).emit('system-channel', {
                        recipientId: nextBidderId,
                        notification: {
                            sender_full_name: 'AuctionWave System',
                            message: `Congratulations! You are the new winner of the auction "${auction_name}". Please proceed with the usage fee payment.`,
                            is_read: false
                        }
                    });

                    console.log(`Notified new winner: user-${nextBidderId} for auction ${listing_id}`);
                } else {
                    console.log(`No valid next bidder found for auction ${listing_id}`);
                }

                // Step 7: Mark the expired bidder as "Failed to Respond"
                await pool.query(
                    `UPDATE Bids SET status = 'Payment Response Failed' AND respond_status = 'Expired' WHERE bid_id = ?`,
                    [bid_id]
                );

                // Step 8: Send notification to the bidder who failed to respond
                await pool.query(
                    `INSERT INTO Notifications (receiver_id, auction_id, notification_type, message, is_read)
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        bidder_id,
                        listing_id,
                        'Response',
                        `You failed to respond in time for the auction "${auction_name}".`,
                        false
                    ]
                );

                // Emit notification to the failed bidder
                appSocket.to(`user-${bidder_id}`).emit('system-channel', {
                    recipientId: bidder_id,
                    notification: {
                        sender_full_name: 'AuctionWave System',
                        message: `You failed to respond in time for the auction "${auction_name}".`,
                        is_read: false
                    }
                });

                console.log(`Notified bidder who failed to respond: user-${bidder_id} for auction ${listing_id}`);
            }
        }

        return { message: 'Bids updated and notifications sent to winner and failed bidder.' };

    } catch (error) {
        console.error('Error in updating bids:', error);
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
