import { defineEventHandler, createError, getCookie } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const {
        page = 1,
        numberOfTransactions = 10,
        selectedTransactionStatus = "", // Filter for transaction status
    } = getQuery(event);

    try {
        const token = getCookie(event, "accessToken");
        if (!token) {
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const bidderId = decoded.userId;
        const pool = getPool();
        const offset = (page - 1) * numberOfTransactions;

        // Main query to retrieve transactions involving the bidder
        const query = `
        WITH TransactionDetails AS (
            SELECT 
                t.transaction_id,
                al.name AS auction_name,
                al.uuid AS auction_uuid,
                al.bidding_type,
                al.listing_id,
                t.transaction_status,
                t.created_at AS transaction_time,
                t.auctioneer_id,
                t.bidder_id
            FROM Transactions t
            JOIN AuctionListings al ON al.listing_id = t.listing_id
            WHERE t.bidder_id = ? 
        )
        SELECT 
            td.transaction_id,
            td.auction_name,
            td.auction_uuid,
            td.bidding_type,
            td.listing_id,
            td.transaction_status,
            td.transaction_time,
            td.auctioneer_id,
            td.bidder_id
        FROM TransactionDetails td
        ${selectedTransactionStatus ? "WHERE td.transaction_status = ?" : ""}
        ORDER BY td.transaction_time DESC
        LIMIT ? OFFSET ?;
        `;

        const queryParams = [
            bidderId,
            ...(selectedTransactionStatus ? [selectedTransactionStatus] : []),
            Number(numberOfTransactions),  // LIMIT
            Number(offset),  // OFFSET
        ];

        const [rows] = await pool.query(query, queryParams);

        // Query to count total transactions for the user (without pagination)
        const totalCountQuery = `
            SELECT COUNT(*) AS total
            FROM Transactions t
            WHERE t.bidder_id = ? 
            ${selectedTransactionStatus ? "AND t.transaction_status = ?" : ""}
        `;

        const totalCountParams = [
            bidderId,
            ...(selectedTransactionStatus ? [selectedTransactionStatus] : []),
        ];

        const [totalResult] = await pool.query(totalCountQuery, totalCountParams);
        const totalCount = totalResult[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / numberOfTransactions);

        return {
            transactions: rows,
            totalPages,
            currentPage: Number(page),
        };
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        });
    }
});
