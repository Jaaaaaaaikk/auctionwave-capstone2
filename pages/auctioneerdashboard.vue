<template>
 <NuxtLayout name="auctioneernavbar">
      <!-- Content Section -->
      <section class="bg-gray-200 h-96 rounded-lg p-6 flex items-center justify-center">
          <!-- Content Container -->
          <div class="flex flex-row items-center space-x-6">
              <!-- Image Content -->
              <div class="flex-shrink-0">
                  <img src="/public/images/auction-image.png" alt="Create Auction" class="w-64 h-auto" />
              </div>

              <!-- Text Content -->
              <div class="text-center md:text-left">
                  <h2 class="text-2xl font-semibold mb-4">You don't have created auctions yet.</h2>
                  <p class="text-gray-700 dark:text-gray-300 mb-4">Click the button below to create one.</p>
                  <NuxtLink to="/createauctions" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                      Create Auction
                  </NuxtLink>
              </div>
          </div>
      </section>
 </NuxtLayout>
 <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>

</script>

<style scoped>
/* Your styles here */
</style>
