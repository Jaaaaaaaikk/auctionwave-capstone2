<template>
    <div class="fixed top-0 right-0 mt-4 mr-4 flex flex-col gap-3 z-50">
        <!-- Loop over the notifications array and display each one -->
        <div v-for="(notification, index) in notifications" :key="notification.id"
            class="relative border bg-gray-300 border-gray-200 rounded-lg shadow-lg w-80">
            <button @click="removeNotification(index)"
                class="absolute p-1 border border-gray-300 rounded-full -top-1 -right-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                </svg>
            </button>

            <div class="flex items-center p-4">
                <img :src="notification.image" alt="User picture" class="object-cover w-12 h-12 rounded-lg" />
                <div class="ml-3 overflow-hidden">
                    <p class="font-medium text-gray-900">{{ notification.name }}</p>
                    <p class="max-w-xs text-sm text-gray-500 truncate">{{ notification.message }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Sample notifications data
const notifications = ref([
    {
        id: 1,
        name: 'Jan Doe',
        message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, laborum?',
        image: 'https://randomuser.me/api/portraits/women/71.jpg',
    },
    {
        id: 2,
        name: 'John Doe',
        message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, laborum?',
        image: 'https://randomuser.me/api/portraits/men/71.jpg',
    },
    {
        id: 3,
        name: 'Mike Doe',
        message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, laborum?',
        image: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
]);

// Function to remove notification by index
const removeNotification = (index) => {
    notifications.value.splice(index, 1);
};
</script>

<style scoped>
/* Notification container positioning */
.fixed {
    position: fixed;
    top: 0;
    right: 0;
    margin-top: 16px;
    /* Space from the top */
    margin-right: 16px;
    /* Space from the right */
    z-index: 50;
    /* Ensures it appears above other content */
}

.w-80 {
    width: 320px;
    /* Set a fixed width for the notification box */
}
</style>