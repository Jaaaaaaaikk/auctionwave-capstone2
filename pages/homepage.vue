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
        class="px-4 py-2 text-gray-900 font-semibold bg-teal-500 border border-teal-500 rounded-full hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
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
              class="inline-flex mr-1 items-center py-3 px-6 text-xl font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              @click="toggleDropdown">
              All categories
              <svg class="w-3 h-3 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
          </div>

          <!-- Dropdown Menu -->
          <div v-if="dropdownOpen"
            class="absolute top-0 mt-16 w-56 bg-white divide-y divide-gray-100  shadow dark:bg-gray-700 rounded-2xl">
            <ul class="py-2 text-xl text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
              <li><button type="button" class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Mockups</button></li>
              <li><button type="button" class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Templates</button></li>
              <li><button type="button" class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Design</button></li>
              <li><button type="button" class="block w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">Logos</button></li>
            </ul>
          </div>

          <!-- Search Input -->
          <div class="relative flex-grow ml-2">
            <input type="text" id="search-dropdown" maxlength="250"
              class="block w-full p-3 text-lg text-gray-900 bg-gray-50  border-gray-300 dark:bg-gray-700 z-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white rounded-xl"
              placeholder="Search items, projects, and more..."/>
            <button type="button"
              class="absolute right-3 pr-2.5  br-b-2 top-3 bottom-3 text-sm font-medium focus:outline-none z-10 bg-gray-50">
              <svg class="w-10 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="bg-gray-800 text-white py-6 mt-8">
      <div class="container mx-auto flex justify-between items-center">
        <p class="text-sm">© 2024 AuctionWave. All rights reserved.</p>
        <div class="flex space-x-4">
          <a href="https://facebook.com" target="_blank" class="text-white hover:text-gray-400">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12.071C22 6.055 17.946 2 12 2S2 6.055 2 12.071c0 5.489 4.153 10.004 9.5 10.648v-7.53h-2.855v-3.078h2.855V9.702c0-2.84 1.696-4.398 4.287-4.398 1.223 0 2.53.227 2.53.227v2.79h-1.423c-1.401 0-1.843.868-1.843 1.759v2.146h3.217l-.514 3.078h-2.703v7.53C17.847 22.075 22 17.56 22 12.071z" />
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" class="text-white hover:text-gray-400">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.46 6.011c-.775.345-1.607.576-2.48.681a4.425 4.425 0 0 0 1.937-2.448 8.73 8.73 0 0 1-2.71 1.036 4.386 4.386 0 0 0-7.46 4.002 12.437 12.437 0 0 1-9.037-4.586 4.397 4.397 0 0 0 1.356 5.855 4.387 4.387 0 0 1-1.989-.548v.055a4.382 4.382 0 0 0 3.512 4.295 4.397 4.397 0 0 1-1.983.075 4.387 4.387 0 0 0 4.095 3.059A8.75 8.75 0 0 1 1 19.206a12.392 12.392 0 0 0 6.712 1.97c8.058 0 12.487-6.678 12.487-12.487 0-.189-.004-.378-.014-.567a8.896 8.896 0 0 0 2.185-2.279z" />
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" class="text-white hover:text-gray-400">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.25c-2.9 0-3.25.01-4.39.063-1.144.054-1.93.246-2.62.513-.676.262-1.244.63-1.749 1.135-.505.505-.873 1.073-1.135 1.749-.268.691-.46 1.477-.514 2.622C2.26 8.75 2.25 9.1 2.25 12c0 2.9.01 3.25.063 4.39.054 1.144.246 1.93.513 2.62.262.676.63 1.244 1.135 1.749.505.505 1.073.873 1.749 1.135.691.268 1.477.46 2.622.514C8.75 21.74 9.1 21.75 12 21.75c2.9 0 3.25-.01 4.39-.063 1.144-.054 1.93-.246 2.62-.513.676-.262 1.244-.63 1.749-1.135.505-.505.873-1.073 1.135-1.749.268-.691.46-1.477.514-2.622.053-1.14.063-1.49.063-4.39s-.01-3.25-.063-4.39c-.054-1.144-.246-1.93-.513-2.62-.262-.676-.63-1.244-1.135-1.749-.505-.505-1.073-.873-1.749-1.135-.691-.268-1.477-.46-2.622-.514C15.25 2.26 14.9 2.25 12 2.25zm0-1.5c2.928 0 3.275.012 4.424.064 1.159.053 1.963.24 2.598.47.749.275 1.367.63 1.905 1.085.538.537.79 1.155 1.065 1.905.232.636.417 1.427.47 2.604.052 1.153.064 1.496.064 4.424s-.012 3.275-.064 4.424c-.053 1.177-.238 1.968-.47 2.604-.275.749-.63 1.367-1.085 1.905-.537.538-1.155.79-1.905 1.065-.636.232-1.427.417-2.604.47-1.153.052-1.496.064-4.424.064s-3.275-.012-4.424-.064c-1.177-.053-1.968-.238-2.604-.47-.749-.275-1.367-.63-1.905-1.065-.538-.537-.79-1.155-1.065-1.905-.232-.636-.417-1.427-.47-2.604-.052-1.153-.064-1.496-.064-4.424s.012-3.275.064-4.424c.053-1.177.238-1.968.47-2.604.275-.749.63-1.367 1.065-1.905.537-.538 1.155-.79 1.905-1.085.636-.232 1.427-.417 2.604-.47C8.725 2.26 9.074 2.25 12 2.25zm0 6.75c-2.93 0-5.25 2.32-5.25 5.25 0 2.93 2.32 5.25 5.25 5.25 2.93 0 5.25-2.32 5.25-5.25 0-2.93-2.32-5.25-5.25-5.25zm0 8.25a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.75-8.75a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
  <SigninModal v-if="showSigninModal" @close="showSigninModal = false" @show-signup="showSignupModal = true" />
  <SignupModal v-if="showSignupModal" @show-login="ShowSigninModal = true" @show-login2="showSignupModal = false"/>
</template>

<script setup>
import { ref } from 'vue';
import SigninModal from '~/components/signinmodal.vue';
import SignupModal from '~/components/signupmodal.vue';

const showSigninModal = ref(false);
const showSignupModal = ref(false);
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

</script>

<style scoped>

</style>