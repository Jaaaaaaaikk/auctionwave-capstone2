<template>
    <div class="flex-1 px-2 py-3">
        <!--Top Icons-->
        <div class="h-10 flex items-center">
            <div class="flex items-center">
                <div class="relative flex items-center ml-3 space-x-0.5">
                    <!-- Checkbox for selecting all -->
                    <input @change="toggleCheckAll" type="checkbox" v-model="checkAll" class="focus:ring-0" />

                    <!-- Button to toggle dropdown -->
                    <button @click="toggleFilterMessages">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>

                    <!-- Dropdown menu -->
                    <div v-if="filterMessages"
                        class="bg-gray-200 shadow-2xl absolute left-0 top-6 w-32 py-2 text-gray-900 rounded z-10">
                        <button v-for="option in filterOptions" name="buttonForFilterMessage" :key="option"
                            @click="applyFilter(option)"
                            class="w-full text-sm font-semibold py-1 hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-custom-bluegreen    ">
                            {{ option }}
                        </button>
                    </div>
                </div>
            </div>
            <span class="bg-gray-300 h-6 w-[.5px] mx-3"></span>
            <div class="flex items-center ml-2">
                <div class="flex items-center space-x-2">
                    <button title="Mark As Read" @click="markAsReadMessageUsingCheckbox"
                        class="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76">
                            </path>
                        </svg>
                    </button>
                    <button title="Mark As Unread" @click="markAsUnreadMessageUsingCheckbox"
                        class="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                            </path>
                        </svg>
                    </button>
                    <button title="Report Spam" @click="spamMessageUsingCheckbox"
                        class="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" />
                            <text x="10" y="14" text-anchor="middle" fill="currentColor" font-size="12"
                                font-weight="bold">!</text>
                        </svg>
                    </button>
                    <button title="Move to Trash" @click="trashMessageUsingCheckbox"
                        class="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-custom-bluegreen hover:text-white transition duration-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <!--Inbox Tab Content-->
        <div class="flex-1 px-2 py-3">
            <div class="bg-gray-100 mb-6">
                <ul>
                    <span v-if="inboxStore.messages.length === 0" class="text-center px-2">No
                        Messages.</span>
                    <li v-else v-for="(message, index) in inboxStore.messages" :key="message.message_id"
                        @mouseenter="setMessageHover(message.message_id, true)"
                        @mouseleave="setMessageHover(message.message_id, false)" :class="[
                            'flex items-center border-y hover:bg-gray-200 px-2',
                            { 'bg-yellow-100': message.is_read === 0, 'bg-white': message.is_read === 1 }  // Conditional classes
                        ]">
                        <input @click.stop type="checkbox" v-model="selectedMessages" :value="message.message_id"
                            class="focus:ring-0 border-2 border-gray-400" />
                        <div class="w-full flex items-center justify-between p-1 my-1 cursor-pointer">
                            <div class="flex items-center ml-4">
                                <!-- Message Info -->
                                <span class="w-56 pr-2 truncate mx-4">From: {{ message.sender_name }}</span>
                                <span class="w-64 truncate mx-4">{{ message.subject }}</span>
                                <span class="mx-4">-</span>
                                <span class="w-96 text-gray-600 text-sm truncate mx-4">
                                    {{ message.message }}
                                </span>
                            </div>
                            <div class="w-32 flex items-center justify-end">
                                <div v-if="hoverStates[message.message_id]" class="flex items-center space-x-2">
                                    <!--Mark As Read-->
                                    <button title="Mark As Read" @click="markAsRead(message.message_id)"
                                        class="text-gray-500 hover:text-custom-bluegreen h-5 w-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76">
                                            </path>
                                        </svg>
                                    </button>
                                    <!-- Mark as Unread Button -->
                                    <button title="Mark As Unread" @click="markAsUnread(message.message_id)">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="text-gray-500 hover:text-custom-bluegreen h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                            </path>
                                        </svg>
                                    </button>
                                    <button title="Report Spam" @click="spamMessage(message.message_id)"
                                        class="text-gray-500 hover:text-custom-bluegreen h-5 w-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor"
                                                stroke-width="2" />
                                            <text x="10" y="14" text-anchor="middle" fill="currentColor" font-size="12"
                                                font-weight="bold">!</text>
                                        </svg>
                                    </button>
                                    <!-- Delete Button -->
                                    <button title="Move to Trash" @click="trashMessage(message.message_id)">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="text-gray-500 hover:text-custom-bluegreen h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                                <span v-if="!hoverStates[message.message_id]" class="text-sm text-gray-500">{{
                                    formatDate(message.created_at) }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useInboxStore } from '@/stores/inbox-store';

