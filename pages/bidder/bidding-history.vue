<template>
    <NuxtLayout name="biddernavbar">
      <div class="container mx-auto p-6">
        <h1 class="text-3xl text-center font-semibold mb-6">History</h1>
  
        <!-- Conditional rendering based on the existence of bids -->
        <div v-if="bids.length === 0" class="flex items-center justify-center h-64">
          <p class="text-xl text-gray-500">You have not placed any bids yet.</p>
        </div>
  
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="bid in bids"
            :key="bid.id"
            class="relative bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <h2 class="text-xl font-semibold mb-4">{{ bid.auctionName }}</h2>
            <p class="text-gray-600 mb-2"><strong>Bid Amount:</strong> ${{ bid.amount }}</p>
            <p class="text-gray-600 mb-2"><strong>Date:</strong> {{ formatDate(bid.date) }}</p>
            <p class="text-gray-600 mb-2"><strong>Status:</strong> {{ bid.status || 'N/A' }}</p>
            <p class="text-gray-600 mb-2"><strong>Cashbond:</strong> {{ bid.cash_bond || 'Not yet implement' }}</p>
  
            <!-- Button for additional action -->
            <button
              class="absolute bottom-4 right-4 bg-teal-500 border border-teal-500 rounded-full shadow-sm-light shadow-black hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 text-gray-900 px-4 py-2 font-semibold"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const bids = ref([]);
  
  const fetchBids = async () => {
    try {
      const response = await axios.get('/api/bidder-bidding-history');
      console.log('Response Data:', response.data); // Debug: Check response data
      bids.value = response.data;
    } catch (error) {
      console.error('Error fetching bidding history:', error);
    }
  };
  
  onMounted(fetchBids);
  
  // Function to format date
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  