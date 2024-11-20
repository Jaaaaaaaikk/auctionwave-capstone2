<template>
    <!-- Dynamically load the navbar layout based on user type -->
    <NuxtLayout :name="navbarLayout">
        <h1 class="flex text-xl mb-10 m-5">Notifications</h1>
        <div class="bg-gray-100 mx-4 rounded-lg">
            <div class="flex-1 px-8 py-3">
                <div class="flex justify-end items center">
                    <div class="flex items-center space-x-3">
                        <NuxtLink to="/bidder/bidderdashboard" title="Archive"
                            class=" flex justify-between items-center pl-1 pr-1 text-gray-700 px-3 py-1 border  border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                            <span class="flex justify-center items-center ml-1">Back to dashboard</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="size-5 ml-2 flex items-center ">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                            </svg>
                        </NuxtLink>
                    </div>
                </div>
                <div class="h-10 flex items-center">
                    <div class="flex items-center">
                        <div class="relative flex items-center ml-3 space-x-0.5">
                            <!-- Checkbox for selecting all -->
                            <input @change="toggleCheckAll" type="checkbox" v-model="checkAll" class="focus:ring-0" />

                            <!-- Button to toggle dropdown -->
                            <button @click="toggleFilterMessages">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </button>

                            <!-- Dropdown menu -->
                            <div v-if="filterMessages"
                                class="bg-gray-200 shadow-2xl absolute left-0 top-6 w-32 py-2 text-gray-900 rounded z-10">
                                <button v-for="option in filterOptions" :key="option" @click="applyFilter(option)"
                                    class="w-full text-sm font-semibold py-1 hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-custom-bluegreen    ">
                                    {{ option }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <span class="bg-gray-300 h-6 w-[.5px] mx-2"></span>
                    <!--navbar icons svg outside of the message-->
                    <div class="flex items-center ml-2">
                        <div class="flex items-center space-x-2">
                            <button title="Mark As Read" @click="markAsReadNotificationUsingCheckbox"
                                class="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76">
                                    </path>
                                </svg>
                            </button>
                            <button title="Mark As Unread" @click="markAsUnreadNotificationUsingCheckbox"
                                class="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </button>
                            <button title="Delete" @click="deleteNotificationUsingCheckbox"
                                class="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ul>
                <li v-if="notifications.length === 0 && !isLoading" class="text-center">
                    <p>No notifications yet.</p>
                </li>

                <!-- Add Loading Spinner here -->
                <li v-if="isLoading" class="fixed inset-0 flex items-center justify-center z-50">

                    <!--Backdrop of Loading Spinner-->
                    <div class="absolute inset-0 bg-gray-900 bg-opacity-50"></div>

                    <div class="flex items-center space-x-4">
                        <svg class="animate-spin" width="80" height="80" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2592_7101)">
                                <path opacity="0.33" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12.6066 0.345176L12.1759 1.95287C11.9417 1.88993 11.7052 1.83929 11.4632 1.79612C11.2212 1.75296 10.9818 1.71873 10.7403 1.6968L10.892 0.0393588C11.1794 0.065229 11.4687 0.104137 11.7559 0.15535C12.043 0.206563 12.3279 0.270083 12.6066 0.345176Z"
                                    fill="#3758F9" />
                                <path opacity="0.38" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M15.0182 1.34671L14.1811 2.78881C13.7674 2.54571 13.3299 2.34072 12.8687 2.17381L13.44 0.60813C13.9926 0.808271 14.5193 1.05881 15.0182 1.34671Z"
                                    fill="#3758F9" />
                                <path opacity="0.42" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M17.0867 2.94304L15.904 4.1161C15.5633 3.77177 15.1915 3.45996 14.7933 3.17731L15.7554 1.81679C16.2325 2.15582 16.6776 2.53148 17.0867 2.94304Z"
                                    fill="#3758F9" />
                                <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M18.6682 5.01543L17.225 5.84575C16.9824 5.4258 16.7068 5.02535 16.3966 4.65259L17.6747 3.58543C18.0477 4.03288 18.3814 4.51141 18.6682 5.01543Z"
                                    fill="#3758F9" />
                                <path opacity="0.55" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M19.6684 7.42856L18.0557 7.85621C17.9323 7.38556 17.7642 6.92809 17.5622 6.49423L19.0718 5.79002C19.3166 6.31617 19.5152 6.86372 19.6684 7.42856Z"
                                    fill="#3758F9" />
                                <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M20.002 10.019L18.3354 10.0138C18.3382 9.52335 18.293 9.04126 18.2128 8.56561L19.8546 8.28284C19.953 8.84638 20.0053 9.43131 20.002 10.019Z"
                                    fill="#3758F9" />
                                <path opacity="0.65" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M19.8447 11.7559C19.7934 12.043 19.7299 12.328 19.6548 12.6066L18.0438 12.1711C18.106 11.941 18.1607 11.7053 18.2039 11.4633C18.247 11.2212 18.2779 10.977 18.2991 10.7396L19.9606 10.892C19.9355 11.1753 19.8966 11.4647 19.8447 11.7559Z"
                                    fill="#3758F9" />
                                <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M19.3926 13.436C19.1917 13.9927 18.9412 14.5194 18.6533 15.0182L17.2112 14.1812C17.4502 13.7667 17.66 13.3259 17.8269 12.8647L19.3926 13.436Z"
                                    fill="#3758F9" />
                                <path opacity="0.75" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M18.184 15.7514C17.8442 16.2325 17.4685 16.6776 17.0577 17.0826L15.8839 15.904C16.2241 15.5626 16.54 15.1915 16.8186 14.7926L18.184 15.7514Z"
                                    fill="#3758F9" />
                                <path opacity="0.8" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M16.4112 17.6699C15.9678 18.0437 15.4893 18.3774 14.9846 18.6682L14.1543 17.225C14.5742 16.9825 14.9713 16.702 15.344 16.3918L16.4112 17.6699Z"
                                    fill="#3758F9" />
                                <path opacity="0.95" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M14.21 19.0718C13.6838 19.3166 13.1363 19.5152 12.5721 19.6643L12.1397 18.055C12.6111 17.9275 13.0678 17.7635 13.5065 17.5581L14.21 19.0718Z"
                                    fill="#3758F9" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.7179 19.8505C11.1495 19.9523 10.5694 20.0012 9.98093 20.0021L9.98616 18.3354C10.4773 18.3341 10.9587 18.293 11.4303 18.2121L11.7179 19.8505Z"
                                    fill="#3758F9" />
                                <path opacity="0.05" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M9.10799 19.9606C8.82057 19.9347 8.53124 19.8958 8.24411 19.8446C7.95697 19.7934 7.67203 19.7299 7.39339 19.6548L7.82477 18.043C8.05902 18.1059 8.29474 18.1607 8.53675 18.2039C8.77877 18.247 9.01887 18.2771 9.26044 18.2991L9.10799 19.9606Z"
                                    fill="#3758F9" />
                                <path opacity="0.07" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.1312 17.8262L6.55991 19.3919C6.00803 19.1876 5.48061 18.9412 4.98248 18.6492L5.8188 17.2112C6.23328 17.4502 6.67074 17.6552 7.1312 17.8262Z"
                                    fill="#3758F9" />
                                <path opacity="0.09" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.20739 16.8186L4.24522 18.1791C3.76744 17.8442 3.32232 17.4685 2.91323 17.057L4.09664 15.8798C4.43731 16.2241 4.80917 16.5359 5.20739 16.8186Z"
                                    fill="#3758F9" />
                                <path opacity="0.11" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M3.60406 15.3433L2.32599 16.4105C1.95293 15.963 1.61927 15.4845 1.33248 14.9805L2.7757 14.1501C3.01823 14.5701 3.29386 14.9705 3.60406 15.3433Z"
                                    fill="#3758F9" />
                                <path opacity="0.13" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M2.43772 13.5058L0.928848 14.2059C0.683367 13.6838 0.484757 13.1363 0.332289 12.5673L1.94493 12.1397C2.06838 12.6103 2.2365 13.0678 2.43772 13.5058Z"
                                    fill="#3758F9" />
                                <path opacity="0.15" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M1.78797 11.4303L0.145415 11.7171C0.0477348 11.1495 -0.00526797 10.5687 -0.0012875 9.97685L1.66536 9.98208C1.66253 10.4725 1.70701 10.9587 1.78797 11.4303Z"
                                    fill="#3758F9" />
                                <path opacity="0.17" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M1.79609 8.53676C1.75293 8.77878 1.7228 9.01888 1.70161 9.25635L0.0393276 9.108C0.0651979 8.82058 0.104105 8.53125 0.155319 8.24411C0.206532 7.95698 0.270783 7.66794 0.345145 7.39339L1.95694 7.82478C1.89473 8.05493 1.83926 8.29475 1.79609 8.53676Z"
                                    fill="#3758F9" />
                                <path opacity="0.19" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M2.78952 5.81474C2.5498 6.23332 2.3407 6.67005 2.17379 7.13124L0.608112 6.55995C0.808254 6.00734 1.05953 5.47655 1.3467 4.98179L2.78952 5.81474Z"
                                    fill="#3758F9" />
                                <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M4.11613 4.09597C3.77663 4.43326 3.46072 4.80439 3.18218 5.20335L1.81682 4.24454C2.15585 3.7675 2.53151 3.32237 2.94307 2.91328L4.11613 4.09597Z"
                                    fill="#3758F9" />
                                <path opacity="0.25" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.84654 2.77086C5.4266 3.01339 5.02952 3.29386 4.65676 3.60406L3.58959 2.32599C4.03295 1.9522 4.51147 1.61853 5.01622 1.32764L5.84654 2.77086Z"
                                    fill="#3758F9" />
                                <path opacity="0.28" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.86098 1.94089C7.3896 2.06844 6.93287 2.23246 6.49417 2.43778L5.78996 0.928178C6.31611 0.683428 6.86366 0.484819 7.4285 0.331619L7.86098 1.94089Z"
                                    fill="#3758F9" />
                                <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M10.0138 1.66458C9.52332 1.66175 9.04195 1.70287 8.56968 1.78793L8.2828 0.145371C8.85044 0.0476906 9.43127 -0.00531221 10.019 -0.00206337L10.0138 1.66458Z"
                                    fill="#3758F9" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2592_7101">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span class="text-lg font-medium text-gray-700">PLEASE WAIT...</span>
                    </div>
                </li>
                <li v-else class="flex flex-col border-y hover:bg-gray-200 px-8 py-4"
                    v-for="(notification, index) in notifications" :key="notification.notification_id"
                    @mouseenter="setMessageHover(notification.notification_id, true)"
                    @mouseleave="setMessageHover(notification.notification_id, false)"
                    :class="{ 'bg-yellow-100': notification.is_read === 0, 'bg-white': notification.is_read === 1 }">
                    <div class="relative w-full item-center flex justify-between py-2 my-1 cursor-pointer ml-2 space-x-0.5"
                        @click="getClickHandler(notification)">
                        <div class="flex justify-between">
                            <div class="flex items-center mr-4 ml-1 space-x-2">
                                <!--checkbox for each message-->
                                <input @click.stop type="checkbox" v-model="selectedMessages"
                                    :value="notification.notification_id" class="focus:ring-0" />
                            </div>
                            <!-- Message Info -->
                            <img src="/images/logo-no-text.jpg"
                                class="w-11 h-11 rounded-full object-cover flex-shrink-0 ml-4 mr-8"
                                alt="Profile Icon" />
                            <span class="w-56 pr-2 truncate mr-72">From: {{ notification.sender_full_name }}</span>
                            <span class="w-96 text-gray-600 text-sm truncate">
                                - {{ notification.message }}
                            </span>
                        </div>

                        <div class="w-32 flex items-center justify-end">
                            <div v-if="hoverStates[notification.notification_id]" class="flex items-center space-x-2">
                                <button title="Mark As Read" @click.stop
                                    @click="markAsRead(notification.notification_id)"
                                    class="text-gray-500 hover:text-custom-bluegreen h-5 w-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76">
                                        </path>
                                    </svg>
                                </button>
                                <!-- Mark as Unread Button -->
                                <button title="Mark As Unread" @click.stop
                                    @click="markAsUnread(notification.notification_id)">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="text-gray-500 hover:text-custom-bluegreen h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                </button>
                                <!-- Delete Button -->
                                <button title="Delete" @click.stop
                                    @click="deleteNotification(notification.notification_id)">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="text-gray-500 hover:text-custom-bluegreen h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                            <span v-if="!hoverStates[notification.notification_id]" class="text-sm text-gray-500">
                                {{ formatDate(notification.created_at) }}
                            </span>
                        </div>
                    </div>
                    <ViewNotificationModalLowest v-if="viewNotificationLowest"
                        @closeAddMessageModal="viewNotificationLowest = false" :message="currentNotification.message"
                        :date="currentNotification.date" :sender="currentNotification.sender"
                        :listing_id="currentNotification.listing_id" />

                    <ViewNotificationModalOffer v-if="viewNotificationOffer"
                        @closeAddMessageModal="viewNotificationOffer = false" :message="currentNotification.message"
                        :date="currentNotification.date" :sender="currentNotification.sender"
                        :listing_id="currentNotification.listing_id" />

                    <BidderRatingModal v-if="bidderRatingModal" @closeRatingModal="bidderRatingModal = false"
                        :listing_id="passDataInRatingModal.listing_id"
                        :auctioneer_id="passDataInRatingModal.auctioneer_id" />
                </li>
            </ul>
            <!-- Pagination Controls -->
            <div v-if="pagination.totalPages > 1" class="flex justify-center space-x-2 py-4">
                <!-- Previous Page Button -->
                <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                    class="btn">Previous</button>
                <!-- Page Number Buttons -->
                <span v-for="page in pageNumbers" :key="page">
                    <button @click="changePage(page)" :class="{ 'bg-blue-500': page === pagination.page }" class="btn">
                        {{ page }}
                    </button>
                </span>
                <!-- Next Page Button -->
                <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
                    class="btn">Next</button>
            </div>
        </div>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useNotificationStore } from '@/stores/notification-store';
