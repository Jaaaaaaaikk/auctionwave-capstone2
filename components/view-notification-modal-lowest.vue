<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 modal-background">
        <!-- Modal Content -->
        <div v-if="winnerDetails" class="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 class="text-xl font-semibold mb-4">Notification From: {{ sender }}</h2>
            <div class="relative"></div>
            <div class="w-full p-4 border border-gray-300 rounded my-4" disabled><span
                    v-if="winnerDetails.status === 'CashBond Pending'">🎉</span>{{ message }}</div>
            <span v-if="winnerDetails.status === 'CashBond Pending'" class="w-full p-2 rounded"><strong
                    class="mr-2">Date:</strong> {{ formatDate(winnerDetails.bid_time)
                }}</span>
            <span v-if="winnerDetails.status === 'CashBond Pending'" class="flex w-full p-2 rounded"><strong
                    class="mr-2">Winning Bid:</strong>{{
                        formatNumber(winnerDetails.bid_amount)
                    }}</span>
            <span v-if="winnerDetails.status === 'CashBond Pending'" class="flex w-full p-2 rounded"><strong
                    class="mr-2">Cash Bond Amount Required:</strong>
                {{ formatNumber(winnerDetails.cashbond_amount) }}</span>
            <span v-if="winnerDetails.status === 'CashBond Pending'" class="flex w-full p-2 rounded"><strong
                    class="mr-2">Status:</strong> {{ winnerDetails.status
                }}</span>
            <span v-if="winnerDetails.status === 'CashBond Pending'" class="flex w-full p-2 rounded"><strong
                    class="mr-2">Response Deadline:</strong> {{
                        formatDate(winnerDetails.response_deadline) }}</span>

            <span class="flex w-full p-2 rounded font-bold text-lg">Auction Summary</span>

            <!-- Scrollable Container for Bidders -->
            <div class="overflow-auto h-48 border-t border-b">

                <div v-for="bidder in auctionStore.bidders" :key="bidder.user_id"
                    class="grid grid-cols-4 gap-16 py-4 px-6 border-b last:border-b-0">
                    <!-- Bidder Name -->
                    <div>
                        <dt class="text-base font-medium text-gray-500">Bidder Name</dt>
                        <dd class="mt-1.5 text-base font-semibold text-gray-900">
                            <span>{{ bidder.bidder_name }}</span>
                        </dd>
                    </div>
                    <!-- Current Bid -->
                    <div>
                        <dt class="text-base font-medium text-gray-500">Current Bid</dt>
                        <dd class="mt-1.5 text-base font-semibold text-gray-900">
                            <span>{{ formatNumber(bidder.bid_amount) }}</span>
                        </dd>
                    </div>
                    <!-- Posted on -->
                    <div>
                        <dt class="text-base font-medium text-gray-500">Posted on</dt>
                        <dd class="mt-1.5 text-base font-semibold text-gray-900">
                            <span>{{ formatDate(bidder.bid_time) }}</span>
                        </dd>
                    </div>
                    <!-- Status -->
                    <div>
                        <dt class="text-base font-medium text-gray-500">Status</dt>
                        <dd :class="{
                            'bg-yellow-200 text-yellow-800': bidder.status === 'Active',
                            'bg-green-200 text-green-800': bidder.status === 'CashBond Pending',
                            'bg-red-200 text-red-800': bidder.status === 'CashBond Response Failed',
                            'bg-purple-200 text-purple-800': bidder.status === 'Outbid',
                            'bg-purple-200 text-yellow-950': bidder.status === 'Won',
                            'bg-purple-200 text-lime-700': bidder.status === 'Transaction Pending'
                        }" class=" text-sm py-1 px-1 rounded-lg text-center">
                            <span>{{ bidder.status }}</span>
                        </dd>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-4 space-x-2">
                <button v-if="winnerDetails.status === 'CashBond Pending'" @click="proceedPaymentFunction"
                    class="bg-custom-bluegreen hover:bg-opacity-40 hover:text-black text-white py-0.5 px-4 rounded">
                    Top-up
                </button>
                <button @click="$emit('closeAddMessageModal')"
                    class="bg-gray-300 hover:bg-custom-bluegreen hover:bg-opacity-40 hover:text-black text-white py-2 px-4 rounded">Close</button>
            </div>
        </div>
        <div v-if="isPaymentModalOpen">
            <transition name="modal-fade">
                <div
                    class="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
                    <div class="relative w-full max-w-md px-4 h-full md:h-auto">
                        <!-- Modal content -->
                        <div class="bg-white rounded-lg shadow relative dark:bg-gray-700">
                            <div class="flex justify-end p-2">
                                <button type="button" @click="closePaymentModal"
                                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                                    <svg class="w-5 h-5" fill="curren tColor" viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8 text-center">
                                <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-5">Cash-Bond Top up
                                </h3>
                                <p class="text-gray-600 mb-5">Choose Your Payment Method.</p>
                                <div id="paypal-button-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { useAuctionStore } from '@/stores/fetch-bidder-store';
