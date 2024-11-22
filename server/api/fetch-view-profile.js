import { defineEventHandler, getCookie, createError, getQuery } from "h3";
import { getPool } from "../db";

export default defineEventHandler(async (event) => {
    const { user_id } = getQuery(event); // Call getQuery with the event object

    try {
        // Retrieve the access token from cookies
        const token = getCookie(event, "accessToken");

        if (!token) {
            throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        }

        const pool = await getPool();

        // Query to get user profile from the Users table
        const [user] = await pool.query(
            `SELECT u.user_id, u.firstname, u.middlename, u.lastname, u.email, u.about, u.location_id, u.user_type, upi.profile_image_url
            FROM Users u LEFT JOIN UserProfileImages upi 
                ON u.user_id = upi.user_id AND upi.is_current_profile_image = TRUE
            WHERE u.user_id = ?`,
            [user_id], // Use the auctioneerId
        );

        if (!user.length) {
            throw createError({ statusCode: 404, statusMessage: "User not found" });
        }

        // Query to get location name associated with the user
        const [location] = await pool.query(
            `SELECT l.location_name 
            FROM Locations l 
            WHERE l.location_id = ?`,
            [user[0].location_id],
        );

        // Query to get categories associated with the bidder
        const [categories] = await pool.query(
            `SELECT c.category_name
            FROM Bidders b
            JOIN Categories c ON b.category_id = c.category_id
            WHERE b.bidder_id = ?`,
            [user_id], // Use the auctioneerId
        );

        // Variable to hold rating
        let rating = null;

        // Check user type and fetch corresponding ratings
        if (user[0].user_type === 'Bidder') {
            // If user is a bidder, get rating from BidderRatings table
            const [bidderRatings] = await pool.query(
                `SELECT AVG(rating) as averageRating 
                FROM BidderRatings 
                WHERE bidder_id = ?`,
                [user_id] // Use the auctioneerId as bidderId
            );
            rating = bidderRatings.length ? bidderRatings[0].averageRating : null;
        } else if (user[0].user_type === 'Auctioneer') {
            // If user is an auctioneer, get rating from AuctioneerRatings table
            const [auctioneerRatings] = await pool.query(
                `SELECT AVG(rating) as averageRating 
                FROM AuctioneerRatings 
                WHERE auctioneer_id = ?`,
                [user_id] // Use the auctioneerId
            );
            rating = auctioneerRatings.length ? auctioneerRatings[0].averageRating : null;
        }

        if (rating !== null) {
            rating = parseFloat(rating); // Ensure the rating is a float
        }

        console.log('rating', rating);

        // Construct the response
        return {
            profile: {
                user_id: user[0].user_id,
                firstName: user[0].firstname,
                middleName: user[0].middlename,
                lastName: user[0].lastname,
                email: user[0].email,
                location: location.length ? location[0].location_name : "Unknown", // Handle case if location is not found
                categories: categories.map((c) => c.category_name),
                about: user[0].about,
                userType: user[0].user_type,
                profile_image_url: user[0].profile_image_url,
                rating: rating, // Add the rating here
            },
        };
    } catch (error) {
        console.error("Error:", error.message);
        throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
});
