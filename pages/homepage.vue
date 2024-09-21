<template>
  <div class="font-mono p-6 bg-white dark:bg-gray-900 min-h-screen ml-10 mr-10">
    <!-- Header Section -->
    <nav class="flex items-center justify-between mb-6">
      <!-- Logo and Company Name -->
      <NuxtLink to="/homepage" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/public/images/auctionwave-logo-final.png" class="h-16" alt="Logo" />
      </NuxtLink>

      <!-- Sign In Button -->
      <div class="flex items-center">
        <button @click="showSigninModal = true"
          class="flex px-4 py-2 text-gray-900 font-semibold bg-teal-500 border border-teal-500 rounded-full hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 shadow-sm-light shadow-black">
          Sign In
        </button>
      </div>
    </nav>

    <!-- Content Section -->
    <section class="bg-gray-200 h-96 rounded-lg p-6 flex items-center justify-center">
      <!-- Search Bar Section -->
      <div class="flex justify-center w-full">
        <form class="relative flex items-center w-full max-w-2xl">
          <!-- Dropdown Button -->
          <div class="relative flex-shrink-0">
            <button id="dropdown-button" type="button"
              class="inline-flex mr-1 items-center py-3 px-6 shadow-sm-light shadow-black text-xl font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              @click="toggleDropdown">
              All categories
              <svg class="w-3 h-3 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 4 4 4-4" />
              </svg>
            </button>
          </div>

          <!-- Dropdown Menu -->
          <div v-if="dropdownOpen"
            class="absolute top-0 mt-16 w-56 bg-white divide-y divide-gray-100 shadow-sm-light shadow-black dark:bg-gray-700 rounded-2xl">
            <ul class="py-2 text-xl text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
              <li>
                <button type="button"
                  class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Art
                </button>
              </li>
              <li>
                <button type="button"
                  class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Electronics
                </button>
              </li>
              <li>
                <button type="button"
                  class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Collectibles
                </button>
              </li>
              <li>
                <button type="button"
                  class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Furniture
                </button>
              </li>
              <li>
                <button type="button"
                  class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Real Estate
                </button>
              </li>
            </ul>
          </div>

          <!-- Search Input -->
          <div class="relative flex-grow ml-2">
            <input type="text" id="search-dropdown" maxlength="250"
              class="block w-full p-3 text-lg text-gray-900 bg-gray-50 shadow-inner shadow-black border-gray-300 dark:bg-gray-700 z-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white rounded-xl"
              placeholder="Search for auction's name..." />
          </div>
        </form>
      </div>
    </section>
  </div>
  <SigninModal v-if="showSigninModal" @close="showSigninModal = false" @close-signup="showSignupModal = false" />
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref } from "vue";
import SigninModal from "~/components/signinmodal.vue";



const showSigninModal = ref(false);
const showSignupModal = ref(false);
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
</script>

<style scoped></style>
