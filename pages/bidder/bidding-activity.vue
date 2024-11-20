<template>
    <NuxtLayout name="biddernavbar">
        <NuxtLayout name="biddersidebar"></NuxtLayout>
        <section class="bg-custom-blue2  antialiased dark:bg-gray-900 md:py-7">
            <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div class="mx-auto max-w-5xl">
                    <div class="gap-4 sm:flex sm:items-center sm:justify-between">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My bids</h2>

                        <div class="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                            <div>
                                <select id="order-type" v-model="selectedBidStatus" @change="resetBidStatus"
                                    class="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-custom-bluegreen focus:ring-custom-bluegreen dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-custom-bluegreen dark:focus:ring-custom-bluegreen">
                                    <option disabled>Lowest-type</option>
                                    <option value="">All</option>
                                    <option v-for="bidStatus in bidStatusMap" :key="bidStatus" :value="bidStatus">{{
                                        bidStatus }}</option>
                                </select>
                            </div>

                            <div>
                                <select id="order-type" v-model="selectedOfferStatus" @change="resetOfferStatus"
                                    class="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-custom-bluegreen focus:ring-custom-bluegreen dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-custom-bluegreen dark:focus:ring-custom-bluegreen">
                                    <option disabled>Offer-type</option>
                                    <option value="" selected>All</option>
                                    <option v-for="offerStatus in offerStatusMap" :key="offerStatus"
                                        :value="offerStatus">{{ offerStatus }}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flow-root sm:mt-8">
                        <div class="divide-y divide-gray-300 dark:divide-gray-700">
                            <!-- Message for No Search Results -->
                            <div v-if="filteredAuctions.length === 0"
                                class="text-center mt-6 text-gray-500 dark:text-gray-300">
                                {{ noResultsMessage }}
                            </div>

                            <!-- Add Loading Spinner here -->
                            <div v-if="isLoading" class="flex justify-center items-center text center h-80 b">

                                <!--Backdrop of Loading Spinner-->
                                <div class="absolute inset-0 bg-gray-900 bg-opacity-50"></div>

                                <div class="flex items-center space-x-4">
                                    <svg class="animate-spin" width="80" height="80" viewBox="0 0 20 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2592_7101)">
                                            <path opacity="0.33" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M12.6066 0.345176L12.1759 1.95287C11.9417 1.88993 11.7052 1.83929 11.4632 1.79612C11.2212 1.75296 10.9818 1.71873 10.7403 1.6968L10.892 0.0393588C11.1794 0.065229 11.4687 0.104137 11.7559 0.15535C12.043 0.206563 12.3279 0.270083 12.6066 0.345176Z"
                                                fill="#3758F9" />
                                            <path opacity="0.38" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M15.0182 1.34671L14.1811 2.78881C13.7674 2.54571 13.3299 2.34072 12.8687 2.17381L13.44 0.60813C13.9926 0.808271 14.5193 1.05881 15.0182 1.34671Z"
                                                fill="#3758F9" />
                                            <path opacity="0.42" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M17.0867 2.94304L15.904 4.1161C15.5633 3.77177 15.1915 3.45996 14.7933 3.17731L15.7554 1.81679C16.2325 2.15582 16.6776 2.53148 17.0867 2.94304Z"
                                                fill="#3758F9" />
                                            <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M18.6682 5.01543L17.225 5.84575C16.9824 5.4258 16.7068 5.02535 16.3966 4.65259L17.6747 3.58543C18.0477 4.03288 18.3814 4.51141 18.6682 5.01543Z"
                                                fill="#3758F9" />
                                            <path opacity="0.55" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M19.6684 7.42856L18.0557 7.85621C17.9323 7.38556 17.7642 6.92809 17.5622 6.49423L19.0718 5.79002C19.3166 6.31617 19.5152 6.86372 19.6684 7.42856Z"
                                                fill="#3758F9" />
                                            <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M20.002 10.019L18.3354 10.0138C18.3382 9.52335 18.293 9.04126 18.2128 8.56561L19.8546 8.28284C19.953 8.84638 20.0053 9.43131 20.002 10.019Z"
                                                fill="#3758F9" />
                                            <path opacity="0.65" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M19.8447 11.7559C19.7934 12.043 19.7299 12.328 19.6548 12.6066L18.0438 12.1711C18.106 11.941 18.1607 11.7053 18.2039 11.4633C18.247 11.2212 18.2779 10.977 18.2991 10.7396L19.9606 10.892C19.9355 11.1753 19.8966 11.4647 19.8447 11.7559Z"
                                                fill="#3758F9" />
                                            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M19.3926 13.436C19.1917 13.9927 18.9412 14.5194 18.6533 15.0182L17.2112 14.1812C17.4502 13.7667 17.66 13.3259 17.8269 12.8647L19.3926 13.436Z"
                                                fill="#3758F9" />
                                            <path opacity="0.75" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M18.184 15.7514C17.8442 16.2325 17.4685 16.6776 17.0577 17.0826L15.8839 15.904C16.2241 15.5626 16.54 15.1915 16.8186 14.7926L18.184 15.7514Z"
                                                fill="#3758F9" />
                                            <path opacity="0.8" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M16.4112 17.6699C15.9678 18.0437 15.4893 18.3774 14.9846 18.6682L14.1543 17.225C14.5742 16.9825 14.9713 16.702 15.344 16.3918L16.4112 17.6699Z"
                                                fill="#3758F9" />
                                            <path opacity="0.95" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M14.21 19.0718C13.6838 19.3166 13.1363 19.5152 12.5721 19.6643L12.1397 18.055C12.6111 17.9275 13.0678 17.7635 13.5065 17.5581L14.21 19.0718Z"
                                                fill="#3758F9" />
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M11.7179 19.8505C11.1495 19.9523 10.5694 20.0012 9.98093 20.0021L9.98616 18.3354C10.4773 18.3341 10.9587 18.293 11.4303 18.2121L11.7179 19.8505Z"
                                                fill="#3758F9" />
                                            <path opacity="0.05" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M9.10799 19.9606C8.82057 19.9347 8.53124 19.8958 8.24411 19.8446C7.95697 19.7934 7.67203 19.7299 7.39339 19.6548L7.82477 18.043C8.05902 18.1059 8.29474 18.1607 8.53675 18.2039C8.77877 18.247 9.01887 18.2771 9.26044 18.2991L9.10799 19.9606Z"
                                                fill="#3758F9" />
                                            <path opacity="0.07" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M7.1312 17.8262L6.55991 19.3919C6.00803 19.1876 5.48061 18.9412 4.98248 18.6492L5.8188 17.2112C6.23328 17.4502 6.67074 17.6552 7.1312 17.8262Z"
                                                fill="#3758F9" />
                                            <path opacity="0.09" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.20739 16.8186L4.24522 18.1791C3.76744 17.8442 3.32232 17.4685 2.91323 17.057L4.09664 15.8798C4.43731 16.2241 4.80917 16.5359 5.20739 16.8186Z"
                                                fill="#3758F9" />
                                            <path opacity="0.11" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3.60406 15.3433L2.32599 16.4105C1.95293 15.963 1.61927 15.4845 1.33248 14.9805L2.7757 14.1501C3.01823 14.5701 3.29386 14.9705 3.60406 15.3433Z"
                                                fill="#3758F9" />
                                            <path opacity="0.13" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M2.43772 13.5058L0.928848 14.2059C0.683367 13.6838 0.484757 13.1363 0.332289 12.5673L1.94493 12.1397C2.06838 12.6103 2.2365 13.0678 2.43772 13.5058Z"
                                                fill="#3758F9" />
                                            <path opacity="0.15" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M1.78797 11.4303L0.145415 11.7171C0.0477348 11.1495 -0.00526797 10.5687 -0.0012875 9.97685L1.66536 9.98208C1.66253 10.4725 1.70701 10.9587 1.78797 11.4303Z"
                                                fill="#3758F9" />
                                            <path opacity="0.17" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M1.79609 8.53676C1.75293 8.77878 1.7228 9.01888 1.70161 9.25635L0.0393276 9.108C0.0651979 8.82058 0.104105 8.53125 0.155319 8.24411C0.206532 7.95698 0.270783 7.66794 0.345145 7.39339L1.95694 7.82478C1.89473 8.05493 1.83926 8.29475 1.79609 8.53676Z"
                                                fill="#3758F9" />
                                            <path opacity="0.19" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M2.78952 5.81474C2.5498 6.23332 2.3407 6.67005 2.17379 7.13124L0.608112 6.55995C0.808254 6.00734 1.05953 5.47655 1.3467 4.98179L2.78952 5.81474Z"
                                                fill="#3758F9" />
                                            <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M4.11613 4.09597C3.77663 4.43326 3.46072 4.80439 3.18218 5.20335L1.81682 4.24454C2.15585 3.7675 2.53151 3.32237 2.94307 2.91328L4.11613 4.09597Z"
                                                fill="#3758F9" />
                                            <path opacity="0.25" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M5.84654 2.77086C5.4266 3.01339 5.02952 3.29386 4.65676 3.60406L3.58959 2.32599C4.03295 1.9522 4.51147 1.61853 5.01622 1.32764L5.84654 2.77086Z"
                                                fill="#3758F9" />
                                            <path opacity="0.28" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M7.86098 1.94089C7.3896 2.06844 6.93287 2.23246 6.49417 2.43778L5.78996 0.928178C6.31611 0.683428 6.86366 0.484819 7.4285 0.331619L7.86098 1.94089Z"
                                                fill="#3758F9" />
                                            <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M10.0138 1.66458C9.52332 1.66175 9.04195 1.70287 8.56968 1.78793L8.2828 0.145371C8.85044 0.0476906 9.43127 -0.00531221 10.019 -0.00206337L10.0138 1.66458Z"
                                                fill="#3758F9" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2592_7101">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <span class="text-lg font-medium text-gray-700">PLEASE WAIT...</span>
                                </div>
                            </div>
                            <div v-else v-for="auction in filteredAuctions" :key="auction.listing_id"
                                class="flex flex-wrap items-center gap-y-4 py-6">
                                <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Auction Name
                                    </dt>
                                    <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                        <span class="hover:underline cursor-pointer">{{ auction.auction_name }}</span>
                                    </dd>
                                </dl>

                                <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Date</dt>
                                    <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{{
                                        formatDate(auction.latest_time) }}
                                    </dd>
                                </dl>

                                <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                    <dd :class="getStatusClass(auction.status)"
                                        class="me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium">
                                        <svg v-if="auction.status === 'Provide More'" class="me-1 h-3 w-3"
                                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                        <svg v-if="auction.status === 'Offer Accepted' || auction.status === 'Usage Fee Payment Completed'"
                                            class="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                        </svg>
                                        <svg v-if="auction.status === 'Outbid' || auction.status === 'Offer Discarded' || auction.status === 'Payment Response Failed'"
                                            class="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                        </svg>
                                        {{ auction.status }}
                                    </dd>
                                </dl>

                                <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                    <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Bidding Type
                                    </dt>
                                    <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{{
                                        auction.bidding_type }}</dd>
                                </dl>

                                <div
                                    class="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                                    <button @click="handleAction(auction)" :disabled="isButtonDisabled(auction.status)"
                                        class="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-custom-bluegreen text-white px-3 py-2 text-sm font-medium hover:bg-green-500 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto">
                                        {{ getButtonText(auction.status) }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav class="mt-6 flex items-center justify-center sm:mt-8" aria-label="Page navigation example">
                        <div v-if="totalPages > 1" class="my-20 mx-auto flex justify-center">
                            <div class="inline-flex -space-x-px text-sm">
                                <button @click="prevPage" :disabled="currentPage === 1"
                                    class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-gray-700">
                                    Previous
                                </button>

                                <span v-for="page in totalPages" :key="page" :class="{
                                    'flex items-center justify-center px-3 h-8 text-custom-bluegreen border border-gray-300 bg-green-50 hover:bg-blue-100 hover:text-blue-700': currentPage === page,
                                    'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700': currentPage !== page
                                }" @click="goToPage(page)">
                                    {{ page }}
                                </span>

                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-gray-700">
                                    Next
                                </button>
                            </div>

                        </div>

                    </nav>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const currentPage = ref(1);
