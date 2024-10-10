// stores/auctionFilterStore.js
import { defineStore } from 'pinia';

export const useAuctionFilterStore = defineStore('auctionFilter', {
    state: () => ({
        selectedCategories: null,
        selectedBiddingType: null,
        selectedRarity: null,
        searchTerm: null,
    }),

    actions: {
        updateCategories(selectedCategories) {
            this.selectedCategories = selectedCategories;
        },
        updateBiddingType(selectedBiddingType) {
            this.selectedBiddingType = selectedBiddingType;
        },
        updateRarity(selectedRarity) {
            this.selectedRarity = selectedRarity;
        },
        updateSearchTerm(searchTerm) {
            this.searchTerm = searchTerm; // Action to set the search term
        },
        clearCategories() {
            this.selectedCategories = null;
        },
        clearBiddingType() {
            this.selectedBiddingType = null;
        },
        clearRarity() {
            this.selectedRarity = null;
        },

    },
});
