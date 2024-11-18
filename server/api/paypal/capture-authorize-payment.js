import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
    const { authorizationID } = await readBody(event);

    // Fetch access token from your PayPal token endpoint
    const tokenResponse = await $fetch('/api/paypal/token');
    const accessToken = tokenResponse.access_token;

    console.log('token for refund-payment', tokenResponse);
    try {
        // Refund the payment capture
        const response = await axios.post(
            process.env.PAYPAL_BASE_URL + `/v2/payments/authorizations/${authorizationID}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Capture Authorize details:', response.data);
        return response.data; // Returns refund details
    } catch (error) {
        console.error('Error refunding PayPal payment:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to refund PayPal payment' });
    }
});