import ViewNotificationModalLowest from "~/components/view-notification-modal-lowest.vue";
import ViewNotificationModalOffer from "~/components/view-notification-modal-offer.vue";
import BidderRatingModal from "~/components/bidder-rating.vue";
import { toast } from 'vue3-toastify';

const bidderRatingModal = ref(false);
const viewNotificationLowest = ref(false);
const viewNotificationOffer = ref(false);
const router = useRouter();
const route = useRoute();
const userType = route.query.userType;
const navbarLayout = ref('');
const notificationsStore = useNotificationStore();
const isLoading = computed(() => notificationsStore.isLoading);
const notifications = computed(() => notificationsStore.notifications);
const pagination = computed(() => notificationsStore.pagination);
const checkAll = ref(false);
const selectedMessages = ref([]);
const filterMessages = ref(false);
const filterOptions = ref(["Unread", "Starred", "Important"]);
const hoverStates = ref({});
const currentNotification = ref({
    sender: '',
    date: '',
    message: ''
});

const passDataInRatingModal = ref({
    listing_id: null,
    auctioneer_id: null
});

const pageNumbers = computed(() => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
    }
    return pages;
});

// Change page for pagination
const changePage = (page) => {
    if (page < 1 || page > pagination.totalPages) return; // Prevent invalid pages
    notificationsStore.fetchNotifications(page);
};

