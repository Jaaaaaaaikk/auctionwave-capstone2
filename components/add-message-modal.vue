<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 modal-background">
        <!-- Modal Content -->
        <div @click.stop class="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 class="text-xl font-semibold mb-4">Compose a New Message</h2>
            <div class="relative">
                <input v-model="to" @input="debouncedSearchUsers" placeholder="To: name or email..."
                    class="w-full p-2 mb-2 border rounded" required autocomplete="off" />
                <ul v-if="filteredUsers.length"
                    class="absolute bg-white border border-gray-300 rounded shadow-lg w-full mt-1">
                    <li v-for="user in filteredUsers" :key="user.email" @click="selectUser(user)"
                        class="p-2 hover:bg-gray-200 cursor-pointer">
                        <strong>{{ user.firstname }} {{ user.lastname }}</strong>
                    </li>
                </ul>
            </div>
            <input v-model="subject" placeholder="Subject:" class="w-full p-2 mb-2 border rounded" />
            <textarea v-model="message" class="w-full h-32 p-2 border border-gray-300 rounded"
                placeholder="Write your message here..."></textarea>
            <div class="flex justify-end mt-4 space-x-2">
                <button @click="$emit('closeAddMessageModal')"
                    class="bg-gray-300 hover:bg-custom-bluegreen hover:bg-opacity-40 hover:text-black text-white py-2 px-4 rounded">Close</button>
                <button @click="sendMessage"
                    class="bg-custom-bluegreen hover:bg-custom-bluegreen hover:bg-opacity-40 hover:text-black text-white py-2 px-4 rounded">Send</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const to = ref('');
const emit = defineEmits();
const subject = ref('');
const message = ref('');
const filteredUsers = ref([]);
let selectedUser = ref(null); // Store selected user object

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Function to search users based on the input in the "To" field
const searchUsers = async () => {
    if (to.value.length < 1) {
        filteredUsers.value = [];
        return;
    }

    try {
        const response = await axios.get('/api/messages/search-user-suggestion', {
            params: { q: to.value }
        });
        filteredUsers.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const debouncedSearchUsers = debounce(searchUsers, 300);

const selectUser = (user) => {
    to.value = `${user.firstname} ${user.lastname}`;
    selectedUser.value = user; // Store the selected user
    filteredUsers.value = [];
};

// Function to send the message
const sendMessage = async () => {
    if (!selectedUser.value) {
        alert('Please select a valid recipient from the suggestions.');
        return;
    }

    if (!subject.value.trim()) {
        alert('Subject cannot be empty.');
        return;
    }

    if (!message.value.trim()) {
        alert('Message cannot be empty.');
        return;
    }

    try {
        const response = await axios.post('/api/messages/compose-message', {
            recipientId: selectedUser.value.user_id, // Assuming user_id is available in the selected user object
            subject: subject.value,
            messageBody: message.value
        });

        console.log('Message sent:', response.data);
        to.value = '';
        subject.value = '';
        message.value = '';
        selectedUser.value = null; // Clear the selected user
        filteredUsers.value = [];
        emit('closeAddMessageModal');
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
    }
};
</script>

<style scoped>
/* Add any additional styling you might want */
</style>
