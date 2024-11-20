  <template>
    <div class="p-2 bg-custom-blue2 dark:bg-gray-900 min-h-screen">
      <!-- Header Section -->
      <nav class="fixed top-0 left-0 right-0 flex items-center justify-between bg-white shadow-md mb-6 z-20 py-3">
        <!-- Logo and Company Name -->
        <NuxtLink v-if="!isAuctioneerDashboard" to="/auctioneer/auctioneerdashboard"
          class="flex justify-start space-x-3 rtl:space-x-reverse mr-8">
          <img src="/public/images/logo-no-text.jpg" class="h-12" alt="Logo" />
        </NuxtLink>


        <div class="flex items-center w-full">
          <div class="flex space-x-4 items-center flex-grow  justify-end">

            <!--Inbox Icon-->
            <div class="relative hidden lg:block">
              <button :class="isActiveInbox ? 'bg-custom-bluegreen bg-opacity-25' : 'bg-gray-200'"
                class="flex items-center p-2 flex-shrink-0 flex-grow-0 text-gray-900 hover:bg-gray-300  rounded-full  md:hover:text-blue-700  md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
                aria-label="View Inbox" aria-expanded="false" @click="handleClickInbox" title="Inbox">
                <svg height="27px" width="27px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="mail"
                  class="icon glyph" fill="#000000">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M22,8.32V18a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V8.69L4,9.78l7.52,4.1A1,1,0,0,0,12,14a1,1,0,0,0,.5-.14L20,9.49Z"
                      style="fill:#005262"></path>
                    <path d="M22,6h0L20,7.18l-8,4.67L4,7.5,2,6.4V6A2,2,0,0,1,4,4H20A2,2,0,0,1,22,6Z"
                      style="fill:#005262">

                    </path>
                  </g>
                </svg>
                <span v-if="inboxStore.unreadCount > 0"
                  class="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full text-xs text-white"> {{
                    inboxStore.unreadCount }}</span>
              </button>


              <div v-if="inboxDropdownOpen"
                class="absolute right-0 mt-2 w-96 bg-white divide-y divide-gray-100 rounded-md shadow-md drop-shadow-lg dark:bg-gray-700 z-0">
                <!-- Message List -->
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto no-scrollbar">
                  <li v-for="message in inboxStore.messages" :key="message.message_id" :class="{
                    'bg-yellow-100': !message.is_read,
                    'bg-gray-100': message.is_read,
                    'block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white': true
                  }" role="button" tabindex="0">
                    <img v-if="message.user_profile_image.length > 0" :src="message.user_profile_image[0]"
                      alt="Auction Image" class="w-11 h-11 rounded-full object-cover flex-shrink-0 ml-4 mr-8"
                      loading="lazy" />
                    <img v-else src="/public/images/no-image.jpg" alt="No Image Available"
                      class="object-cover w-full h-32 rounded-t-lg" loading="lazy" />
                    From: {{ message.sender_name }} - {{ message.message }} - {{ formatDate(message.created_at) }}
                  </li>

                  <li v-if="inboxStore.messages.length === 0">
                    <p class="block px-4 py-2 text-gray-500">No Messages.</p>
                  </li>
                </ul>
                <!-- Fixed buttons for 'See All' and 'Mark All as Read' -->
                <div class="flex flex-col px-4 py-2 border-t space-y-2">
                  <div class="flex justify-between">
                    <NuxtLink :to="{ path: '/inbox', query: { userType: userType } }"
                      class="flex items-center text-gray-700 hover:text-red-500">
                      <svg class="w-8 h-8 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      <span class="text-xs hover:underline">See All</span>
                    </NuxtLink>
                    <button @click="addMessage = true" class="flex items-center text-gray-700 hover:text-green-500">
                      <svg class="w-8 h-8 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="text-xs hover:underline">Compose Message</span>
                    </button>
                  </div>
                  <button @click="markAllMessagesAsRead"
                    class="flex items-center w-full text-gray-700 hover:text-green-500">
                    <svg class="w-8 h-8 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-xs hover:underline">Mark All as Read</span>
                  </button>
                </div>
              </div>

              <!-- Add Message Modal - Place it outside the dropdown -->
              <AddMessageModal v-if="addMessage" @closeAddMessageModal="addMessage = false" />
            </div>

            <!--Notification Bell-->
            <!--View Notification Bell-->
            <div class="relative flex justify-end">
              <button :class="isActiveNotification ? 'bg-custom-bluegreen bg-opacity-25' : 'bg-gray-200'"
                class="flex items-center p-2 text-gray-900 rounded-full   hover:bg-gray-300 md:border-0 md:hover:text-blue-700  md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
                aria-expanded="false" @click="handleClick" title="Notification">
                <svg class="w-7 h-7 fill-current text-[#005262]  " viewBox="0 0 28 28" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <title>ic_fluent_alert_28_filled</title>
                    <desc>Created with Sketch.</desc>
                    <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="ic_fluent_alert_28_filled" fill="#005262" fill-rule="nonzero">
                        <path
                          d="M17.4656511,22.0023722 C17.2225412,23.6986589 15.7635335,25.0024884 14,25.0024884 C12.2364665,25.0024884 10.7774588,23.6986589 10.5343489,22.0023722 L17.4656511,22.0023722 Z M13.9999998,3 C18.6097416,3 22.362545,6.66898984 22.4974867,11.2460464 L22.4974867,11.501244 L22.5012438,11.501244 L22.501,15.613 L23.9150137,19.2573205 C23.9531988,19.3557443 23.9789872,19.4583221 23.9919367,19.5626921 L24.0016764,19.7202958 C24.0016764,20.3830375 23.4979968,20.9281385 22.852549,20.9936873 L22.7216764,21.0002958 L5.27478822,21.0002958 C5.11608079,21.0002958 4.95875738,20.9707807 4.81084204,20.913256 C4.19316669,20.67304 3.86769517,20.0060343 4.04055137,19.3807182 L4.08182805,19.2563496 L5.498,15.612 L5.49875581,11.501244 C5.49875581,6.80613658 9.3048924,3 13.9999998,3 Z"
                          id="🎨-Color">

                        </path>
                      </g>
                    </g>
                  </g>
                </svg>

                <span v-if="unreadCount > 0"
                  class="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full text-xs text-white"> {{
                    unreadCount }}</span>
              </button>
              <div v-if="notificationDropdownOpen"
                class="absolute right-0  mt-13 sm:w-96 w-80 bg-white divide-y  divide-gray-100 rounded-md shadow-md drop-shadow-lg dark:bg-gray-700 z-0">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto no-scrollbar">

                  <li v-for="notification in notifications" :key="notification.notification_id" :class="{
                    'bg-yellow-100': !notification.is_read,
                    'bg-gray-100': notification.is_read,
                    'block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white': true
                  }" @click="getClickHandler(notification)" role="button" tabindex="0">
                    <img src="/images/logo-no-text.jpg"
                      class="w-11 h-11 rounded-full object-cover flex-shrink-0 ml-4 mr-8" alt="Profile Icon" />
                    From: {{ notification.sender_full_name }} - {{ notification.message }} - {{
                      formatDate(notification.created_at)
                    }}
                  </li>
                  <li v-if="notifications.length === 0">
                    <p class="block px-4 py-2 text-gray-500">No notifications</p>
                  </li>
                </ul>
                <!-- Fixed buttons for 'See All' and 'Mark All as Read' -->
                <div class="flex justify-between items-center px-4 py-2 border-t">
                  <NuxtLink :to="{ path: '/notification', query: { userType: userType } }"
                    class="flex items-center text-gray-700 hover:text-red-500">
                    <svg class="w-8 h-8 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span class="text-xs">See All</span>
                  </NuxtLink>
                  <button @click="markAllNotificationsAsRead"
                    class="flex items-center text-gray-700 hover:text-green-500">
                    <svg class="w-8 h-8 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-xs">Mark All As Read</span>
                  </button>
                </div>
              </div>

            </div>

            <!-- Profile Icon -->
            <div class="relative pr-8">
              <button @click="toggleProfileDropdown"
                class="flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
                aria-expanded="false">
                <img :src="userStore.userProfileImage" class="w-10 h-10 rounded-full object-cover" alt="Profile Icon" />
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
                      My Profile
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
      </nav>

      <!-- Content Section -->
      <div class="pt-16">
        <slot />
        <!-- Add Message Modal - Place it outside the dropdown -->
        <AddMessageModal v-if="addMessage" @closeAddMessageModal="addMessage = false" />
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from '@/stores/user-profile-image';
import { useNotificationStore } from '@/stores/notification-store';
import { useInboxStore } from '@/stores/inbox-store';
import AddMessageModal from "~/components/add-message-modal.vue";
import { useInboxSocketStore } from '@/stores/socketStore';
import { toast } from 'vue3-toastify';

