import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
    // Read the items and intent from the client request
    const { items } = await readBody(event);
    const currency = 'PHP';

    // Fetch access token from your PayPal token endpoint
    const tokenResponse = await $fetch('/api/paypal/token');
    const accessToken = tokenResponse.access_token;

    // Prepare the purchase_units for PayPal API
    const purchaseUnit = {
        description: 'Payment for AuctionWave services',
        amount: {
            currency_code: currency,
            value: items.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2),
            breakdown: {
                item_total: {
                    currency_code: currency,
                    value: items.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2),
                },
            },
        },
        items: items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: 1,
            unit_amount: {
                currency_code: currency,
                value: parseFloat(item.amount).toFixed(2),
            },
        })),
    };

    try {
        // Create an order with PayPal API
        const response = await axios.post(
            process.env.PAYPAL_BASE_URL + `/v2/checkout/orders`,
            {
                intent: 'AUTHORIZE',
                purchase_units: [purchaseUnit],
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                    brand_name: 'AuctionWave',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('The response in Create-payment-cashbond', response.data);
        // Return order ID to client
        return response.data;
    } catch (error) {
        console.error('Error creating PayPal order:', error.response?.data || error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create PayPal order',
        });
    }
});
