<template>
  <div class="bg-custom-blue2 dark:bg-gray-900 min-h-screen">
    <!-- Header Section -->
    <div class="fixed top-0 left-0 right-0  flex items-center justify-between bg-white shadow-md mb-6 z-20">
      <NuxtLink to="/bidder/bidderdashboard" class="flex justify-start space-x-3 rtl:space-x-reverse mr-8">
        <img src="/images/logo-no-text.jpg" class="h-16" alt="Logo" />
      </NuxtLink>

      <div class="flex items-center w-full">

        <form class="ml-74.5 w-3/5 mx-4">
          <label for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" v-model="auctionStore.searchTerm" 
              class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-custom-bluegreen focus:border-custom-bluegreen dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search auction name..." required />
          </div>
        </form>

        <div class="flex space-x-4 items-center flex-grow  justify-end">
          <div class="relative mx-1 hover:text-green-500">
            <NuxtLink :to="{ path: '/inbox', query: { userType: userType } }">
              <svg height="28px" width="28px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"
                class="fill-current text-[#005262] hover:text-green-500">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <polygon class="st0" points="512,295.199 445.92,226.559 512,169.6" fill="currentColor"></polygon>
                    <polygon class="st0" points="66.16,226.559 0,295.279 0,169.6" fill="currentColor"></polygon>
                    <path class="st0"
                      d="M512,357.6v63.199c0,15.281-12.4,27.682-27.68,27.682H27.68c-15.281,0-27.68-12.4-27.68-27.682V357.6 l98.959-102.721L212,352.238c11.76,10.082,27.359,15.682,44,15.682c16.641,0,32.32-5.6,44.08-15.682l112.959-97.359L512,357.6z"
                      fill="currentColor"></path>
                    <path class="st0"
                      d="M512,91.119v27.68l-241.442,208c-7.76,6.72-21.359,6.72-29.119,0L0,118.799v-27.68 c0-15.279,12.398-27.6,27.68-27.6H484.32C499.6,63.519,512,75.84,512,91.119z"
                      fill="currentColor"></path>
                  </g>
                </g>
              </svg>
            </NuxtLink>
          </div>
          <div class="relative">
            <button @click="toggleNotificationDropdown"
              class="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
              aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="w-7 h-7 fill-current text-[#005262] hover:text-green-500">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="style=fill">
                    <g id="notification-bell">
                      <path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd"
                        d="M14.802 19.8317C15.4184 19.7699 15.8349 20.4242 15.5437 20.9539C15.3385 21.3271 15.0493 21.6529 14.7029 21.9197C14.3496 22.1918 13.9397 22.4006 13.5 22.5408C13.0601 22.6812 12.593 22.7522 12.1242 22.7522C11.6554 22.7522 11.1883 22.6812 10.7484 22.5408C10.3087 22.4006 9.89883 22.1918 9.54556 21.9197C9.1991 21.6529 8.90988 21.3271 8.70472 20.9539C8.41354 20.4242 8.83002 19.7699 9.44644 19.8317C9.63869 19.851 11.1433 19.9981 12.1242 19.9981C13.1051 19.9981 14.6097 19.851 14.802 19.8317Z">
                      </path>
                      <path id="vector (Stroke)_2" fill-rule="evenodd" clip-rule="evenodd"
                        d="M8.52901 2.08755C10.7932 1.00445 13.4465 0.967602 15.7423 1.98737L15.9475 2.07851C18.3532 3.14707 19.8934 5.4622 19.8934 8.0096L19.8934 9.27297C19.8934 10.2885 20.1236 11.2918 20.5681 12.213L20.8335 12.7632C22.0525 15.29 20.465 18.2435 17.6156 18.7498L17.455 18.7783C13.93 19.4046 10.3154 19.4046 6.79044 18.7783C3.90274 18.2653 2.37502 15.1943 3.77239 12.7115L3.99943 12.3082C4.55987 11.3124 4.85335 10.1981 4.85335 9.06596L4.85335 7.79233C4.85335 5.3744 6.27704 3.16478 8.52901 2.08755Z">
                      </path>
                    </g>
                  </g>
                </g>
              </svg>
              <span v-if="notificationsStore.unreadCount > 0" class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            </button>
            <div v-if="notificationDropdownOpen"
              class="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm-light shadow-black dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li v-for="notification in notificationsStore.notifications" :key="notification.notification_id"
                  :class="{ 'bg-yellow-100': !notification.is_read, 'bg-gray-100': notification.is_read }">
                  <button class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">{{
                    notification.message }}</button>
                </li>
                <li v-if="notificationsStore.notifications.length === 0">
                  <p class="block px-4 py-2 text-gray-500">No notifications</p>
                </li>
              </ul>
            </div>
          </div>

          <div class="relative pr-8">
            <button @click="toggleProfileDropdown"
              class="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
              aria-expanded="false">
              <img :src="userStore.userProfileImage" class="w-10 h-10 rounded-full object-cover" alt="Profile Icon" />
            </button>
            <div v-if="profileDropdownOpen"
              class="absolute right-0 mx-10 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-md shadow-gray-300 drop-shadow-md dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button @click="viewProfile"
                    class="flex items-center px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" />
                    </svg>
                    View Profile
                  </button>
                </li>
                <li>
                  <button
                    class="flex items-center px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.75 15V16.5H11.25V15H12.75ZM10.5 10.4318C10.5 9.66263 11.1497 9 12 9C12.8503 9 13.5 9.66263 13.5 10.4318C13.5 10.739 13.3151 11.1031 12.9076 11.5159C12.5126 11.9161 12.0104 12.2593 11.5928 12.5292L11.25 12.7509V14.25H12.75V13.5623C13.1312 13.303 13.5828 12.9671 13.9752 12.5696C14.4818 12.0564 15 11.3296 15 10.4318C15 8.79103 13.6349 7.5 12 7.5C10.3651 7.5 9 8.79103 9 10.4318H10.5Z"
                        fill="#6B7280"></path>
                    </svg>
                    Help
                  </button>
                </li>
                <li>
                  <button @click="logout"
                    class="flex items-center px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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

    <div class="pt-16">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from '@/stores/user-profile-image';
