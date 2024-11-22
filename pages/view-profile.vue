<template>
    <NuxtLayout name="biddernavbar">
        <client-only>

            <!-- new profile -->
            <NuxtLayout name="biddersidebar" class="hidden xl:block"></NuxtLayout>


            <div class="bg-custom-blue2   flex items-center justify-center p-4">


                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-6xl w-full xl:w-3/5 2xl:w-full p-8 transition-all duration-300 animate-fade-in">

                    <div class="flex flex-col ">

                        <div class="md:w-1/3 text-center mb-8 md:mb-0 mx-auto">
                            <div class="relative w-48 sm:mx-auto mx-auto">
                                <img :src="profile.profile_image_url || '/images/default-profile-image.png'"
                                    alt="Profile Picture"
                                    class="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-custom-bluegreen dark:border-blue-900 transition-transform duration-300 hover:scale-105" />
                            </div>
                            <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                {{ profile.firstName }} {{ profile.middleName }} {{ profile.lastName }}
                            </h1>
                            <p class="text-gray-800 dark:text-gray-300">{{ profile.userType }}</p>

                            <!-- Ratings Section -->
                            <div class="flex items-center justify-center">
                                <template v-for="star in 5" :key="star">
                                    <svg v-if="star <= Math.floor(profile.rating)" class="w-4 h-4 text-yellow-300 me-1"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                        viewBox="0 0 22 20">
                                        <path
                                            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                    <svg v-else class="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path
                                            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                </template>
                                <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {{ profile.rating ? profile.rating.toFixed(1) : 0.0 }} out of 5
                                </p>
                            </div>
                        </div>

                        <!-- About Me Section -->
                        <div class="md:w-full lg:w-full md:pl-8">
                            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">About Me</h2>
                            <p class="text-sm text-gray-800 dark:text-gray-300 mb-6 w-full break-words">
                                {{ profile.about }}
                            </p>

                            <!-- Interested Categories Section -->
                            <h2 v-if="profile.userType === 'Bidder'"
                                class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                Interested Categories
                            </h2>
                            <div v-if="profile.userType === 'Bidder'" class="flex flex-wrap gap-2 mb-6">
                                <span v-for="category in profile.categories" :key="category"
                                    class="bg-indigo-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    {{ category }}
                                </span>
                            </div>

                            <!-- Contact Information Section -->
                            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Contact Information
                            </h2>
                            <ul class="space-y-2 text-gray-800 dark:text-gray-300">
                                <li class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5 mr-2 text-custom-bluegreen dark:text-blue-900"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    {{ profile.email }}
                                </li>
                                <li class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5 mr-2 text-custom-bluegreen dark:text-blue-900"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    {{ profile.location }}
                                </li>
                            </ul>
                            <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
                                <div class="lg:max-w-6xl mx-auto px-4">
                                    <div class="flex justify-between items-center mb-6">
                                        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">User
                                            comments</h2>
                                    </div>
                                    <div class="mb-6 ">
                                        <div
                                            class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                            <label for="comment" class="sr-only">Your comment</label>
                                            <textarea id="comment" rows="6" v-model="commentText"
                                                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                                placeholder="Write a comment..." required></textarea>
                                        </div>
                                        <button @click="submitComment(profile.user_id)"
                                            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-custom-bluegreen hover:bg-green-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                            Post comment
                                        </button>
                                    </div>
                                    <div v-if="comments.length === 0"
                                        class="text-gray-500 dark:text-white mt-4 text-center">
                                        No comments posted.
                                    </div>
                                    <div v-else>
                                        <article v-for="comment in comments.slice(0, commentsToShow)"
                                            :key="comment.comment_id"
                                            class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                                            <footer class="flex justify-between items-center mb-2">
                                                <div class="flex items-center">
                                                    <p
                                                        class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                        <img class="mr-2 w-6 h-6 rounded-full"
                                                            :src="comment.profile_image_url || '/images/default-profile-image.png'"
                                                            alt="User Image">{{ comment.firstname }} {{
                                                                comment.lastname }}
                                                    </p>
                                                    <div class="text-sm text-gray-600 dark:text-gray-400">Posted on {{
                                                        formatDate(comment.created_at) }}</div>
                                                </div>
                                            </footer>
                                            <p class="text-gray-500 dark:text-gray-400">{{ comment.comment_text }}</p>
                                        </article>
                                        <div v-if="comments.length > commentsToShow" class="text-center mt-4">
                                            <button @click="loadMoreComments"
                                                class="text-blue-500 hover:text-blue-700 text-sm font-medium">See
                                                More</button>
                                        </div>
                                    </div>

                                </div>
                            </section>
                        </div>
                    </div>
                </div>

            </div>
        </client-only>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

const route = useRoute();

const decodeId = (encodedId) => {
    return atob(encodedId);  // Base64 decode the string
};

const user_id = decodeId(route.query.id);


const profile = ref({
    user_id: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    location: "",
    categories: [],
    about: "",
    userType: '',
    profile_image_url: '',
    rating: 0.0,
});


const commentText = ref('');
const comments = ref([]);
const commentsToShow = ref(3);

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

const submitComment = async (userId) => {
    try {
        // Make sure the commentText and userId are not empty
        if (!commentText.value.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        // Show a confirmation alert to the user
        const isConfirmed = confirm('Are you sure you want to post this comment?');
        if (!isConfirmed) {
            toast.error('Comment posting canceled.');
            return;
        }

        // Make the POST request to the API
        const response = await axios.post('/api/post-comment-in-profile', {
            user_id: userId,
            commentText: commentText.value
        });

        if (response.data.success) {
            // Reset the comment input after successful post
            commentText.value = '';
            toast.success('Comment posted successfully!');
            fetchUserComments();
        } else {
            toast.error('Failed to post comment');
        }
    } catch (error) {
        toast.error('Failed to post comment');
    }
};


// Fetch user's comments data
const fetchUserComments = async () => {
    try {
        const response = await axios.get("/api/get-user-comments", { params: { user_id: user_id } });
        if (response.data.success) {
            comments.value = response.data.comments;
        } else {
            toast.error('Failed to load comments');
        }
    } catch (error) {
        toast.error('Failed to load comments');
    }
};

// Fetch more comments on 'See More' click
const loadMoreComments = () => {
    commentsToShow.value += 3; // Load 3 more comments
};


// Fetch user's profile data
const fetchViewProfile = async () => {
    try {
        const response = await axios.get("/api/fetch-view-profile", {
            params: { user_id: user_id }
        });
        console.log('response.data.profile', response.data.profile);
        profile.value = response.data.profile;
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        toast.error("Failed to load profile");
    }
};

// Fetch data on mount
onMounted(() => {
    if (user_id) {
        fetchViewProfile();
        fetchUserComments();
    } else {
        toast.error('No profile data to be shown.')
    }

});
</script>


<style scoped>
/* Add any custom styles here */
</style>