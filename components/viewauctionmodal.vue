<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4 border-b border-gray-400 pb-4">
        <h2 class="text-2xl font-semibold truncate">{{ auction.name }}</h2>
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
            <strong>Location:</strong> {{ auction.location }}
          </p>
          <p class="text-gray-600 mb-2 truncate">
            <strong>Starting Bid:</strong> {{ auction.starting_bid }}
          </p>
          <p class="text-gray-600 mb-2 truncate">
            <strong>Description:</strong> {{ auction.description }}
          </p>
          <p class="text-gray-600 mb-2 truncate">
            <strong>Rarity:</strong> {{ auction.rarity }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Categories:</strong>
            {{
              auction.categories
                ? auction.categories.join(", ")
                : "No categories"
            }}
          </p>
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
        <button class="bg-teal-500 border border-teal-500 rounded-full hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 text-gray-900 px-4 py-2 shadow-sm-light shadow-black"
          @click="joinAuction">
          {{ buttonLabel }}
        </button>
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

const currentUserId = ref(null);
const bidders = ref([]);

const closeModal = () => {
  emit('close');
};

const joinAuction = async () => {
  const auctionId = props.auction.uuid;

  try {
    const { data } = await axios.get('/api/check-bidder-participation', {
      params: { auctionId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    // If the user is a participant (has placed a bid), navigate to the bidding page
    if (data.isParticipant) {
      router.push({
        path: '/bidder/bidder-auction',
        query: { id: auctionId, userType: userRole.value },
      });
    } else {
      // Otherwise, join the auction and navigate
      await axios.post('/api/bidder-join-auction', { auctionId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      router.push({
        path: '/bidder/bidder-auction',
        query: { id: auctionId, userType: userRole.value },
      });
    }
  } catch (error) {
    console.error('Failed to join or continue bidding in auction:', error);
  }
};

const userRole = computed(() => {
  return localStorage.getItem('userType') || null;
});

const isCurrentUser = (bidderId) => {
  return bidderId === currentUserId.value;
};

const buttonLabel = computed(() => {
  return bidders.value.some(bidder => isCurrentUser(bidder.user_id)) ? 'Continue Bidding' : 'Join Auction';
});

const base64UrlDecode = (base64Url) => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

const getUserIdFromToken = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }
  const payload = base64UrlDecode(parts[1]);
  const decodedPayload = JSON.parse(payload);
  return decodedPayload.userId;
};

const fetchBidders = async () => {
  const listingId = props.auction.listing_id;
  if (listingId) {
    try {
      const { data } = await axios.get(`/api/fill-in-bidder-participants?id=${listingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      bidders.value = data.bidders;

      const token = localStorage.getItem('accessToken');
      if (token) {
        currentUserId.value = getUserIdFromToken(token);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    console.error('No listing ID available');
  }
};

onMounted(() => {
  fetchBidders();
});
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
