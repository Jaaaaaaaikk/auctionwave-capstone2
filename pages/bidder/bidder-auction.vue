<template>
  <NuxtLayout name="biddernavbar">
    <section class="bg-gray-400 p-6 rounded-lg mx-96">
      <NuxtLink to="/bidder/bidderdashboard">
        <button type="button" class="text-gray-600 hover:text-gray-800">
        <svg class="w-full h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
      </NuxtLink>

      <h2 class="text-2xl font-semibold mb-4 text-center">Auction Details</h2>

      <!-- Auction Information -->
      <div v-if="auction" class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold mb-4">{{ auction.name }}</h3>
        <p class="text-gray-700 mb-2">
          <strong>Description:</strong> {{ auction.description }}
        </p>
        <p class="text-gray-500 mb-2">
          <strong>Location:</strong> {{ auction.location }}
        </p>
        <p class="text-gray-500 mb-2">
          <strong>Starting Bid:</strong> {{ auction.starting_bid }}
        </p>
        <p class="text-gray-500 mb-2">
          <strong>Bidding Type:</strong> {{ auction.bidding_type }}
        </p>
        <p class="text-gray-500 mb-2">
          <strong>Rarity:</strong> {{ auction.rarity }}
        </p>

        <div class="flex flex-col items-end mt-6">
          <input v-model.number="bidAmount" class="rounded-xl" type="number" step="1" min="0"
            :max="auction?.starting_bid - 1" placeholder="Amount bid" required @input="validateBidAmount" />
          <p v-if="bidAmount >= auction?.starting_bid" class="text-red-500 p-12">
            Bid amount must be less than the starting bid.
          </p>
          <p v-if="isNaN(bidAmount) || bidAmount < 0" class="text-red-500">
            Invalid bid amount. Please enter a positive number.
          </p>
        </div>


        <!-- <p class="text-gray-500 mb-2"><strong>Categories:</strong>
                    {{ auction.categories.length > 0 ? auction.categories.join(', ') : 'No categories' }}
                </p> -->

        <!-- Join Auction Button -->
        <div class="flex justify-end mt-6">
          <button @click="confirmBid" class="bg-teal-500 border font-semibold border-teal-500 shadow-sm-light shadow-black hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 text-gray-900 px-4 py-2 rounded-full">
            Enter Bid
          </button>
        </div>
      </div>
      <!-- Error Handling -->
      <div v-else class="text-xl text-center text-red-500">
        <p>No auction details available.</p>
      </div>
    </section>
  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const auction = ref(null);
const bidAmount = ref(0); // Add this to track the bid amount
const errorMessage = ref("");

const fetchAuction = async () => {
  try {
    const auctionId = route.query.id; // Get auction ID from query params
    console.log("Auction ID:", auctionId);

    if (!auctionId) {
      throw new Error("Auction ID is missing");
    }

    const response = await axios.get(`/api/auction/${auctionId}`);
    console.log("Response Data:", response.data); // Log the response data

    if (response.data) {
      auction.value = response.data;
    } else {
      throw new Error("No auction data returned");
    }
  } catch (err) {
    console.error("Failed to fetch auction details:", err);
    // Handle errors here
  }
};

const confirmBid = () => {
  const amount = parseFloat(bidAmount.value);
  if (isNaN(amount) || amount <= 0 || amount >= auction.value.starting_bid) {
    alert("Please enter a valid bid amount that is less than the starting bid.");
    return;
  }

  const confirmed = confirm(`Are you sure you want to place a bid of ${amount}?`);
  if (confirmed) {
    placeBid(amount);
  }
};

const placeBid = async (amount) => {
  try {
    const auctionId = route.query.id;
    const token = localStorage.getItem("accessToken");

    await axios.post('/api/place-bid', { auctionId, bidAmount: amount }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Bid placed successfully!");
  } catch (err) {
    console.error("Failed to place bid:", err);
    alert("Failed to place bid.");
  }
};

onMounted(fetchAuction);
</script>

<style scoped>
/* Add any specific styles for the auction page here */
</style>
