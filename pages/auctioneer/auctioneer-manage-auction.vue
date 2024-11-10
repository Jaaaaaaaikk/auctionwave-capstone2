<template>
  <NuxtLayout name="auctioneernavbar">
    <NuxtLayout name="auctioneersidebar"></NuxtLayout>
    <div class="bg-white py-6 my-4 sm:py-8 lg:py-12 w-3/5 mx-auto rounded-md">
      <div class="mx-auto max-w-screen-lg px-4 md:px-8">
        <!-- Breadcrumb -->
        <nav class="flex  pb-16 text-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
              <NuxtLink to="/auctioneer/auctioneerdashboard"
                class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Dashboard
              </NuxtLink>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 9 4-4-4-4" />
                </svg>
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{{ auction.name
                  }}</span>
              </div>
            </li>
          </ol>
        </nav>
        <div class="mb-2 md:mb-3">
          <h2 class="text-2xl font-semibold text-gray-800 lg:text-3xl">{{ auction.name }}</h2>
        </div>


        <div class="grid gap-8 md:grid-cols-3">
          <!-- images - start -->
          <div class="space-y-4 w-full col-span-2">
            <div class="relative overflow-hidden rounded-lg bg-gray-100 border">
              <img v-if="auction.image_url" :src="auction.image_url" loading="lazy" alt="Auction Image Preview"
                class="h-full w-full object-cover object-center" />
              <img v-else src="public/images/no-image.jpg" alt="No Image Available"
                class="h-full w-full object-cover object-center" />
            </div>
            <div class="mt-10 md:mt-16 lg:mt-20">

              <div class="mb-3 text-lg font-semibold text-gray-800">Item Details</div>
              <p v-if="!auction.item_details" class="text-gray-500">No Item Details Provided.</p>
              <p class="mb-3 text-lg  text-gray-500">{{ auction.item_details }}</p>

              <div class="mb-3 text-lg font-semibold text-gray-800">Item Description</div>
              <p v-if="!auction.description" class="text-gray-500">No Description Provided.</p>
              <p class="text-gray-500">


                {{ auction.description }}<br /><br />
              </p>
            </div>


          </div>
          <div class="">
            <div class=" items-center mb-4">
              <!-- <a href="#" class=" text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">47 participants</a> -->
              <p class="font-semibold text-lg">Bidding Type</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ auction.bidding_type }}</p>
              </div>
            </div>
            <div v-if="auction.bidding_type === 'Lowest-type'" class=" items-center mb-4">

              <p class="font-semibold text-lg">Starting Bid</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">₱{{ auction.starting_bid }}</p>
              </div>
            </div>
            <div class=" items-center mb-4">

              <p class="font-semibold text-lg">Location</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ auction.location }}</p>
              </div>
            </div>
            <div class=" items-center mb-4">

              <p class="font-semibold text-lg">Rarity</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ auction.rarity }}</p>
              </div>
            </div>
            <div class=" items-center mb-4">

              <p class="font-semibold text-lg">Status</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ auction.status }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-2.5 my-7">
          <button @click="confirmEmailBlast" :disabled="isEmailBlastSent"
            class="inline-block flex-1 rounded-lg bg-custom-bluegreen px-8 py-3 text-center text-sm font-semibold text-white outline-none  transition duration-100 hover:bg-green-500 focus-visible:ring  sm:flex-none md:text-base"
            :class="{ 'opacity-50 cursor-not-allowed': isEmailBlastSent }">
            {{ isEmailBlastSent ? "Email Blast Sent Already" : "Email Blast" }}
          </button>

          <a href="#"
            class="inline-block rounded-lg bg-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M14.4443 5.68747L5.44587 14.6859C4.78722 15.3446 4.26719 16.1441 4.10888 17.062C3.94903 17.9888 3.89583 19.139 4.44432 19.6875C4.99281 20.236 6.14299 20.1828 7.0698 20.0229C7.98772 19.8646 8.78722 19.3446 9.44587 18.6859L18.4443 9.68747M14.4443 5.68747C14.4443 5.68747 17.4443 2.68747 19.4443 4.68747C21.4443 6.68747 18.4443 9.68747 18.4443 9.68747M14.4443 5.68747L18.4443 9.68747"
                  stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </g>
            </svg>
          </a>
        </div>
      </div>

    </div>
    <div v-if="auction.bidding_type === 'Lowest-type'"
      class="bg-white py-6sm:py-8 lg:py-12 w-3/5 mx-auto rounded-md mb-44 ">
      <div class="mx-auto max-w-screen-lg px-4 md:px-8 pb-4">
        <h1 class="text-3xl font-semibold mb-2">Bidders Participated</h1>
      </div>
      <div v-if="bidders.length === 0" class="text-gray-500 mb-2 text-center">
        No participated bidders yet.
      </div>
      <div v-else v-for="bidder in bidders" :key="bidder.user_id"
        class="flex flex-wrap items-center border-b gap-y-4 py-5   border-gray-300 px-6 mx-auto w-5/6 lg md:px-8 border">
        <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Bidder Name:</dt>
          <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
            <a href="#" class="hover:underline">{{ bidder.bidder_name }}</a>
          </dd>
        </dl>
        <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Current Bid:</dt>
          <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
            <a href="#" class="hover:underline">₱{{ bidder.bid_amount }}</a>
          </dd>
        </dl>
      </div>
    </div>
    <div v-if="auction.bidding_type === 'Offer-type'"
      class="bg-white py-6sm:py-8 lg:py-12 w-3/5 mx-auto rounded-md mb-44 ">
      <!-- Comment Section -->
      <section class="w-full rounded-lg p-4 mt-8">
        <h3 class="font-os text-lg font-bold">Recent Offers</h3>

        <!-- Offer Block 1 -->
        <div v-for="offer in topComments.slice(0, offersToShow)" :key="offer.offer_id" class="flex mt-4">
          <!-- User's Profile Image -->
          <div class="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center">
            <img class="h-12 w-12 rounded-full object-cover"
              :src="offer.userImageUrl || '/images/default-profile-image.png'" alt="User Image" />
          </div>

          <!-- Comment Details -->
          <div class="ml-3">
            <div class="font-medium text-gray-900">{{ offer.full_name }}</div>
            <div class="text-gray-600 text-sm">Posted on {{ formatDate(offer.offer_time) }}</div>
            <div class="mt-2 text-gray-900 max-w-xs break-words">{{ offer.comment }}
            </div>
          </div>

          <!-- Uploaded Images (Sample Images) -->
          <div v-if="offer.commentImages && offer.commentImages.length > 0" class="m-2 flex space-x-2">
            <div class="w-16 h-16">
              <img v-for="(image, idx) in offer.commentImages" :key="idx" :src="image" @click="openImageModal(image)"
                alt="Offer Images" class="w-full h-full object-cover rounded cursor-pointer" />
            </div>
          </div>

          <!-- Status Section -->
          <div class="ml-auto flex flex-col justify-between items-end">
            <div class="bg-gray-200 text-center text-gray-800 py-1 px-3 rounded-lg text-sm">
              <strong>Actions</strong>

              <!-- Discard Offer Button -->
              <div @click="updateOfferStatus(offer.offer_id, 'Discard Offer')"
                class="flex items-center justify-center px-2 py-1 rounded bg-red-500 hover:bg-red-700 text-white space-x-1 cursor-pointer">
                <!-- Trash Icon for Discard -->
                <svg class="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M3 6h18M9 6V4h6v2M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6H6z" stroke="#ffffff" stroke-width="2" />
                </svg>
                <span class="text-sm">Discard Offer</span>
              </div>

              <!-- Accept Offer Button -->
              <div @click="updateOfferStatus(offer.offer_id, 'Accept Offer')"
                class="flex items-center justify-center px-2 py-1 rounded bg-green-500 hover:bg-green-700 text-white space-x-1 cursor-pointer mt-2">
                <!-- Checkmark Icon for Accept -->
                <svg class="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span class="text-sm">Accept Offer</span>
              </div>

              <!-- Provide More Button -->
              <div @click="updateOfferStatus(offer.offer_id, 'Provide More')"
                class="flex items-center justify-center px-2 py-1 rounded bg-blue-500 hover:bg-blue-700 text-white space-x-1 cursor-pointer mt-2">
                <!-- Plus Icon for Provide More -->
                <svg class="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 4v16M4 12h16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span class="text-sm">Provide More</span>
              </div>
            </div>

          </div>
          <!-- Status Section -->
          <div class="ml-4 flex flex-col justify-between items-end">
            <div class="bg-gray-200 text-center text-gray-800 py-1 px-3 rounded-lg text-sm">
              <strong>Status</strong>

              <!-- Review Status -->
              <p :class="{
                'bg-yellow-200 text-yellow-800': offer.review_status === 'Offer Pending',
                'bg-green-200 text-green-800': offer.review_status === 'Accepted Offer',
                'bg-red-200 text-red-800': offer.review_status === 'Offer Discarded',
                'bg-purple-200 text-purple-800': offer.review_status === 'Provide More'
              }" class="mt-2 text-sm py-1 px-3 rounded-lg">
                {{ offer.review_status }}
              </p>
            </div>

          </div>
        </div>
        <!-- Horizontal Separator -->
        <hr class="my-8 border-gray-300" />

        <!-- See More Button -->
        <div v-if="offersToShow < topComments.length" class="text-center mt-4">
          <button @click="loadMoreOffers" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            See More
          </button>
        </div>

        <!-- Modal to display the clicked image -->
        <div v-if="isPictureViewModalOpen" @click="closeModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div class="relative">
            <img :src="modalImageSrc" alt="Large View" class="max-w-4xl max-h-[70vh] object-contain" />
            <!-- Close button -->
            <button @click="closeModal"
              class="absolute top-0 right-0 bg-gray-900 text-white rounded-full p-2 cursor-pointer">
              x
            </button>
          </div>
        </div>
      </section>
    </div>


  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { toast } from "vue3-toastify";
