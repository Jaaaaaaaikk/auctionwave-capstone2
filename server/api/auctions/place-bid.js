import { defineEventHandler, readBody, getCookie, createError } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read request body
    const { auctionId, bidAmount } = await readBody(event);

    let decodedToken;
    try {
        // Retrieve the access token from cookies
        const token = getCookie(event, "accessToken");

        if (!token) {
            // No token found, return an unauthorized error
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw createError({ statusCode: 401, message: 'Invalid token' });
    }

    const bidderId = decodedToken.userId;

    try {
        // Retrieve listing_id and auctioneer_id from UUID
        const [result] = await pool.query(
            `SELECT listing_id, auctioneer_id, name FROM AuctionListings WHERE uuid = ?`,
            [auctionId]
        );

        if (result.length === 0) {
            throw createError({ statusCode: 404, message: 'Auction not found' });
        }

        const listingId = result[0].listing_id;
        const auctioneerId = result[0].auctioneer_id; // Get the auctioneer ID
        const auction_name = result[0].name;

        // Retrieve participant_id
        const [participantResult] = await pool.query(
            `SELECT participant_id FROM AuctionVisits WHERE listing_id = ? AND bidder_id = ?`,
            [listingId, bidderId]
        );

        if (participantResult.length === 0) {
            throw createError({ statusCode: 404, message: 'Participant not found' });
        }

        const participantId = participantResult[0].participant_id;

        // Check if this is the first bid by this bidder for this auction
        const [existingBidResult] = await pool.query(
            `SELECT bid_id FROM Bids WHERE listing_id = ? AND participant_id = ?`,
            [listingId, participantId]
        );

        // Insert bid into Bids table
        await pool.query(
            `INSERT INTO Bids (listing_id, participant_id, bid_amount) 
             VALUES (?, ?, ?)`,
            [listingId, participantId, bidAmount]
        );

        let message;
        if (existingBidResult.length === 0) {
            // First bid from this bidder
            message = `${auction_name}: A new bidder has placed their first bid on your auction.`;
        } else {
            // Subsequent bid
            message = `${auction_name}: A bidder has placed a new bid on your auction.`;
        }

        // Insert notification for the auctioneer about the bid
        await pool.query(
            `INSERT INTO Notifications (user_id, auction_id, notification_type, message) 
             VALUES (?, ?, 'BidPlaced', ?)`,
            [auctioneerId, listingId, message]
        );

        return { status: 'success' };
    } catch (error) {
        // Handle database errors
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});
