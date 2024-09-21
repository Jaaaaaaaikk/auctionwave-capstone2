<template>
    <NuxtLayout name="biddernavbar">
        <!-- Content Section -->
        <section class="bg-gray-400 p-6 rounded-lg shadow-xl">
            <h2 class="text-2xl font-semibold mb-4 text-center">
                Available Auctions
            </h2>

            <!-- Search Bar Section -->
            <div class="flex-grow flex justify-center mb-6">
                <form class="relative flex items-center w-full max-w-lg">
                    <!-- Dropdown Button -->
                    <div class="relative flex items-center">
                        <button id="dropdown-button" type="button"
                            class="flex-shrink-0 inline-flex items-center py-2 px-4 text-sm shadow-black shadow-sm-light font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-blue-100 ml-1"
                            @click="toggleDropdown">
                            {{ selectedCategory || "Select Category" }}
                            <svg class="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                    </div>

                    <!-- Dropdown Menu -->
                    <div v-if="dropdownOpen"
                        class="absolute top-0 mt-12 w-44 bg-white divide-y divide-gray-100 rounded-2xl shadow-sm-light shadow-black dark:bg-gray-700">
                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                            <li v-for="category in categories" :key="category.id">
                                <button type="button"
                                    class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    @click="selectCategory(category.name)">
                                    {{ category.name }}
                                </button>
                            </li>
                        </ul>
                    </div>

                    <!-- Search Input -->
                    <div class="relative flex-grow ml-2">
                        <input type="text" id="search-dropdown" v-model="searchTerm" @input="handleSearch"
                            class="block w-full p-3 text-sm text-gray-900 shadow-inner shadow-black bg-gray-50 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                            placeholder="Search for auction's name..." />
                    </div>
                </form>
            </div>

            <!-- Auction Listings -->
            <div v-if="currentListings.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                <div v-for="listing in currentListings" :key="listing.listing_id"
                    class="bg-white p-4 rounded-lg shadow-sm-light shadow-black">
                    <h3 class="text-2xl font-semibold mb-2 truncate">
                        {{ listing.name }}
                    </h3>
                    <p class="text-gray-700 mb-2 truncate">
                        Description: {{ listing.description }}
                    </p>
                    <p class="text-gray-500 mb-2 truncate">
                        Location: {{ listing.location }}
                    </p>
                    <p class="text-gray-500 mb-4 truncate">
                        Bidding Type: {{ listing.bidding_type }}
                    </p>

                    <!-- Categories Section -->
                    <div class="flex flex-wrap mt-2">
                        <strong>Categories:</strong>
                        <span v-if="listing.categories.length === 0" class="text-gray-500">No categories</span>

                        <!-- Display each category as a styled tag -->
                        <span v-for="(category, index) in listing.categories" :key="index"
                            class="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">
                            {{ category }}
                        </span>
                    </div>


                    <div class="flex items-center space-x-2 mb-2 self-end">
                        <!-- Image Icon with Viewers Count -->
                        <img src="/public/images/viewers-count-image.png" alt="Viewers Count"
                            class="w-5 h-5 text-gray-600" />
                        <p class="text-gray-600">{{ viewersCount[listing.listing_id] || 0 }}</p>
                    </div>
                    <div class="flex justify-center">

                        <button @click="openModal(listing)"
                            class="bg-teal-500 border border-teal-500 rounded-full shadow-sm-light shadow-black hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 text-gray-900 px-4 py-2 font-semibold">
                            View Auction
                        </button>
                    </div>
                </div>
            </div>

            <!-- No Auctions Available Message -->
            <div v-else class="text-xl text-center text-red-500">
                <p>No auction's available.</p>
            </div>

            <!-- Pagination Controls -->
            <div class="flex justify-center items-center mt-4">
                <button @click="prevPage" :disabled="currentPage === 1" class="p-2">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-line cap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span class="mx-4 text-lg">{{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="p-2">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <ViewAuctionModal v-if="showModal" :auction="selectedAuction" @close="closeModal" />
        </section>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import ViewAuctionModal from "~/components/viewauctionmodal.vue";

// Hardcoded categories for demonstration
const categories = ref([
    { id: 1, name: "Art" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Collectibles" },
    { id: 4, name: "Furniture" },
    { id: 5, name: "Real Estate" },
]);

const listings = ref([]);
const pageSize = 5;
const currentPage = ref(1);
const selectedCategory = ref(null);
const searchTerm = ref("");
const dropdownOpen = ref(false);
const showModal = ref(false);
const selectedAuction = ref(null);
const viewersCount = ref({});

const fetchListings = async () => {
    try {
        const params = {
            category: selectedCategory.value,
            search: searchTerm.value
        };
        const response = await axios.get("/api/displayauctionlisting", { params });
        listings.value = response.data;

        fetchViewersCount();
    } catch (error) {
        console.error("Failed to fetch auction listings:", error);
    }
};

// Fetch viewers count for each listing
const fetchViewersCount = async () => {
    try {
        const promises = listings.value.map(async (listing) => {
            const response = await axios.get(`/api/get-viewer-count`, {
                params: { listing_id: listing.listing_id },
            });
            viewersCount.value[listing.listing_id] = response.data.viewer_count;
        });
        await Promise.all(promises);
    } catch (error) {
        console.error("Failed to fetch viewers count:", error);
    }
};

// Function to handle search input changes
const handleSearch = () => {
    selectedCategory.value = null; // Reset category selection
    dropdownOpen.value = false;
    currentPage.value = 1; // Reset to first page
    debouncedSearch(); // Call debounced search
};

function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Debounced search handler
const debouncedSearch = debounce(() => {
    currentPage.value = 1; // Reset to first page
    fetchListings(); // Fetch listings with the search term
}, 300); // Delay set to 300ms for debouncing

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

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const selectCategory = (category) => {
    selectedCategory.value = category;
    currentPage.value = 1; // Reset to first page
    fetchListings();
    toggleDropdown(); // Close dropdown after selection
};

const openModal = (auction) => {
    selectedAuction.value = auction;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedAuction.value = null;
};

onMounted(() => {
    fetchListings();
});
</script>


<style scoped>
/* Text overflow ellipsis */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
