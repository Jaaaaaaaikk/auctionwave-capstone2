import { defineEventHandler, createError, getCookie } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const {
        page = 1,
        numberOfPayments = 10, // Number of payments per page
        selectedPaymentStatus = "", // Filter for payment status
    } = getQuery(event);

    try {
        // Verify access token
        const token = getCookie(event, "accessToken");
        if (!token) {
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const bidderId = decoded.userId; // Bidder ID extracted from token

        const pool = getPool();
        const offset = (page - 1) * numberOfPayments;

        // Main query to fetch payment records
        const paymentQuery = `
            SELECT 
                p.payment_id,
                p.amount,
                p.payment_type,
                p.payment_status,
                p.payment_method,
                p.created_at AS payment_time,
                al.name AS auction_name,
                al.uuid AS auction_uuid,
                al.bidding_type
            FROM Payments p
            JOIN AuctionListings al ON p.listing_id = al.listing_id
            WHERE p.user_id = ?
            ${selectedPaymentStatus ? "AND p.payment_status = ?" : ""}
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?;
        `;

        const paymentParams = [
            bidderId,
            ...(selectedPaymentStatus ? [selectedPaymentStatus] : []),
            Number(numberOfPayments), // LIMIT
            Number(offset), // OFFSET
        ];

        const [paymentRows] = await pool.query(paymentQuery, paymentParams);

        // Query to count total payments for pagination
        const totalCountQuery = `
            SELECT COUNT(*) AS total
            FROM Payments p
            WHERE p.user_id = ?
            ${selectedPaymentStatus ? "AND p.payment_status = ?" : ""}
        `;

        const totalCountParams = [
            bidderId,
            ...(selectedPaymentStatus ? [selectedPaymentStatus] : []),
        ];

        const [totalResult] = await pool.query(totalCountQuery, totalCountParams);
        const totalCount = totalResult[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / numberOfPayments);

        return {
            payments: paymentRows,
            totalPages,
            currentPage: Number(page),
            totalPayments: totalCount,
        };
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        });
    }
});