const inboxStore = useInboxStore();
const hoverStates = ref({});
const filterOptions = ref(["Unread", "Starred", "Important"]);
const filterMessages = ref(false);
const selectedMessages = ref([]);
const checkAll = ref(false);
let ws;

// Toggle the "Select All" checkbox
const toggleCheckAll = () => {
    if (checkAll.value) {
        // Select all notifications
        selectedMessages.value = inboxStore.messages.map(message => message.message_id);
    } else {
        // Clear selected messages
        selectedMessages.value = [];
    }
};

const markAsRead = async (messageId) => {
    await inboxStore.markAsRead(messageId);
};

const markAsReadMessageUsingCheckbox = async () => {
    for (const messageId of selectedMessages.value) {
        await inboxStore.markAsRead(messageId);
    }
    selectedMessages.value = [];
};

const markAsUnread = async (messageId) => {
    await inboxStore.markAsUnread(messageId);
};

const markAsUnreadMessageUsingCheckbox = async () => {
    for (const messageId of selectedMessages.value) {
        await inboxStore.markAsUnread(messageId);
        await inboxStore.fetchInbox();
    }
    selectedMessages.value = [];
};

const spamMessage = async (messageId) => {
    const confirm = window.confirm("Report this message as Spam?");
    if (confirm) {
        await inboxStore.spamMessage(messageId);
        await inboxStore.fetchInbox();

    }

};

const spamMessageUsingCheckbox = async () => {
    const confirm = window.confirm("Report this all selected message as Spam?");
    if (confirm) {
        for (const messageId of selectedMessages.value) {
            await inboxStore.spamMessage(messageId);
            await inboxStore.fetchInbox();
        }
        selectedMessages.value = [];
    }
};

const trashMessage = async (messageId) => {
    const confirm = window.confirm("Are you sure you want to move the message to trash?");
    if (confirm) {
        await inboxStore.trashMessage(messageId);
        await inboxStore.fetchInbox();
    }
};

const trashMessageUsingCheckbox = async () => {
    const confirm = window.confirm("Are you sure you want to move all selected message to trash?");
    if (confirm) {
        for (const messageId of selectedMessages.value) {
            await inboxStore.trashMessage(messageId);
            await inboxStore.fetchInbox();
        }
        selectedMessages.value = [];
    }
};

// Apply filter to notifications
const applyFilter = (filter) => {
    console.log(`Applying filter: ${filter}`);
    filterMessages.value = false;
};

function toggleFilterMessages() {
    filterMessages.value = !filterMessages.value
}

// Utility function to format the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const setMessageHover = (messageId, isHovered) => {
    hoverStates.value[messageId] = isHovered;
};

const connectWebSocket = () => {
    ws = new WebSocket('ws://localhost:3001'); // Replace with your WebSocket URL

    ws.onopen = () => {
        console.log('WebSocket connection established.');
    };

    ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        console.log('New message received:', newMessage);
        inboxStore.messages.push(newMessage); // Update your store or local state
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
};


onMounted(() => {
    inboxStore.fetchInbox(); // Fetch messages on mount
    connectWebSocket();
});

onBeforeUnmount(() => {
    if (ws) {
        ws.close();
    }
});
</script>

<style scoped></style>