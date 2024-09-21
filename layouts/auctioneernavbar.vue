  <template>
    <div class="font-mono p-6 bg-white dark:bg-gray-900 min-h-screen">
      <!-- Header Section -->
      <nav class="fixed top-0 left-0 right-0 px-4 py-4 flex justify-between items-center bg-white shadow-xl">
        <!-- Logo and Company Name -->
        <NuxtLink to="/auctioneer/auctioneerdashboard" class="flex justify-start space-x-3 rtl:space-x-reverse mr-8">
          <img src="/public/images/auctionwave-logo-final.png" class="h-16" alt="Logo" />
        </NuxtLink>

        <!-- Navigation Bar Section -->
        <div class="flex space-x-8 text-xl rtl:space-x-reverse w-full">
          <!-- Auctions Dropdown Button -->
          <div class="relative">
            <button id="dropdownNavbarLink" type="button"
              class="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              @click="toggleAuctionsDropdown" aria-expanded="false">
              Auctions
              <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 4 4 4-4" />
              </svg>
            </button>
            <!-- Auctions Dropdown Menu -->
            <div v-if="auctionsDropdownOpen"
              class="absolute top-full mt-2 w-48 shadow-sm-light shadow-slate-950 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <NuxtLink to="/inbox"
                    class="block px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Transaction History</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <NuxtLink :to="{ path: '/faq', query: { userType: userType } }" class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">
            FAQ's</NuxtLink>
          <NuxtLink :to="{ path: '/contactus', query: { userType: userType } }" class="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500">
            Contact Us
          </NuxtLink>
          <NuxtLink
            :to="{ path: '/inbox', query: { userType: userType } }"
            class="text-gray-900 dark:text-white text-xl hover:text-blue-700 dark:hover:text-blue-500"
            >Inbox
          </NuxtLink>
        </div>

        <!-- Notification and Profile Icons -->
        <div class="flex space-x-4 items-center">
          <!-- Notification Icon -->
          <div class="relative">
            <button @click="toggleNotificationDropdown"
              class="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
              aria-expanded="false">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 22c1.104 0 2-.896 2-2H10c0 1.104.896 2 2 2zM5 11V8a7 7 0 0 1 14 0v3l1 1v1H4v-1l1-1z" />
              </svg>
            </button>
            <div v-if="notificationDropdownOpen"
              class="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 shadow-sm-light shadow-black">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Notification 1
                  </button>
                </li>
                <li>
                  <button class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Notification 2
                  </button>
                </li>
                <li>
                  <button class="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Notification 3
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Profile Icon -->
          <div class="relative">
            <button @click="toggleProfileDropdown"
              class="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
              aria-expanded="false">
              <img :src="userProfileImage" class="w-10 h-10 rounded-full object-cover" alt="Profile Icon" />
            </button>
            <div v-if="profileDropdownOpen"
              class="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 shadow-sm-light shadow-black">
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
      </nav>

      <!-- Content Section -->
      <div class="mt-24 p-6">
        <slot />
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";

  const notificationDropdownOpen = ref(false);
  const profileDropdownOpen = ref(false);
  const auctionsDropdownOpen = ref(false); // Added state for auctions dropdown
  const router = useRouter();
  const userProfileImage = ref("/images/default-profile-image.png");
  const userType = ref("");

  const toggleNotificationDropdown = () => {
    notificationDropdownOpen.value = !notificationDropdownOpen.value;
    profileDropdownOpen.value = false;
    auctionsDropdownOpen.value = false;
  };

  const toggleProfileDropdown = () => {
    profileDropdownOpen.value = !profileDropdownOpen.value;
    notificationDropdownOpen.value = false;
    auctionsDropdownOpen.value = false;
  };

  const toggleAuctionsDropdown = () => {
    auctionsDropdownOpen.value = !auctionsDropdownOpen.value; // Toggle auctions dropdown
    notificationDropdownOpen.value = false;
    profileDropdownOpen.value = false;
  };

  function viewProfile() {
    profileDropdownOpen.value = false;
    router.replace("/auctioneer/auctioneerprofile");
  }

  const logout = async () => {
    try {
      await axios.post("/api/logout");

      // Clear localStorage on logout
      //localStorage.removeItem("userType");

      // Redirect to login page or homepage
      router.replace("/homepage");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const getUserType = async () => {
    try {
      const { data } = await axios.post("/api/get-usertype");
      userType.value = data.userType;
    } catch (error) {
      console.error("Failed to get:", error);
      toast.error("Failed to get. Please try again.");
    }
  };

  onMounted(() => {
    getUserType();
});
  </script>

  <style></style>
