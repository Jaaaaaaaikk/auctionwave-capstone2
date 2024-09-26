<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-3xl overflow-hidden w-11/12 max-w-4xl mx-auto">
      <header class="flex justify-between p-4 border-b">
        <h1 class="text-2xl font-bold">Auction Form</h1>
        <button type="button" @click="$emit('close')" class="text-gray-600 hover:text-gray-800">
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </header>

      <section class="p-4">
        <form @submit.prevent="createAuction" class="flex gap-4">
          <!-- Left Section - Auction Details -->
          <div class="w-1/2 flex flex-col gap-5">
            <!-- Name and Location -->
            <div class="flex gap-4">
              <div class="flex-1 flex flex-col">
                <label for="name" class="text-sm font-medium mb-2">Name</label>
                <input v-model="auctionData.name" id="name" type="text" class="form-input" placeholder="Auction name"
                  required />
              </div>
              <div class="flex-1 flex flex-col">
                <label for="location" class="text-sm font-medium mb-2">Location</label>
                <input v-model="auctionData.location_name" id="location" type="text" class="form-input"
                  placeholder="Location" disabled />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="text-sm font-medium mb-2">Description</label>
              <textarea v-model="auctionData.description" id="description" rows="3" class="form-input"
                placeholder="Description"></textarea>
            </div>

            <!-- Starting Bid and Bidding Type -->
            <div class="flex gap-4">
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
            <div class="flex gap-4">
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
                <label for="rarity" class="text-sm font-medium mb-2">Rarity</label>
                <select v-model="auctionData.rarity" id="rarity" class="form-select">
                  <option value="" disabled>Select Rarity</option>
                  <option value="Common">Common (5%)</option>
                  <option value="Uncommon">Uncommon (10%)</option>
                  <option value="Rare">Rare (20%)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Vertical Divider -->
          <div class="border-r h-full mx-4"></div>

          <!-- Right Section - Image Upload -->
          <div class="w-1/2 flex flex-col items-center justify-center">
            <!-- Image Preview -->
            <div class="mb-4">
              <img :src="auctionData.image || '/images/no-image.jpg'" alt="Auction Image Preview"
                class="w-48 h-48 object-cover rounded-lg shadow-xl" />
            </div>

            <!-- File Input -->
            <div class="mb-4">
              <label class="text-sm font-medium mb-2">Upload Image</label>
              <input type="file" @change="onImageChange" class="form-input" accept="image/*" />
            </div>
          </div>
                </form>

        <div class="flex justify-end mt-5">
          <button type="submit"
            class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
            <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"></path>
            </svg>
            Submit Auction
          </button>
        </div>

        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      </section>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

// Define your form data as reactive properties
const auctionData = ref({
  name: "",
  location_id: 0,
  location_name: "",
  description: "",
  startingBid: 0,
  biddingType: "",
  categories: [], // Stores selected category IDs
  rarity: "",
  image: null,
});

const selectedCategory = ref("");
const categoryMap = ref({
  1: "Art",
  2: "Electronics",
  3: "Collectibles",
  4: "Furniture",
  5: "Real Estate",
});
const errorMessage = ref("");
const router = useRouter();

// Handle image upload and display a preview
const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    auctionData.value.image = URL.createObjectURL(file); // Create an image preview URL
  } else {
    auctionData.value.image = null; // Reset if no file is selected
  }
};


const fetchLocation = async () => {

  try {
    const response = await axios.post('/api/get-locationid-by-name');

    console.log("API Response:", response.data);

    if (response.data.location_id) {
      auctionData.value.location_id = response.data.location_id;
      auctionData.value.location_name = response.data.locationName;
    } else {
      console.error("Location ID not found for:", userLocation);
      errorMessage.value = "Location ID not found. Please check the location name.";
    }
  } catch (error) {
    console.error("Error fetching location ID:", error);
    errorMessage.value = "Error fetching location ID. Please try again.";
  }
};



const createAuction = async () => {
  try {
    // Log the data being sent to the API for debugging
    console.log("Sending auction data:", {
      name: auctionData.value.name,
      location_id: auctionData.value.location_id,
      description: auctionData.value.description,
      starting_bid: auctionData.value.startingBid,
      bidding_type: auctionData.value.biddingType,
      rarity: auctionData.value.rarity,
      categories: auctionData.value.categories, // Ensure this is an array of IDs
    });

    const response = await axios.post(
      "/api/createauction",
      {
        name: auctionData.value.name,
        location_id: auctionData.value.location_id,
        description: auctionData.value.description,
        starting_bid: auctionData.value.startingBid,
        bidding_type: auctionData.value.biddingType,
        rarity: auctionData.value.rarity,
        categories: auctionData.value.categories, // Send category IDs to the backend
      }
    );

    const responseData = response.data;
    if (responseData.status === 201) {
      toast.success(responseData.json.message);
      emit("close");
      router.replace("/auctioneer/auctioneerdashboard");
    } else if (responseData.json && responseData.json.message) {
      toast.error(responseData.json.message);
    }
  } catch (error) {
    console.error("Error creating auction:", error); // Log the error for debugging
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("An error occurred. Please try again.");
    }
  }
};
const addCategory = () => {
  if (
    selectedCategory.value &&
    !auctionData.value.categories.includes(selectedCategory.value)
  ) {
    auctionData.value.categories.push(selectedCategory.value); // Add category ID
    selectedCategory.value = ""; // Reset selection
  }
};

const removeCategory = (categoryId) => {
  auctionData.value.categories = auctionData.value.categories.filter(
    (id) => id !== categoryId,
  );
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
