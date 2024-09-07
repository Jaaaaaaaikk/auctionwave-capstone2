<template>
    <NuxtLayout name="auctioneernavbar">
        <div class="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 class="text-3xl">Auction Name!</h1>
            <!-- Auction Details -->
            <div class="mb-6">
                <h1 class="text-3xl font-semibold mb-2"></h1>
                <p class="text-gray-600 mb-4"></p>
                <div class="flex items-center space-x-4 mb-4">
                    <span class="text-xl font-medium">Bidding Type:</span>
                    <span class="text-lg text-blue-500">lower-type/offer-type</span>
                </div>
                <div class="flex items-center space-x-4 mb-4">
                    <span class="text-xl font-medium">Starting Bid:</span>
                    <span class="text-lg text-green-500">$</span>
                </div>
                <div class="flex items-center space-x-4 mb-4">
                    <span class="text-xl font-medium">Location:</span>
                    <span class="text-lg text-green-500">ex. location</span>
                </div>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-100 rounded-lg shadow-md">
                        <h3 class="text-lg font-medium">Description</h3>
                        <p class="text-gray-500">text of description....</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4 mb-4">
                    <span class="text-xl font-medium">Rarity:</span>
                    <span class="text-lg text-green-500">Common(5%)/Uncommon(10%)/Rare(20%)</span>
                </div>
            </div>
            <div class="flex items-center space-x-4 mb-4">
                <span class="text-xl font-medium">Status:</span>
                <span class="text-lg text-green-500">Auction Pending/Auction Done</span>
            </div>
            <!-- Participated Bidders -->
            <div class="space-y-4">
                <div class="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h1 class="text-3xl mb-2">Participated Bidders</h1>
                    <h3 class="text-lg font-medium">fullname</h3>
                    <p class="text-gray-500">location</p>
                </div>
            </div>
            <div class="space-y-4">
                <div class="p-4 bg-gray-100 rounded-lg shadow-md">
                    <button class="text-lg border bg-green-500 rounded-full px-4 py-2 shadow-md shadow-black hover:bg-teal-600 font-semibold">Email Blast</button>
                </div>
            </div>
        </div>
    </NuxtLayout>
    <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
</script>

<style scoped></style>