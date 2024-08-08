<template>
    <NuxtLayout name="auctioneernavbar">
        <div class="min-h-screen bg-custom-white w-full mt-16">
            <div class="bg-white w-3/5 mx-auto px-12 py-12 rounded-lg flex items-start">
                <div class="mr-6">
                    <img class="w-48 rounded-full" src="../public/images/default-profile-image.png" alt="Profile Picture">
                </div>
                <div class="my-2 mx-8">
                    <h1 class="text-3xl font-medium mb-3">Auctioneer</h1>
                    <div class="flex justify-left">
                        <button type="button"
                            class="border p-2 w-24 h-20 bg-custom-bluegreen rounded-lg text-black font-medium mr-2 hover:shadow-inner">Contact</button>
                        <button type="button"
                            class="border-2 border-custom-bluegreen p-2 w-24 h-20 bg-white rounded-lg text-custom-bluegreen font-medium ml-2 outline-custom-bluegreen hover:shadow-inner">Resume</button>
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
                <hr class="w-full">
            </div>
        </div>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const profile = ref({
    fullname: '',
    email: '',
    location: '',
});

const fetchProfile = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No token found in local storage');
            router.replace('/homepage'); // Redirect to login page if no token
            return;
        }

        const response = await axios.get('/api/auctioneerprofile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        profile.value = response.data.profile;
    } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
        if (error.response?.status === 401) {
            router.replace('/homepage'); // Redirect to login page if token is invalid
        }
    }
};

onMounted(fetchProfile);
</script>

<style scoped>
/* Add custom styles here */
</style>
