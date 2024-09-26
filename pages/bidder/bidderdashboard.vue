<template>
    <NuxtLayout name="biddernavbar">
        <!-- Content Section -->
        <div class="bg-gray-400 p-6 rounded-lg shadow-xl" @focus = "autoCloseDropDown">
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
                        <input type="search" id="search-dropdown" v-model="searchTerm" @focus = "autoCloseDropDown"
                            class="block w-full p-3 text-sm text-gray-900 shadow-inner shadow-black bg-gray-50 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 cursor-pointer"
                            placeholder="Search for auction's name..." />
                    </div>
                </form>
            </div>

            <!-- Auction Listings Table -->
            <table class="min-w-full border border-gray-300">
                <thead>
                    <tr class="bg-gray-200 text-gray-600">
                        <th class="py-2 px-4 border border-gray-300 text-center">Auction Name</th>
                        <th class="py-2 px-4 border border-gray-300 text-center">Description</th>
                        <th class="py-2 px-4 border border-gray-300 text-center">Location</th>
                        <th class="py-2 px-4 border border-gray-300 text-center">Bidding Type</th>
                        <th class="py-2 px-4 border border-gray-300 text-center">Categories</th>
                        <th class="py-2 px-4 border border-gray-300 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="currentListings.length === 0">
                        <td colspan="6" class="text-center py-4 text-red-500 border border-gray-300">No auctions
                            available.</td>
                    </tr>
                    <tr v-for="listing in currentListings" :key="listing.listing_id" class="text-center">
                        <td class="py-2 px-4 border border-gray-300">{{ listing.name }}</td>
                        <td class="py-2 px-4 border border-gray-300">
                            {{ truncateDescription(listing.description, 100) }} <!-- Adjust character limit here -->
                        </td>
                        <td class="py-2 px-4 border border-gray-300">{{ listing.location }}</td>
                        <td class="py-2 px-4 border border-gray-300">{{ listing.bidding_type }}</td>
                        <td class="py-2 px-4 border border-gray-300">
                            <span v-if="listing.categories.length === 0">No categories</span>
                            <span v-for="(category, index) in listing.categories" :key="index"
                                class="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">
                                {{ category }}
                            </span>
                        </td>
                        <td class="py-2 px-4 border border-gray-300">
                            <button @click="openModal(listing)"
                                class="bg-teal-500 border border-teal-500 rounded-full text-white px-2 py-1">
                                View
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="flex justify-center items-center mt-4">
                <button @click="prevPage" :disabled="currentPage === 1" class="p-2">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
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
        </div>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import ViewAuctionModal from "~/components/viewauctionmodal.vue";

const categories = ref([
    { id: 1, name: "Art" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Collectibles" },
    { id: 4, name: "Furniture" },
    { id: 5, name: "Real Estate" },
]);

const pageSize = 5;
const currentPage = ref(1);
const selectedCategory = ref(null);
const searchTerm = ref("");
const dropdownOpen = ref(false);
const showModal = ref(false);
const selectedAuction = ref(null);
const listings = ref([]);

const fetchListings = async () => {
    try {
        const params = {
            category: selectedCategory.value,
            search: searchTerm.value
        };
        const response = await axios.get("/api/displayauctionlisting", { params });
        listings.value = response.data;

    } catch (error) {
        console.error("Failed to fetch auction listings:", error);
    }
};

watch(searchTerm, (newValue) => {
    if (newValue === "") {
        selectedCategory.value = null; // Reset category selection
    }
    currentPage.value = 1; // Reset to first page
    fetchListings(); // Fetch listings with the search term
});

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

const autoCloseDropDown = () => {
    dropdownOpen.value = false;
    selectedCategory.value = null;
    fetchListings();
};

const selectCategory = (category) => {
    selectedCategory.value = category;
    currentPage.value = 1; // Reset to first page
    fetchListings();
    toggleDropdown(); // Close dropdown after selection
};

const openModal = (auction) => {
    if (auction) {
        selectedAuction.value = auction;
        showModal.value = true;
    } else {
        console.warn("No auction data provided");
    }
};

const closeModal = () => {
    showModal.value = false;
    selectedAuction.value = null;
};

const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
        return description.slice(0, 30) + '...';
    }
    return description;
};

onMounted(() => {
    fetchListings();
});
</script>

<style scoped>
/* Add your custom styles here */
</style>
