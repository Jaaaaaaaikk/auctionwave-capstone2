<template>
  <NuxtLayout name="auctioneernavbar">
    <NuxtLayout name="auctioneersidebar"></NuxtLayout>

    <div v-if="!isLoading" class="bg-white py-6 my-4 sm:py-8 lg:py-12 w-3/5 mx-auto rounded-md">

      <div class="mx-auto max-w-screen-lg px-4 md:px-8">
        <!-- Breadcrumb -->
        <nav class="flex  pb-16 text-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
              <NuxtLink to="/auctioneer/auctioneerdashboard"
                class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Dashboard
              </NuxtLink>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 9 4-4-4-4" />
                </svg>
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{{ auction.name
                  }}</span>
              </div>
            </li>
          </ol>
        </nav>
        <div class="mb-2 md:mb-3">
          <h2 class="text-2xl font-semibold text-gray-800 lg:text-3xl">{{ auction.name }}</h2>
        </div>


        <div class="grid gap-8 md:grid-cols-3">
          <!-- images - start -->
          <div class="space-y-4 w-full col-span-2">
            <div class="relative overflow-hidden rounded-lg bg-gray-100 border">
              <img v-if="auction.image_url" :src="auction.image_url" loading="lazy" alt="Auction Image Preview"
                class="h-full w-full object-cover object-center" />
              <img v-else src="public/images/no-image.jpg" alt="No Image Available"
                class="h-full w-full object-cover object-center" />
            </div>
            <div class="mt-10 md:mt-16 lg:mt-20">

              <div class="mb-3 text-lg font-semibold text-gray-800">Auction Request Caption</div>
              <p v-if="!auction.caption" class="text-gray-500">No Request Caption Provided.</p>
              <p class="mb-3 text-lg  text-gray-500">{{ auction.caption }}</p>

              <div class="mb-3 text-lg font-semibold text-gray-800">Auction Request Description</div>
              <p v-if="!auction.description" class="text-gray-500">No Request Description Provided.</p>
              <p class="text-gray-500">
                {{ auction.description }}<br /><br />
              </p>
            </div>


          </div>
          <div class="">
            <div class=" items-center mb-4">
              <!-- <a href="#" class=" text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">47 participants</a> -->
              <p class="font-semibold text-lg">Bidding Type</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ auction.bidding_type }}</p>
              </div>
            </div>
            <div v-if="auction.bidding_type === 'Lowest-type'" class=" items-center mb-4">

              <p class="font-semibold text-lg">Starting Bid</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ formatNumber(auction.starting_bid) }}</p>
              </div>
            </div>
            <div class=" items-center mb-4">

              <p class="font-semibold text-lg">Location</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ auction.location }}</p>
              </div>
            </div>
            <div class=" items-center mb-4">

              <p class="font-semibold text-lg">Rarity</p>
              <div class=" flex items-center ">
                <p class="text-gray-500">{{ auction.rarity }}</p>
              </div>
            </div>
            <div v-if="auction.bidding_type === 'Lowest-type'" class="my-4">
              <strong>Time Left </strong>
              <span v-if="remainingTime > 0" class="flex text-red-300">{{ formattedTime }}</span>
              <span v-else-if="remainingTime <= 0 || auction.status === 'Auction Ended'" class="text-red-300"> (Auction
                Ended)</span>
            </div>
            <div v-if="auction.bidding_type === 'Offer-type'" class=" items-center mb-4">
              <p class="font-semibold text-lg">Status</p>
              <div class=" flex items-center ">
                <p v-if="auction.status === 'Auction Ended'" class="text-red-300">(Auction Ended)</p>
                <p v-if="auction.status === 'Auction Pending'" class="text-gray-500">{{ auction.status }}</p>
              </div>
            </div>
          </div>
        </div>



        <div class="flex gap-2.5 my-7 relative"> <!-- Add relative positioning here -->
          <button @click="confirmEmailBlast" :disabled="isEmailBlastSent"
            class="inline-block flex-1 rounded-lg bg-custom-bluegreen px-8 py-3 text-center text-sm font-semibold text-white outline-none  transition duration-100 hover:bg-green-500 focus-visible:ring  sm:flex-none md:text-base"
            :class="{ 'opacity-50 cursor-not-allowed': isEmailBlastSent }">
            {{ isEmailBlastSent ? "Email Blast Sent Already" : "Email Blast" }}
          </button>

          <svg @click="toggleTooltip"
            class="w-6 h-6 cursor-pointer text-blue-500 hover:text-blue-400 transition duration-200 ease-in-out"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12 7C11.45 7 11 7.45 11 8V11C11 11.55 11.45 12 12 12C12.55 12 13 11.55 13 11V8C13 7.45 12.55 7 12 7ZM12 13C11.45 13 11 13.45 11 14C11 14.55 11.45 15 12 15C12.55 15 13 14.55 13 14C13 13.45 12.55 13 12 13Z"
              fill="currentColor" />
          </svg>

          <!-- Tooltip Popup -->
          <div v-if="isTooltipVisible" @click="toggleTooltip"
            class="absolute left-0 top-8 bg-gray-200 text-black p-2 rounded-lg shadow-lg z-10 w-60">
            <p class="text-sm">Click the "Email Blast" button to notify all participants about the auction. Ensure
              that you've completed the payment process first.</p>
          </div>
        </div>

        <div v-if="isPaymentModalOpen">
          <div
            class="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
            <div class="relative w-full max-w-md px-4 h-full md:h-auto">
              <!-- Modal content -->
              <div class="bg-white rounded-lg shadow relative dark:bg-gray-700">
                <div class="flex justify-end p-2">
                  <button type="button" @click="closePaymentModal"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                    <svg class="w-5 h-5" fill="curren tColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                <div class="px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8 text-center">
                  <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-5">Email Blast Payment</h3>
                  <p class="text-gray-600 mb-5">Choose Your Payment Method.</p>
                  <div id="paypal-button-container"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Add Loading Spinner here -->
    <div v-else-if="isLoading" class="fixed inset-0 flex items-center justify-center z-50">

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



    <div v-if="auction.bidding_type === 'Lowest-type'"
      class="bg-white py-6sm:py-8 lg:py-12 w-3/5 mx-auto rounded-md mb-44 ">
      <div class="mx-auto max-w-screen-lg px-4 md:px-8 pb-4">
        <h1 class="text-3xl font-semibold mb-2">Bidders Participated</h1>
      </div>
      <div v-if="bidders.length === 0" class="text-gray-500 mb-2 text-center">
        No participated bidders yet.
      </div>
      <div v-else v-for="bidder in bidders" :key="bidder.user_id"
        class="flex flex-wrap items-center border-b gap-y-4 py-5   border-gray-300 px-6 mx-auto w-5/6 lg md:px-8 border">
        <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Bidder Name</dt>
          <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
            <NuxtLink :to="{ path: '/view-profile', query: { id: encodeId(bidder.user_id) } }"
              class="cursor-pointer hover:underline">{{ bidder.bidder_name }}</NuxtLink>
          </dd>
        </dl>
        <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Current Bid</dt>
          <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
            <span>{{ formatNumber(bidder.bid_amount) }}</span>
          </dd>
        </dl>
        <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Posted on</dt>
          <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
            <span>{{ formatDate(bidder.bid_time) }}</span>
          </dd>
        </dl>
      </div>
    </div>

    <div v-if="auction.bidding_type === 'Offer-type'"
      class="bg-white py-6sm:py-8 lg:py-1 w-3/5 mx-auto rounded-md mb-44 ">
      <section class="w-full rounded-lg p-4 mt-8">
        <h3 class="font-os text-2xl font-bold mb-10 border-b pb-2">Pending </h3>

        <span v-if="pendingComments.length === 0" class="text-gray-500 mb-2 text-center">
          No pending offers.
        </span>
        <!-- Offer Block 1 -->
        <div v-else v-for="pendingOffer in pendingComments.slice(0, offersToShow)" :key="pendingOffer.offer_id"
          class="flex mt-4 ">
          <!-- User's Profile Image -->
          <NuxtLink :to="{ path: '/view-profile', query: { id: encodeId(pendingOffer.user_id) } }"
            class="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center">
            <img class="h-12 w-12 rounded-full object-cover"
              :src="pendingOffer.userImageUrl || '/images/default-profile-image.png'" alt="User Image" />
          </NuxtLink>

          <!-- Comment Details -->
          <div class="ml-3">
            <NuxtLink :to="{ path: '/view-profile', query: { id: encodeId(pendingOffer.user_id) } }"
              class="font-medium text-gray-900 cursor-pointer hover:underline">{{ pendingOffer.full_name }}</NuxtLink>
            <div class="text-gray-600 text-sm">Posted on {{ formatDate(pendingOffer.offer_time) }}</div>
            <div class="mt-2 text-gray-900 max-w-3xl break-words bg-gray-200 p-4 rounded-lg">{{ pendingOffer.comment }}
            </div>
            <div v-if="pendingOffer.commentImages && pendingOffer.commentImages.length > 0" class="text-center">
              <div class="flex flex-wrap gap-2 mt-2">
                <div v-for="(image, idx) in pendingOffer.commentImages" :key="idx" class="w-64 h-64 border rounded-lg">
                  <img @click="openImageModal(image)" :src="image" alt="Offer Image"
                    class="w-full h-full object-cover rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div class="ml-4 flex flex-col justify-between items-end">
            <div class=" text-center text-gray-800 px-3 rounded-lg text-sm">

              <!-- Review Status -->
              <p class=" text-sm py-1 px-3 rounded-lg bg-yellow-200 text-yellow-800">
                {{ pendingOffer.review_status }}
              </p>
            </div>

          </div>
          <div class=" flex flex-col justify-between items-end">
            <div @click="toggleDropdown(pendingOffer.offer_id)"
              class="bg-custom-bluegreen text-center text-white hover:bg-green-500 py-1 px-3 rounded-lg text-sm cursor-pointer">
              <strong>
                <svg height="20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.7 14C10.623 14 9.74999 13.1046 9.74999 12C9.74999 10.8954 10.623 10 11.7 10C12.7769 10 13.65 10.8954 13.65 12C13.65 12.5304 13.4445 13.0391 13.0789 13.4142C12.7132 13.7893 12.2172 14 11.7 14Z"
                      stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M16.8841 16.063V14.721C16.8841 14.3887 17.0128 14.07 17.2419 13.835L18.1672 12.886C18.6443 12.3967 18.6443 11.6033 18.1672 11.114L17.2419 10.165C17.0128 9.93001 16.8841 9.61131 16.8841 9.27899V7.93599C16.8841 7.24398 16.3371 6.68299 15.6624 6.68299H14.353C14.029 6.68299 13.7182 6.55097 13.4891 6.31599L12.5638 5.36699C12.0867 4.87767 11.3132 4.87767 10.8361 5.36699L9.91087 6.31599C9.68176 6.55097 9.37102 6.68299 9.04702 6.68299H7.73759C7.41341 6.68299 7.10253 6.81514 6.87339 7.05034C6.64425 7.28554 6.51566 7.6045 6.51592 7.93699V9.27899C6.51591 9.61131 6.3872 9.93001 6.15809 10.165L5.23282 11.114C4.75573 11.6033 4.75573 12.3967 5.23282 12.886L6.15809 13.835C6.3872 14.07 6.51591 14.3887 6.51592 14.721V16.063C6.51592 16.755 7.06288 17.316 7.73759 17.316H9.04702C9.37102 17.316 9.68176 17.448 9.91087 17.683L10.8361 18.632C11.3132 19.1213 12.0867 19.1213 12.5638 18.632L13.4891 17.683C13.7182 17.448 14.029 17.316 14.353 17.316H15.6614C15.9856 17.3163 16.2966 17.1844 16.5259 16.9493C16.7552 16.7143 16.8841 16.3955 16.8841 16.063Z"
                      stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </g>
                </svg>
              </strong>
            </div>
            <div v-if="isDropdownOpen[pendingOffer.offer_id]"
              class="absolute mt-8 bg-white shadow-md drop-shadow text-center text-gray-800 py-1 px-3 rounded-lg text-sm">
              <!-- Discard Offer Button -->
              <div @click="updateOfferStatus(pendingOffer.offer_id, 'Discard Offer')"
                class="flex items-center justify-center px-2 py-1 rounded bg-red-500 hover:bg-red-700 text-white space-x-1 cursor-pointer">
                <!-- Trash Icon for Discard -->
                <svg class="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M3 6h18M9 6V4h6v2M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6H6z" stroke="#ffffff" stroke-width="2" />
                </svg>
                <span class="text-sm">Discard Offer</span>
              </div>
              <!-- Accept Offer Button -->
              <div @click="confirmAcceptOffer(pendingOffer.offer_id)"
                class="flex items-center justify-center px-2 py-1 rounded bg-green-500 hover:bg-green-700 text-white space-x-1 cursor-pointer mt-2">
                <!-- Checkmark Icon for Accept -->
                <svg class="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span class="text-sm">Accept Offer</span>
              </div>
              <!-- Provide More Button -->
              <div @click="updateOfferStatus(pendingOffer.offer_id, 'Provide More')"
                class="flex items-center justify-center px-2 py-1 rounded bg-blue-500 hover:bg-blue-700 text-white space-x-1 cursor-pointer mt-2">
                <!-- Plus Icon for Provide More -->
                <svg class="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 4v16M4 12h16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span class="text-sm">Provide More</span>
              </div>
            </div>
          </div>

        </div>
        <!-- Horizontal Separator -->
        <hr class="my-8 border-gray-300" />

        <!-- See More Button -->
        <div v-if="offersToShow < topComments.length" class="text-center mt-4">
          <button @click="loadMoreOffers" class="bg-custom-bluegreen text-white py-2 px-4 rounded hover:bg-blue-600">
            See More
          </button>
        </div>

        <!-- Modal to display the clicked image -->
        <div v-if="isPictureViewModalOpen" @click="closeModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div class="relative">
            <img :src="modalImageSrc" alt="Large View" class="max-w-4xl max-h-[70vh] object-contain" />
            <!-- Close button -->
            <button @click="closeModal"
              class="absolute top-0 right-0 bg-gray-900 text-white rounded-full p-2 cursor-pointer">
              x
            </button>
          </div>
        </div>
      </section>
      <!-- Comment Section -->
      <section class="w-full rounded-lg p-4 mt-8">
        <h3 class="font-os text-2xl font-bold mb-10 border-b pb-2">Recent Offers </h3>

        <span v-if="topComments.length === 0" class="text-gray-500 mb-2 text-center">
          No recent offers.
        </span>
        <!-- Offer Block 1 -->
        <div v-for="offer in topComments.slice(0, offersToShow)" :key="offer.offer_id" class="flex mt-4">
          <!-- User's Profile Image -->
          <NuxtLink :to="{ path: '/view-profile', query: { id: encodeId(offer.user_id) } }"
            class="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center">
            <img class="h-12 w-12 rounded-full object-cover"
              :src="offer.userImageUrl || '/images/default-profile-image.png'" alt="User Image" />
          </NuxtLink>

          <!-- Comment Details -->
          <div class="ml-3">
            <NuxtLink :to="{ path: '/view-profile', query: { id: encodeId(offer.user_id) } }"
              class="font-medium text-gray-900 cursor-pointer hover:underline">{{ offer.full_name }}</NuxtLink>
            <div class="text-gray-600 text-sm">Posted on {{ formatDate(offer.offer_time) }}</div>
            <div class="mt-2 text-gray-900 max-w-3xl bg-gray-200 rounded-lg p-4 break-words">{{ offer.comment }}</div>
            <div v-if="offer.commentImages && offer.commentImages.length > 0" class="text-center">
              <div class="flex flex-wrap gap-2 mt-2">
                <div v-for="(image, idx) in offer.commentImages" :key="idx" class="w-64 h-64 border rounded-lg">
                  <img @click="openImageModal(image)" :src="image" alt="Offer Image"
                    class="w-full h-full object-cover rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          <!-- Status Section -->
          <div class="ml-4 flex flex-col justify-between items-end">
            <div class=" text-center text-gray-800 px-3 rounded-lg text-sm">
              <!-- <strong>Status</strong> -->

              <!-- Review Status -->
              <p :class="{
                'bg-yellow-200 text-yellow-800': offer.review_status === 'Offer Pending',
                'bg-green-200 text-green-800': offer.review_status === 'Offer Accepted',
                'bg-red-200 text-red-800': offer.review_status === 'Offer Discarded',
                'bg-purple-200 text-purple-800': offer.review_status === 'Provide More'
              }" class=" text-sm py-1 px-3 rounded-lg">
                {{ offer.review_status }}
              </p>
            </div>

          </div>


        </div>
        <!-- Horizontal Separator -->
        <hr class="my-8 border-gray-300" />

        <!-- See More Button -->
        <div v-if="offersToShow < topComments.length" class="text-center mt-4">
          <button @click="loadMoreOffers" class="bg-custom-bluegreen text-white py-2 px-4 rounded hover:bg-blue-600">
            See More
          </button>
        </div>

        <!-- Modal to display the clicked image -->
        <div v-if="isPictureViewModalOpen" @click="closeModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div class="relative">
            <img :src="modalImageSrc" alt="Large View" class="max-w-4xl max-h-[70vh] object-contain" />
            <!-- Close button -->
            <button @click="closeModal"
              class="absolute top-0 right-0 bg-gray-900 text-white rounded-full p-2 cursor-pointer">
              x
            </button>
          </div>
        </div>
      </section>
    </div>


  </NuxtLayout>
  <NuxtLayout name="footer"></NuxtLayout>
