import { defineEventHandler, createError, getCookie } from "h3";
import { getPool } from "../../db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const {
        page = 1,
        numberOfAuctions = 10,
        selectedBidStatus = "",
        selectedOfferStatus = "",
    } = getQuery(event);

    try {
        const token = getCookie(event, "accessToken");
        if (!token) {
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const bidderId = decoded.userId;
        const pool = getPool();
        const offset = (page - 1) * numberOfAuctions;

        // Main query using CTE
        const query = `
        WITH ParticipatedAuctions AS (
            SELECT 
                al.listing_id,
                al.name AS auction_name,
                al.created_at,
                al.bidding_type,
                al.uuid,
                b.bid_time,
                b.status AS bid_status,
                o.offer_time,
                o.review_status,
                b.bidder_id,
                ROW_NUMBER() OVER (PARTITION BY al.listing_id ORDER BY 
                    CASE 
                        WHEN al.bidding_type = 'Lowest-type' THEN b.bid_time
                        WHEN al.bidding_type = 'Offer-type' THEN o.offer_time
                    END DESC) AS row_num
            FROM AuctionListings al
            LEFT JOIN Bids b ON al.listing_id = b.listing_id AND b.bidder_id = ?
            LEFT JOIN Offers o ON al.listing_id = o.listing_id AND o.bidder_id = ?
            WHERE al.listing_id IN (
                SELECT listing_id FROM Bids WHERE bidder_id = ?
                UNION
                SELECT listing_id FROM Offers WHERE bidder_id = ?
            )
        )
        SELECT 
            p.listing_id,
            p.auction_name,
            p.created_at,
            p.bidding_type,
            p.uuid,
            -- Determine the latest time
            CASE 
                WHEN p.bidding_type = 'Lowest-type' THEN p.bid_time
                WHEN p.bidding_type = 'Offer-type' THEN p.offer_time
            END AS latest_time,
            
            -- Determine the relevant status based on the latest time
            CASE 
                WHEN p.bidding_type = 'Lowest-type' THEN p.bid_status
                WHEN p.bidding_type = 'Offer-type' THEN p.review_status
            END AS status
        FROM ParticipatedAuctions p
        WHERE p.row_num = 1  -- Filter to get the latest bid or offer per auction
        ${selectedBidStatus ? "AND p.bid_status = ?" : ""}
        ${selectedOfferStatus ? "AND p.review_status = ?" : ""}
        ORDER BY latest_time DESC
        LIMIT ? OFFSET ?;


        `;

        const queryParams = [
            bidderId, bidderId, bidderId, bidderId,
            ...(selectedBidStatus ? [selectedBidStatus] : []),
            ...(selectedOfferStatus ? [selectedOfferStatus] : []),
            Number(numberOfAuctions), // LIMIT value
            Number(offset), // OFFSET value
        ];


        const [rows] = await pool.query(query, queryParams);

        // Query to count the total distinct auctions participated by the bidder
        const totalCountQuery = `
            WITH ParticipatedAuctions AS (
                SELECT 
                    al.listing_id,
                    b.status,
                    o.review_status
                FROM AuctionListings al
                LEFT JOIN Bids b ON al.listing_id = b.listing_id AND b.bidder_id = ?
                LEFT JOIN Offers o ON al.listing_id = o.listing_id AND o.bidder_id = ?
                WHERE al.listing_id IN (
                    SELECT listing_id FROM Bids WHERE bidder_id = ?
                    UNION
                    SELECT listing_id FROM Offers WHERE bidder_id = ?
                )
            )
            SELECT COUNT(DISTINCT listing_id) AS total
            FROM ParticipatedAuctions
            WHERE 1=1
            ${selectedBidStatus ? "AND status = ?" : ""}
            ${selectedOfferStatus ? "AND review_status = ?" : ""}
        `;

        const totalCountParams = [
            bidderId, bidderId, bidderId, bidderId,
            ...(selectedBidStatus ? [selectedBidStatus] : []),
            ...(selectedOfferStatus ? [selectedOfferStatus] : []),
        ];

        const [totalResult] = await pool.query(totalCountQuery, totalCountParams);
        const totalCount = totalResult[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / numberOfAuctions);

        return {
            auctions: rows,
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
