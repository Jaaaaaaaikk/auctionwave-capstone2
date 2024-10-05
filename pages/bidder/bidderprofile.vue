<template>
  <NuxtLayout name="biddernavbar">
    <div class="min-h-screen bg-custom-white w-full mt-16">
      <div class="bg-white w-3/5 mx-auto px-12 py-12 rounded-lg flex items-start relative">
        <div class="mr-6 relative"> <!-- Wrapper for positioning the pencil icon -->
          <input type="file" accept="image/png, image/jpeg" @change="handleImageUpload" ref="fileInput"
            class="hidden" />

          <!-- with ring border -->
          <img class="w-48 rounded-full ring-4 ring-blue-500" :src="userStore.userProfileImage || '/images/default-profile-image.png'"
            alt="Profile Picture" />

          <!-- Pencil Icon -->
          <div class="absolute top-0 right-0 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" @click="profile_modal = true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8h4l1-2h8l1 2h4a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V10a2 2 0 012-2zm7 3a3 3 0 106 0 3 3 0 00-6 0z" />
            </svg>
            <profileModal v-if="profile_modal" @close="handleModalClose" @image-uploaded="fetchProfile"/>
          </div>
        </div>

        <div class="my-2 mx-8">
          <h1 class="text-3xl font-medium">Bidder</h1>
          <div class="flex justify-left">
            <button type="button"
              class="border-2 border-custom-bluegreen p-2 w-24 h-20 mt-5 bg-white rounded-lg text-custom-bluegreen font-medium ml-2 outline-custom-bluegreen hover:shadow-inner">
              Resume
            </button>
          </div>
        </div>
        <div class="w-px h-52 bg-gray-300 mx-10"></div>
        <div class="flex">
          <div class="mx-10 my-2">
            <div class="font-medium my-2">Full name:</div>
            <div class="font-medium my-2">Email:</div>
            <div class="font-medium my-2">Location:</div>
            <div class="font-medium my-2">Categories:</div>
          </div>
          <div class="my-2">
            <div class="font-normal my-2">{{ profile.fullname }}</div>
            <div class="font-normal my-2">{{ profile.email }}</div>
            <div class="font-normal my-2">{{ profile.location }}</div>
            <div class="font-normal my-2">
              <div class="flex flex-wrap">
                <span v-for="(category, index) in profile.categories" :key="index"
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {{ category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center my-8">
        <hr class="w-full" />
      </div>
      <div class="bg-white w-3/5 mx-auto my-6 px-12 py-12 rounded-lg items-start">
        <div class="flex justify-between items-center mb-4">
          <div class="text-2xl font-medium">About</div>
          <div class="flex gap-2">
            <button @click="toggleEdit" :class="{
              'bg-blue-500 px-3 py-1 rounded-3xl': !isEditing,
              'bg-transparent border-none': isEditing,
            }" class="text-white focus:outline-none mr-4">
              <span v-if="!isEditing">Edit</span>
              <span v-if="isEditing" class="text-red-500 text-2xl">X</span>
            </button>
            <button v-if="isEditing" @click="saveAbout" class="bg-green-500 text-white px-3 py-1 rounded-3xl">
              Save
            </button>
          </div>
        </div>
        <div>
          <div v-if="isEditing">
            <textarea v-model="editAbout" rows="4" class="w-full border border-gray-300 p-2 rounded-3xl"></textarea>
          </div>
          <div v-else class="font-normal my-4">{{ profile.about }}</div>
        </div>
        <div class="flex justify-center my-8">
          <hr class="w-full" />
        </div>
      </div>
    </div>
  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import profileModal from "~/components/change-profile-picture-modal.vue";
import { useUserStore } from '@/stores/user-profile-image'; // Import the user store


const profile = ref({
  fullname: "",
  email: "",
  location: "",
  categories: [],
  about: "",
  profileImage: "",
});

const profile_modal = ref(false);
const isEditing = ref(false);
const editAbout = ref("");
const fileInput = ref(null); // Define the file input ref
const userStore = useUserStore(); // Use the store


const fetchProfile = async () => {
  try {
    const response = await axios.get("/api/bidderprofile");
    profile.value = response.data.profile;
    editAbout.value = profile.value.about;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
  }
};

const saveAbout = async () => {
  try {
    await axios.put("/api/update_about_in_profile", { about: editAbout.value });
    profile.value.about = editAbout.value;
    isEditing.value = false;
  } catch (error) {
    console.error("Error saving about:", error.message);
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editAbout.value = profile.value.about;
  }
};

const handleModalClose = () => {
  profile_modal.value = false;
  fetchProfile();
};

onMounted(async () => {
  userStore.initializeProfileImage(); // Initialize from localStorage
  await Promise.all([fetchProfile()]);
});
</script>

<style scoped>
/* Add custom styles here */
</style>
