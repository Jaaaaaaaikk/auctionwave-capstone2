<template>
  <NuxtLayout name="auctioneernavbar">
    <NuxtLayout name="auctioneersidebar"></NuxtLayout>

    <div class="my-6">
      <div class="flex flex-wrap mx-auto w-5/6">
        <!-- First Filter Item -->
        <div class="filter-container w-full sm:w-1/2 xl:w-1/2 p-3" @click="filterPendingAuctions">
          <div
            class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white hover:bg-custom-bluegreen hover:bg-opacity-20 hover:cursor-pointer">
            <div class="p-3 rounded-full bg-indigo-600 bg-opacity-75">
              <svg class="w-8 h-8" fill="#fffafa" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.623 7.603l6.062 3.5c0.479 0.276 1.090 0.112 1.365-0.366 0.277-0.478 0.113-1.090-0.365-1.365l-6.062-3.5c-0.479-0.276-1.090-0.112-1.366 0.365s-0.112 1.089 0.366 1.366zM17.186 11.969l-6.062-3.5-3.5 6.062 6.062 3.5 3.5-6.062zM6.123 17.129l6.062 3.5c0.478 0.276 1.090 0.112 1.365-0.366s0.112-1.090-0.365-1.365l-6.062-3.5c-0.479-0.276-1.090-0.112-1.366 0.365-0.277 0.478-0.112 1.090 0.366 1.366zM27.012 19.951l-11.076-5.817-1 1.732 10.576 6.683c0.717 0.414 1.635 0.169 2.049-0.549s0.168-1.635-0.549-2.049zM16.033 25c0-0.553-0.448-1-1-1h-9c-0.553 0-1 0.447-1 1 0 0.552 0 1 0 1l-1.033-0.021 0.033 1.021h13l0.047-0.958-0.984-0.042c0 0-0.063-0.448-0.063-1z">
                </path>
              </svg>
            </div>
            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ totalPendingAuctions }}</h4>
              <div class="text-gray-500">Pending Auctions</div>
            </div>
          </div>
        </div>

        <!-- Second Filter Item -->
        <div class="filter-container w-full sm:w-1/2 xl:w-1/2 p-3 mt-6 sm:mt-0" @click="filterPendingTransactions">
          <div
            class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white hover:bg-custom-bluegreen hover:bg-opacity-20 hover:cursor-pointer">
            <div class="p-3 rounded-full bg-pink-600 bg-opacity-75">
              <svg viewBox="0 0 1024 1024" class="w-8 h-8" version="1.1" xmlns="http://www.w3.org/2000/svg"
                fill="#000000">
                <path
                  d="M511.9 183c-181.8 0-329.1 147.4-329.1 329.1s147.4 329.1 329.1 329.1c181.8 0 329.1-147.4 329.1-329.1S693.6 183 511.9 183z m0 585.2c-141.2 0-256-114.8-256-256s114.8-256 256-256 256 114.8 256 256-114.9 256-256 256z">
                </path>
                <path d="M548.6 365.7h-73.2v161.4l120.5 120.5 51.7-51.7-99-99z" fill="#ffffff"></path>
              </svg>
            </div>
            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ totalPendingTransaction }}</h4>
              <div class="text-gray-500">Transaction Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="bg-white rounded-lg  flex flex-col items-center justify-center w-5/6 mx-auto">
      <!-- Default Message if No Auctions Exist -->
      <div v-if="auctions.length === 0 && !isSearching && !isLoading" class="flex flex-row items-center space-x-6">
        <div class="flex-shrink-0">
          <img src="/public/images/auction-image.png" alt="Create Auction" class="w-64 h-auto" />
        </div>
        <div class="text-center md:text-left">
          <h2 class="text-2xl font-semibold mb-4">
            You don't have created auctions yet.
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Click the button below to create one.
          </p>
          <button @click="create_AuctionModal = true"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Create Auction
          </button>
        </div>
      </div>

      <!-- Auctions Table if Auctions Exist -->
      <div v-else class="w-full">
        <div class="gap-4 sm:flex sm:items-center sm:justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl m-6">My Auctions</h2>

          <div class="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0 mx-6">
            <!-- <form @submit.prevent class="flex justify-end max-w-lg w-full"> -->
            <label for="simple-search" class="sr-only">Search</label>
            <div class="relative w-full">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                </svg>
              </div>
              <input type="search" v-model="searchTerm" @input="handleSearch" id="simple-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                placeholder="Search auction name..." />
            </div>

            <!-- </form> -->

            <div>
              <label for="AuctionStatus"
                class="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Auction Status</label>
              <select id="AuctionStatus" v-model="selectedAuctionStatus" @change="resetAuctionStatus" class="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 py-2.5 text-sm
                text-gray-900 focus:border-custom-bluegreen focus:ring-custom-bluegreen dark:border-gray-600
                dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-custom-bluegreen
                dark:focus:ring-custom-bluegreen">
                <option value="">
                  All
                </option>
                <option v-for="auctionStatus in auctionStatusMap" :key="auctionStatus" :value="auctionStatus">
                  {{ auctionStatus }}
                </option>
              </select>
            </div>

            <div>
              <label for="AuctionTransaction
                Status" class="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">AuctionTransaction
                Status</label>
              <select id="AuctionTransaction
                Status" v-model="selectedTransactionStatus" @change="resetTransactionStatus"
                class="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-custom-bluegreen focus:ring-custom-bluegreen dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-custom-bluegreen dark:focus:ring-custom-bluegreen">
                <option value="">
                  All
                </option>
                <option v-for="transactionStatus in transactionStatusMap" :key="transactionStatus"
                  :value="transactionStatus">
                  {{ transactionStatus }}
                </option>
              </select>
            </div>

            <!-- <span class="inline-block text-gray-500 dark:text-gray-400"> from </span> -->

            <button @click="create_AuctionModal = true"
              class="flex bg-custom-bluegreen text-white py-2 px-4 rounded hover:bg-green-500"><svg class=" w-5 h-5"
                fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>

          </div>
        </div>

        <!-- Message for No Search Results -->
        <div v-if="isSearching && filteredAuctions.length === 0 && !isLoading"
          class="text-center mt-6 text-gray-500 dark:text-gray-300">
          {{ noResultsMessage }}
        </div>

        <!-- Add Loading Spinner here -->
        <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center z-50">

          <!--Backdrop of Loading Spinner-->
          <div class="absolute inset-0 bg-gray-900 bg-opacity-50"></div>

          <div class="flex items-center space-x-4">
            <svg class="animate-spin" width="80" height="80" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2592_7101)">
                <path opacity="0.33" fill-rule="evenodd" clip-rule="evenodd"
                  d="M12.6066 0.345176L12.1759 1.95287C11.9417 1.88993 11.7052 1.83929 11.4632 1.79612C11.2212 1.75296 10.9818 1.71873 10.7403 1.6968L10.892 0.0393588C11.1794 0.065229 11.4687 0.104137 11.7559 0.15535C12.043 0.206563 12.3279 0.270083 12.6066 0.345176Z"
                  fill="#3758F9" />
                <path opacity="0.38" fill-rule="evenodd" clip-rule="evenodd"
                  d="M15.0182 1.34671L14.1811 2.78881C13.7674 2.54571 13.3299 2.34072 12.8687 2.17381L13.44 0.60813C13.9926 0.808271 14.5193 1.05881 15.0182 1.34671Z"
                  fill="#3758F9" />
                <path opacity="0.42" fill-rule="evenodd" clip-rule="evenodd"
                  d="M17.0867 2.94304L15.904 4.1161C15.5633 3.77177 15.1915 3.45996 14.7933 3.17731L15.7554 1.81679C16.2325 2.15582 16.6776 2.53148 17.0867 2.94304Z"
                  fill="#3758F9" />
                <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd"
                  d="M18.6682 5.01543L17.225 5.84575C16.9824 5.4258 16.7068 5.02535 16.3966 4.65259L17.6747 3.58543C18.0477 4.03288 18.3814 4.51141 18.6682 5.01543Z"
                  fill="#3758F9" />
                <path opacity="0.55" fill-rule="evenodd" clip-rule="evenodd"
                  d="M19.6684 7.42856L18.0557 7.85621C17.9323 7.38556 17.7642 6.92809 17.5622 6.49423L19.0718 5.79002C19.3166 6.31617 19.5152 6.86372 19.6684 7.42856Z"
                  fill="#3758F9" />
                <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd"
                  d="M20.002 10.019L18.3354 10.0138C18.3382 9.52335 18.293 9.04126 18.2128 8.56561L19.8546 8.28284C19.953 8.84638 20.0053 9.43131 20.002 10.019Z"
                  fill="#3758F9" />
                <path opacity="0.65" fill-rule="evenodd" clip-rule="evenodd"
                  d="M19.8447 11.7559C19.7934 12.043 19.7299 12.328 19.6548 12.6066L18.0438 12.1711C18.106 11.941 18.1607 11.7053 18.2039 11.4633C18.247 11.2212 18.2779 10.977 18.2991 10.7396L19.9606 10.892C19.9355 11.1753 19.8966 11.4647 19.8447 11.7559Z"
                  fill="#3758F9" />
                <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd"
                  d="M19.3926 13.436C19.1917 13.9927 18.9412 14.5194 18.6533 15.0182L17.2112 14.1812C17.4502 13.7667 17.66 13.3259 17.8269 12.8647L19.3926 13.436Z"
                  fill="#3758F9" />
                <path opacity="0.75" fill-rule="evenodd" clip-rule="evenodd"
                  d="M18.184 15.7514C17.8442 16.2325 17.4685 16.6776 17.0577 17.0826L15.8839 15.904C16.2241 15.5626 16.54 15.1915 16.8186 14.7926L18.184 15.7514Z"
                  fill="#3758F9" />
                <path opacity="0.8" fill-rule="evenodd" clip-rule="evenodd"
                  d="M16.4112 17.6699C15.9678 18.0437 15.4893 18.3774 14.9846 18.6682L14.1543 17.225C14.5742 16.9825 14.9713 16.702 15.344 16.3918L16.4112 17.6699Z"
                  fill="#3758F9" />
                <path opacity="0.95" fill-rule="evenodd" clip-rule="evenodd"
                  d="M14.21 19.0718C13.6838 19.3166 13.1363 19.5152 12.5721 19.6643L12.1397 18.055C12.6111 17.9275 13.0678 17.7635 13.5065 17.5581L14.21 19.0718Z"
                  fill="#3758F9" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M11.7179 19.8505C11.1495 19.9523 10.5694 20.0012 9.98093 20.0021L9.98616 18.3354C10.4773 18.3341 10.9587 18.293 11.4303 18.2121L11.7179 19.8505Z"
                  fill="#3758F9" />
                <path opacity="0.05" fill-rule="evenodd" clip-rule="evenodd"
                  d="M9.10799 19.9606C8.82057 19.9347 8.53124 19.8958 8.24411 19.8446C7.95697 19.7934 7.67203 19.7299 7.39339 19.6548L7.82477 18.043C8.05902 18.1059 8.29474 18.1607 8.53675 18.2039C8.77877 18.247 9.01887 18.2771 9.26044 18.2991L9.10799 19.9606Z"
                  fill="#3758F9" />
                <path opacity="0.07" fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.1312 17.8262L6.55991 19.3919C6.00803 19.1876 5.48061 18.9412 4.98248 18.6492L5.8188 17.2112C6.23328 17.4502 6.67074 17.6552 7.1312 17.8262Z"
                  fill="#3758F9" />
                <path opacity="0.09" fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.20739 16.8186L4.24522 18.1791C3.76744 17.8442 3.32232 17.4685 2.91323 17.057L4.09664 15.8798C4.43731 16.2241 4.80917 16.5359 5.20739 16.8186Z"
                  fill="#3758F9" />
                <path opacity="0.11" fill-rule="evenodd" clip-rule="evenodd"
                  d="M3.60406 15.3433L2.32599 16.4105C1.95293 15.963 1.61927 15.4845 1.33248 14.9805L2.7757 14.1501C3.01823 14.5701 3.29386 14.9705 3.60406 15.3433Z"
                  fill="#3758F9" />
                <path opacity="0.13" fill-rule="evenodd" clip-rule="evenodd"
                  d="M2.43772 13.5058L0.928848 14.2059C0.683367 13.6838 0.484757 13.1363 0.332289 12.5673L1.94493 12.1397C2.06838 12.6103 2.2365 13.0678 2.43772 13.5058Z"
                  fill="#3758F9" />
                <path opacity="0.15" fill-rule="evenodd" clip-rule="evenodd"
                  d="M1.78797 11.4303L0.145415 11.7171C0.0477348 11.1495 -0.00526797 10.5687 -0.0012875 9.97685L1.66536 9.98208C1.66253 10.4725 1.70701 10.9587 1.78797 11.4303Z"
                  fill="#3758F9" />
                <path opacity="0.17" fill-rule="evenodd" clip-rule="evenodd"
                  d="M1.79609 8.53676C1.75293 8.77878 1.7228 9.01888 1.70161 9.25635L0.0393276 9.108C0.0651979 8.82058 0.104105 8.53125 0.155319 8.24411C0.206532 7.95698 0.270783 7.66794 0.345145 7.39339L1.95694 7.82478C1.89473 8.05493 1.83926 8.29475 1.79609 8.53676Z"
                  fill="#3758F9" />
                <path opacity="0.19" fill-rule="evenodd" clip-rule="evenodd"
                  d="M2.78952 5.81474C2.5498 6.23332 2.3407 6.67005 2.17379 7.13124L0.608112 6.55995C0.808254 6.00734 1.05953 5.47655 1.3467 4.98179L2.78952 5.81474Z"
                  fill="#3758F9" />
                <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd"
                  d="M4.11613 4.09597C3.77663 4.43326 3.46072 4.80439 3.18218 5.20335L1.81682 4.24454C2.15585 3.7675 2.53151 3.32237 2.94307 2.91328L4.11613 4.09597Z"
                  fill="#3758F9" />
                <path opacity="0.25" fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.84654 2.77086C5.4266 3.01339 5.02952 3.29386 4.65676 3.60406L3.58959 2.32599C4.03295 1.9522 4.51147 1.61853 5.01622 1.32764L5.84654 2.77086Z"
                  fill="#3758F9" />
                <path opacity="0.28" fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.86098 1.94089C7.3896 2.06844 6.93287 2.23246 6.49417 2.43778L5.78996 0.928178C6.31611 0.683428 6.86366 0.484819 7.4285 0.331619L7.86098 1.94089Z"
                  fill="#3758F9" />
                <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd"
                  d="M10.0138 1.66458C9.52332 1.66175 9.04195 1.70287 8.56968 1.78793L8.2828 0.145371C8.85044 0.0476906 9.43127 -0.00531221 10.019 -0.00206337L10.0138 1.66458Z"
                  fill="#3758F9" />
              </g>
              <defs>
                <clipPath id="clip0_2592_7101">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span class="text-lg font-medium text-gray-700">PLEASE WAIT...</span>
          </div>
        </div>

        <div v-for="auction in filteredAuctions" :key="auction.listing_id" @click="view_auction(auction)"
          class="flex flex-wrap items-center border-b gap-y-4 py-5 hover:bg-custom-bluegreen hover:bg-opacity-20 hover:cursor-pointer border-gray-300 px-6">

          <!-- Auction Name -->
          <dl class="flex-1">
            <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Auction Name:</dt>
            <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
              <a href="#" class="hover:underline">{{ auction.name }}</a>
            </dd>
          </dl>

          <!-- Status -->
          <dl class="flex-1">
            <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
            <dd v-if="auction.transaction_status" class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
              {{ auction.transaction_status }}
            </dd>
            <dd v-else class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
              {{ auction.status }}
            </dd>
          </dl>

          <!-- Location -->
          <dl class="flex-1">
            <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Location:</dt>
            <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{{ auction.location_name }}</dd>
          </dl>

          <!-- Bidding Type -->
          <dl class="flex-1">
            <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Bidding Type:</dt>
            <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{{ auction.bidding_type }}</dd>
          </dl>

          <!-- Rarity -->
          <dl class="flex-1">
            <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Rarity:</dt>
            <dd :class="{
              ' text-blue-400': auction.rarity === 'Common',
              ' text-purple-800': auction.rarity === 'Uncommon',
              ' text-red-800': auction.rarity === 'Rare',
            }" class="mt-1.5 text-base font-semibold dark:text-white">{{ auction.rarity }}</dd>
          </dl>

          <!-- Email Blast Status -->
          <dl class="flex-1">
            <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Email Blast Status:</dt>
            <dd v-if="auction.email_blast_paid" class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">Yes
            </dd>
            <dd v-else class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">No</dd>
          </dl>

          <!-- Date Created -->
          <dl class="flex-1">
            <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Date Created:</dt>
            <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{{ formatDate(auction.created_at)
              }}</dd>
          </dl>

          <!-- Transaction Status: Item Received / Not Received -->
          <dl @click.stop
            v-if="auction.transaction_status === 'Transaction Pending' || auction.transaction_status === 'Transaction Completed'"
            class="flex-1">
            <dd class="mt-1.5 flex items-center space-x-2">
              <!-- Item Received -->
              <button v-if="auction.is_rated === 0" :class="{
                'bg-custom-bluegreen hover:bg-green-500': auction.transaction_status === 'Transaction Pending',
                'bg-yellow-500 hover:bg-yellow-600': auction.transaction_status === 'Transaction Completed',
              }" class="flex items-center justify-center px-2 py-1 rounded text-white space-x-1"
                @click="handleButtonClick(auction)">
                <svg v-if="auction.transaction_status === 'Transaction Pending'" xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M16.707 6.707a1 1 0 00-1.414-1.414L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                    clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 15.27l5.18 2.73-1.64-6.93L18 7.24l-7.19-.61L10 0 9.19 6.63 2 7.24l4.46 4.11L4.82 18z"
                    clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-center p-2">
                  {{ auction.transaction_status === 'Transaction Pending' ? 'Mark as Complete' : 'Rate Experience' }}
                </span>
              </button>

            </dd>


            <div v-if="showRateModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div class="bg-white p-6 rounded-lg shadow-md w-96">
                <h3 class="text-lg font-semibold mb-4">Rate Experience</h3>
                <div class="flex justify-center space-x-2">
                  <button v-for="star in 5" :key="star" @click="setRating(star)"
                    :class="{ 'text-yellow-400': star <= rating, 'text-gray-400': star > rating }" class="text-4xl">
                    ★
                  </button>
                </div>
                <div class="mt-4 flex justify-end space-x-2">
                  <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                  <button :disabled="rating === 0" @click="submitRating"
                    class="px-4 py-2 bg-custom-bluegreen text-white rounded hover:bg-green-500">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </dl>

          <dl @click.stop v-else-if="auction.status === 'Awaiting Bidder Payment'" class="flex-1">
            <button class="ml-4 px-4 py-2 bg-custom-bluegreen text-white rounded hover:bg-green-500">
              Open the auction
            </button>
          </dl>

          <!-- Empty Space if No Item Status -->
          <span v-else class="flex-1"></span>
        </div>


        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="my-20 mx-auto flex justify-center">
          <div class="inline-flex -space-x-px text-sm">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-gray-700">
              Previous
            </button>
            <span v-for="page in totalPages" :key="page" :class="{
              'flex items-center justify-center px-3 h-8 text-custom-bluegreen border border-gray-300 bg-green-50 hover:bg-blue-100 hover:text-blue-700': currentPage === page,
              'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700': currentPage !== page
            }" @click="goToPage(page)">
              {{ page }}
            </span>

            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-custom-bluegreen hover:bg-opacity-25 hover:text-gray-700">
              Next
            </button>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="flex flex-col min-w-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded pb-24 z-0">
          <div class="rounded-t mb-0 px-0 border-0">
            <div class="flex flex-wrap items-center px-4 py-2">
              <div class=" w-full max-w-full flex-grow flex-1">
                <h3 class="font-semibold text-base text-gray-900 dark:text-gray-50">Recent Activities</h3>
              </div>
            </div>
            <div class="block w-full">
              <div
                class="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Today
              </div>
              <ul class="my-1">
                <li v-if="recentActivitiesToday.length === 0" class="px-4 py-2 text-gray-600 dark:text-gray-200">No
                  recent activities today.</li>
                <li v-for="(activity, index) in recentActivitiesToday" :key="index" class="flex px-4">
                  <div class="w-9 h-9 rounded-full flex-shrink-0 bg-indigo-500 my-2 mr-3">
                    <svg class="w-9 h-9 fill-current text-indigo-50" viewBox="0 0 36 36">
                      <path
                        d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z">
                      </path>
                    </svg>
                  </div>
                  <div
                    class="flex-grow flex items-center border-b border-gray-100 dark:border-gray-400 text-sm text-gray-600 dark:text-gray-100 py-2">
                    <div class="flex-grow flex justify-between items-center">
                      <span class="self-center">
                        {{ activity.message }}
                      </span>
                      <div class="flex-shrink-0 ml-2">
                        <button
                          class="flex items-center font-medium text-custom-bluegreen hover:text-green-500 dark:text-blue-400 dark:hover:text-blue-500"
                          style="outline: none;" @click="viewActivity(activity)">
                          View
                          <span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
                              class="transform transition-transform duration-500 ease-in-out">
                              <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                class="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Yesterday
              </div>
              <ul class="my-1">
                <li v-if="recentActivitiesYesterday.length === 0" class="px-4 py-2 text-gray-600 dark:text-gray-200">No
                  recent activities yesterday.</li>
                <li v-for="(activity, index) in recentActivitiesYesterday" :key="index" class="flex px-4">
                  <div class="w-9 h-9 rounded-full flex-shrink-0 bg-green-500 my-2 mr-3">
                    <svg class="w-9 h-9 fill-current text-light-blue-50" viewBox="0 0 36 36">
                      <path
                        d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z">
                      </path>
                    </svg>
                  </div>
                  <div class="flex-grow flex items-center border-gray-100 text-sm text-gray-600 dark:text-gray-50 py-2">
                    <div class="flex-grow flex justify-between items-center">
                      <span class="self-center">{{ activity.message }}</span>
                      <div class="flex-shrink-0 ml-2">
                        <button @click="viewActivity(activity)"
                          class="flex items-center font-medium text-custom-bluegreen hover:text-green-500 dark:text-blue-400 dark:hover:text-blue-500"
                          href="#0" style="outline: none;">
                          View<span><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
                              class="transform transition-transform duration-500 ease-in-out">
                              <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"></path>
                            </svg></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- ./Recent Activities -->
      </div>

      <CreateAuction_Modal v-if="create_AuctionModal" @close="handleModalClose" />

    </section>

  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import CreateAuction_Modal from "~/components/createauctionmodal.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const create_AuctionModal = ref(false);
