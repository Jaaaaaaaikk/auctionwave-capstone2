<template>
  <NuxtLayout name="biddernavbar">
    <section class="bg-gray-400 p-6 rounded-lg mx-96">
      <NuxtLink to="/bidder/bidderdashboard">
        <button type="button" class="text-gray-600 hover:text-gray-800">
          <svg class="w-full h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
      </NuxtLink>

      <h2 class="text-2xl font-semibold mb-4 text-center">Auction Details</h2>

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

        <div class="mb-2">
          <strong>Categories:</strong>
          <div class="flex flex-wrap mt-2">
            <span v-if="auction.categories.length === 0" class="text-gray-500">No categories</span>
            <span v-for="(category) in auction.categories"
              class="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">
              {{ category }}
            </span>
          </div>
        </div>

        <div class="w-1/2 flex flex-col items-end justify-end mb-4">
          <img 
            v-if="auction.image_url" 
            :src="auction.image_url" 
            alt="Auction Image Preview" 
            class="w-48 h-48 object-cover rounded-lg shadow-xl" 
            @error="auction.image_url = 'public/images/no-image.jpg'" 
          />
          <img 
            v-else 
            src="public/images/no-image.jpg" 
            alt="No Image Available" 
            class="w-48 h-48 object-cover rounded-lg shadow-xl" 
          />
        </div>


        <div class="flex flex-col items-end mt-6">
          <input v-model.number="bidAmount" class="rounded-xl" type="number" step="1" :min="minBid" :max="maxBid"
            placeholder="Amount bid" required @input="validateBidAmount" />

          <!-- Validation Messages -->
          <p v-if="bidders.length === 0 && bidAmount !== auction.starting_bid" class="text-red-500 p-12">
            Bid amount must be the starting bid since there are no bidders yet.
          </p>
          <p v-if="bidders.length > 0 && (bidAmount < minBid || bidAmount >= maxBid)" class="text-red-500 p-12">
            Bid amount must be between {{ minBid }} and {{ maxBid - 1}}.
          </p>
        </div>

        <div class="flex justify-end mt-6">
          <button @click="confirmBid"
            class="bg-teal-500 border font-semibold border-teal-500 shadow-sm-light shadow-black hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 text-gray-900 px-4 py-2 rounded-full">
            Enter Bid
          </button>
        </div>

        <div class="w-full pl-6 mt-4">
          <h3 class="flex text-xl text-center font-semibold mb-4">Participated Bidders</h3>
          <div v-for="bidder in bidders" :key="bidder.user_id" class="mb-2">
            <span>{{ bidder.firstname }} {{ bidder.lastname }} - {{ bidder.bid_amount }}
              <span v-if="isCurrentUser(bidder.user_id)" class="text-teal-500 pr-10">(YOU)</span>
            </span>
          </div>
        </div>
      </div>

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
const bidAmount = ref(0);
const bidders = ref([]);
const currentUserId = ref(null);
const minBid = ref(0);
const maxBid = ref(0);

const fetchAuction = async () => {
  try {
    const auctionId = route.query.id;
    console.log("Auction ID:", auctionId);

    if (!auctionId) {
      throw new Error("Auction ID is missing");
    }

    const response = await axios.get(`/api/auction/${auctionId}`);
    console.log("Response Data:", response.data);

    if (response.data) {
      auction.value = response.data;
      if (auction.value.categories) {
        auction.value.categories = auction.value.categories.split(', ').map(category => category.trim());
      } else {
        auction.value.categories = [];
      }

      fetchBidders(auction.value.id);
    } else {
      throw new Error("No auction data returned");
    }
  } catch (err) {
    console.error("Failed to fetch auction details:", err);
  }
};


const fetchBidders = async (listingId) => {
  console.log('auction.listing_id', listingId);
  if (listingId) {
    try {
      const { data } = await axios.get(`/api/fill-in-bidder-participants?id=${listingId}`);
      bidders.value = data.bidders;
      console.log('fetch bidder in bidder-auction', data);
      currentUserId.value = data.currentUserId;

      // Set maxBid to the lowestBid fetched from the API
      if (data.lowestBid !== null) {
        maxBid.value = data.lowestBid; // Max bid is the lowest bid from the API
        minBid.value = Math.ceil(data.lowestBid * 0.8); // Set min bid to 80% of the lowest bid
      } else {
        // If there are no bids yet, set min and max to the starting bid
        minBid.value = auction.value.starting_bid;
        maxBid.value = auction.value.starting_bid;
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    console.error('No listing ID available');
  }
};

const confirmBid = () => {
  const amount = parseFloat(bidAmount.value);

  // Ensure auction data is loaded
  if (!auction.value || !auction.value.starting_bid) {
    alert("Auction data is not yet fully loaded. Please wait and try again.");
    return;
  }

  // Validate bid based on the number of existing bidders
  if (bidders.value.length > 0) {
    if (isNaN(amount) || amount < minBid.value || amount >= maxBid.value) {
      alert(`Bid amount must be between ${minBid.value} and ${maxBid.value - 1}.`);
      return;
    }
  } else {
    if (isNaN(amount) || amount !== parseFloat(auction?.value.starting_bid)) {
      alert(`Bid amount must be the starting bid since there are no bidders yet.`);
      return;
    }
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Invalid bid amount. Please enter a positive number.");
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
    await axios.post('/api/place-bid', { auctionId, bidAmount: amount });
    alert("Bid placed successfully!");

    // After placing the bid, fetch the updated list of bidders and bids
    await fetchBidders(auction.value.id);
  } catch (err) {
    console.error("Failed to place bid:", err);
    alert("Failed to place bid.");
  }
};

const isCurrentUser = (bidderId) => {
  return bidderId === currentUserId.value;
};

onMounted(() => {
  fetchAuction();
});
</script>

<style scoped>
/* Add any specific styles for the auction page here */
</style>
