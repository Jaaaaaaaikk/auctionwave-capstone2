<template>
  <div class="font-mono p-6 bg-white dark:bg-gray-900 min-h-screen">
      <!-- Header Section -->
      <nav class="fixed top-0 left-0 right-0 px-4 py-4 flex justify-between items-center bg-white shadow-md">
          <!-- Logo and Company Name -->
          <NuxtLink to="/auctioneerdashboard" class="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/public/images/auctionwave-logo-final.png" class="h-16" alt="Logo" />
          </NuxtLink>

          <!-- Navigation Bar Section -->
          <div class="flex space-x-8 rtl:space-x-reverse">
              <!-- Auctions Dropdown Button -->
              <div class="relative">
                  <button id="dropdownNavbarLink" type="button"
                      class="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                      @click="toggleAuctionsDropdown" aria-expanded="false">
                      Auctions
                      <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                          fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m1 1 4 4 4-4" />
                      </svg>
                  </button>
                  <!-- Auctions Dropdown Menu -->
                  <div v-if="auctionsDropdownOpen"
                      class="absolute top-full mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                              <button @click="create_AuctionModal = true"
                                  class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  Create Auction
                              </button>
                          </li>
                          <li>
                              <NuxtLink to="/viewauctions"
                                  class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  View Auctions</NuxtLink>
                          </li>
                          <li>
                              <NuxtLink to="/transactionhistory"
                                  class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  Transaction History</NuxtLink>
                          </li>
                      </ul>
                  </div>
              </div>
              <NuxtLink to="/faq" class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">
                  FAQ's</NuxtLink>
              <NuxtLink to="/contactus"
                  class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">Contact Us
              </NuxtLink>
          </div>

          <!-- Notification and Profile Icons -->
          <div class="flex space-x-4 items-center">
              <!-- Notification Icon -->
              <div class="relative">
                  <NuxtLink to="#" @click="toggleNotificationDropdown"
                      class="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                      aria-expanded="false">
                      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 22c1.104 0 2-.896 2-2H10c0 1.104.896 2 2 2zM5 11V8a7 7 0 0 1 14 0v3l1 1v1H4v-1l1-1z" />
                      </svg>
                  </NuxtLink>
                  <div v-if="notificationDropdownOpen"
                      class="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                              <button
                                  class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Notification
                                  1</button>
                          </li>
                          <li>
                              <button
                                  class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Notification
                                  2</button>
                          </li>
                          <li>
                              <button
                                  class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Notification
                                  3</button>
                          </li>
                      </ul>
                  </div>
              </div>

              <!-- Profile Icon -->
              <div class="relative">
                  <NuxtLink to="#" @click="toggleProfileDropdown"
                      class="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                      aria-expanded="false">
                      <img :src="userProfileImage" class="w-10 h-10 rounded-full object-cover" alt="Profile Icon" />
                  </NuxtLink>
                  <div v-if="profileDropdownOpen"
                      class="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                              <button @click="viewProfile"
                                  class="flex items-center px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-200"
                                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <path stroke="gray" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" />
                                  </svg>
                                  View Profile
                              </button>
                          </li>
                          <li>
                              <button @click="logout"
                                  class="flex items-center px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-200"
                                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                      stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6-10V5a3 3 0 00-6 0v1" />
                                  </svg>
                                  Logout
                              </button>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </nav>

      <!-- Content Section -->
      <div class="mt-24 p-6">
        <slot />
      </div>
      <CreateAuction_Modal v-if="create_AuctionModal" @close="create_AuctionModal = false" />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateAuction_Modal from '~/components/createauctionmodal.vue';

const create_AuctionModal = ref(false);
const notificationDropdownOpen = ref(false);
const profileDropdownOpen = ref(false);
const auctionsDropdownOpen = ref(false); // Added state for auctions dropdown
const router = useRouter();
const userProfileImage = ref('/images/default-profile-image.png');

const toggleNotificationDropdown = () => {
    notificationDropdownOpen.value = !notificationDropdownOpen.value;
    profileDropdownOpen.value = false;
    auctionsDropdownOpen.value = false;
};

const toggleProfileDropdown = () => {
    profileDropdownOpen.value = !profileDropdownOpen.value;
    notificationDropdownOpen.value = false;
    auctionsDropdownOpen.value = false
};

const toggleAuctionsDropdown = () => {
    auctionsDropdownOpen.value = !auctionsDropdownOpen.value; // Toggle auctions dropdown
    notificationDropdownOpen.value = false;
    profileDropdownOpen.value = false;
};

function viewProfile() {
    profileDropdownOpen.value = false;
    router.push('/auctioneerprofilepage');
    
}

const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            console.error('No refresh token available');
            return;
        }

        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-refresh-token': refreshToken,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        // Clear tokens from local storage or cookies if needed
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken'); // Assuming you have an access token

        // Redirect to home page or login page
        router.push('/');
    } catch (error) {
        console.error('Logout failed:', error);
        // Optionally show an error message to the user
    }
};

</script>

<style>

</style>