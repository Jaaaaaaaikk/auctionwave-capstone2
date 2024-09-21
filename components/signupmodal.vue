<template>
  <transition name="modal-width">
    <div class="font-mono fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div class="bg-gray-300 shadow-lg rounded-3xl overflow-hidden w-11/12 max-w-lg mx-auto p-5">
        <header class="p-4 border-b">
          <button type="button" @click="$emit('close-signup')" class="text-gray-600 hover:text-gray-800">
            <svg class="w-full h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-center">Sign Up Form</h1>
        </header>
        <section class="p-4">
          <form @submit.prevent="submitForm">
            <!-- Group First Name, Middle Name, Last Name -->
            <div class="flex flex-wrap -mx-2 mb-5">
              <div class="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
                <div class="relative z-0 w-full group">
                  <input v-model="form.firstname" id="firstname" type="text"
                    class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" " required />
                  <label for="firstname"
                    class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    First Name</label>
                </div>
              </div>
              <div class="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
                <div class="relative z-0 w-full group">
                  <input v-model="form.middlename" id="middlename" type="text"
                    class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" " />
                  <label for="middlename"
                    class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Middle Name</label>
                </div>
              </div>
              <div class="w-full sm:w-1/3 px-2">
                <div class="relative z-0 w-full group">
                  <input v-model="form.lastname" id="lastname" type="text"
                    class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" " required />
                  <label for="lastname"
                    class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Last Name</label>
                </div>
              </div>
            </div>

            <!-- Email, and Location Field Group -->
            <div class="flex flex-wrap -mx-2 mb-5">
              <div class="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                <div class="relative z-0 w-full mb-5 group">
                  <input v-model="form.email" id="email" type="email"
                    class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" " required />
                  <label for="email"
                    class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Email address</label>
                  <span v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</span>
                </div>
              </div>
              <div class="w-full sm:w-1/2 px-2">
                <input type="text" v-model="selectedCity.name"
                  class="text-gray-500 bg-transparent border-2 rounded-md w-full" placeholder="City Location" readonly
                  required />
                <button type="button" @click="toggleMap"
                  class="bg-teal-500 border border-teal-500 rounded-full hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 text-gray-900 px-4 ml-3 shadow-sm-light shadow-black text-xs">
                  Select City on Map
                </button>
                <CityMap v-if="showMap" @citySelected="setCity" />
              </div>
            </div>

            <!-- Group Password and Confirm Password -->
            <div class="flex flex-wrap -mx-2 mb-5">
              <div class="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                <div class="relative z-0 w-full group">
                  <input v-model="form.password" id="password" type="password"
                    class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" " required />
                  <label for="password"
                    class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Password</label>
                </div>
              </div>
              <div class="w-full sm:w-1/2 px-2">
                <div class="relative z-0 w-full group">
                  <input v-model="form.confirmPassword" id="confirmPassword" type="password"
                    class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" " required />
                  <label for="confirmPassword"
                    class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Confirm Password</label>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mb-5">
              <!-- User Type Field -->
              <div class="w-full sm:w-1/2 px-2">
                <div class="relative z-0 w-full mb-5 group">
                  <select v-model="form.userType" id="userType" @change="handleUserTypeChange"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required>
                    <option disabled>Select User Type</option>
                    <option value="Bidder">Bidder</option>
                    <option value="Auctioneer">Auctioneer</option>
                  </select>
                  <label for="userType"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    User Type</label>
                </div>
              </div>

              <div class="w-full sm:w-1/2 px-2">
                <!-- Bidder Category Selection -->
                <div v-if="form.userType === 'Bidder'" class="relative z-0 w-full mb-5 group">
                  <select v-model="selectedCategory" @change="addCategory"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer">
                    <option value="" disabled>Select Category</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                  <label for="category"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Bidder Category</label>
                </div>
              </div>
            </div>

            <!-- Selected Categories Display -->
            <div v-if="form.userType === 'Bidder'" class="mb-5">
              <span v-for="category in form.categories" :key="category"
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {{ category }}
                <button type="button" @click="removeCategory(category)" class="text-red-500 ml-1">
                  x
                </button>
              </span>
            </div>

            <!-- Submit and Back to Login Buttons -->
            <div class="flex justify-end mt-4">
              <!-- <button type="submit"
                class="bg-teal-500 border border-teal-500 rounded-full hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 text-gray-900 py-2 px-4 shadow-sm-light shadow-black font-semibold">
                Sign Up
              </button> -->
              <button type="button" @click="toggleOtpModal"
                class="bg-teal-500 border border-teal-500 rounded-full hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600 text-gray-900 py-2 px-4 shadow-sm-light shadow-black font-semibold">
                Next
              </button>
              <OtpModal v-if="showOtpModal" @close_otp_modal="showOtpModal = false"
                @show-signin="showSigninModalHandler" :form="form" />
            </div>
          </form>
        </section>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import CityMap from '~/components/city-map.vue';