import { useAuctionFilterStore } from "@/stores/fetch-auction-bidder-dashboard";
import { useNotificationStore } from '@/stores/notification-store';


const notificationDropdownOpen = ref(false);
const profileDropdownOpen = ref(false);
const router = useRouter();
const userType = ref("");
const userStore = useUserStore(); // Use the store
const auctionStore = useAuctionFilterStore();
const notificationsStore = useNotificationStore();

const toggleNotificationDropdown = async () => {
  notificationDropdownOpen.value = !notificationDropdownOpen.value;
  profileDropdownOpen.value = false;
  if (notificationDropdownOpen.value && notificationsStore.notifications.length === 0) {
    await notificationsStore.fetchNotifications();
  }
};


const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
  notificationDropdownOpen.value = false;
};

const viewProfile = () => {
  profileDropdownOpen.value = false;
  router.replace("/bidder/bidderprofile");
};

const logout = async () => {
  try {
    await axios.post("/api/logout");

    localStorage.removeItem("user_profile_picture");

    router.replace("/homepage");
  } catch (error) {
    console.error("Logout failed:", error);
    // handle logout error
  }
};

// const fetchNotifications = async () => {
//   try {
//     const { data } = await axios.get('/api/notifications/fetch-bidder-inbox-notification');
//     notifications.value = data.notifications;
//     unreadCount.value = data.notifications.filter(notification => !notification.read).length;
//   } catch (error) {
//     console.error("Failed to fetch notifications:", error);
//   }
// };

const getUserType = async () => {
  try {
    const { data } = await axios.post("/api/get-usertype");
    userType.value = data.userType;
  } catch (error) {
    console.error("Failed to get:", error);
    // handle error
  }
};

onMounted(async () => {
  userStore.initializeProfileImage();
  await Promise.all([notificationsStore.fetchNotifications(), getUserType()]);
});
// Initialize the user's profile image from the store

</script>

<style scoped>
/* Add custom styles here */
</style>
