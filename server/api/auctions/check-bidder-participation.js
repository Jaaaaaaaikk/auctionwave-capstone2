import { defineEventHandler, getCookie, createError } from 'h3';
import { getPool } from '../../db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const pool = getPool();

  // Extract auctionId from query params
  const auctionId = event.req.url?.split('?')[1]?.split('=')[1];

  if (!auctionId) {
    throw createError({ statusCode: 400, message: 'Auction ID is required' });
  }

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
  const userType = decodedToken.userType;

  try {

    const [rows] = await pool.query(
      `SELECT B.bid_id 
FROM Bids B
JOIN AuctionVisits AV ON B.participant_id = AV.participant_id
JOIN AuctionListings AL ON B.listing_id = AL.listing_id
JOIN Users U ON AV.bidder_id = U.user_id
WHERE U.user_id = ?
AND AL.listing_id = ?
LIMIT 1;
`,
      [auctionId, bidderId]
    );

    const isParticipant = rows.length > 0;

    return { isParticipant, userType };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Database query failed' });
  }
});