const numberOfAuctions = ref(10);
const totalPages = ref(0);
const selectedBidStatus = ref("");
const selectedOfferStatus = ref("");
const auctions = ref([]);
const isFiltered = ref(false);
const isLoading = ref(true);

const noResultsMessage = computed(() => {
    if (selectedBidStatus.value) {
        return "No auctions found for the selected auction Lowest-type status.";
    } else if (selectedOfferStatus.value) {
        return "No auctions found for the selected auction Offer-type status.";
    } else {
        return "No auctions found for your search criteria.";
    }
});

// Define the bid status and offer status arrays as reactive refs
const bidStatusMap = ref([
    "Active",
    "Outbid",
    "Usage Fee Payment Completed",
    "Usage Fee Payment Pending",
    "Payment Response Failed"
]);

const offerStatusMap = ref([
    "Offer Pending",
    "Offer Accepted",
    "Offer Discarded",
    "Provide More"
]);

const resetBidStatus = () => {
    selectedOfferStatus.value = "";
    currentPage.value = 1;
    isFiltered.value = true;
    fetchActivityAuctions();
};

const resetOfferStatus = () => {
    selectedBidStatus.value = "";
    currentPage.value = 1;
    isFiltered.value = true;
    fetchActivityAuctions();
};

// Fetch auctions with pagination parameters
const fetchActivityAuctions = async () => {
    isLoading.value = true;
    try {
        const { data } = await axios.get("/api/auctions/display-bidding-activities", {
            params: { page: currentPage.value, numberOfAuctions: numberOfAuctions.value, selectedBidStatus: selectedBidStatus.value, selectedOfferStatus: selectedOfferStatus.value, }
        });
        console.log("Fetched data:", data);
        auctions.value = data.auctions;
        totalPages.value = data.totalPages;

    } catch (error) {
        console.error("Failed to fetch auctions:", error);
    } finally {
        isLoading.value = false;
    }
};

