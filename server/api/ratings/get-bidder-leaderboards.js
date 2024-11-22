import { defineEventHandler, getCookie, createError } from "h3";
import jwt from "jsonwebtoken";
import { getPool } from "../../db";

export default defineEventHandler(async (event) => {
  try {
    // Verify the JWT token
    const token = getCookie(event, "accessToken");
    if (!token) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET);

    // Get database connection
    const pool = getPool();

    // Query for Auctioneers
    const [auctioneers] = await pool.query(`
      SELECT 
        u.user_id,
        CONCAT(u.firstname, ' ', u.lastname) AS name,
        u.location_id,
        l.location_name AS location,
        (
          SELECT COUNT(*) 
          FROM AuctionListings al 
          WHERE al.auctioneer_id = u.user_id 
            AND al.status = 'Auction Ended'
            AND EXISTS (
              SELECT 1 FROM Transactions t 
              WHERE t.listing_id = al.listing_id 
              AND t.transaction_status = 'Transaction Completed'
            )
        ) AS successful_auctions,
        (
          SELECT AVG(r.rating) 
          FROM AuctioneerRatings r 
          WHERE r.auctioneer_id = u.user_id
        ) AS average_rating,
        (
          SELECT COUNT(*) 
          FROM AuctioneerRatings r 
          WHERE r.auctioneer_id = u.user_id
        ) AS total_reviews,
        (
          SELECT profile_image_url 
          FROM UserProfileImages up 
          WHERE up.user_id = u.user_id 
            AND up.is_current_profile_image = TRUE
        ) AS profile_image
      FROM Users u
      LEFT JOIN Locations l ON u.location_id = l.location_id
      WHERE u.user_type = 'Auctioneer'
      HAVING 
        successful_auctions > 0 
        AND average_rating IS NOT NULL 
        AND total_reviews > 0
      ORDER BY successful_auctions DESC, average_rating DESC
      LIMIT 10;
    `);

    // Query for Bidders
    const [bidders] = await pool.query(`
      SELECT 
        u.user_id,
        CONCAT(u.firstname, ' ', u.lastname) AS name,
        u.location_id,
        l.location_name AS location,
        (
          SELECT COUNT(*) 
          FROM AuctionVisits av 
          JOIN Transactions t ON t.listing_id = av.listing_id 
          WHERE av.bidder_id = u.user_id 
            AND t.transaction_status = 'Transaction Completed'
        ) AS successful_auctions,
        (
          SELECT AVG(r.rating) 
          FROM BidderRatings r 
          WHERE r.bidder_id = u.user_id
        ) AS average_rating,
        (
          SELECT COUNT(*) 
          FROM BidderRatings r 
          WHERE r.bidder_id = u.user_id
        ) AS total_reviews,
        (
          SELECT profile_image_url 
          FROM UserProfileImages up 
          WHERE up.user_id = u.user_id 
            AND up.is_current_profile_image = TRUE
        ) AS profile_image
      FROM Users u
      LEFT JOIN Locations l ON u.location_id = l.location_id
      WHERE u.user_type = 'Bidder'
      HAVING 
        successful_auctions > 0 
        AND average_rating IS NOT NULL 
        AND total_reviews > 0
      ORDER BY successful_auctions DESC, average_rating DESC
      LIMIT 10;
    `);

    // Ensure numeric values are parsed as floats
    const formattedAuctioneers = auctioneers.map(a => ({
      ...a,
      average_rating: a.average_rating !== null ? parseFloat(a.average_rating) : null,
      successful_auctions: a.successful_auctions !== null ? parseInt(a.successful_auctions, 10) : 0,
      total_reviews: a.total_reviews !== null ? parseInt(a.total_reviews, 10) : 0
    }));

    const formattedBidders = bidders.map(b => ({
      ...b,
      average_rating: b.average_rating !== null ? parseFloat(b.average_rating) : null,
      successful_auctions: b.successful_auctions !== null ? parseInt(b.successful_auctions, 10) : 0,
      total_reviews: b.total_reviews !== null ? parseInt(b.total_reviews, 10) : 0
    }));

    console.log('formattedAuctioneers', formattedAuctioneers);
    console.log('formattedBidders', formattedBidders);


    return { auctioneers: formattedAuctioneers, bidders: formattedBidders };
  } catch (error) {
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
