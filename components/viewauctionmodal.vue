<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4 border-b border-gray-400 pb-4">
        <h2 class="text-2xl font-semibold truncate">{{ auction?.name || 'N/A' }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex flex-wrap">
        <!-- Sidebar -->
        <div class="w-full sm:w-1/3 pr-4 border-r border-gray-400 ml-5 mb-4 sm:mb-0">
          <h3 class="text-gray-600 mb-2">
            <strong>Bidding Type:</strong> {{ auction.bidding_type }}
          </h3>
          <p class="text-gray-600 mb-2 truncate">
            <strong>Location:</strong> {{ auction?.location || 'Not specified Location' }}
          </p>
          <p class="text-gray-600 mb-2 truncate">
            <strong>Starting Bid:</strong> {{ auction.starting_bid || 'N/A' }}
          </p>
          <p class="text-gray-600 mb-2 truncate">
            <strong>Description:</strong> {{ auction?.description || 'No description' }}
          </p>
          <p class="text-gray-600 mb-2 truncate">
            <strong>Rarity:</strong> {{ auction.rarity || 'No Rarity' }}
          </p>
          <div class="mb-2">
            <strong>Categories:</strong>
            <div class="flex flex-wrap mt-2">
              <span v-if="auction.categories.length === 0" class="text-gray-500">No categories</span>
              <span v-for="(category, index) in auction.categories" :key="index"
                class="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">
                {{ category }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bidders Section -->
        <div class="w-full sm:w-1/2 pl-6 mt-4">
          <h3 class="flex text-xl text-center font-semibold mb-4">Participated Bidders</h3>
          <div v-for="bidder in bidders" :key="bidder.user_id" class="mb-2">
            <span>{{ bidder.firstname }} {{ bidder.lastname }}
              <span v-if="isCurrentUser(bidder.user_id)" class="text-teal-500 pr-10">(YOU)</span>
            </span>
          </div>
        </div>

      </div>

      <div class="modal-footer mt-4 font-semibold">
        <button
          class="bg-teal-500 border border-teal-500 rounded-full hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 text-gray-900 px-4 py-2 shadow-sm-light shadow-black"
          @click="joinAuction">
          {{ buttonLabel }}
        </button>
        <div class="flex items-center space-x-2 mb-2 justify-end">
          <!-- Image Icon with Viewers Count -->
          <img src="/images/viewers-count-image.png" alt="Viewers Count" class="w-5 h-5 text-gray-600" />
          <p class="text-gray-600">{{ viewersCount || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const props = defineProps({
  auction: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'joinAuction', 'manageAuction']);
const router = useRouter();
const userRole = ref('');
const currentUserId = ref(null);
const bidders = ref([]);
const viewersCount = ref({});


const closeModal = () => {
  emit('close');
};

const joinAuction = async () => {
  const auctionId = props.auction.uuid;

  try {
    const { data } = await axios.get('/api/check-bidder-participation', { params: { auctionId } });
    userRole.value = data.userType;
    // If the user is a participant (has placed a bid), navigate to the bidding page
    if (data.isParticipant) {
      router.push({
        path: '/bidder/bidder-auction',
        query: { id: auctionId, userType: userRole.value },
      });
    } else {
      // Otherwise, join the auction and navigate
      await axios.post('/api/bidder-join-auction', { auctionId });
      router.push({
        path: '/bidder/bidder-auction',
        query: { id: auctionId, userType: userRole.value },
      });
    }
  } catch (error) {
    console.error('Failed to join or continue bidding in auction:', error);
  }
};

const fetchViewersCount = async () => {
  const listingId = props.auction.listing_id;
  if (listingId) {
    try {
      const { data } = await axios.get(`/api/get-viewer-count`, { params: { listing_id: listingId } });
      viewersCount.value = data.viewer_count;
    } catch (error) {
      console.error("Failed to fetch viewers count:", error);
    }
  }
};

const isCurrentUser = (bidderId) => {
  return bidderId === currentUserId.value;
};

const buttonLabel = computed(() => {
  return bidders.value.some(bidder => isCurrentUser(bidder.user_id)) ? 'Continue Bidding' : 'Join Auction';
});

const fetchBidders = async () => {
  const listingId = props.auction.listing_id;
  if (listingId) {
    try {
      const { data } = await axios.get(`/api/fill-in-bidder-participants?id=${listingId}`);
      bidders.value = data.bidders;

      currentUserId.value = data.currentUserId;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    console.error('No listing ID available');
  }
};

onMounted(() => {
  fetchBidders();
  fetchViewersCount();
});
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Category tag styling */
.bg-tag {
  background-color: #e2e8f0;
  /* Tailwind gray-200 */
  color: #4a5568;
  /* Tailwind gray-700 */
  border-radius: 9999px;
  /* Full rounding */
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
