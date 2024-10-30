<template>
  <NuxtLayout name="auctioneernavbar">
    <div class="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <!-- Auction Details -->
      <div class="mb-6">
        <h1 class="text-3xl font-semibold mb-2">Auction Name: {{ auction.name }}</h1>
        <div class="w-full flex flex-col items-center justify-center mb-4">
          <!-- Display auction image or fallback to a default image -->
          <img v-if="auction.image_url" :src="auction.image_url" alt="Auction Image Preview"
            class="w-48 h-48 object-cover rounded-lg shadow-xl" />
          <img v-else src="public/images/no-image.jpg" alt="No Image Available"
            class="w-48 h-48 object-cover rounded-lg shadow-xl" />
        </div>
        <div class="flex items-center space-x-4 mb-4">
          <span class="text-xl font-medium">Bidding Type:</span>
          <span class="text-lg text-blue-500">{{ auction.bidding_type }}</span>
        </div>
        <div class="flex items-center space-x-4 mb-4">
          <span class="text-xl font-medium">Starting Bid:</span>
          <span class="text-lg text-green-500">${{ auction.starting_bid }}</span>
        </div>
        <div class="flex items-center space-x-4 mb-4">
          <span class="text-xl font-medium">Location:</span>
          <span class="text-lg text-green-500">{{ auction.location }}</span>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 class="text-lg font-medium">Item Details</h3>
            <p v-if="!auction.item_details" class="text-gray-500">No Item Details Provided.</p>
            <p v-else class="text-gray-500">{{ auction.item_details }}</p>
          </div>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 class="text-lg font-medium">Description</h3>
            <p v-if="!auction.description" class="text-gray-500">No Description Provided.</p>
            <p class="text-gray-500">{{ auction.description }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4 my-4">
          <span class="text-xl font-medium">Rarity:</span>
          <span class="text-lg text-green-500">{{ auction.rarity }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-4 mb-4">
        <span class="text-xl font-medium">Status:</span>
        <span class="text-lg text-green-500">{{ auction.status }}</span>
      </div>
      <!-- Participated Bidders -->
      <div class="space-y-4">
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 class="flex text-xl text-center font-semibold mb-4"> {{ h2Label }} </h2>
          <template v-if="auction.bidding_type === 'Lowest-type'">
            <div v-if="bidders.length === 0" class="text-gray-500 mb-2">
              No participated bidders yet.
            </div>
            <div v-else>
              <div v-for="bidder in bidders" :key="bidder.user_id" class="mb-2">
                <span>{{ bidder.firstname }} {{ bidder.lastname }} - {{ bidder.bid_amount }}
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="auction.bidding_type === 'Offer-type'">
            <div v-if="topComments.length === 0" class="text-gray-500 mb-2">
              No offers have been posted yet.
            </div>
            <div v-else>
              <div v-for="comment in topComments" :key="comment.user_id" class="mb-2">
                <span>{{ comment.firstname }} {{ comment.lastname }} (number of offers: {{ comment.offer_count }})
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="space-y-4">
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
          <button @click="confirmEmailBlast" :disabled="isEmailBlastSent" class="text-lg border bg-green-500 rounded-full px-4 py-2 shadow-md shadow-black hover:bg-teal-600
            font-semibold" :class="{ 'opacity-50 cursor-not-allowed': isEmailBlastSent }">
            {{ isEmailBlastSent ? "Email Blast Sent Already" : "Email Blast" }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { toast } from "vue3-toastify";

const route = useRoute();
const auction = ref({});
const isEmailBlastSent = ref(false);
const bidders = ref([]);
const topComments = ref([]);


const fetchAuctionDetails = async () => {
  try {
    const { data } = await axios.get(`/api/auctions/${route.query.id}`);
    console.log(data);
    auction.value = data;

    fetchBidders(auction.value.id);

    if (data.email_blast_sent === 1) {
      isEmailBlastSent.value = true;
    }
  } catch (error) {
    console.error("Failed to fetch auction details:", error);
  }
};

const fetchBidders = async (listingId) => {
  console.log('auction.listing_id', listingId);
  if (listingId && auction.value.bidding_type === 'Lowest-type') { // Corrected access here
    try {
      const { data } = await axios.get(`/api/auctions/fill-in-bidder-participants?id=${listingId}`);
      bidders.value = data.bidders;
      console.log('fetch bidder in bidder-auction', data);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else if (listingId && auction.value.bidding_type === 'Offer-type') { // Corrected access here
    try {
      const { data } = await axios.get(`/api/auctions/fill-in-offer-participants?id=${listingId}`);
      topComments.value = data.offers; // Store the fetched top comments

      console.log('fetch Top comments in bidder-auction', topComments.value);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    console.error('No listing ID available');
  }
};

const confirmEmailBlast = () => {
  if (window.confirm("Are you sure you want to send an email blast to all related bidders?")) {
    sendEmailBlast();
  }
};

const sendEmailBlast = async () => {
  try {
    const emailBlastResponse = await axios.post('/api/notifications/email-blast', { auctionUuid: route.query.id });
    console.log(emailBlastResponse);
    toast.success("Email blast sent successfully!");
    isEmailBlastSent.value = true;
  } catch (error) {
    console.error("Failed to send email blast:", error);
    toast.error("Failed to send email blast.");
  }
};

const h2Label = computed(() => {
  return auction.value.bidding_type === 'Lowest-type' ? 'Participated Bidders' : 'Top Comments';
});

onMounted(() => {
  fetchAuctionDetails();
});
</script>

<style scoped>
/* Optional: add some styling for the disabled button */
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>