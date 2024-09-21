<template>
  <NuxtLayout name="auctioneernavbar">
    <div class="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <!-- Auction Details -->
      <div class="mb-6">
        <h1 class="text-3xl font-semibold mb-2">Auction Name: {{ auction.name }}</h1>
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
            <h3 class="text-lg font-medium">Description</h3>
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
          <h1 class="text-3xl mb-2">Participated Bidders</h1>
          <!-- Example static data, replace with dynamic data -->
          <h3 class="text-lg font-medium">John Doe</h3>
          <p class="text-gray-500">Location</p>
        </div>
      </div>
      <div class="space-y-4">
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
          <button @click="confirmEmailBlast"
            class="text-lg border bg-green-500 rounded-full px-4 py-2 shadow-md shadow-black hover:bg-teal-600 font-semibold">
            Email Blast
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

const fetchAuctionDetails = async () => {
  try {
    const { data } = await axios.get(`/api/auction/${route.query.id}`);
    console.log(data);
    auction.value = data;
    auction.value.status = route.query.status;
  } catch (error) {
    console.error("Failed to fetch auction details:", error);
  }
};

const confirmEmailBlast = () => {
  if (window.confirm("Are you sure you want to send an email blast to all related bidders?")) {
    sendEmailBlast();
  }
};

const sendEmailBlast = async () => {
  try {
    const emailBlastResponse = await axios.post('/api/email-blast', {auctionUuid: route.query.id});
    console.log(emailBlastResponse);
    toast.success("Email blast sent successfully!");
  } catch (error) {
    console.error("Failed to send email blast:", error);
    toast.error("Failed to send email blast.");
  }
};

onMounted(() => {
  fetchAuctionDetails();
});
</script>

<style scoped></style>