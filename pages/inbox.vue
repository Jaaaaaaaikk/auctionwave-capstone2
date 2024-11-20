<template>
  <NuxtLayout :name="navbarLayout">
    <div class="min-h-screen w-full bg-custom-white-green shadow-xl rounded-lg flex overflow-x-auto">
      <!-- Sidebar -->
      <div :class="[
        'min-h-screen bg-white px-1 py-2 transition-transform duration-300',
        showSidebar || isDesktop ? 'w-64' : 'w-16',
        'lg:w-64'
      ]">
        <!-- Sidebar Header with Toggle Button -->
        <div class="h-16 flex items-center justify-between px-2">
          <!-- Toggle button visible only on mobile/tablet -->
          <button v-if="!isDesktop" @click="showSidebar = !showSidebar"
            class="bg-custom-bluegreen hover:bg-custom-bluegreen hover:bg-opacity-80 text-gray-100 p-2 rounded-full transition duration-150">
            <!-- Sidebar Toggle Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" :class="showSidebar ? 'rotate-180' : ''"
              class="h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <!-- Back to Dashboard Button always visible on larger screens -->
          <button v-if="showSidebar || isDesktop" @click="$router.push('/bidder/bidderdashboard')"
            class="flex items-center text-gray-800 py-2 px-4 w-full rounded transition duration-150 hover:underline">
            <!-- SVG Icon -->
            <svg class="w-8 h-8 mr-1 hover:underline" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M9.66088 8.53078C9.95402 8.23813 9.95442 7.76326 9.66178 7.47012C9.36913 7.17698 8.89426 7.17658 8.60112 7.46922L9.66088 8.53078ZM4.47012 11.5932C4.17698 11.8859 4.17658 12.3607 4.46922 12.6539C4.76187 12.947 5.23674 12.9474 5.52988 12.6548L4.47012 11.5932ZM5.51318 11.5771C5.21111 11.2936 4.73648 11.3088 4.45306 11.6108C4.16964 11.9129 4.18475 12.3875 4.48682 12.6709L5.51318 11.5771ZM8.61782 16.5469C8.91989 16.8304 9.39452 16.8152 9.67794 16.5132C9.96136 16.2111 9.94625 15.7365 9.64418 15.4531L8.61782 16.5469ZM5 11.374C4.58579 11.374 4.25 11.7098 4.25 12.124C4.25 12.5382 4.58579 12.874 5 12.874V11.374ZM15.37 12.124V12.874L15.3723 12.874L15.37 12.124ZM17.9326 13.1766L18.4614 12.6447V12.6447L17.9326 13.1766ZM18.25 15.7351C18.2511 16.1493 18.5879 16.4841 19.0021 16.483C19.4163 16.4819 19.7511 16.1451 19.75 15.7309L18.25 15.7351ZM8.60112 7.46922L4.47012 11.5932L5.52988 12.6548L9.66088 8.53078L8.60112 7.46922ZM4.48682 12.6709L8.61782 16.5469L9.64418 15.4531L5.51318 11.5771L4.48682 12.6709ZM5 12.874H15.37V11.374H5V12.874ZM15.3723 12.874C16.1333 12.8717 16.8641 13.1718 17.4038 13.7084L18.4614 12.6447C17.6395 11.8276 16.5267 11.3705 15.3677 11.374L15.3723 12.874ZM17.4038 13.7084C17.9435 14.245 18.2479 14.974 18.25 15.7351L19.75 15.7309C19.7468 14.572 19.2833 13.4618 18.4614 12.6447L17.4038 13.7084Z"
                  fill="#000000"></path>
              </g>
            </svg>
            <!-- Button Text -->
            <span>Back to Dashboard</span>
          </button>
        </div>

        <!-- Compose Button -->
        <div v-if="showSidebar || isDesktop" class="h-16 flex items-center">
          <button @click="addMessage = true"
            class="w-48 mx-auto bg-custom-bluegreen hover:bg-opacity-80 text-gray-100 py-2 rounded transition duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Compose</span>
          </button>
          <AddMessageModal v-if="addMessage" @closeAddMessageModal="addMessage = false" />
        </div>

        <!-- Tabs List -->
        <div v-if="showSidebar || isDesktop" class="px-2 pt-2 pb-8 border-r border-gray-300">
          <ul class="space-y-2">
            <!-- Inbox Tab -->
            <li>
              <button @click="activeTab = 'inbox'"
                :class="{ 'bg-custom-bluegreen bg-opacity-25 text-custom-bluegreen': activeTab === 'inbox' }"
                class="hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-custom-bluegreen flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>Inbox</span>
                <!-- Only show unread count if there are messages -->
                <span v-if="inboxStore.messages.length > 0 && unreadCount > 0"
                  class="bg-custom-bluegreen bg-opacity-80 text-gray-100 font-bold px-2 py-0.5 text-xs rounded-lg">
                  {{ unreadCount }}
                </span>
              </button>
            </li>

            <!-- Sent Tab -->
            <li>
              <button @click="activeTab = 'sent'"
                :class="{ 'bg-custom-bluegreen bg-opacity-25 text-custom-bluegreen': activeTab === 'sent' }"
                class="hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-custom-bluegreen flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Sent</span>
              </button>
            </li>

            <!-- Spam Tab -->
            <li>
              <button @click="activeTab = 'spam'"
                :class="{ 'bg-custom-bluegreen bg-opacity-25 text-custom-bluegreen': activeTab === 'spam' }"
                class="hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-custom-bluegreen flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Spam</span>
              </button>
            </li>

            <!-- Trash Tab -->
            <li>
              <button @click="activeTab = 'trash'"
                :class="{ 'bg-custom-bluegreen bg-opacity-25 text-custom-bluegreen': activeTab === 'trash' }"
                class="hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-custom-bluegreen flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Trash</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <InboxTab v-show="activeTab === 'inbox'" />
        <SentTab v-show="activeTab === 'sent'" />
        <SpamTab v-show="activeTab === 'spam'" />
        <TrashTab v-show="activeTab === 'trash'" />
      </div>

    </div>
  </NuxtLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AddMessageModal from "~/components/add-message-modal.vue";
