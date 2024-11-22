<template>
    <div v-if="isVisible" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal">
        <div class="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg">

            <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Contact Us</h2>
            <form @submit.prevent="submitForm" class="space-y-4 sm:space-y-6">
                <!-- Name Field -->
                <div class="relative z-0 w-full mb-4 sm:mb-5 group">
                    <input id="email" type="email"
                        class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" " required />

                    <label for="email"
                        class="peer-focus:font-medium pl-2 left-1 bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Your Name
                    </label>
                </div>

                <!-- Email Field -->
                <div class="relative z-0 w-full mb-4 sm:mb-5 group">
                    <input id="email" type="email"
                        class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" " required />
                    <label for="email"
                        class="peer-focus:font-medium pl-2 left-1 bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Your Email
                    </label>
                </div>

                <div>
                    <textarea v-model="form.message" id="message" rows="4" required
                        class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="Your message..."></textarea>
                </div>

                <!-- Submit Button -->
                <div class="text-center">
                    <button type="submit"
                        class="px-6 py-3 text-white rounded-lg hover:custom- focus:outline-none focus:ring-2 bg-custom-bluegreen hover:bg-green-500 focus:ring-opacity-50">
                        Submit
                    </button>
                </div>
            </form>
            <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    isVisible: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['update:isVisible']);

const form = ref({
    name: '',
    email: '',
    message: '',
});

// const submitForm = async () => {
//     try {
//         const response = await fetch('/api/contact', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(form.value),
//         });

//         if (response.ok) {
//             alert('Your message has been sent successfully!');
//             form.value = { name: '', email: '', message: '' }; // Clear form
//             closeModal();
//         } else {
//             alert('There was an issue with your submission. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error submitting form:', error);
//         alert('There was an error submitting your message. Please try again later.');
//     }
// };

const closeModal = () => {
    emit('update:isVisible', false);
};
</script>

<style scoped>
/* Add custom styles for the modal */
</style>