const inboxDropdownOpen = ref(false);
const notificationDropdownOpen = ref(false);
const profileDropdownOpen = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const notificationsStore = useNotificationStore();
const inboxStore = useInboxStore();
const addMessage = ref(false);
const userType = ref("");
const userName = ref("");
const socketStore = useInboxSocketStore();
const notifications = computed(() => notificationsStore.notifications);
const unreadCount = computed(() => notificationsStore.unreadCount);
const isAuctioneerDashboard = ref(true);
const isActiveInbox = ref(false);
const isActiveNotification = ref(false);

const getClickHandler = async (notification) => {

  if (notification.message?.includes('marked your transaction as completed for auction')) {
    return;
  }
  else {
    viewAuction(notification);
  }
};






const toggleNotification = () => {
  isActiveNotification.value = !isActiveNotification.value;
};

const toggleInbox = () => {
  isActiveInbox.value = !isActiveInbox.value;
};

const handleClick = () => {
  toggleNotificationDropdown();
  isActiveInbox.value = false;
  toggleNotification();
};

const handleClickInbox = () => {
  toggleInboxDropdown();
  isActiveNotification.value = false;
  toggleInbox();
};

const updateRouteCheck = () => {
  isAuctioneerDashboard.value =
    route.path === "/auctioneer/auctioneerdashboard" ||
    route.path === "/auctioneer/auctioneer-manage-auction" ||
    route.path === "/auctioneer/auctioneerprofile";
};

