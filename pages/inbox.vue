<template>
  <!-- Dynamically load the navbar layout based on user type -->
  <NuxtLayout :name="navbarLayout">
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Inbox</h1>
      <div v-if="notifications.length === 0" class="text-center">
        <p>No notifications yet.</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="(notification, index) in notifications"
          :key="notification.notification_id"
          class="flex justify-between items-center p-4 bg-white shadow-md rounded-lg transition duration-300"
          :class="{ 'bg-yellow-100': notification.is_read === 0, 'bg-gray-100': notification.is_read === 1 }"
        >
          <!-- Highlight unread notifications with bg-yellow-100 -->
          <div>
            <p class="text-gray-800 mb-4">{{ notification.message }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(notification.created_at) }}</p>
          </div>
          <div class="flex space-x-4">
            <!-- Mark as Read Icon/Button -->
            <button
              @click="markAsRead(notification.notification_id, index)"
              class="text-blue-600 hover:text-blue-800"
              v-if="notification.is_read === 0"
            >
              <i class="fas fa-check"></i> Mark as Read
            </button>
            <!-- Delete Icon/Button -->
            <button
              @click="deleteNotification(notification.notification_id, index)"
              class="text-red-600 hover:text-red-800"
            >
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>

  <!-- Load universal footer -->
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const navbarLayout = ref('');
const notifications = ref([]);

// Define the function to fetch notifications
const fetchNotifications = async () => {
  try {
    const { data } = await axios.get('/api/notifications');
    console.log('Fetched notifications:', data.notifications);
    notifications.value = data.notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
};

// Define the function to mark a notification as read
const markAsRead = async (notificationId, index) => {
  console.log("Notification ID BEFORE MARK AS READ:", notificationId); // Add this for debugging
  try {
    await axios.post('/api/mark-as-read', { id: notificationId });
    notifications.value[index].is_read = 1; // Set notification as read
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

// Define the function to delete a notification
const deleteNotification = async (notificationId, index) => {
  try {
    await axios.post('/api/notifications/delete', { id: notificationId });
    notifications.value.splice(index, 1);
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
};

// Format date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Determine the appropriate navbar layout based on user type
onMounted(() => {
  const userType = route.query.userType;
  if (userType === 'Bidder') {
    navbarLayout.value = 'biddernavbar';
  } else {
    navbarLayout.value = 'auctioneernavbar';
  }

  // Fetch notifications after setting the navbar layout
  fetchNotifications();
});
</script>

<style scoped>
.container {
  max-width: 800px;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-yellow-100 {
  background-color: #fef3c7; /* Highlight color for unread notifications */
}
</style>
