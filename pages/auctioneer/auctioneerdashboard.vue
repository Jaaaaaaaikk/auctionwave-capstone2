<template>
  <NuxtLayout name="auctioneernavbar">
    <section class="bg-gray-400 rounded-lg p-6 flex flex-col items-center justify-center">
      <!-- Default Message if No Auctions Exist -->
      <div v-if="auctions.length === 0" class="flex flex-row items-center space-x-6">
        <div class="flex-shrink-0">
          <img src="/public/images/auction-image.png" alt="Create Auction" class="w-64 h-auto" />
        </div>
        <div class="text-center md:text-left">
          <h2 class="text-2xl font-semibold mb-4">
            You don't have created auctions yet.
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Click the button below to create one.
          </p>
          <button @click="create_AuctionModal = true"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Create Auction
          </button>
        </div>
      </div>

      <!-- Auctions List if Auctions Exist -->
      <div v-else class="w-full">
        <h2 class="text-2xl font-semibold mb-4 text-center">
          Your Created Auctions
        </h2>
        <!-- Grid Layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="auction in paginatedAuctions" :key="auction.listing_id"
            class="p-6 bg-white rounded shadow-sm-light shadow-black flex flex-col">
            <h3 class="text-xl font-bold mb-2">{{ auction.name }}</h3>
            <p class="text-gray-600">Location: {{ auction.location }}</p>
            <p class="text-gray-700 mt-2">
              Description: {{ auction.description }}
            </p>
            <p class="text-sm text-gray-500 mt-4">
              Bidding Type: {{ auction.bidding_type }}
            </p>
            <!-- View Auction Button -->
            <button @click="view_auction"
              class="bg-teal-500 border border-teal-500 rounded-full shadow-sm-light shadow-black hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 text-gray-900 px-4 py-2 font-semibold mt-auto self-end">
              View Auction
            </button>
          </div>
          <div class="flex mt-48">
            <button @click="create_AuctionModal = true"
              class="bg-teal-500 text-black text-3xl py-2 px-4 hover:bg-teal-600 rounded-xl shadow-md shadow-black">
              +
            </button>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center items-center mt-4">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="p-2">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="mx-4 text-lg">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="p-2">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <CreateAuction_Modal v-if="create_AuctionModal" @close="create_AuctionModal = false" />
    </section>
  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import CreateAuction_Modal from "~/components/createauctionmodal.vue";
import axios from "axios";
import { useRouter } from "vue-router";

const create_AuctionModal = ref(false);
const auctions = ref([]);
const currentPage = ref(1);
const pageSize = 6;
const router = useRouter();

const view_auction = () => {
  router.push('/auctioneer/auctioneer-manage-auction')

};

const fetchAuctions = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.get("/api/auctioneer-created-auctions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    auctions.value = data.auctions;
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
  }
};

const paginatedAuctions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return auctions.value.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  return Math.ceil(auctions.value.length / pageSize);
});

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

onMounted(() => {
  fetchAuctions();
});
</script>

<style scoped>
/* Your styles here */
</style>
