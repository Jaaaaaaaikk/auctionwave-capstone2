<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 class="text-lg font-semibold mb-4">Rate Experience</h3>
            <div class="flex justify-center space-x-2">
                <!-- Use `rating` in the template -->
                <button v-for="star in 5" :key="star" @click="setRating(star)"
                    :class="{ 'text-yellow-400': star <= rating, 'text-gray-400': star > rating }" class="text-4xl">
                    ★
                </button>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
                <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button :disabled="rating === 0" @click="submitRating"
                    class="px-4 py-2 bg-custom-bluegreen text-white rounded hover:bg-blue-600">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

// Define the emit to communicate with parent
const emit = defineEmits();

// Rating selected by user
const rating = ref(0);

// Define props passed to the modal
const props = defineProps({
    auctioneer_id: Number,
    listing_id: Number
});

// Function to set the rating
const setRating = (value) => {
    rating.value = value; // Use `rating.value` to update the reactive variable
};

// Function to submit the rating
const submitRating = async () => {
    if (rating.value === 0) {
        toast.error('Please select a rating before submitting.');
        return;
    }

    try {
        const response = await axios.post('/api/ratings/bidder-rating', {
            listing_id: props.listing_id,  // Use props for auctioneer_id and listing_id
            auctioneer_id: props.auctioneer_id,
            rating: rating.value,
        });

        if (response.data.success) {
            toast.success('Thank you for your feedback!');
            closeModal();  // Close the modal after submitting the rating
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
        toast.error('An error occurred while submitting your rating.', error);
    }
};

// Function to close the modal
const closeModal = () => {
    emit('closeRatingModal'); // Emit event to parent to handle closing the modal
};
</script>


<style scoped></style>