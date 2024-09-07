<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <button @click="closeModal" class="close-button">Close</button>
            <div id="map"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';

// Emit event when a city is selected
const emit = defineEmits(['citySelected']);

const isVisible = ref(true);

const closeModal = () => {
    isVisible.value = false;
};

// Dynamically load Leaflet
let L;

onMounted(async () => {
    if (process.client) {
        // Dynamically import Leaflet only on the client side
        const leaflet = await import('leaflet');
        L = leaflet.default; // Access Leaflet's default export

        // Initialize the map after Leaflet is loaded
        const map = L.map('map', {
            center: [7.8000, 124.4553],
            zoom: 6.8,
            zoomControl: false, // Disable zoom control buttons
            scrollWheelZoom: false, // Disable scroll zoom
            dragging: false, // Disable dragging
            doubleClickZoom: false, // Disable double-click zoom
            boxZoom: false, // Disable box zoom
            touchZoom: false, // Disable touch zoom
            keyboard: false // Disable keyboard navigation
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Array of cities with coordinates
        const cities = [
            { name: "Davao City", lat: 7.1907, lng: 125.4553 },
            { name: "Zamboanga City", lat: 6.9214, lng: 122.0790 },
            { name: "Cagayan de Oro", lat: 8.4542, lng: 124.6319 },
            { name: "General Santos City", lat: 6.1164, lng: 125.1716 },
            { name: "Butuan", lat: 8.9494, lng: 125.5433 },
            { name: "Iligan", lat: 8.2280, lng: 124.2452 },
            { name: "Cotabato City", lat: 7.2044, lng: 124.2439 },
            { name: "Tagum", lat: 7.4477, lng: 125.8047 },
            { name: "Valencia", lat: 7.9062, lng: 125.0927 },
            { name: "Pagadian", lat: 7.8256, lng: 123.4372 },
            { name: "Panabo", lat: 7.3081, lng: 125.6846 },
            { name: "Marawi", lat: 8.0057, lng: 124.2928 },
            { name: "Koronadal", lat: 6.5032, lng: 124.8463 },
            { name: "Malaybalay", lat: 8.1571, lng: 125.1277 },
            { name: "Digos", lat: 6.7499, lng: 125.3572 },
            { name: "Polomolok", lat: 6.2164, lng: 125.0636 },
            { name: "Surigao City", lat: 9.7577, lng: 125.5135 },
            { name: "Kidapawan", lat: 7.0084, lng: 125.0894 },
            { name: "Mati", lat: 6.9495, lng: 126.2166 },
            { name: "Ozamiz", lat: 8.1462, lng: 123.8504 },
            { name: "Dipolog", lat: 8.5886, lng: 123.3405 },
            { name: "Tacurong", lat: 6.6922, lng: 124.6738 },
            { name: "Bislig", lat: 8.2109, lng: 126.3161 },
            { name: "Bayugan", lat: 8.7566, lng: 125.7516 },
            { name: "El Salvador", lat: 8.5553, lng: 124.5598 },
            { name: "Lamitan", lat: 6.6500, lng: 122.1333 },
            { name: "Tandag", lat: 9.0783, lng: 126.1988 },
            { name: "Sultan Kudarat", lat: 6.6314, lng: 124.5385 },
            { name: "Isabela City", lat: 6.7042, lng: 121.9719 }
        ];

        // Add city markers to the map
        cities.forEach(city => {
            L.marker([city.lat, city.lng])
                .addTo(map)
                .bindTooltip(city.name)
                .on('click', () => {
                    emit('citySelected', city.name);
                });
        });
    }
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    position: relative;
    width: 80%;
    max-width: 800px;
    height: 80%;
    max-height: 600px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

#map {
    height: 100%;
    width: 100%;
}

.close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 10px 15px;
    background: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 1100;
    font-size: 16px;
    color: #fff;
}

.close-button:hover {
    background: #0056b3;
}
</style>
