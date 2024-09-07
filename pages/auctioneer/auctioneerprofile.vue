<template>
  <NuxtLayout name="auctioneernavbar">
    <div class="min-h-screen bg-custom-white w-full mt-16">
      <div
        class="bg-white w-3/5 mx-auto px-12 py-12 rounded-lg flex items-start"
      >
        <div class="mr-6">
          <img
            class="w-48 rounded-full"
            src="../../public/images/default-profile-image.png"
            alt="Profile Picture"
          />
        </div>
        <div class="my-2 mx-8">
          <h1 class="text-3xl font-medium mb-3">Auctioneer</h1>
          <div class="flex justify-left">
            <button
              type="button"
              class="border p-2 w-24 h-20 bg-custom-bluegreen rounded-lg text-black font-medium mr-2 hover:shadow-inner"
            >
              Contact
            </button>
            <button
              type="button"
              class="border-2 border-custom-bluegreen p-2 w-24 h-20 bg-white rounded-lg text-custom-bluegreen font-medium ml-2 outline-custom-bluegreen hover:shadow-inner"
            >
              Resume
            </button>
          </div>
        </div>
        <div class="w-px h-52 bg-gray-300 ml-48"></div>
        <div class="flex w-full">
          <div class="mx-10 my-2">
            <div class="font-medium my-2">Fullname:</div>
            <div class="font-medium my-2">Email:</div>
            <div class="font-medium my-2">Location:</div>
          </div>
          <div class="my-2">
            <div class="font-normal my-2">{{ profile.fullname }}</div>
            <div class="font-normal my-2">{{ profile.email }}</div>
            <div class="font-normal my-2">{{ profile.location }}</div>
          </div>
        </div>
      </div>
      <div class="flex justify-center my-8">
        <hr class="w-full" />
      </div>
      <div
        class="bg-white w-3/5 mx-auto my-6 px-12 py-12 rounded-lg items-start"
      >
        <div class="flex justify-between items-center mb-4">
          <div class="text-2xl font-medium">About</div>
          <div class="flex gap-2">
            <button
              @click="toggleEdit"
              :class="{
                'bg-blue-500 px-3 py-1 rounded-3xl': !isEditing,
                'bg-transparent border-none': isEditing,
              }"
              class="text-white focus:outline-none mr-4"
            >
              <span v-if="!isEditing">Edit</span>
              <span v-if="isEditing" class="text-red-500 text-2xl">X</span>
            </button>
            <button
              v-if="isEditing"
              @click="saveAbout"
              class="bg-green-500 text-white px-3 py-1 rounded-3xl"
            >
              Save
            </button>
          </div>
        </div>
        <div>
          <div v-if="isEditing">
            <textarea
              v-model="editAbout"
              rows="4"
              class="w-full border border-gray-300 p-2 rounded-3xl"
            ></textarea>
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

const profile = ref({
  fullname: "",
  email: "",
  location: "",
  about: "",
});

const isEditing = ref(false);
const editAbout = ref("");

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in local storage");
      router.replace("/homepage"); // Redirect to login page if no token
      return;
    }

    const response = await axios.get("/api/auctioneerprofile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    profile.value = response.data.profile;
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error.response ? error.response.data : error.message,
    );
    if (error.response?.status === 401) {
      router.replace("/homepage"); // Redirect to login page if token is invalid
    }
  }
};

const saveAbout = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    await axios.put(
      "/api/update_about_in_profile",
      { about: editAbout.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
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

onMounted(fetchProfile);
</script>

<style scoped>
/* Add custom styles here */
</style>
