<template>
  <!-- Dynamically load the navbar layout based on user type -->
  <NuxtLayout :name="navbarLayout">
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Inbox</h1>

      <!-- Display a message if there are no notifications -->
      <div v-if="notifications.length === 0" class="text-center">
        <p>No notifications yet.</p>
      </div>

      <!-- Table for notifications -->
      <div v-else>
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr class="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-center">Message</th>
              <th class="py-3 px-6 text-center">Date</th>
              <th class="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(notification, index) in notifications" :key="notification.notification_id"
              :class="{ 'bg-yellow-100': notification.is_read === 0, 'bg-gray-100': notification.is_read === 1 }"
              class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6 text-left">
                {{ notification.message }}
              </td>
              <td class="py-3 px-6 text-left">
                {{ formatDate(notification.created_at) }}
              </td>
              <td class="py-3 px-6 text-center">
                <div class="flex justify-center space-x-4">
                  <!-- Mark as Read Button with Tooltip and Styled -->
                  <button @click="markAsRead(notification.notification_id, index)" class="btn-action tooltip"
                    v-if="notification.is_read === 0">Mark as Read
                    <i class="fas fa-check"></i>
                    <span class="tooltip-text">Mark as Read</span>
                  </button>

                  <!-- Delete Button with Tooltip and Styled -->
                  <button @click="deleteNotification(notification.notification_id, index)"
                    class="btn-action tooltip">Delete
                    <i class="fas fa-trash"></i>
                    <span class="tooltip-text">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

// Fetch notifications from the API
const fetchNotifications = async () => {
  try {
    const { data } = await axios.get('/api/notifications');
    console.log('Fetched notifications:', data.notifications);
    notifications.value = data.notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
};

// Mark a notification as read
const markAsRead = async (notificationId, index) => {
  try {
    await axios.post('/api/mark-as-read', { id: notificationId });
    notifications.value[index].is_read = 1; // Mark notification as read
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

// Delete a notification
const deleteNotification = async (notificationId, index) => {
  try {
    const response = await axios.post('/api/delete-notification', { id: notificationId });
    console.log('response on deletion', response);
    if (response.data.status === 200) {
      notifications.value.splice(index, 1); // Remove the notification from the list
    } else {
      console.error("Failed to delete notification:", response.data.body.message);
    }
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
};

// Format date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Set navbar layout based on user type
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

/* Table Row Background Colors */
.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-yellow-100 {
  background-color: #fef3c7;
  /* Highlight color for unread notifications */
}

/* Styling for table */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  /* Add border for table readability */
}

thead {
  background-color: #f1f1f1;
}

/* Action Buttons Style */
.btn-action {
  background-color: #f1f5f9;
  border: 2px solid #1c1c1e;
  border-radius: 0.375rem;
  /* Rounded border */
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
}

.btn-action:hover {
  background-color: #e5e7eb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Hover shadow */
}

.tooltip {
  position: relative;
  display: inline-block;
  text-align: center;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 100px;
  background-color: darkslategray;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -50px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
