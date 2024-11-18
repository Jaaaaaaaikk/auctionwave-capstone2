import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
    const { orderID } = await readBody(event);

    // Fetch PayPal access token from your token endpoint
    const tokenResponse = await $fetch('/api/paypal/token');
    const accessToken = tokenResponse.access_token;

    try {
        // Capture the payment using the PayPal API
        const response = await axios.post(
            `https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/authorize`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Return the capture response data
        return response.data;
    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to capture PayPal payment',
        });
    }
});
