import { defineEventHandler, createError, getCookie } from "h3";
import { getPool } from "../db";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, "accessToken");
    // const refreshToken = cookies.refreshToken; // Retrieve the refresh token from the cookies

    // if (!refreshToken) {
    //   console.error("No refresh token provided in cookies");
    //   throw createError({
    //     statusCode: 400,
    //     statusMessage: "Refresh token is required",
    //   });
    // }

    if (!accessToken) {
      console.error("No access token provided in cookies");
      throw createError({
        statusCode: 400,
        statusMessage: "Access token is required",
      });
    }

    console.log("Received access token from cookies:", accessToken);
    //console.log("Received refresh token from cookies:", refreshToken);

    const pool = await getPool();

    // Check if the token exists
    // const [rows] = await pool.query(
    //   "SELECT * FROM UserTokens WHERE token = ?",
    //   [refreshToken]
    // );

    // if (rows.length === 0) {
    //   console.error("Token not found:", refreshToken);
    //   throw createError({ statusCode: 404, statusMessage: "Token not found" });
    // }

    // const tokenData = rows[0];
    // console.log("Token data:", tokenData);

    // Check if the token is already revoked
    // if (tokenData.revokedAt !== null) {
    //   console.log("Token already revoked:", refreshToken);
    //   return { message: "Token already revoked" };
    // }

    // Set the revokedAt column to the current timestamp
    // const currentDateTime = new Date();
    // console.log("Updating token revoke time to:", currentDateTime);
    // await pool.query("UPDATE UserTokens SET revokedAt = ? WHERE token = ?", [
    //   currentDateTime,
    //   refreshToken,
    // ]);

    //console.log("Token revoked successfully:", refreshToken);

    // Clear the refresh token cookie by setting it with a past expiry date
    // setHeader(event, "Set-Cookie", `refreshToken=; HttpOnly; Path=/; Max-Age=0;`);
    setHeader(event, "Set-Cookie", `accessToken=; HttpOnly; Path=/; Max-Age=0;`);

    return { message: "Logout successful" };
  } catch (error) {
    console.error("Logout error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