import { usePaypalStore } from '~/stores/paypalStore';
import axios from 'axios';
import { toast } from "vue3-toastify";

const props = defineProps({
    sender: String,
    date: String,
    message: String,
    listing_id: Number
});

const paypalStore = usePaypalStore();
const auctionStore = useAuctionStore();
const emit = defineEmits();
const paypalButtonsRendered = ref(false);
const isPaymentModalOpen = ref(false);
const winnerDetails = ref([]);

const formatNumber = (value) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
};

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
};

const proceedPaymentFunction = () => {
    if (window.confirm("You will be redirect to payment, proceed?")) {
        isPaymentModalOpen.value = true; // Open the modal
        loadPaypalSdkAndRenderButton(); // Load PayPal SDK and render buttons
    }
};

// Function to close the payment modal
const closePaymentModal = () => {
    isPaymentModalOpen.value = false;
    paypalButtonsRendered.value = false; // Reset button rendering state when modal is closed
};

// Function to load PayPal SDK and render the buttons
const loadPaypalSdkAndRenderButton = async () => {
    if (paypalButtonsRendered.value) return; // Avoid re-rendering buttons if they already exist

    // Load PayPal SDK if it hasn't been loaded yet
    if (!paypalStore.isPaypalLoaded) {
        await paypalStore.loadPaypalCashbondSdk(); // Load PayPal SDK if not already loaded
    }

    // Ensure modal content is fully rendered
    nextTick(() => {
        renderPaypalButtons(); // After DOM updates, render PayPal buttons
    });
};

// Function to render PayPal buttons after SDK is loaded
const renderPaypalButtons = () => {
    const container = document.getElementById("paypal-button-container");
    if (container && !paypalButtonsRendered.value) {
        window.paypal.Buttons({
            createOrder: async () => {
                try {
                    // Create an order on the server
                    const usageFee = 20.00;
                    const orderResponse = await axios.post('/api/paypal/create-payment-cashbond', {
                        items: [
                            {
                                name: `Cash Bond for Auction ${winnerDetails.value.auction_name}`,
                                description: `Cash bond required for winning bid of ${formatNumber(winnerDetails.value.bid_amount)}`,
                                amount: winnerDetails.value.cashbond_amount
                            },
                            {
                                name: `Usage Fee for Auction ${winnerDetails.value.auction_name}`,
                                description: `Usage fee for winning bid of ${formatNumber(winnerDetails.value.bid_amount)}`,
                                amount: usageFee
                            }
                        ],
                    });
                    console.log('OrderID from PayPal:', orderResponse.data.id);
                    // Return the orderID for PayPal to use
                    return orderResponse.data.id // 'id' is the PayPal `orderID`
                } catch (error) {
                    console.error('Error capturing payment:', error.response?.data || error);
                    toast.error('Error capturing payment. Please try again.');
                }
            },

            onApprove: async (data) => {
                try {
                    // Capture the order on the server using the approved orderID
                    const captureResponse = await axios.post('/api/paypal/capture-payment-cashbond', {
                        orderID: data.orderID
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (captureResponse.data.status === 'COMPLETED') {

                        // Update Bids Table with status 'Won' and 'Accepted'
                        await axios.post('/api/payments/update-status', {
                            cashbond_amount: winnerDetails.value.cashbond_amount,
                            listing_id: props.listing_id,
                            orderID: data.orderID
                        });
                        toast.success('Payment successful!');
                        closePaymentModal();
                    } else {
                        toast.warn('Payment failed or was not completed.');
                    }
                } catch (error) {
                    console.error('Error capturing payment:', error);
                }
            },

            onCancel: () => {
                toast.error('Payment was cancelled.');
            },
        }).render('#paypal-button-container');
        paypalButtonsRendered.value = true;
    }
};

const fetchBidWinnerDetails = async (auction) => {
    if (!auction.id) {
        console.error('No listing ID');
        return;
    }

    try {
        const response = await axios.get(`/api/auctions/fetch-summary-lowest?id=${auction.id}`);
        winnerDetails.value = response.data.winnerBidderData;
    } catch (error) {
        console.error('Failed to fetch bidders:', error);
    }
};


onMounted(async () => {
    fetchBidWinnerDetails({ id: props.listing_id });
    auctionStore.fetchBidders({ id: props.listing_id });
    if (!paypalStore.isPaypalLoaded) {
        await paypalStore.loadPaypalCashbondSdk(); // Load PayPal SDK if not already loaded
    }
});
</script>

<style scoped>
/* Add any additional styling you might want */
</style>