const auctions = ref([]);
const currentPage = ref(1);
const pageSize = ref(6);
const totalPages = ref(0);
const router = useRouter();
const searchTerm = ref("");
const isSearching = ref(false);
const isFiltered = ref(false);
const totalPendingAuctions = ref(0);
const totalPendingTransaction = ref(0);
const selectedAuctionStatus = ref("");
const selectedTransactionStatus = ref("");
const recentActivitiesToday = ref([]);
const recentActivitiesYesterday = ref([]);
const showRateModal = ref(false);
const selectedAuctionForRating = ref(null);
const rating = ref(0);
const isLoading = ref(true);


// Initialize auction status map as an array of strings
const auctionStatusMap = ref([
  "Auction Pending",
  "Awaiting Bidder Payment",
  "Auction Ended",

]);

const transactionStatusMap = ref([
  "Transaction Pending",
  "Transaction Completed",
  "Transaction Failed",
]);

const setRating = (value) => {
  rating.value = value;
};

const openRateModal = (auction) => {
  if (!auction.listing_id || !auction.bidder_id) {
    toast.error("Unable to proceed. Missing required data.");
    return;
  }
  selectedAuctionForRating.value = {
    listing_id: auction.listing_id,
    bidder_id: auction.bidder_id,
  };
  showRateModal.value = true;
};