const getClickHandler = async (notification) => {
    console.log('notification.message', notification.message);
    const isMessage = notification.message?.includes('Congratulations');
    if (isMessage) {
        currentNotification.value = {
            sender: notification.sender_full_name || "AuctionWave System",
            date: notification.created_at,
            message: notification.message,
            listing_id: notification.listing_id
        };
        if (notification.bidding_type === 'Lowest-type') {
            openNotificationModalLowest(notification);
        } else if (notification.bidding_type === 'Offer-type') {
            openNotificationModalOffer(notification);
        }
    } else if (notification.message?.includes('marked your transaction as completed for auction')) {
        passDataInRatingModal.value = {
            listing_id: notification.listing_id,
            auctioneer_id: notification.auctioneer_id
        };

        // Check if the auction is already rated before opening the rating modal
        const canRate = await checkIfAuctionRated(notification.listing_id, notification.auctioneer_id);

        if (canRate) {
            bidderRatingModal.value = true; // Open the rating modal if the auction hasn't been rated yet
        } else {
            // Optionally, show a message that the auction has already been rated
            toast.error('You have already rated this auction.');
            return;
        }
    }
    else {
        viewAuction(notification);
    }
};


const checkIfAuctionRated = async (listing_id, auctioneer_id) => {
    try {
        const response = await axios.post('/api/ratings/check-rating', {
            listing_id,
            auctioneer_id
        });

        if (response.status === 200) {
            return true; // Auction can be rated
        } else {
            return false; // Auction already rated
        }
    } catch (error) {
        console.error('Error checking auction rating:', error);
        return false; // Error occurred, assume the auction cannot be rated
    }
};