watch(route, updateRouteCheck);

const toggleInboxDropdown = async () => {
  inboxDropdownOpen.value = !inboxDropdownOpen.value;
  profileDropdownOpen.value = false;
  notificationDropdownOpen.value = false;
};

const toggleNotificationDropdown = async () => {
  notificationDropdownOpen.value = !notificationDropdownOpen.value;
  profileDropdownOpen.value = false;
  inboxDropdownOpen.value = false;
};


const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
  notificationDropdownOpen.value = false;
  inboxDropdownOpen.value = false;
};

const markAllMessagesAsRead = () => {
  inboxStore.markAllAsRead()
}

const markAllNotificationsAsRead = () => {
  notificationsStore.markAllAsRead()
}

function viewProfile() {
  profileDropdownOpen.value = false;
  router.replace("/auctioneer/auctioneerprofile");
}

const viewAuction = async (notification) => {
  try {
    router.push({ path: '/auctioneer/auctioneer-manage-auction', query: { id: notification.auction_uuid } });
  } catch (error) {
    console.error("failed to view the auction:", error);
  }
};

const logout = async () => {
  try {
    await axios.post("/api/logout");

    localStorage.removeItem("user_profile_picture");

    // Disconnect the WebSocket
    socketStore.disconnectSocket();

    // Redirect to login page or homepage
    router.replace("/homepage");
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed. Please try again.");
  }
};

const handleIncomingMessage = (newMessage) => {
  console.log('Received message in inbox:', newMessage);
  inboxStore.messages.unshift(newMessage); // Update messages list
  inboxStore.unreadCount = newMessage.unreadCount;

  toast(`New message from ${newMessage.senderId}: ${newMessage.subject}`, {
    type: 'info',
    autoClose: 3000,
    position: 'top-right',
  });
};

const handleIncomingBidNotification = (newBidNotificationMessage) => {
  console.log('Received new notification message in BidderNavbar:', newBidNotificationMessage);
  notifications.unshift(newBidNotificationMessage.notification);

  // Update unread count if necessary
  unreadCount = newBidNotificationMessage.notification.unreadCount;

  // Display a toast notification
  toast(`From AuctionWave System: ${newBidNotificationMessage.notification.message}`, {
    type: 'info',
    autoClose: 3000,
    position: 'top-right',
  });
};

const handleIncomingOfferNotification = (newOfferNotificationMessage) => {
  console.log('Received new notification message in BidderNavbar:', newOfferNotificationMessage);
  notifications.unshift(newOfferNotificationMessage.notification);


  // Update unread count if necessary
  unreadCount = newOfferNotificationMessage.notification.unreadCount;

  // Display a toast notification
  toast(`From AuctionWave System: ${newOfferNotificationMessage.notification.message}`, {
    type: 'info',
    autoClose: 3000,
    position: 'top-right',
  });
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const getUserType = async () => {
  try {
    const { data } = await axios.post("/api/get-usertype");
    userType.value = data.userType;
    userName.value = data.userName;
  } catch (error) {
    console.error("Failed to get:", error);
    // handle error
  }
};

onMounted(async () => {
  updateRouteCheck();
  userStore.initializeProfileImage(); // Initialize from localStorage
  await Promise.all([notificationsStore.fetchNotifications(), inboxStore.fetchInbox(), getUserType()]);

  if (!socketStore.socket) {
    socketStore.connectSocket();
  }
  // Listen for incoming messages specifically for this user
  socketStore.socket.on('message-channel', handleIncomingMessage);
  socketStore.socket.on('bid-channel', handleIncomingBidNotification);
  socketStore.socket.on('offer-channel', handleIncomingOfferNotification);
});

onBeforeUnmount(() => {
  if (socketStore.socket) {
    socketStore.socket.off('message-channel', handleIncomingMessage);
    socketStore.socket.off('bid-channel', handleIncomingBidNotification);
    socketStore.socket.off('offer-channel', handleIncomingOfferNotification);
  }
  socketStore.disconnectSocket();
});
</script>

<style scoped>
.no-scrollbar {
  overflow-x: hidden;
  /* Prevent horizontal scrollbar */
}
</style>