</template>


<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { toast } from "vue3-toastify";
import { useInboxSocketStore } from '@/stores/socketStore';
import { usePaypalStore } from '~/stores/paypalStore';

const emit = defineEmits();
const paypalStore = usePaypalStore();
const route = useRoute();
const auction = ref({});
const isEmailBlastSent = ref(false);
const bidders = ref([]);
const topComments = ref([]);
const pendingComments = ref([]);
const socketStore = useInboxSocketStore();
const offersToShow = ref(3);
const isPictureViewModalOpen = ref(false);
const modalImageSrc = ref('');
const paypalButtonsRendered = ref(false);
const isPaymentModalOpen = ref(false);
const isTooltipVisible = ref(false);
const isDropdownOpen = ref({});
const remainingTime = ref(0);
let timerInterval = null;
const isLoading = ref(true);

const encodeId = (id) => {
  return btoa(id);  // Base64 encode the ID
};

const formattedTime = computed(() => {
  return formatTime(remainingTime.value);
});

// Timer to update remaining time every second
const startTimer = () => {
  // Clear any existing interval to avoid multiple timers running
  if (timerInterval) clearInterval(timerInterval);

  // Start a new interval
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      // Stop the timer once it hits zero
      clearInterval(timerInterval);
    }
  }, 1000); // Decrease by 1 every second
};

