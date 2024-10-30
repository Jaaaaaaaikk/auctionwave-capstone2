<template>
    <aside id="default-sidebar"
        class="fixed top-0 left-0 z-0 w-72  transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div class="h-full px-6 py-20 overflow-y-auto z-0  bg-custom-blue2 dark:bg-gray-800 ">
            <ul class="space-y-2 font-medium ">
                <li>

                    <NuxtLink to="/bidder/bidding-activity">

                        <div class="flex items-center pl-2 py-4 text-gray-900 rounded-lg dark:text-white
hover:bg-custom-bluegreen hover:bg-opacity-25 dark:hover:bg-gray-700 group">
                            <svg viewBox="0 0 1024 1024" class="w-6 h-6" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M512 1024C229.7 1024 0 794.3 0 512S229.7 0 512 0s512 229.7 512 512-229.7 512-512 512z m0-938.7C276.7 85.3 85.3 276.7 85.3 512S276.7 938.7 512 938.7 938.7 747.3 938.7 512 747.3 85.3 512 85.3z"
                                        fill="#3688FF"></path>
                                    <path
                                        d="M640 682.7c-9.6 0-19.3-3.2-27.3-9.9l-128-106.7c-9.7-8.1-15.4-20.1-15.4-32.8V384c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v129.4l112.6 93.9c18.1 15.1 20.5 42 5.5 60.1-8.5 10-20.6 15.3-32.8 15.3z"
                                        fill="#5F6379"></path>
                                </g>
                            </svg>
                            <span class="flex-1 ms-3 whitespace-nowrap">Bidding Activity</span>
                        </div>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="#">

                        <div
                            class="flex items-center pl-2 py-4 text-gray-900 rounded-lg dark:text-white hover:bg-custom-bluegreen hover:bg-opacity-25 dark:hover:bg-gray-700 group">
                            <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                fill="#000000" width="24" height="24">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M860.48 259.52a22.72 22.72 0 0 0 22.656-22.656V152c0-17.6-14.4-32-32-32h-640c-17.6 0-32 14.4-32 32v768c0 17.6 14.4 32 32 32h640c17.6 0 32-14.4 32-32v-250.432h-0.064l0.064-0.448a22.656 22.656 0 0 0-45.312 0l0.064 0.448h-0.064V501.12a22.656 22.656 0 0 0 45.312 0V323.52h-0.064a22.592 22.592 0 0 0-45.248 0h-0.064V236.864a22.784 22.784 0 0 0 22.72 22.656z"
                                        fill=""></path>
                                    <path
                                        d="M837.824 903.616a6.4 6.4 0 0 1-6.4 6.4H230.848a6.4 6.4 0 0 1-6.4-6.4V170.432a6.4 6.4 0 0 1 6.4-6.4h600.576a6.4 6.4 0 0 1 6.4 6.4v733.184z"
                                        fill="#FFFF00"></path>
                                    <path
                                        d="M285.248 520.576a16 16 0 0 1-32 0V249.152a16 16 0 0 1 32 0v271.424zM285.248 655.552a16 16 0 0 1-32 0v-62.976a16 16 0 0 1 32 0v62.976z"
                                        fill="#FFFFFF"></path>
                                    <path
                                        d="M328.704 357.44c0 8.832 7.168 16 16 16h283.968a16 16 0 0 0 0-32H344.704a16.064 16.064 0 0 0-16 16zM690.688 341.44a16 16 0 0 0 0 32h36.032a16 16 0 0 0 0-32h-36.032z"
                                        fill="#BABA00"></path>
                                    <path
                                        d="M328.704 485.12c0 8.832 7.168 16 16 16h381.952a16 16 0 0 0 0-32H344.704a16 16 0 0 0-16 16zM328.704 612.736c0 8.768 7.168 16 16 16h381.952a16 16 0 1 0 0-32H344.704a16 16 0 0 0-16 16z"
                                        fill="#BABA00"></path>
                                    <path
                                        d="M392.448 141.568c0 12.288-10.112 22.4-22.4 22.4h-0.512a22.528 22.528 0 0 1-22.4-22.4V74.752c0-12.288 10.112-22.4 22.4-22.4h0.512c12.288 0 22.4 10.112 22.4 22.4v66.816zM715.136 141.568c0 12.288-10.112 22.4-22.4 22.4h-0.512a22.528 22.528 0 0 1-22.464-22.4V74.752c0-12.288 10.048-22.4 22.464-22.4h0.512c12.224 0 22.4 10.112 22.4 22.4v66.816z"
                                        fill=""></path>
                                </g>
                            </svg>
                            <span class="flex-1 ms-3 whitespace-nowrap">Transaction History</span>
                        </div>
                    </NuxtLink>
                </li>
            </ul>
            <div class="my-4 ">
                <hr class="h-px bg-gray-300  border-0 dark:bg-gray-700 ">
            </div>
            <div class="flex justify-between items-center p-2">
                <p class="font-medium">Bidding Type</p>
                <button @click="clearAuctionType"
                    class="text-sm font-medium text-custom-bluegreen hover:text-custom-bluegreen-dark hover:underline">
                    Clear All
                </button>
            </div>
            <ul class="font-light p-2">
                <li class="flex items-center mb-4" v-for="type in biddingTypes" :key="type">
                    <input :id="type" type="radio" name="auction-type" :value="type"
                        v-model="auctionStore.selectedBiddingType"
                        class="w-4 h-4 text-custom-bluegreen bg-gray-100 border-gray-300 focus:ring-custom-bluegreen dark:focus:ring-blue-600 dark:ring-offset-custom-bluegreen focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label :for="type" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ type
                        }}</label>
                </li>
            </ul>
            <div>
                <hr class="h-px bg-gray-300  border-0 dark:bg-gray-700">
            </div>
            <div class="flex justify-between items-center p-2">
                <p class="font-medium">Rarity</p>
                <button @click="clearAuctionRarity"
                    class="text-sm font-medium text-custom-bluegreen hover:text-custom-bluegreen-dark hover:underline">
                    Clear All
                </button>
            </div>
            <ul class="font-light p-2">
                <li v-for="rarity in rarities" :key="rarity" class="flex items-center pb-2">
                    <input :id="rarity" type="radio" :value="rarity" name="auction-rarity"
                        v-model="auctionStore.selectedRarity"
                        class="w-4 h-4 text-custom-bluegreen bg-gray-100 border-gray-300 focus:ring-custom-bluegreen dark:focus:ring-blue-600 dark:ring-offset-custom-bluegreen focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label :for="rarity" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ rarity
                        }}</label>
                </li>
            </ul>

        </div>
    </aside>


</template>

<script setup>
import { ref } from "vue";
import { useAuctionFilterStore } from "@/stores/fetch-auction-bidder-dashboard";

const categories = ref(['Art', 'Electronics', 'Collectibles', 'Furniture', 'Real Estate']);
const rarities = ref(['Common', 'Uncommon', 'Rare']);
const biddingTypes = ref(["Lowest-Type", "Offer-Type"]);

const auctionStore = useAuctionFilterStore();

// Function to clear all selected categories
const clearAllCategories = () => auctionStore.clearCategories();
const clearAuctionType = () => auctionStore.clearBiddingType();
const clearAuctionRarity = () => auctionStore.clearRarity();

</script>

<style scoped>
/* Add any specific styles for the sidebar here */
</style>