const openNotificationModalLowest = (notification) => {
    viewNotificationLowest.value = true;
};

const openNotificationModalOffer = (notification) => {
    viewNotificationOffer.value = true;
};

const viewAuction = async (notification) => {
    const auctionId = notification.auction_uuid;

    if (userType === 'Auctioneer') {
        // Redirect for auctioneer
        router.push({ path: '/auctioneer/auctioneer-manage-auction', query: { id: auctionId } });
        await notificationsStore.markAsRead(notification.notification_id);
    } else if (userType === 'Bidder') {
        try {
            // Mark notification as read immediately
            await notificationsStore.markAsRead(notification.notification_id);

            // Attempt to join the auction directly without checking participation
            await axios.post('/api/auctions/bidder-join-auction', { auctionId });

            // Navigate to the bidder auction page
            router.push({
                path: '/bidder/bidder-auction',
                query: { id: auctionId },
            });
        } catch (error) {
            console.error('Failed to join or continue bidding in auction:', error);
        }
    }
};


// Format date
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
};

// Toggle the "Select All" checkbox
const toggleCheckAll = () => {
    if (checkAll.value) {
        // Select all notifications
        selectedMessages.value = notificationsStore.notifications.map(notification => notification.notification_id);
    } else {
        // Clear selected messages
        selectedMessages.value = [];
    }
};