// Format the remaining time as hh:mm:ss
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
};

// Calculate remaining time based on auction's end_time
const calculateRemainingTime = () => {
  if (!auction.value || !auction.value.end_time) return 0; // Return 0 if end_time is missing

  const now = new Date();
  const endTime = new Date(auction.value.end_time);

  if (isNaN(endTime.getTime())) return 0; // Return 0 if end_time is not a valid date

  const timeDiff = endTime - now;
  return Math.max(0, Math.floor(timeDiff / 1000)); // return time in seconds
};

const toggleDropdown = (offerId) => {
  isDropdownOpen.value[offerId] = !isDropdownOpen.value[offerId];
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
};

const toggleTooltip = () => {

  // Toggle tooltip visibility
  isTooltipVisible.value = !isTooltipVisible.value;
};

// Function to load more offers
const loadMoreOffers = () => {
  offersToShow.value += 3; // Show 3 more offers when the button is clicked
};

const updateOfferStatus = async (offerId, action) => {
  try {
    await axios.post('/api/auctions/change-offer-status', { offerId, action });
    toast.success(`Offer status updated to "${action}"`);
    fetchAuctionDetails();
  } catch (error) {
    console.error("Failed to update offer status:", error);
    toast.error("Failed to update offer status.");
  }
};

// Function specifically for accepting an offer
const confirmAcceptOffer = (offerId) => {
  if (confirm("Are you sure you want to accept this offer? This will end the auction.")) {
    acceptOfferAndEndAuction(offerId);
  }
};

