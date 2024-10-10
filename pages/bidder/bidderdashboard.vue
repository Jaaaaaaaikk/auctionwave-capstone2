<template>
    <NuxtLayout name="biddernavbar">
        <div class="flex w-full">
            <NuxtLayout name="sidebar"></NuxtLayout>
            <!-- Content Section -->
            <div class="flex-grow bg-custom-blue2 mx-auto justify-center" @focus="autoCloseDropDown">
                <h2 class="text-2xl font-semibold mb-4 justify-center ml-96">
                </h2>

                <div v-if="currentListings.length === 0" class="text-center py-4 text-red-500">No auctions available.
                </div>
                <div class="flex justify-center mx-95">
                    <!-- Flex container to hold the cards -->

                    <div class="flex flex-wrap mx-auto justify-center"> <!-- Added justify-center here -->
                        <div v-for="listing in currentListings" :key="listing.listing_id" @click="openModal(listing)"
                            class="cursor-pointer bg-white border relative border-gray-200 rounded-lg shadow-md m-2 transition-transform hover:scale-105 w-64">

                            <!-- Auction Image -->
                            <img v-if="listing.image_urls.length > 0" :src="listing.image_urls[0]" alt="Auction Image"
                                class="object-cover w-full h-32 rounded-t-lg" loading="lazy" />
                            <img v-else src="public/images/no-image.jpg" alt="No Image Available"
                                class="object-cover w-full h-32 rounded-t-lg" loading="lazy" />

                            <div class="p-2 pb-12">
                                <!-- Auction Name -->
                                <h5 class="mb-1 text-base font-bold tracking-tight text-gray-900 dark:text-white">
                                    {{ listing.name }}
                                </h5>



                                <!-- Categories -->
                                <div class="mt-1 flex flex-wrap">
                                    <span v-if="listing.categories.length === 0" class="text-sm text-gray-500">No
                                        categories</span>
                                    <span v-for="(category, index) in listing.categories" :key="index"
                                        class="bg-gray-200 text-gray-700 text-xs font-semibold mr-1 mb-1 px-1 py-0.5 rounded">
                                        {{ category }}
                                    </span>
                                </div>

                                <!-- Starting Bid -->
                                <p class="text-gray-500 dark:text-white mt-1 text-xs"
                                    v-if="listing.bidding_type === 'Lowest-type'">
                                    Starting Bid: <span class="font-bold text-black">${{ listing.starting_bid }}</span>
                                </p>
                                <p class="text-gray-500 dark:text-white mt-1 text-xs">
                                    Bidding Type: <span class="font-bold text-black">{{ listing.bidding_type }}</span>
                                </p>
                                <p class="text-gray-500 dark:text-white mt-1 text-xs">
                                    Rarity: <span class="font-bold text-black">{{ listing.rarity }}</span>
                                </p>

                            </div>
                        </div>
                    </div>
                </div>


                <!-- Pagination Controls -->
                <div class="my-20 mx-auto flex justify-center">
                    <div class="inline-flex -space-x-px text-sm">
                        <div>
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer">
                                Previous
                            </button>
                        </div>

                        <!-- <span class="mx-4 text-lg">{{ currentPage }} / {{ totalPages }}</span> -->

                        <div v-for="page in totalPages" :key="page">
                            <span :class="{
                                'flex items-center justify-center px-3 h-8 text-custom-bluegreen border border-gray-300 bg-green-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white': currentPage === page,
                                'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white': currentPage !== page
                            }">
                                {{ page }}
                            </span>
                        </div>

                        <div>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer">
                                Next
                            </button>
                        </div>
                    </div>

                </div>


                <!-- Trending Auctions Sidebar (Right) -->
                <div class="w-1/6 p-4 rounded-lg fixed right-0 top-0 mt-17 min-h-screen overflow-y-auto">
                    <h3 class="text-xl text-gray-500 font-semibold mb-4">Trending Auctions</h3>
                    <ul>
                        <li v-for="(trending, index) in trendingAuctions" :key="trending.listing_id" class="mb-4">
                            <!-- Use listing_id for key -->
                            <div class="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
                                <div
                                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-solid border-custom-bluegreen bg-transparent text-purple-blue-500">
                                    <span class="text-base font-bold leading-7 text-custom-bluegreen2">{{ index + 1
                                        }}</span>
                                </div>

                                <div class="flex-1">
                                    <h4 class="font-semibold text-base text-gray-900">{{ trending.name }}</h4>
                                    <div class="mt-1 flex flex-wrap">
                                        <span v-if="trending.categories.length === 0" class="text-sm text-gray-500">No
                                            categories</span>
                                        <span v-for="(category, index) in trending.categories" :key="index"
                                            class="bg-gray-200 text-gray-700 text-xs font-semibold mr-1 mb-1 px-1 py-0.5 rounded">
                                            {{ category }}
                                        </span>
                                    </div>

                                    <p class="text-sm text-gray-600">
                                        <span class="font-semibold">Bidding Type:</span> {{ trending.bidding_type }}
                                    </p>
                                    <p class="text-sm text-gray-600">
                                        <span class="font-semibold">Location:</span> {{ trending.location }}
                                        <!-- Ensure `location` is provided in the API response -->
                                    </p>
                                    <button @click="openModal(trending)"
                                        class="bg-custom-bluegreen border-custom-bluegreen rounded-md hover:bg-green-500 text-white px-2 py-1 text-xs mt-2">
                                        View Auction
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <ViewAuctionModal v-if="showModal" :auction="selectedAuction" @close="closeModal" />
            </div>
        </div>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import ViewAuctionModal from "~/components/viewauctionmodal.vue";
