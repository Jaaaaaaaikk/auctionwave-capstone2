import { defineEventHandler, readBody, getCookie, createError } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = await getPool();

    // Read request body
    const { auctionId, offerComment } = await readBody(event);

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
        // Retrieve listing_id and auctioneer_id from AuctionListings
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

        console.log('The Auction Name', auction_name);
        
        // Insert offer into Offers table
        const [offerResult] = await pool.query(
            `INSERT INTO Offers (listing_id, bidder_id, comment) VALUES (?, ?, ?)`,
            [listingId, bidderId, offerComment]
        );

        // Prepare notification message for the auctioneer
        const message = `${auction_name}: A new offer has been placed on your auction.`;

        // Insert notification for the auctioneer about the offer
        await pool.query(
            `INSERT INTO Notifications (user_id, auction_id, notification_type, message) 
             VALUES (?, ?, 'OfferPlaced', ?)`,
            [auctioneerId, listingId, message]
        );

        return { status: 'success', offerId: offerResult.insertId }; // Return the offer ID
    } catch (error) {
        // Handle database errors
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});
