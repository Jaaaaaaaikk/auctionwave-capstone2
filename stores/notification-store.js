import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([]);
    const unreadCount = ref(0);

    const fetchNotifications = async () => {
        try {

            // Introduce a delay of 1.5 seconds (1500 milliseconds)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const { data } = await axios.get('/api/notifications/fetch-bidder-inbox-notification');
            notifications.value = data.notifications;
            unreadCount.value = data.notifications.filter(notification => !notification.is_read).length; // Ensure correct property
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    return { notifications, unreadCount, fetchNotifications };
});