import { useAuctionFilterStore } from '@/stores/fetch-auction-bidder-dashboard';

const filterStore = useAuctionFilterStore();

const pageSize = 12;
const currentPage = ref(1);
const selectedCategory = ref(filterStore.selectedCategories);
const selectedBiddingType = ref(filterStore.selectedBiddingType);
const selectedRarity = ref(filterStore.selectedRarity);
const searchAuction = ref(filterStore.searchTerm);
const dropdownOpen = ref(false);
const showModal = ref(false);
const selectedAuction = ref(null);
const listings = ref([]);
const trendingAuctions = ref([]);

// Function to fetch trending auctions
const fetchTrendingAuctions = async () => {
    try {
        const response = await axios.get("/api/auctions/trending-auctions");
        trendingAuctions.value = response.data.allData.slice(0, 3); // Limit to top 3 trend auctions
    } catch (error) {
        console.error("Failed to fetch trending auctions:", error);
    }
};


// Function to fetch auction listings
const fetchListings = async (params) => {
    try {
        const params = {
        category: selectedCategory.value,
        biddingType: selectedBiddingType.value,
        rarity: selectedRarity.value,
        search: searchAuction.value,
    };
        const response = await axios.get(`/api/auctions/display-auction-bidder-dashboard`, { params });
        listings.value = response.data;
    } catch (error) {
        console.error("Failed to fetch auction listings:", error);
    }
};

// Watch for changes in the filter store and fetch listings accordingly



// Watchers for filter selections
watch(
    () => filterStore.selectedCategories,
    (newValue) => {
        selectedCategory.value = newValue;
        fetchListings(); 
    }
);

watch(
    () => filterStore.selectedBiddingType,
    (newValue) => {
        selectedBiddingType.value = newValue;
        fetchListings(); 
    }
);

watch(
    () => filterStore.selectedRarity,
    (newValue) => {
        selectedRarity.value = newValue;
        fetchListings(); 
    }
);

watch(
    () => filterStore.searchTerm,
    (newValue) => {
        searchAuction.value = newValue;
        fetchListings(); 
    }
);


const currentListings = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return listings.value.slice(start, start + pageSize);
});

const totalListings = computed(() => listings.value.length);
const totalPages = computed(() => Math.ceil(totalListings.value / pageSize));

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};


const autoCloseDropDown = () => {
    dropdownOpen.value = false;
    selectedCategory.value = null;
    fetchListings();
};

const openModal = (auction) => {
    selectedAuction.value = auction;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedAuction.value = null;
};

onMounted(async () => {
    await Promise.all([fetchListings(), fetchTrendingAuctions()]);
});
</script>

<style scoped>
/* Add your custom styles here */
</style>