const markAsRead = async (notificationId) => {
    await notificationsStore.markAsRead(notificationId);
};

const markAsReadNotificationUsingCheckbox = async () => {
    for (const notificationId of selectedMessages.value) {
        await notificationsStore.markAsRead(notificationId);
    }
    selectedMessages.value = [];
};

const markAsUnread = async (notificationId) => {
    await notificationsStore.markAsUnread(notificationId);
};

const markAsUnreadNotificationUsingCheckbox = async () => {
    for (const notificationId of selectedMessages.value) {
        await notificationsStore.markAsUnread(notificationId);
    }
    selectedMessages.value = [];
};

const deleteNotification = (notificationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (confirmDelete) {
        notificationsStore.deleteNotification(notificationId);
    }
};

const deleteNotificationUsingCheckbox = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (confirmDelete) {
        for (const notificationId of selectedMessages.value) {
            await notificationsStore.deleteNotification(notificationId);
        }
        selectedMessages.value = [];
    }
};


const setMessageHover = (notificationId, isHovered) => {
    hoverStates.value[notificationId] = isHovered;
};

// Apply filter to notifications
const applyFilter = (filter) => {
    console.log(`Applying filter: ${filter}`);
};

// Toggle filter menu visibility
const toggleFilterMessages = () => {
    filterMessages.value = !filterMessages.value;
};

// Set navbar layout based on user type
onMounted(() => {
    if (userType === 'Bidder') {
        navbarLayout.value = 'biddernavbar';
    } else {
        navbarLayout.value = 'auctioneernavbar';
    }

    // Fetch notifications after setting the navbar layout
    notificationsStore.fetchNotifications(1);

    const intervalId = setInterval(() => {
        notificationsStore.fetchNotifications();
    }, 30000); // call the fetchNotification again every 30 seconds.

    onBeforeUnmount(() => {
        clearInterval(intervalId);
    });

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
