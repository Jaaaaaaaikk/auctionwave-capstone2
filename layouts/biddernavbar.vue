<template>
    <div class="font-mono p-6 bg-white dark:bg-gray-900 min-h-screen">
        <!-- Header Section -->
        <div class="fixed top-0 left-0 right-0 px-4 py-4 flex items-center justify-between shadow-md mb-6">
            <!-- Logo and Company Name -->
            <NuxtLink to="/bidderdashboard" class="flex items-center space-x-3 rtl:space-x-reverse mr-8"> <!-- Added margin-right -->
                <img src="/public/images/auctionwave-logo-final.png" class="h-16" alt="Logo" />
            </NuxtLink>

            <!-- Navigation Bar and Search Bar Container -->
            <div class="flex items-center space-x-3 rtl:space-x-reverse w-full">
                <!-- Navigation Links -->
                <div class="flex space-x-8 rtl:space-x-reverse flex-grow">
                    <NuxtLink to="/biddinghistory"
                        class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">Bidding History
                    </NuxtLink>
                    <NuxtLink to="/transactionhistory"
                        class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">Transaction
                        History</NuxtLink>
                    <NuxtLink to="/faq" class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">
                        FAQ's</NuxtLink>
                    <NuxtLink to="/contactus"
                        class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">Contact Us
                    </NuxtLink>
                </div>

                <!-- Search Bar Section -->
                <div class="flex-grow flex justify-center">
                    <form class="relative flex items-center w-full max-w-lg">
                        <!-- Dropdown Button -->
                        <div class="relative flex items-center">
                            <!-- Dropdown Button -->
                            <button id="dropdown-button" type="button"
                                class="flex-shrink-0 inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 ml-1"
                                @click="toggleDropdown">
                                All categories
                                <svg class="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                        </div>

                        <!-- Dropdown Menu -->
                        <div v-if="dropdownOpen"
                            class="absolute top-0 mt-12 w-44 bg-white divide-y divide-gray-100 rounded-2xl shadow dark:bg-gray-700">
                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                                <li><button type="button"
                                        class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Mockups</button>
                                </li>
                                <li><button type="button"
                                        class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Templates</button>
                                </li>
                                <li><button type="button"
                                        class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Design</button>
                                </li>
                                <li><button type="button"
                                        class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Logos</button>
                                </li>
                            </ul>
                        </div>

                        <!-- Search Input -->
                        <div class="relative flex-grow ml-2">
                            <input type="text" id="search-dropdown"
                                class="block w-full p-3 text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                placeholder="Search items, projects, and more..." />
                            <button type="submit"
                                class="absolute right-3 top-1 pr-1 br-b-2 bottom-2 px-3 text-sm font-medium text-white bg-gray-50 rounded-xl">
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 20 20">
                                    <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </button>
                        </div>
                    </form>
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
            </div>
        </div>

        <!-- Main Content -->
        <div class="mt-16 pt-20">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const dropdownOpen = ref(false);
const notificationDropdownOpen = ref(false);
const profileDropdownOpen = ref(false);
const router = useRouter();
const userProfileImage = '/images/default-profile-image.png'; // Use a default profile image

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const toggleNotificationDropdown = () => {
    notificationDropdownOpen.value = !notificationDropdownOpen.value;
    profileDropdownOpen.value = false;
};

const toggleProfileDropdown = () => {
    profileDropdownOpen.value = !profileDropdownOpen.value;
    notificationDropdownOpen.value = false;
};

const viewProfile = () => {
    profileDropdownOpen.value = false;
    router.push('bidderprofilepage');
};

const logout = async () => {
    try {
        // Retrieve the refresh token from storage
        const refreshToken = localStorage.getItem('refreshToken'); // Or fetch from cookies

        if (!refreshToken) {
            console.error('No refresh token available');
            return;
        }

        // Send the refresh token to the server to update revokedAt
        await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-refresh-token': refreshToken, // Include the refresh token in the header
            },
            credentials: 'include',
        });

        // Optionally clear local storage or cookies if needed
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');

        // Redirect to the home page
        router.push('/');
    } catch (error) {
        console.error('Logout failed:', error);
        // Optionally show an error message
    }
};

</script>

<style scoped>
/* Add custom styles here */
</style>