import InboxTab from '~/components/MessageTabs/InboxTab.vue';
import SentTab from '~/components/MessageTabs/SentTab.vue';
import SpamTab from '~/components/MessageTabs/SpamTab.vue';
import TrashTab from '~/components/MessageTabs/TrashTab.vue';
import { useInboxStore } from '@/stores/inbox-store';

const inboxStore = useInboxStore();
const addMessage = ref(false);
const activeTab = ref('inbox');
const router = useRouter();
const route = useRoute();
const userType = route.query.userType;
const navbarLayout = ref('');
const showSidebar = ref(false);
const isDesktop = ref(false);
const unreadCount = computed(() => inboxStore.unreadCount);

// Set navbar layout based on user type
onMounted(() => {
  if (userType === 'Bidder') {
    navbarLayout.value = 'biddernavbar';
  } else {
    navbarLayout.value = 'auctioneernavbar';
  }
  if (process.client) {
    isDesktop.value = window.innerWidth >= 1024
    window.addEventListener('resize', () => {
      isDesktop.value = window.innerWidth >= 1024
    })
  }
});

</script>

<style scoped>
.container {
  max-width: 800px;
}

/* Table Row Background Colors */
.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-yellow-100 {
  background-color: #fef3c7;
  /* Highlight color for unread notifications */
}

/* Styling for table */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  /* Add border for table readability */
}

thead {
  background-color: #f1f1f1;
}

/* Action Buttons Style */
.btn-action {
  background-color: #f1f5f9;
  border: 2px solid #1c1c1e;
  border-radius: 0.375rem;
  /* Rounded border */
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
}

.btn-action:hover {
  background-color: #e5e7eb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Hover shadow */
}

.tooltip {
  position: relative;
  display: inline-block;
  text-align: center;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 100px;
  background-color: darkslategray;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -50px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
