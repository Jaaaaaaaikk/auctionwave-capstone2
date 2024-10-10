<template>
  <NuxtLayout name="auctioneernavbar">
    <section class="bg-gray-400 rounded-lg p-6 flex flex-col items-center justify-center w-full">
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

      <!-- Auctions Table if Auctions Exist -->
      <div v-else class="w-full">
        <h2 class="text-2xl font-semibold mb-4 text-center">
          Your Created Auctions
        </h2>
        <button @click="create_AuctionModal = true" class="flex bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"><svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
            </svg>Create Auction
        </button>
        <!-- Table Layout -->
        <table class="min-w-full border border-gray-300">
          <thead>
            <tr class="bg-gray-200 text-gray-600">
              <th class="py-2 px-4 border border-gray-300 text-center">Auction Name</th>
              <th class="py-2 px-4 border border-gray-300 text-center">Description</th>
              <th class="py-2 px-4 border border-gray-300 text-center">Location</th>
              <th class="py-2 px-4 border border-gray-300 text-center">Bidding Type</th>
              <th class="py-2 px-4 border border-gray-300 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State if No Auctions -->
            <tr v-if="paginatedAuctions.length === 0">
              <td colspan="6" class="text-center py-4 text-red-500 border border-gray-300">No auctions available.</td>
            </tr>
            <!-- Render Each Auction Row -->
            <tr v-for="auction in paginatedAuctions" :key="auction.listing_id" class="text-center">
              <td class="py-2 px-4 border border-gray-300">{{ auction.name }}</td>
              <td class="py-2 px-4 border border-gray-300">
                {{ truncateDescription(auction.description, 100) }}
              </td>
              <td class="py-2 px-4 border border-gray-300">{{ auction.location_name }}</td>
              <td class="py-2 px-4 border border-gray-300">{{ auction.bidding_type }}</td>
              <td class="py-2 px-4 border border-gray-300">
                <button @click="view_auction(auction)"
                  class="bg-teal-500 border border-teal-500 rounded-full text-white px-2 py-1">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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

      <CreateAuction_Modal v-if="create_AuctionModal" @close="handleModalClose" />

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

const view_auction = (auction) => {
  // Pass auction ID in query parameter
  router.push({ path: '/auctioneer/auctioneer-manage-auction', query: { id: auction.uuid } });
};

const fetchAuctions = async () => {
  try {
    const { data } = await axios.get("/api/auctions/auctioneer-created-auctions");
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

const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.substring(0, 30) + '...';
  }
  return description;
};

const handleModalClose = () => {
  create_AuctionModal.value = false;
  fetchAuctions(); // Re-fetch auctions after closing the modal
};

onMounted(() => {
  fetchAuctions();
});
</script>


<style scoped>
/* Your styles here */
</style>
