import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

export const useInboxStore = defineStore('inbox', () => {
    const messages = ref([]);
    const unreadCount = ref(0);
    // let socket;

    // const connectWebSocket = () => {
    //     try {
    //         socket = new WebSocket('ws://localhost:3001/ws'); // Ensure this URL is correct
    //         socket.onopen = () => {
    //             console.log("WebSocket connection established.");
    //         };
    //         socket.onmessage = (event) => {
    //             const newMessage = JSON.parse(event.data);
    //             console.log("New message received:", newMessage); // Log received messages
    //             messages.value.unshift(newMessage); // Add to start of inbox
    //             if (!newMessage.is_read) unreadCount.value++;
    //         };

    //         socket.onclose = () => {
    //             console.log("WebSocket closed. Reconnecting...");
    //             setTimeout(connectWebSocket, 5000); // Reconnect after a delay
    //         };

    //         socket.onerror = (error) => {
    //             console.error("WebSocket error observed:", error);
    //         };
    //     } catch (error) {
    //         console.error("WebSocket connection failed:", error);
    //     }
    // };

    // const addMessage = (newMessage) => {
    //     messages.value.push(newMessage);
    // };

    const fetchInbox = async () => {
        try {
            // Introduce a delay of 1.5 seconds (1500 milliseconds)
            await new Promise(resolve => setTimeout(resolve, 1200));

            const { data } = await axios.get('/api/messages/fetch-message-user-inbox');
            messages.value = data.messages;
            unreadCount.value = data.messages.filter(message => !message.is_read).length; // Ensure correct property
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    // Mark a message as read
    const markAsRead = async (messageId) => {
        const messageIndex = messages.value.findIndex(message => message.message_id === messageId);
        if (messageIndex !== -1) {
            messages.value[messageIndex].is_read = 1; // Optimistic update
        }

        try {
            await axios.post('/api/messages/mark-as-read', { id: messageId });
        } catch (error) {
            console.error("Failed to mark message as read:", error);
            // Rollback the optimistic update if the request fails
            messages.value[messageIndex].is_read = 0; // Rollback
        }
    };

    // Mark all message as read
    const markAllAsRead = async () => {
        try {
            await axios.post('/api/messages/mark-all-as-read'); // Call the new API endpoint
            messages.value.forEach(message => {
                message.is_read = 1; // Mark all message as read
            });
            unreadCount.value = 0; // Reset unread count
        } catch (error) {
            console.error("Failed to mark all message as read:", error);
        }
    };

    // Spam the message
    const spamMessage = async (messageId) => {
        try {
            const response = await axios.post('/api/messages/spam-message-inbox', { id: messageId });
            if (response.data.status === 200) {
                const messageIndex = messages.value.findIndex(message => message.message_id === messageId);
                if (messageIndex !== -1) {
                    messages.value.splice(messageIndex, 1);
                }
            } else {
                console.error("Failed to trash message:", response.data.body.message);
            }
        } catch (error) {
            console.error("Failed to trash message:", error);
        }
    };

    // Trash the message
    const trashMessage = async (messageId) => {
        try {
            const response = await axios.post('/api/messages/trash-message-inbox', { id: messageId });
            if (response.data.status === 200) {
                const messageIndex = messages.value.findIndex(message => message.message_id === messageId);
                if (messageIndex !== -1) {
                    messages.value.splice(messageIndex, 1);
                }
            } else {
                console.error("Failed to trash message:", response.data.body.message);
            }
        } catch (error) {
            console.error("Failed to trash message:", error);
        }
    };

    // Delete a message
    const deleteMessage = async (messageId) => {
        try {
            const response = await axios.post('/api/messages/delete-message-inbox', { id: messageId });
            if (response.data.status === 200) {
                const messageIndex = messages.value.findIndex(message => message.message_id === messageId);
                if (messageIndex !== -1) {
                    messages.value.splice(messageIndex, 1); // Remove the message from the list
                }
            } else {
                console.error("Failed to delete message:", response.data.body.message);
            }
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    // Mark as unread the message
    const markAsUnread = async (messageId) => {
        const messageIndex = messages.value.findIndex(message => message.message_id === messageId);
        if (messageIndex !== -1) {
            messages.value[messageIndex].is_read = 0; // Optimistic update
        }

        try {
            await axios.post('/api/messages/mark-as-unread', { id: messageId });
        } catch (error) {
            console.error("Failed to mark message as unread:", error);
            // Rollback the optimistic update if the request fails
            messages.value[messageIndex].is_read = 1; // Rollback
        }
    };


    return { messages, unreadCount, fetchInbox, markAsRead, markAllAsRead, spamMessage, trashMessage, deleteMessage, markAsUnread };
});