const closeModal = () => {
  showRateModal.value = false;
  rating.value = 0;
};

const submitRating = async () => {
  isLoading.value = true;
  if (!selectedAuctionForRating.value || !selectedAuctionForRating.value.listing_id || !selectedAuctionForRating.value.bidder_id) {
    toast.error("Missing required data for rating.");
    return;
  }

  if (rating.value === 0) {
    toast.error('Please select a rating before submitting.');
    return;
  }

  const { listing_id, bidder_id } = selectedAuctionForRating.value;

  try {
    const response = await axios.post('/api/ratings/auctioneer-rating', {
      listing_id,
      bidder_id,
      rating: rating.value,
    });

    if (response.data.success) {
      toast.success('Thank you for your feedback!');
      closeModal();
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    toast.error('An error occurred while submitting your rating.');
  } finally {
    isLoading.value = false;
  }
};


const handleButtonClick = (auction) => {
  if (auction.transaction_status === 'Transaction Pending') {
    handleMarkTransactionPending(auction.transaction_id);
  } else if (auction.transaction_status === 'Transaction Completed') {
    openRateModal(auction);
  }
};

const handleMarkTransactionPending = async (transaction_id) => {
  isLoading.value = true;
  if (
    confirm(
      "This will mark the transaction as successful. Are you sure you want to proceed?"
    )
  ) {
    try {
      const response = await axios.post(
        "/api/auctions/update-transaction-status",
        { transaction_id }
      );

      if (response.data.success) {
        toast.success("Transaction marked as completed.");
        // Optionally, refresh auction list or update UI state
      } else {
        toast.error(response.data.message || "Failed to update transaction.");
      }
    } catch (error) {
      console.error("Failed to update transaction status:", error);
      toast.error("An error occurred while updating the transaction.");
    } finally {
      isLoading.value = false;
    }
  }
};


const noResultsMessage = computed(() => {
  if (selectedAuctionStatus.value) {
    return "No auctions found for the selected auction status.";
  } else if (selectedTransactionStatus.value) {
    return "No auctions found for the selected transaction status.";
  } else {
    return "No auctions found for your search criteria.";
  }
});

const filterPendingAuctions = () => {
  selectedAuctionStatus.value = "Auction Pending";
  selectedTransactionStatus.value = "";
  currentPage.value = 1;
  isSearching.value = true;
  isFiltered.value = true;
  fetchAuctions();
};


const filterPendingTransactions = () => {
  selectedAuctionStatus.value = "";
  selectedTransactionStatus.value = "Transaction Pending";
  currentPage.value = 1;
  isSearching.value = true;
  isFiltered.value = true;
  fetchAuctions();
};

const resetAuctionStatus = () => {
  selectedTransactionStatus.value = "";
  searchTerm.value = "";
  currentPage.value = 1;
  isFiltered.value = true;
  isSearching.value = true;
  fetchAuctions();
};

const resetTransactionStatus = () => {
  selectedAuctionStatus.value = "";
  searchTerm.value = "";
  currentPage.value = 1;
  isFiltered.value = true;
  isSearching.value = true;
  fetchAuctions();
};

const fetchRecentActivities = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.post("/api/auctions/display-recent-activities", {
    });
    console.log('the Data', data);
    recentActivitiesToday.value = data.recentActivitiesToday;
    recentActivitiesYesterday.value = data.recentActivitiesYesterday;

  } catch (error) {
    console.error("Error fetching recent activities:", error);
  } finally {
    isLoading.value = false;
  }
};


