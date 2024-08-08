<template>
    <NuxtLayout name="biddernavbar">
        <!-- Content Section -->
        <section class="bg-gray-200 p-6 rounded-lg">

            <h2 class="text-2xl font-semibold mb-4 text-center">Available Auctions</h2>

            <!-- Search Bar Section -->
            <div class="flex-grow flex justify-center mb-6">
                <form class="relative flex items-center w-full max-w-lg">
                    <!-- Dropdown Button -->
                    <div class="relative flex items-center">
                        <button id="dropdown-button" type="button"
                            class="flex-shrink-0 inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 ml-1"
                            @click="toggleDropdown">
                            {{ selectedCategory || 'Select Category' }}
                            <svg class="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                    </div>

                    <!-- Dropdown Menu -->
                    <div v-if="dropdownOpen"
                        class="absolute top-0 mt-12 w-44 bg-white divide-y divide-gray-100 rounded-2xl shadow dark:bg-gray-700">
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
                        <input type="text" id="search-dropdown"
                            class="block w-full p-3 text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                            placeholder="Search name of auction, bidding-type..." />
                        <button type="submit"
                            class="absolute right-3 top-1 pr-1 br-b-2 bottom-2 px-3 text-sm font-medium text-white bg-gray-50 rounded-xl">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 20 20">
                                <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Auction Listings -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                <div v-for="listing in currentListings" :key="listing.listing_id"
                    class="bg-white p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold mb-2">{{ listing.name }}</h3>
                    <p class="text-gray-700 mb-2">Description: {{ listing.description }}</p>
                    <p class="text-gray-500 mb-2">Location: {{ listing.location }}</p>
                    <p class="text-gray-500 mb-4">Bidding Type: {{ listing.bidding_type }}</p>
                    <div class="flex justify-center">
                        <NuxtLink :to="`/auction/${listing.listing_id}`"
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            View Auction
                        </NuxtLink>
                    </div>
                </div>
            </div>

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
        </section>
    </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Hardcoded categories for demonstration
const categories = ref([
    { id: 1, name: 'Art' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Collectibles' },
    { id: 4, name: 'Furniture' },
    { id: 5, name: 'Real Estate' }
]);

const listings = ref([]);
const pageSize = 5;
const currentPage = ref(1);
const selectedCategory = ref(null);
const dropdownOpen = ref(false);

const fetchListings = async () => {
    try {
        const params = { category: selectedCategory.value };
        const response = await axios.get('/api/displayauctionlisting', { params });
        listings.value = response.data;
    } catch (error) {
        console.error('Failed to fetch auction listings:', error);
    }
};

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

onMounted(fetchListings);
</script>

<style scoped>
/* Add custom styles for icons here if needed */
.material-icons {
    font-size: 24px;
    /* Adjust size if needed */
}
</style>