const acceptOfferAndEndAuction = async (offerId) => {
  try {
    await axios.post('/api/auctions/accept-offer', { offerId });
    toast.success("Offer accepted and auction ended.");
    fetchAuctionDetails();
  } catch (error) {
    console.error("Failed to accept offer and end auction:", error);
    toast.error("Failed to accept offer and end auction.");
  }
};

const fetchAuctionDetails = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get(`/api/auctions/${route.query.id}`);
    console.log('Data for FetchAuctionDetails', data);
    auction.value = data;

    fetchBidders(auction.value.id);
    fetchPendingOffers(auction.value.id);
    remainingTime.value = calculateRemainingTime();
    startTimer();
    if (data.email_blast_paid === 1) {
      isEmailBlastSent.value = true;
    }
  } catch (error) {
    console.error("Failed to fetch auction details:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchBidders = async (listingId) => {
  if (listingId && auction.value.bidding_type === 'Lowest-type') { // Corrected access here

    try {
      const { data } = await axios.get(`/api/auctions/fill-in-bidder-participants?id=${listingId}`);
      bidders.value = data.bidders;
      console.log('fetch bidder in bidder-auction', data);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else if (listingId && auction.value.bidding_type === 'Offer-type') { // Corrected access here

    try {
      const { data } = await axios.get(`/api/auctions/fill-in-offer-participants?id=${listingId}`);
      topComments.value = data.offers; // Store the fetched top comments
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  } else {
    console.error('No listing ID available');
  }
};

const fetchPendingOffers = async (listingId) => {

  try {
    const { data } = await axios.get(`/api/auctions/pending-offers?id=${listingId}`);
    pendingComments.value = data.offers;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

const sendEmailBlast = async (orderID) => {

  try {

    const emailBlastResponse = await axios.post('/api/notifications/email-blast', { auctionUuid: route.query.id, orderID: orderID });

    const notificationDetails = emailBlastResponse.data.results;

    // Emit notifications for each bidder
    notificationDetails.forEach(notification => {
      socketStore.socket.emit('notification-message', {
        recipientId: notification.bidderId,
        notification: {
          location: notification.notificationDetails.location_id,
          sender_full_name: 'AuctionWave System',
          auction_name: notification.notificationDetails.auction_name,
          listing_id: notification.notificationDetails.listing_id,
          message: notification.notificationDetails.message,
          is_read: notification.notificationDetails.is_read,
          created_at: notification.notificationDetails.created_at,
          unreadCount: notification.unreadCount
        }
      });
    });

    toast(`Payment success. Email blast sent successfully!`, {
      type: 'success',
      autoClose: 10000,
      position: 'top-right',
    });
    fetchAuctionDetails();
    return { success: true };
  } catch (error) {
    console.error("Failed to send email blast:", error);
    // Show a detailed error message on the client side
    if (error.response) {
      toast.error(`Failed to send email blast: ${error.response.data.message || 'An error occurred.'}`);
    } else {
      toast.error("Failed to send email blast: Unable to connect to the server.");
    }
    return { success: false };
  }

};

// Function to open the modal with the clicked image's source
const openImageModal = (imageSrc) => {
  modalImageSrc.value = imageSrc;
  isPictureViewModalOpen.value = true;
};

// Function to close the modal
const closeModal = () => {
  isPictureViewModalOpen.value = false;
  modalImageSrc.value = '';  // Reset the modal image source
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true // 12-hour format with AM/PM
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const confirmEmailBlast = () => {
  if (window.confirm("This feature requires a payment, proceed?")) {
    if (auction.value.status === 'Auction Ended' || auction.value.status === 'Transaction Ended') {
      toast.error('You cannot use this feature as the auction has already ended.');
      return;
    }
    isPaymentModalOpen.value = true; // Open the modal
    loadPaypalSdkAndRenderButton(); // Load PayPal SDK and render buttons
  }
};

// Function to close the payment modal
const closePaymentModal = () => {
  isPaymentModalOpen.value = false;
  paypalButtonsRendered.value = false; // Reset button rendering state when modal is closed
};

// Function to load PayPal SDK and render the buttons
const loadPaypalSdkAndRenderButton = async () => {
  if (paypalButtonsRendered.value) return;

  if (!paypalStore.isPaypalLoaded) {
    await paypalStore.loadPaypalEmailblastSdk();
  }

  // Ensure modal content is fully loaded before rendering buttons
  nextTick(() => {
    const container = document.getElementById("paypal-button-container");
    if (!container) {
      console.error("PayPal button container is missing.");
      return;
    }
    renderPaypalButtons();
  });
};


// Function to render PayPal buttons after SDK is loaded
const renderPaypalButtons = () => {
  const container = document.getElementById("paypal-button-container");

  if (container && !paypalButtonsRendered.value) {
    try {
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            // Create order with 'AUTHORIZE' intent (to hold funds)
            const orderResponse = await axios.post('/api/paypal/create-payment', {
              items: [
                {
                  name: 'Email Blast',
                  description: 'Payment for notifying all bidders',
                  amount: '150.00'
                }
              ]
            });
            return orderResponse.data.id; // Return PayPal order ID
          } catch (error) {
            console.error('Error creating order:', error);
            throw error; // Let PayPal handle the error
          }
        },

        onApprove: async (data) => {
          try {
            // Capture the payment (which is now authorized)
            const captureResponse = await axios.post('/api/paypal/capture-payment', {
              orderID: data.orderID,
            });

            // If capture is successful, proceed with email blast
            if (captureResponse.data.status === 'COMPLETED') {
              // Trigger the email blast API after payment authorization is captured
              const emailBlastResponse = await sendEmailBlast(data.orderID);

              console.log('emailBlastResponse', emailBlastResponse.success);
              const authorizationID = captureResponse.data.purchase_units[0].payments.authorizations[0].id;
              if (emailBlastResponse.success === true) {
                await axios.post('/api/paypal/capture-authorize-payment', {
                  authorizationID: authorizationID,
                });
                isEmailBlastSent.value = true;
                closePaymentModal();
                toast(`Email blast sent and payment captured!`, {
                  type: 'success',
                  autoClose: 10000,
                  position: 'top-right',
                });
              } else {
                // Email blast was successful, so capture the authorized payment
                await axios.post('/api/paypal/capture-authorization-fail', {
                  authorizationID: authorizationID,
                });
                toast(`Email blast failed. Payment cancelled.`, {
                  type: 'error',
                  autoClose: 10000,
                  position: 'top-right',
                });
              }
            } else {
              toast(`Payment failed or was not completed.`, {
                type: 'warn',
                autoClose: 10000,
                position: 'top-right',
              });
            }
          } catch (error) {
            console.error('Error during PayPal payment capture or email blast:', error);
          }
        },

        onCancel: () => {
          toast.error('Payment was cancelled.');
        },

        onError: (error) => {
          console.error('PayPal error:', error);
          toast.error('Error during PayPal payment process.');
        }
      }).render(container); // Render buttons inside the container

      paypalButtonsRendered.value = true; // Set the flag to prevent re-render
    } catch (error) {
      console.error('Error rendering PayPal buttons:', error);
    }
  } else {
    console.warn("PayPal button container is missing or already rendered.");
  }
};



const handleIncomingBidNotification = (newBidNotificationMessage) => {
  console.log('Received new notification message in BidderNavbar:', newBidNotificationMessage);
  const { sender_full_name, bid_amount, bid_time } = newBidNotificationMessage.notification;

  const newBidder = {
    bidder_name: sender_full_name,
    bid_amount: bid_amount,
    bid_time: bid_time,
  };

  // Add the new bid at the start of the `bidders` array
  bidders.value.unshift(newBidder);
};

onMounted(async () => {
  fetchAuctionDetails();
  if (!paypalStore.isPaypalLoaded) {
    await paypalStore.loadPaypalEmailblastSdk(); // Load PayPal SDK if not already loaded
  }

  if (!socketStore.socket) {
    socketStore.connectSocket();
  }
  socketStore.socket.on('bid-channel', handleIncomingBidNotification);
});

onBeforeUnmount(() => {
  remainingTime.value = 0;
  if (socketStore.socket) {
    socketStore.socket.off('bid-channel', handleIncomingBidNotification);
  }
  socketStore.disconnectSocket();
});
</script>

<style scoped>
/* Optional: add some styling for the disabled button */
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>