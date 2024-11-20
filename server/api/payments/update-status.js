import { defineEventHandler, getCookie, readBody, createError } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const pool = getPool();
    let decoded;
    let userId = null;

    // Step 1: Authenticate user via JWT token
    try {
        const token = getCookie(event, "accessToken");
        if (!token) {
            throw createError({ statusCode: 401, message: "Unauthorized" });
        }
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
    } catch (error) {
        throw createError({ statusCode: 401, message: 'Invalid token' });
    }

    // Step 2: Get the listing ID and cash bond amount from the request body
    const body = await readBody(event);
    const { listing_id, orderID } = body;

    // Validate required fields
    if (!listing_id || !orderID) {
        throw createError({ statusCode: 400, message: "Listing ID, Cash Bond Amount, and Order ID are required." });
    }

    // Step 3: Get auctioneer_id from AuctionListings table using the listing_id
    const [auctionListing] = await pool.query(
        "SELECT auctioneer_id FROM AuctionListings WHERE listing_id = ?",
        [listing_id]
    );

    if (!auctionListing || auctionListing.length === 0) {
        throw createError({ statusCode: 404, message: "Auction listing not found." });
    }

    const { auctioneer_id } = auctionListing[0];

    // Step 4: Find the winning bid for the given listing (only 'Usage Fee Payment Pending' status)
    const [winningBid] = await pool.query(
        "SELECT * FROM Bids WHERE listing_id = ? AND status = 'Usage Fee Payment Pending' LIMIT 1",
        [listing_id]
    );

    if (!winningBid || winningBid.length === 0) {
        throw createError({ statusCode: 404, message: "No cash bond pending bid found for the given listing." });
    }

    const { bid_id, bidder_id, bid_amount } = winningBid[0];

    // Step 5: Update the winning bid's status to 'Usage Fee Payment Completed' and response_status to 'Accepted'
    await pool.query(
        "UPDATE Bids SET status = 'Usage Fee Payment Completed', response_status = 'Accepted' WHERE bid_id = ?",
        [bid_id]
    );

    // Step 6: Add rows to the Payments table for cash bond and usage fee
    const usageFee = 20.00; // Fixed usage fee for the auction

    // Insert payment row for usage fee
    await pool.query(
        "INSERT INTO Payments (listing_id, user_id, amount, payment_type, payment_status, order_id) VALUES (?, ?, ?, 'Usage Fee', 'Payment Completed', ?)",
        [listing_id, bidder_id, usageFee, orderID]
    );

    // Step 7: Insert a row into Transactions table
    await pool.query(
        "INSERT INTO Transactions (listing_id, bidder_id, auctioneer_id, transaction_status) VALUES (?, ?, ?, 'Transaction Pending')",
        [listing_id, bidder_id, auctioneer_id]
    );

    // Step 8: Update Status of Auction to ended
    await pool.query(
        `UPDATE AuctionListings SET status = 'Auction Ended' WHERE listing_id = ?`,
        [listing_id]
    );


    return {
        message: "Bid status updated to 'Usage Fee Payment Completed', payments recorded, and transaction initialized.",
        paymentDetails: {
            usageFee: { amount: usageFee, status: "Payment Completed" },
        },
    };
});
