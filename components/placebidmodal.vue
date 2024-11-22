<template>
  <transition name="modal-fade">
    <div
      class="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
      <div class="relative w-full max-w-md px-4 h-full sm:h-auto md:h-auto sm:max-w-sm md:max-w-md lg:max-w-lg">
        <!-- Modal content -->
        <div class="bg-white rounded-lg shadow relative dark:bg-gray-700">
          <div class="flex justify-end p-2">
            <button type="button" @click="closeModal"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
              <svg class="w-5 h-5" fill="curren tColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div class="px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8 text-center">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-5">Place Bid</h3>
            <p class="text-gray-600 mb-5">Enter the lowest amount you're willing to bid. We will show you the current
              bidding range so you can stay ahead.</p>
            <p class="text-gray-600 mb-5">
              <span v-if="auctionStore.bidders.length === 0" class="font-bold">Your bid amount must be the starting
                bid.</span>
              <span v-else>
                Minimum Bid: <span class="font-bold">{{ auctionStore.minBid.toLocaleString() }}</span> |
                Maximum Bid: <span class="font-bold">{{ (auctionStore.maxBid - 1).toLocaleString() }}</span>
              </span>
            </p>

            <!-- Preset Amount Dropdown -->
            <div class="relative z-0 w-full mb-5 group">
              <label for="presetAmount" class="block text-sm font-medium text-gray-500 mb-1">Choose Preset
                Amount</label>
              <select v-model="selectedPresetAmount" id="presetAmount"
                class="block py-2 px-3 w-full text-sm bg-gray-100 border border-gray-300 rounded-md">
                <option value="" disabled>Select Amount</option>
                <option v-for="amount in presetAmounts" :key="amount" :value="amount">
                  {{ amount.toLocaleString() }}
                </option>
              </select>
            </div>

            <div class="relative z-0 w-full mb-5 group">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 dark:text-white">₱</span>
              <input v-model="formattedBidAmount" id="bidAmount" type="text" step="1" min="0"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-8 focus:ring-custom-bluegreen focus:border-custom-bluegreen dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="0" required @input="formatBidAmount" />
              <label for="bidAmount"
                class="peer-focus:font-medium pl-2 left-1 bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Amount
              </label>
            </div>

            <button @click="confirmBid"
              class="w-full text-white bg-custom-bluegreen hover:bg-green-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">submit</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import { useAuctionStore } from '@/stores/fetch-bidder-store';
import axios from "axios";
import { useInboxSocketStore } from '@/stores/socketStore';
import { toast } from 'vue3-toastify';

const auctionStore = useAuctionStore();
const emit = defineEmits();
const socketStore = useInboxSocketStore();

const props = defineProps({
  auctionUuid: {
    type: String, // Adjust the type as needed (e.g., Number if it's a number)
    required: true,
  },
  auctionStartingBid: {
    type: String,
    required: true,
  },
});

const bidAmount = ref(0);
const selectedPresetAmount = ref(""); // For the dropdown
const formattedBidAmount = ref("")

// Function to format bid amount with commas
const formatBidAmount = (event) => {
  let value = event.target.value.replace(/[^0-9.]/g, ''); // Remove any non-numeric characters
  if (value) {
    value = Number(value).toLocaleString(); // Format number with commas
  }
  formattedBidAmount.value = value;
};

// When preset amount is selected, format and set the bid amount
watch(selectedPresetAmount, (newVal) => {
  if (newVal) {
    const formattedValue = Number(newVal).toLocaleString(); // Format number with commas
    formattedBidAmount.value = formattedValue;
    bidAmount.value = newVal; // Store the raw number for processing
  }
});

const presetAmounts = computed(() => {
  const minBid = auctionStore.minBid;
  const maxBid = auctionStore.maxBid;

  // Calculate increment based on the bid range
  const range = maxBid - minBid;
  const increment = range > 200 ? 50 : range > 100 ? 20 : 10; // Adjust increments

  let amounts = [];
  for (let i = minBid; i < maxBid; i += increment) {
    amounts.push(i);
  }
  return amounts;
});


const confirmBid = () => {
  const rawBidAmount = formattedBidAmount.value.replace(/,/g, ''); // Remove commas
  const amount = parseFloat(rawBidAmount);
  const startingBid = props.auctionStartingBid;

  // Validate bid based on the number of existing bidders
  if (auctionStore.bidders.length > 0) {
    if (isNaN(amount) || amount < auctionStore.minBid || amount >= auctionStore.maxBid) {
      toast.warn(`Bid amount must be between ₱${auctionStore.minBid} and ₱${auctionStore.maxBid - 1}.`);
      return;
    }
  } else {
    if (isNaN(amount) || amount !== parseFloat(startingBid)) {
      toast.warn(`Bid amount must be the starting bid since there are no bidders yet.`);
      return;
    }
  }

  const confirmed = confirm(`Are you sure you want to place a bid of ${amount}?`);
  if (confirmed) {
    placeBid(amount);
  }
};


const placeBid = async (amount) => {
  try {
    const auctionId = props.auctionUuid

    if (!auctionId) {
      throw new Error("Auction ID is missing");
    }

    const response = await axios.post('/api/auctions/place-bid', { auctionId, bidAmount: amount });

    const bidAmount = response.data.bidAmount;
    const bidTime = response.data.bid_time;

    console.log('Formatted Bid Amount:', bidAmount); // Log bid amount
    console.log('Bid Time:', bidTime);

    // Emit the message to the server with the recipient's ID
    socketStore.socket.emit('bid-message', {
      recipientId: response.data.auctioneer_id,
      notification: {
        sender_full_name: response.data.bidder_name,
        listing_id: response.data.listing_id,
        message: response.data.message,
        bid_time: response.data.bid_time,
        unreadCount: response.data.unreadCount,
        bid_amount: response.data.bidAmount
      }
    });
    toast.success("Bid placed successfully!");
    closeModal();

  } catch (error) {
    // Extract message based on error source
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    console.error("Failed to place bid:", errorMessage);

    // Display toast with error message
    toast.error(`Failed to place bid: ${errorMessage}`);

  }
};

const closeModal = () => {
  emit('displayTheBid');
  emit('close')
}

</script>