import OtpModal from '~/components/otp-modal.vue';

const emit = defineEmits();
const showMap = ref(false)
const showOtpModal = ref(false)
const selectedCity = ref({ name: '', id: '' });
const selectedCategory = ref("");
const emailError = ref("");

const form = ref({
  firstname: "",
  middlename: "",
  lastname: "",
  location_id: "",
  email: "",
  password: "",
  confirmPassword: "",
  userType: "",
  categories: [], // Array to store selected categories for bidders
});

const categories = ref([
  "Art",
  "Electronics",
  "Collectibles",
  "Furniture",
  "Real Estate",
]);

// Watch for email changes and validate in email address field
watch(() => form.value.email, async (newEmail) => {
  if (newEmail) {
    try {
      const response = await axios.post("/api/validate-email-signup", { email: newEmail });
      if (!response.data.success) {
        emailError.value = response.data.message;
      } else {
        emailError.value = "";
      }
    } catch (error) {
      emailError.value = "An error occurred while checking the email.";
    }
  } else {
    emailError.value = "";
  }
});

const showSigninModalHandler = () => {
  emit('close-signup'); // Emit event to show Signin modal from SigninModal.vue
  showOtpModal.value = false; // Close OTP modal
};

// Watch for changes in selectedCity and update location_id in form
watch(selectedCity, (newCity) => {
  form.value.location_id = newCity.id;
});

// Function to handle form validation
const validateForm = () => {
  const requiredFields = ['firstname', 'lastname', 'email', 'password', 'confirmPassword', 'userType'];

  // Check if all required fields are filled
  for (const field of requiredFields) {
    if (!form.value[field]) {
      toast.warning(`Please fill in your ${field.replace(/([A-Z])/g, ' $1')}.`);
      return false;
    }
  }

  // Check if passwords match
  if (form.value.password !== form.value.confirmPassword) {
    toast.warning("Passwords do not match");
    return false;
  }

  // Check email domain
  const emailRegex = /^[\w-.]+@gmail\.com$/;
  if (!emailRegex.test(form.value.email)) {
    toast.warning("Please use a valid @gmail.com email address.");
    return false;
  }

  if (emailError.value) {
    toast.warning("Email address is already in use.");
    return false;
  }

  // Ensure a city is selected
  if (!selectedCity.value.name) {
    toast.warning("Please select a city.");
    return false;
  }

  return true; // if All validations passed then return true.
};

const toggleOtpModal = async () => {
  if (validateForm()) {
    try {
      // Call API to generate OTP
      const response = await axios.post('/api/generate-otp', { email: form.value.email });
      console.log(response);

      if (response.data.status === 400) {
        showOtpModal.value = true;
      } else if (response.data.status === 200) {
        toast.info(response.data.json.message);
        showOtpModal.value = true; // Open the OTP modal if OTP generation is successful
      } else {
        toast.error(response.data.json.message || 'Failed to generate OTP.');
      }
    } catch (error) {
      // Handle any errors in OTP generation
      toast.error(`Error generating OTP: ${error.response?.data?.json?.message || error.message}`);
    }
  }
};


const setCity = (city) => {
  selectedCity.value = { name: city.name, id: city.id }; // Store both name and ID
  showMap.value = false; // Close the map modal after city selection
};

const toggleMap = () => {
  showMap.value = !showMap.value;
};


const handleUserTypeChange = () => {
  if (form.value.userType !== "Bidder") {
    form.value.categories = [];
  }
};


// Function to handle adding category to form
const addCategory = () => {
  if (
    selectedCategory.value &&
    !form.value.categories.includes(selectedCategory.value)
  ) {
    form.value.categories.push(selectedCategory.value);
    selectedCategory.value = "";
  }
};

// Function to handle removing category from form
const removeCategory = (category) => {
  form.value.categories = form.value.categories.filter(
    (cat) => cat !== category,
  );
};
</script>

<style scoped>
.modal-width-enter-active,
.modal-width-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.modal-width-enter,
.modal-width-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