import { useInboxSocketStore } from '@/stores/socketStore';

const route = useRoute();
const auction = ref({});
const isEmailBlastSent = ref(false);
const bidders = ref([]);
const topComments = ref([]);
const socketStore = useInboxSocketStore();
const offersToShow = ref(3);
const isPictureViewModalOpen = ref(false);
const modalImageSrc = ref('');

// Function to load more offers
const loadMoreOffers = () => {
  offersToShow.value += 3; // Show 3 more offers when the button is clicked
};

const updateOfferStatus = async (offerId, action) => {
  try {
    await axios.post('/api/auctions/change-offer-status', { offerId, action });
    toast.success(`Offer status updated to "${action}"`);
    fetchAuctionDetails();
  } catch (error) {
    console.error("Failed to update offer status:", error);
    toast.error("Failed to update offer status.");
  }
};

const fetchAuctionDetails = async () => {
  try {
    const { data } = await axios.get(`/api/auctions/${route.query.id}`);
    console.log(data);
    auction.value = data;

    fetchBidders(auction.value.id);

    if (data.email_blast_sent === 1) {
      isEmailBlastSent.value = true;
    }
  } catch (error) {
    console.error("Failed to fetch auction details:", error);
  }
};

const fetchBidders = async (listingId) => {
  console.log('auction.listing_id', listingId);
  if (listingId && auction.value.bidding_type === 'Lowest-type') { // Corrected access here
    try {
      const { data } = await axios.get(`/api/auctions/fill-in-bidder-participants?id=${listingId}`);
      bidders.value = data.bidders;
      console.log('fetch bidder in bidder-auction', data);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else if (listingId && auction.value.bidding_type === 'Offer-type') { // Corrected access here
    try {
      const { data } = await axios.get(`/api/auctions/fill-in-offer-participants?id=${listingId}`);
      topComments.value = data.offers; // Store the fetched top comments

      console.log('fetch Top comments in bidder-auction', topComments.value);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    console.error('No listing ID available');
  }
};

const confirmEmailBlast = () => {
  if (window.confirm("Are you sure you want to send an email blast to all related bidders?")) {
    sendEmailBlast();
  }
};

const sendEmailBlast = async () => {
  try {
    const emailBlastResponse = await axios.post('/api/notifications/email-blast', { auctionUuid: route.query.id });

    const notificationDetails = emailBlastResponse.data.results;

    // Emit notifications for each bidder
    notificationDetails.forEach(notification => {
      socketStore.socket.emit('notification-message', {
        recipientId: notification.bidderId,
        notification: {
          location: notification.notificationDetails.location_id,
          sender_full_name: notification.notificationDetails.sender_full_name,
          auction_name: notification.notificationDetails.auction_name,
          listing_id: notification.notificationDetails.listing_id,
          message: notification.notificationDetails.message,
          is_read: notification.notificationDetails.is_read,
          created_at: notification.notificationDetails.created_at,
          unreadCount: notification.unreadCount
        }
      });
    });

    console.log(emailBlastResponse);
    toast.success("Email blast sent successfully!");
    isEmailBlastSent.value = true;
  } catch (error) {
    console.error("Failed to send email blast:", error);
    toast.error("Failed to send email blast.");
  }
};

// Function to open the modal with the clicked image's source
const openImageModal = (imageSrc) => {
  modalImageSrc.value = imageSrc;
  isPictureViewModalOpen.value = true;
};

// Function to close the modal
const closeModal = () => {
  isPictureViewModalOpen.value = false;
  modalImageSrc.value = '';  // Reset the modal image source
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true // 12-hour format with AM/PM
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const handleIncomingBidNotification = (newBidNotificationMessage) => {
  console.log('Received new notification message in BidderNavbar:', newBidNotificationMessage);
  bidders.value.unshift(newBidNotificationMessage.notification);
};

onMounted(() => {
  fetchAuctionDetails();

  if (!socketStore.socket) {
    socketStore.connectSocket();
  }
  socketStore.socket.on('bid-channel', handleIncomingBidNotification);
});

</script>

<style scoped>
/* Optional: add some styling for the disabled button */
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>