import { defineEventHandler, readBody } from "h3";
import axios from 'axios';

export default defineEventHandler(async (event) => {
    const { orderID } = await readBody(event);

    // Fetch access token from your PayPal token endpoint
    const tokenResponse = await $fetch('/api/paypal/token');
    const accessToken = tokenResponse.access_token;

    try {
        const response = await axios.post(
            process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderID}/authorize`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('PayPal Response capture-payment.js:', response.data);
        return response.data; // Returns capture details, including status
    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to capture PayPal payment' });
    }
});