const view_auction = (auction) => {
  // Pass auction ID in query parameter
  router.push({ path: '/auctioneer/auctioneer-manage-auction', query: { id: auction.uuid } });
};

const viewActivity = (activity) => {
  // Pass auction ID in query parameter
  router.push({ path: '/auctioneer/auctioneer-manage-auction', query: { id: activity.auctionUuid } });
};

// Fetch auctions with pagination parameters
const fetchAuctions = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get("/api/auctions/auctioneer-created-auctions", {
      params: { page: currentPage.value, pageSize: pageSize.value, search: searchTerm.value, auctionStatus: selectedAuctionStatus.value, transactionStatus: selectedTransactionStatus.value, }
    });

    auctions.value = data.auctions;
    totalPendingAuctions.value = data.totalAuctionPending;
    totalPendingTransaction.value = data.totalTransactionPending;
    totalPages.value = data.totalPages;

  } catch (error) {
    console.error("Failed to fetch auctions:", error);
  } finally {
    isLoading.value = false;
  }
};

// Computed filtered results
const filteredAuctions = computed(() => {
  if (!isFiltered.value) return auctions.value;
  return auctions.value.filter((auction) => {
    const matchesSearchTerm = auction.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesAuctionStatus = !selectedAuctionStatus.value || auction.status === selectedAuctionStatus.value;
    const matchesTransactionStatus = !selectedTransactionStatus.value || auction.transaction_status === selectedTransactionStatus.value;
    return matchesSearchTerm && matchesAuctionStatus && matchesTransactionStatus;
  });
});


watch([filteredAuctions, currentPage], () => {
  // If currentPage exceeds totalPages after filtering, adjust it to totalPages
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;  // Ensure currentPage stays within totalPages
  }
});


const handleSearch = () => {
  currentPage.value = 1; // Reset to the first page on search
  isSearching.value = !!searchTerm.value;
  selectedAuctionStatus.value = "";
  selectedTransactionStatus.value = "";
  isFiltered.value = true;
  fetchAuctions(); // Re-fetch auctions after updating search
};


const handleModalClose = () => {
  create_AuctionModal.value = false;
  fetchAuctions(); // Re-fetch auctions after closing the modal
};

// Pagination controls
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    fetchAuctions();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    fetchAuctions();
  }
};

const goToPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchAuctions();
  }
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchAuctions();
  fetchRecentActivities();

});

</script>


<style scoped>
/* Your styles here */
</style>