// Computed filtered results
const filteredAuctions = computed(() => {
    console.log("Filtered Auctions:", auctions.value);
    if (!isFiltered.value) return auctions.value;
    return auctions.value.filter((auction) => {
        const matchesAuctionStatus = !selectedBidStatus.value || auction.status === selectedBidStatus.value;
        const matchesPaymentStatus = !selectedOfferStatus.value || auction.status === selectedOfferStatus.value;
        return matchesAuctionStatus && matchesPaymentStatus;
    });
});

watch([filteredAuctions, currentPage], () => {
    // If currentPage exceeds totalPages after filtering, adjust it to totalPages
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;  // Ensure currentPage stays within totalPages
    }
});

const getStatusClass = (status) => {
    switch (status) {
        case 'Provide More':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Usage Fee Payment Pending':
        case 'Offer Pending':
        case 'Active':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Offer Accepted':
        case 'Usage Fee Payment Completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Payment Response Failed':
        case 'Outbid':
        case 'Offer Discarded':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const getButtonText = (status) => {
    switch (status) {
        case 'Outbid':
        case 'Provide More':
        case 'Offer Pending':
        case 'Active':
            return 'View Details';
        case 'Usage Fee Payment Pending':
        case 'Offer Accepted':
            return 'View Auction Summary';
        case 'Usage Fee Payment Completed':
            return 'Visit Transaction History';
        default:
            return '';
    }
};

const isButtonDisabled = (status) => {
    const disabledStatuses = ['Payment Response Failed', 'Offer Discarded'];
    return disabledStatuses.includes(status);
};

const handleAction = (auction) => {
    if (auction.status === 'Offer Discarded') {
        toast.error("You cannot participate in this auction because your offer was discarded. Please contact the auctioneer for more details.");
    } else if (auction.status === 'Usage Fee Payment Completed') {
        toast.success("Please visit your transaction history to complete the payment.");
    } else if (['Outbid', 'Provide More', 'Offer Pending', 'Active'].includes(auction.status)) {
        // For these statuses, navigate to auction details or perform another action
        // Router redirection or other actions can be handled here
    }
};

// Pagination controls
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
        fetchAuctions();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
        fetchAuctions();
    }
};

const goToPage = (page) => {
    if (page !== currentPage.value) {
        currentPage.value = page;
        fetchAuctions();
    }
};

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
};

onMounted(() => {
    fetchActivityAuctions();
});
</script>

<style scoped>
button:disabled {
    opacity: 0;
    cursor: not-allowed;
    pointer-events: none;
    /* Maintain consistent size */
    height: 40px;
    /* Or any other value that matches your button's height */
    width: 100%;
    /* Ensure it occupies the full available width */
}
</style>