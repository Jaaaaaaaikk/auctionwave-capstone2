<template>
  <NuxtLayout name="biddernavbar">
    <div class="min-h-screen bg-custom-white w-full mt-16">
      <div class="bg-white w-3/5 mx-auto px-12 py-12 rounded-lg flex items-start">
        <div class="mr-6">
          <img class="w-48 rounded-full" src="../public/images/default-profile-image.png" alt="Profile Picture">
        </div>
        <div class="my-2 mx-8">
          <h1 class="text-3xl font-medium">Bidder</h1>
          <div class="flex justify-left">
            <button type="button"
              class="border-2 border-custom-bluegreen p-2 w-24 h-20 mt-5 bg-white rounded-lg text-custom-bluegreen font-medium ml-2 outline-custom-bluegreen hover:shadow-inner">Resume</button>
          </div>
        </div>
        <div class="w-px h-52 bg-gray-300 ml-48"></div>
        <div class="flex">
          <div class="mx-10 my-2">
            <div class="font-medium my-2">Full name:</div>
            <div class="font-medium my-2">Email:</div>
            <div class="font-medium my-2">Location:</div>
            <div class="font-medium my-2">Categories:</div>
          </div>
          <div class="my-2 w-full">
            <div class="font-normal my-2">{{ profile.fullname }}</div>
            <div class="font-normal my-2">{{ profile.email }}</div>
            <div class="font-normal my-2">{{ profile.location }}</div>
            <div class="font-normal my-2">
              <div class="flex flex-wrap">
                <span v-for="(category, index) in profile.categories" :key="index"
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {{ category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center my-8">
        <hr class="w-full">
      </div>
      <div class="bg-white w-3/5 mx-auto my-6 px-12 py-12 rounded-lg items-start">
        <div class="mr-6">
          <div class="text-2xl font-medium">About</div>
        </div>
        <div class="mr-6">
          <div class="font-normal my-4">{{ profile.about }}</div>
        </div>
        <div class="flex justify-center my-8">
          <hr class="w-full">
        </div>
      </div>
    </div>
  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const profile = ref({
  fullname: '',
  email: '',
  location: '',
  categories: [],
  about: ''
});

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
    const response = await axios.get('/api/bidderprofile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    profile.value = response.data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error.message);
  }
};

onMounted(fetchProfile);
</script>

<style scoped>
/* Add custom styles here */
</style>