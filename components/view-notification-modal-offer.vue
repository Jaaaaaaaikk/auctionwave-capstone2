<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 modal-background">
        <!-- Modal Content -->
        <div v-if="winnerDetails"
            class="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
            <h2 class="text-xl font-semibold mb-4">Notification From: {{ sender }}</h2>
            <div class="relative"></div>
            <div class="w-full p-4 border border-gray-300 rounded my-4" disabled><span
                    v-if="winnerDetails.review_status === 'Offer Accepted'">🎉</span>{{ message }}</div>
            <span v-if="winnerDetails.review_status === 'Offer Accepted'" class="w-full p-2 rounded"><strong
                    class="mr-2">Date:</strong> {{ formatDate(winnerDetails.offer_time)
                }}</span>
            <span v-if="winnerDetails.review_status === 'Offer Accepted'" class="flex w-full p-2 rounded"><strong
                    class="mr-2">Status:</strong> {{ winnerDetails.review_status
                }}</span>

            <span class="flex w-full p-2 rounded font-bold text-lg">Auction Summary</span>

            <!-- Scrollable Container for Bidders -->
            <section class="w-full rounded-lg p-4">
                <span v-if="topComments.length === 0" class="text-gray-500 mb-2 text-center">
                    No recent offers.
                </span>
                <!-- Offer Block 1 -->
                <div v-for="offer in topComments.slice(0, offersToShow)" :key="offer.offer_id" class="flex mt-4">
                    <!-- User's Profile Image -->
                    <div class="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center">
                        <img class="h-12 w-12 rounded-full object-cover"
                            :src="offer.userImageUrl || '/images/default-profile-image.png'" alt="User Image" />
                    </div>

                    <!-- Comment Details -->
                    <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ offer.full_name }}</div>
                        <div class="text-gray-600 text-xs">Posted on {{ formatDate(offer.offer_time) }}</div>
                        <div class="mt-2 text-sm text-gray-900 max-w-3xl bg-gray-200 rounded-lg p-2 break-words">{{
                            offer.comment }}</div>
                        <div v-if="offer.commentImages && offer.commentImages.length > 0" class="text-center">
                            <div class="flex flex-wrap gap-2 mt-2 justify-start">
                                <div v-for="(image, idx) in offer.commentImages" :key="idx"
                                    class="w-16 h-16 border rounded-lg">
                                    <img @click="openImageModal(image)" :src="image" alt="Offer Image"
                                        class="w-full h-full object-cover rounded cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Status Section -->
                    <div class="ml-4 flex flex-col justify-between items-end">
                        <div class=" text-center text-gray-800 px-3 rounded-lg text-sm">
                            <!-- <strong>Status</strong> -->

                            <!-- Review Status -->
                            <p :class="{
                                'bg-yellow-200 text-yellow-800': offer.review_status === 'Offer Pending',
                                'bg-green-200 text-green-800': offer.review_status === 'Offer Accepted',
                                'bg-red-200 text-red-800': offer.review_status === 'Offer Discarded',
                                'bg-purple-200 text-purple-800': offer.review_status === 'Provide More'
                            }" class=" text-xs py-1 px-3 rounded-lg">
                                {{ offer.review_status }}
                            </p>
                        </div>

                    </div>


                </div>
                <!-- Horizontal Separator -->
                <hr class="my-8 border-gray-300" />

                <!-- See More Button -->
                <div v-if="offersToShow < topComments.length" class="text-center mt-4">
                    <button @click="loadMoreOffers"
                        class="bg-custom-bluegreen text-white py-2 px-4 rounded hover:bg-blue-600">
                        See More
                    </button>
                </div>

                <!-- Modal to display the clicked image -->
                <div v-if="isPictureViewModalOpen" @click="closeModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div class="relative">
                        <img :src="modalImageSrc" alt="Large View" class="max-w-4xl max-h-[70vh] object-contain" />
                        <!-- Close button -->
                        <button @click="closeModal"
                            class="absolute top-0 right-0 bg-gray-900 text-white rounded-full p-2 cursor-pointer">
                            x
                        </button>
                    </div>
                </div>
            </section>

            <div class="flex justify-end mt-4 space-x-2">
                <button v-if="winnerDetails.review_status === 'Offer Accepted'" @click="proceedPaymentFunction"
                    class="bg-custom-bluegreen hover:bg-opacity-40 hover:text-black text-white py-0.5 px-4 rounded">
                    Pay Usage Fee
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
                                <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-5">Usage Fee Payment
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
import { usePaypalStore } from '~/stores/paypalStore';
import axios from 'axios';
import { toast } from "vue3-toastify";

const props = defineProps({
    sender: { type: String, default: 'AuctionWave System' },
    date: { type: String, default: '' },
    message: { type: String, default: '' },
    listing_id: { type: Number, required: true } // Assuming this is always required
});

const paypalStore = usePaypalStore();
const emit = defineEmits();
const paypalButtonsRendered = ref(false);
const isPaymentModalOpen = ref(false);
const winnerDetails = ref([]);
const offersToShow = ref(3);
const topComments = ref([]);
const isPictureViewModalOpen = ref(false);
const modalImageSrc = ref('');

// Function to open the modal with the clicked image's source
const openImageModal = (imageSrc) => {
    modalImageSrc.value = imageSrc;
    isPictureViewModalOpen.value = true;
};

// Function to close the modal
const closeModal = () => {
    isPictureViewModalOpen.value = false;
    modalImageSrc.value = '';  // Reset the modal image source
};

// Function to load more offers
const loadMoreOffers = () => {
    offersToShow.value += 3; // Show 3 more offers when the button is clicked
};

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
        await paypalStore.loadPaypalUsageFeeSdk(); // Load PayPal SDK if not already loaded
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
                    const orderResponse = await axios.post('/api/paypal/create-payment-usage', {
                        items: [
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
                    const captureResponse = await axios.post('/api/paypal/capture-payment-usage', {
                        orderID: data.orderID
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (captureResponse.data.status === 'COMPLETED') {

                        // Update Bids Table with status 'Won' and 'Accepted'
                        await axios.post('/api/payments/update-status', {
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

const fetchOfferBidders = async (auction) => {
    if (!auction.id) {
        console.error('No listing ID');
        return;
    }
    try {
        const { data } = await axios.get(`/api/auctions/fill-in-offer-participants?id=${auction.id}`);
        topComments.value = data.offers; // Store the fetched top comments
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
};

const fetchOfferWinnerDetails = async (auction) => {
    if (!auction.id) {
        console.error('No listing ID');
        return;
    }

    try {
        const response = await axios.get(`/api/auctions/fetch-summary-offer?id=${auction.id}`);
        console.log('response', response.data);
        winnerDetails.value = response.data.winnerBidderData;
    } catch (error) {
        console.error('Failed to fetch bidders:', error);
    }
};

onMounted(async () => {
    fetchOfferWinnerDetails({ id: props.listing_id });
    fetchOfferBidders({ id: props.listing_id });
    if (!paypalStore.isPaypalLoaded) {
        await paypalStore.loadPaypalUsageFeeSdk(); // Load PayPal SDK if not already loaded
    }
});
</script>

<style scoped>
/* Add any additional styling you might want */
</style>