<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-3xl overflow-hidden w-11/12 max-w-lg mx-auto">
      <header class="flex justify-between p-4 border-b">
        <h1 class="text-2xl font-bold ml-40">Auction Form</h1>
        <button type="button" @click="$emit('close')" class="text-gray-600 hover:text-gray-800">
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </header>
      <section class="p-4">
        <form @submit.prevent="createAuction">

          <!-- Name and Location -->
          <div class="flex gap-4 mb-5">
            <div class="flex-1 flex flex-col">
              <label for="name" class="text-sm font-medium mb-2">Name</label>
              <input v-model="auctionData.name" id="name" type="text" class="form-input" placeholder="Auction name"
                required />
            </div>
            <div class="flex-1 flex flex-col">
              <label for="location" class="text-sm font-medium mb-2">Location</label>
              <input v-model="auctionData.location" id="location" type="text" class="form-input" placeholder="Location"
                disabled />
            </div>
          </div>

          <!-- Description -->
          <div class="flex gap-4 mb-5">
            <div class="flex-1 flex flex-col">
              <label for="description" class="text-sm font-medium mb-2">Description</label>
              <textarea v-model="auctionData.description" id="description" rows="3" class="form-input"
                placeholder="Description"></textarea>
            </div>
          </div>

          <!-- Starting Bid and Bidding Type -->
          <div class="flex gap-4 mb-5">
            <div class="flex-1 flex flex-col">
              <label for="startingBid" class="text-sm font-medium mb-2">Starting Bid</label>
              <input v-model.number="auctionData.startingBid" id="startingBid" type="number" step="1" min="0"
                class="form-input" placeholder="Starting bid" required />
            </div>
            <div class="flex-1 flex flex-col">
              <label for="biddingType" class="text-sm font-medium mb-2">Bidding Type</label>
              <select v-model="auctionData.biddingType" id="biddingType" class="form-select" required>
                <option value="" disabled>Bidding Type</option>
                <option value="Lowest-type">Lowest-type</option>
                <option value="Offer-type">Offer-type</option>
              </select>
            </div>
          </div>

          <!-- Category and Rarity -->
          <div class="flex gap-4 mb-5">
            <div class="flex-1 flex flex-col">
              <label for="categoryId" class="text-sm font-medium mb-2">Category</label>
              <select v-model="selectedCategory" id="categoryId" class="form-select" @change="addCategory">
                <option value="" disabled>Select Category</option>
                <option v-for="(name, id) in categoryMap" :key="id" :value="id">
                  {{ name }}
                </option>
              </select>
              <div class="mt-2">
                <span v-for="categoryId in auctionData.categories" :key="categoryId"
                  class="inline-block px-3 py-1 mr-2 mb-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {{ categoryMap[categoryId] }}
                  <button type="button" @click="removeCategory(categoryId)" class="text-red-500 ml-1">x</button>
                </span>
              </div>
            </div>
            <div class="flex-1 flex flex-col">
              <label for="rarity" class="text-xs font-medium mb-2">(This is where cash bond depends)</label>
              <select v-model="auctionData.rarity" id="rarity" class="form-select">
                <option value="" disabled>Select Rarity</option>
                <option value="Common">Common (5%)</option>
                <option value="Uncommon">Uncommon (10%)</option>
                <option value="Rare">Rare (20%)</option>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end mb-5">
            <button type="submit"
              class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"></path>
              </svg>
              Submit Auction
            </button>
          </div>
        </form>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

// Define your form data as reactive properties
const auctionData = ref({
  name: '',
  location: '',
  description: '',
  startingBid: 0,
  biddingType: '',
  categories: [], // Stores selected category IDs
  rarity: ''
});

const emit = defineEmits();
const selectedCategory = ref('');
const categoryMap = ref({
  1: 'Art',
  2: 'Electronics',
  3: 'Collectibles',
  4: 'Furniture',
  5: 'Real Estate'
});
const errorMessage = ref('');
const router = useRouter();

const fetchLocation = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found in local storage');
      router.replace('/homepage'); // Redirect to login page if no token
      return;
    }

    const response = await axios.get('/api/fillinlocationfield', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    auctionData.value.location = response.data.auctioneerlocation.location;
  } catch (error) {
    console.error('Error fetching location:', error.response ? error.response.data : error.message);
    if (error.response?.status === 401) {
      router.replace('/homepage'); // Redirect to login page if token is invalid
    }
  }
};

const createAuction = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    toast.error('No access token found. Please log in first.');
    router.replace('/'); // Redirect to login page if no token
    return;
  }

  try {
    // Log the data being sent to the API for debugging
    console.log('Sending auction data:', {
      name: auctionData.value.name,
      location: auctionData.value.location,
      description: auctionData.value.description,
      starting_bid: auctionData.value.startingBid,
      bidding_type: auctionData.value.biddingType,
      rarity: auctionData.value.rarity,
      categories: auctionData.value.categories // Ensure this is an array of IDs
    });

    const response = await axios.post('/api/createauction', {
      name: auctionData.value.name,
      location: auctionData.value.location,
      description: auctionData.value.description,
      starting_bid: auctionData.value.startingBid,
      bidding_type: auctionData.value.biddingType,
      rarity: auctionData.value.rarity,
      categories: auctionData.value.categories // Send category IDs to the backend
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const responseData = response.data;
    if (responseData.status === 201) {
      toast.success(responseData.json.message); 
      emit('close');
    }
    else if (responseData.json && responseData.json.message) {
      toast.error(responseData.json.message); 
    }

  } catch (error) {
    console.error('Error creating auction:', error); // Log the error for debugging
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
  }
};
const addCategory = () => {
  if (selectedCategory.value && !auctionData.value.categories.includes(selectedCategory.value)) {
    auctionData.value.categories.push(selectedCategory.value); // Add category ID
    selectedCategory.value = ''; // Reset selection
  }
};

const removeCategory = (categoryId) => {
  auctionData.value.categories = auctionData.value.categories.filter(id => id !== categoryId);
};

onMounted(() => {
  fetchLocation();
});
</script>

<style scoped>
.form-input {
  @apply border rounded-lg p-2 w-full;
}

.form-select {
  @apply border rounded-lg p-2 w-full;
}
</style>





<!-- Image Upload and Name -->
<!-- <div class="flex flex-col items-center mb-5">
            Image Upload
            <div class="flex flex-col items-center mb-4">
              <img v-if="imagePreview" :src="imagePreview" alt="Image preview"
                class="mt-2 max-w-[150px] max-h-[150px] rounded-3xl" />
              <input type="file" id="image" @change="handleImageUpload" class="rounded-3xl mt-10" />
            </div>
          </div> -->



<!-- @click="openEmailBlastModal" -->
<!-- <EmailBlast_Modal v-if="email_Blast_Modal" @close="email_Blast_Modal = false" :auctionData="auctionData" /> -->

<!-- 
// Function to handle image upload and preview
// const handleImageUpload = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       imagePreview.value = e.target.result;
//       image.value = file;
//     };
//     reader.readAsDataURL(file);
//   }
// }; -->
