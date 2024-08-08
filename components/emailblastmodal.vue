<template>
      <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div class="relative p-4 w-full max-w-md bg-white rounded-3xl shadow-md">
              <button @click="$emit('close')"
                  class="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
              </button>

              <div class="p-4 text-center">
                  <svg class="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <h3 class="mb-5 text-lg font-normal text-gray-500">Do you want to use Email Blast?
                  </h3>
                  <button @click="createAuction"
                      class="text-white mr-2 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                      Yes
                  </button>
                  <button @click="createAuction"
                      class="py-2.5 px-5 text-sm font-medium text-gray-900 ml-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100">
                      No
                  </button>
              </div>
          </div>
      </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';

// Define props to receive data from parent component
const props = defineProps({
  auctionData: Object
});

const emit = defineEmits();

// Function to handle "No" button click
const createAuction = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('No access token found');
    return;
  }

  try {
    const formData = new FormData();
    Object.keys(props.auctionData).forEach(key => {
      formData.append(key, props.auctionData[key]);
    });

    const response = await axios.post('/api/createauction', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    console.log('API Response:', response.data);
    emit('close'); // Close the modal
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
  }
};

</script>

<style scoped>

</style>