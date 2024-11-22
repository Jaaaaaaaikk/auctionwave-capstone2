<template>
  <div class="p-2 bg-custom-blue2 dark:bg-gray-900 min-h-screen">
    <!-- Header Section -->
    <nav class="fixed top-0 left-0 right-0 flex items-center justify-between bg-white shadow-md mb-6 z-20 py-3">
      <!-- Logo and Company Name -->
      <NuxtLink v-if="!isAuctioneerDashboard" to="/auctioneer/auctioneerdashboard"
        class="flex justify-start space-x-3 rtl:space-x-reverse mr-8">
        <img src="/public/images/logo-no-text.jpg" class="h-12" alt="Logo" />
      </NuxtLink>

      <div class="">
        <!-- Button to toggle the drawer -->
        <div
          class="flex xl:hidden justify-start space-x-3 rtl:space-x-reverse lg:mr-8 lg:ml-7 ml-2 flex-shrink-0 py-3 lg:py-0">
          <button @click="toggleDrawer" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L4 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M20 12L4 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M20 17L4 17" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
          </button>
        </div>

        <!-- Drawer component -->
        <div id="drawer-navigation" :class="{ '-translate-x-full': !drawerOpen }"
          class="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 xl:hidden">
          <h5 id="drawer-navigation-label"
            class="flex items-center space-x-3 text-base font-semibold text-gray-500 uppercase dark:text-gray-400 mb-8">
            <img src="/public/images/logo-no-text123.jpg" class="h-16" alt="Logo" />
            <span>AuctionWave</span>
          </h5>
          <!-- Profile Section -->
          <div @click="viewProfile" class="mt-4 flex items-center space-x-3">
            <img :src="userStore.userProfileImage" class="w-11 h-11 rounded-full object-cover  flex-shrink-0"
              alt="Profile Icon" />
            <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ userName }}</span>
            <!-- Replace with dynamic username if needed -->
          </div>
          <div class="border my-2 border-custom-bluegreen border-opacity-25 ">

          </div>

          <button @click="toggleDrawer" type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Close menu</span>
          </button>
          <div class="py-4 overflow-y-auto">
            <ul class="space-y-2 font-medium">
              <li>
                <NuxtLink to="/bidder/bidderdashboard">
                  <div
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mb-4">
                    <svg height="20" width="20" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                      fill="#000000" class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900">
                      <g>
                        <path style="fill:#CDCED1;"
                          d="M256,48.552c-141.383,0-256,114.617-256,256c0,60.054,20.736,115.235,55.358,158.897h401.284 C491.264,419.787,512,364.606,512,304.552C512,163.169,397.383,48.552,256,48.552">
                        </path>
                        <path style="fill:#C6421E;"
                          d="M240.517,272.808c-14.027,6.85-22.837,22.722-18.882,40.06c2.913,12.765,13.286,23.128,26.041,26.041 c17.346,3.964,33.218-4.855,40.068-18.882c10.152-20.78,19.465-41.966,31.364-61.802l25.167-41.949l-41.949,25.167C282.492,253.343,261.306,262.647,240.517,272.808">
                        </path>
                        <g>
                          <path style="fill:#3F3F3F;"
                            d="M59.797,384.487c-1.836-4.511-6.991-6.7-11.511-4.846L15.8,392.882 c2.039,5.535,4.193,11.026,6.603,16.375l32.547-13.259C59.462,394.153,61.633,389.007,59.797,384.487">
                          </path>
                          <path style="fill:#3F3F3F;"
                            d="M79.448,304.552c0-4.873-3.955-8.828-8.828-8.828h-70.4C0.124,298.664,0,301.594,0,304.552 c0,2.975,0.282,5.879,0.38,8.828h70.241C75.494,313.379,79.448,309.425,79.448,304.552">
                          </path>
                          <path style="fill:#3F3F3F;"
                            d="M60.737,222.34c1.889-4.493-0.212-9.675-4.705-11.564l-32.397-13.639 c-2.472,5.323-4.767,10.743-6.868,16.26l32.406,13.656c1.121,0.468,2.286,0.689,3.425,0.689 C56.041,227.743,59.316,225.713,60.737,222.34">
                          </path>
                          <path style="fill:#3F3F3F;"
                            d="M68.888,129.923l24.823,24.823c1.721,1.721,3.981,2.578,6.241,2.578 c2.251,0,4.511-0.856,6.241-2.578c3.443-3.452,3.443-9.039,0-12.491L81.37,117.44C77.071,121.457,72.904,125.624,68.888,129.923">
                          </path>
                          <path style="fill:#3F3F3F;"
                            d="M164.556,103.504c1.395,3.425,4.696,5.5,8.183,5.5c1.103,0,2.233-0.212,3.328-0.653 c4.511-1.845,6.682-6.991,4.846-11.511L167.619,64.23c-5.544,2.039-10.964,4.317-16.322,6.727L164.556,103.504z">
                          </path>
                          <path style="fill:#3F3F3F;"
                            d="M256,128c4.873,0,8.828-3.955,8.828-8.828v-70.4c-2.94-0.097-5.87-0.221-8.828-0.221 c-2.957,0-5.888,0.124-8.828,0.221v70.4C247.172,124.045,251.127,128,256,128">
                          </path>
                          <path style="fill:#3F3F3F;"
                            d="M338.211,109.289c1.121,0.477,2.278,0.697,3.425,0.697c3.443,0,6.718-2.03,8.139-5.402 l13.639-32.397c-5.323-2.472-10.743-4.767-16.26-6.868l-13.656,32.406C331.608,102.227,333.718,107.4,338.211,109.289">
                          </path>
                          <path style="fill:#3F3F3F;"
                            d="M430.629,117.44l-24.823,24.823c-3.443,3.443-3.443,9.031,0,12.482 c1.73,1.721,3.99,2.586,6.25,2.586c2.251,0,4.511-0.865,6.241-2.586l24.814-24.823 C439.095,125.623,434.928,121.456,430.629,117.44">
                          </path>
                        </g>
                        <g>
                          <path style="fill:#C6421E;"
                            d="M463.711,229.462l32.618-13.286c-2.048-5.553-4.326-10.973-6.735-16.331l-32.547,13.259 c-4.511,1.845-6.682,6.991-4.846,11.511c1.395,3.425,4.705,5.5,8.183,5.5C461.496,230.115,462.617,229.903,463.711,229.462">
                          </path>
                          <path style="fill:#C6421E;"
                            d="M512,304.552c0-2.957-0.124-5.888-0.221-8.828h-70.4c-4.873,0-8.828,3.955-8.828,8.828 s3.955,8.828,8.828,8.828h70.241C511.717,310.431,512,307.527,512,304.552">
                          </path>
                          <path style="fill:#C6421E;"
                            d="M495.089,395.642l-32.265-13.586c-4.502-1.889-9.666,0.212-11.564,4.705 c-1.889,4.493,0.221,9.675,4.705,11.564l32.335,13.621C490.772,406.615,492.979,401.159,495.089,395.642">
                          </path>
                        </g>
                      </g>
                    </svg>
                    <span class="ms-3">Dashboard</span>
                  </div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/bidder/bidding-activity">
                  <div
                    class="flex items-center p-2  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mb-4">
                    <svg viewBox="0 0 1024 1024"
                      class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <g>
                        <path
                          d="M320 853.333333h490.666667l128 128V533.333333c0-46.933333-38.4-85.333333-85.333334-85.333333H320c-46.933333 0-85.333333 38.4-85.333333 85.333333v234.666667c0 46.933333 38.4 85.333333 85.333333 85.333333z"
                          fill="#558B2F"></path>
                        <path
                          d="M614.4 699.733333h-76.8l-14.933333 44.8h-46.933334l78.933334-213.333333h40.533333l78.933333 213.333333h-46.933333l-12.8-44.8z m-66.133333-34.133333h53.333333L576 584.533333l-27.733333 81.066667z"
                          fill="#1B5E20"></path>
                        <path
                          d="M704 533.333333H213.333333l-128 128V170.666667c0-46.933333 38.4-85.333333 85.333334-85.333334h533.333333c46.933333 0 85.333333 38.4 85.333333 85.333334v277.333333c0 46.933333-38.4 85.333333-85.333333 85.333333z"
                          fill="#8BC34A"></path>
                        <path
                          d="M541.866667 302.933333c0 21.333333-4.266667 38.4-10.666667 53.333334s-14.933333 27.733333-27.733333 36.266666l36.266666 27.733334-27.733333 25.6-46.933333-36.266667c-4.266667 0-10.666667 2.133333-17.066667 2.133333-12.8 0-25.6-2.133333-38.4-6.4-10.666667-4.266667-21.333333-12.8-29.866667-21.333333-8.533333-8.533333-14.933333-21.333333-19.2-34.133333-4.266667-12.8-6.4-27.733333-6.4-44.8v-8.533334c0-17.066667 2.133333-32 6.4-44.8 4.266667-12.8 10.666667-25.6 19.2-34.133333 8.533333-8.533333 17.066667-17.066667 29.866667-21.333333 10.666667-4.266667 23.466667-6.4 38.4-6.4 12.8 0 25.6 2.133333 38.4 6.4 10.666667 4.266667 21.333333 12.8 29.866667 21.333333 8.533333 8.533333 14.933333 21.333333 19.2 34.133333 4.266667 12.8 6.4 27.733333 6.4 44.8v6.4z m-46.933334-10.666666c0-23.466667-4.266667-40.533333-12.8-51.2-8.533333-12.8-19.2-17.066667-34.133333-17.066667-14.933333 0-27.733333 6.4-34.133333 17.066667-8.533333 12.8-12.8 29.866667-12.8 51.2v10.666666c0 10.666667 2.133333 21.333333 4.266666 29.866667 2.133333 8.533333 4.266667 17.066667 8.533334 21.333333 4.266667 6.4 8.533333 10.666667 14.933333 12.8 6.4 2.133333 12.8 4.266667 19.2 4.266667 14.933333 0 27.733333-6.4 34.133333-17.066667 8.533333-12.8 12.8-29.866667 12.8-53.333333v-8.533333z"
                          fill="#FFFFFF"></path>
                      </g>
                    </svg>
                    <span class="flex-1 ms-3 whitespace-nowrap pl-1">FAQ</span>

                  </div>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="{ path: '/inbox', query: { userType: userType } }"
                  class="flex items-center text-gray-700 hover:text-red-500">
                  <div
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mb-4">
                    <svg height="24" width="24" version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"
                      fill="#000000">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <path style="fill:#F6B154;"
                            d="M512,148.263v9.952c-0.617,0.386-1.466,0.85-2.161,1.312l-19.134,11.342 c-1.389,0.77-2.701,1.697-4.321,2.545c0,0.077-0.077,0.077-0.077,0.077h-0.077c-4.938,2.856-10.802,6.25-16.048,9.336 c-3.318,2.006-6.481,3.78-9.027,5.324l-24.149,14.195l-9.336,5.479l-126.148,74.145l-2.16,1.312l-1.466,0.849l-4.475,2.623 l-3.318,2.006l-11.65,6.867l-5.941,3.472c-2.083,1.158-4.398,2.006-6.867,2.624c-0.231,0.077-0.463,0.077-0.694,0.155 c-2.855,0.617-5.941,0.848-8.95,0.694c-3.009,0.154-6.095-0.077-8.95-0.694c-0.232-0.077-0.463-0.077-0.695-0.155 c-2.469-0.618-4.784-1.466-6.866-2.624l-5.941-3.549l-5.941-3.472l-5.709-3.318l-2.546-1.544l-0.771-0.462l-4.475-2.623 l-61.184-35.954l-65.35-38.423l-12.576-7.408l-24.149-14.195c-1.774-1.004-3.78-2.238-5.941-3.473 c-6.018-3.55-13.193-7.793-19.134-11.188h-0.077c0,0-0.077,0-0.077-0.077c-1.62-0.848-2.932-1.774-4.321-2.545L2.162,159.528 c-0.695-0.462-1.543-0.926-2.161-1.312v-9.952c0-1.698,0.232-3.086,0.695-4.321c0-0.076,0.077-0.076,0.077-0.076 c0.463-0.309,0.926-0.541,1.389-0.85l6.25-3.703l12.885-7.638c8.178-4.706,21.449-12.576,29.55-17.283l0.926-0.541l23.224-13.657 l36.339-21.371l10.493-6.173L239.49,3.444c4.552-2.546,10.647-3.703,16.511-3.395c5.864-0.308,12.036,0.85,16.511,3.395 l78.775,46.293l38.886,22.915l10.107,5.941l36.726,21.603l24.149,14.197c0.695,0.386,1.389,0.771,2.161,1.234 c4.938,2.933,11.264,6.713,17.205,10.108c3.703,2.238,7.253,4.244,10.185,5.941l7.947,4.706l4.938,2.932l6.249,3.703 c0.463,0.309,0.926,0.541,1.389,0.85C511.768,145.1,512,146.565,512,148.263z">
                          </path>
                          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="256.0007" y1="346.9041"
                            x2="256.0007" y2="44.2867">
                            <stop offset="0" style="stop-color:#F3982E"></stop>
                            <stop offset="0.7685" style="stop-color:#F5A33B"></stop>
                          </linearGradient>
                          <path style="fill:url(#SVGID_1_);"
                            d="M512,192.55v9.952c-0.617,0.386-1.389,0.85-2.161,1.312l-19.134,11.342 c-4.475,2.546-10.493,6.094-16.357,9.49c-4.783,2.854-9.568,5.632-13.194,7.793l-38.037,22.374l-78.543,46.216l-0.926,0.541 l-7.175,4.167l-17.592,10.339l-0.849,0.54l-45.521,26.772c-2.083,1.158-4.398,2.006-6.867,2.624 c-3.009,0.771-6.404,1.002-9.644,0.849c-3.24,0.153-6.635-0.077-9.644-0.849c-2.469-0.618-4.784-1.466-6.866-2.624l-45.444-26.695 l-0.077-0.077l-9.953-5.864l-8.487-5.014l-7.253-4.244l-75.92-44.673l-41.509-24.38c-2.855-1.698-6.327-3.703-10.03-5.941 c-6.79-3.935-14.197-8.333-19.52-11.342L2.162,203.814c-0.695-0.462-1.543-0.926-2.161-1.312v-9.952 c0-1.698,0.232-3.086,0.695-4.32c0-0.077,0.077-0.077,0.077-0.077c0.463-0.309,0.926-0.541,1.389-0.85l6.25-3.703l12.885-7.638 c1.312-0.771,2.778-1.62,4.321-2.547c6.481-3.781,14.582-8.563,21.064-12.266c0.154-0.154,0.386-0.232,0.54-0.309 c1.312-0.772,2.469-1.543,3.627-2.161l29.781-17.514l61.955-36.417l33.408-19.675l63.499-37.343 c4.552-2.546,10.647-3.703,16.511-3.395c5.864-0.308,12.036,0.85,16.511,3.395l63.575,37.343l31.634,18.672l66.276,38.963 l27.159,15.971c1.234,0.771,2.7,1.543,4.166,2.469c0.926,0.462,1.852,1.002,2.778,1.62c5.941,3.472,12.653,7.407,18.286,10.646 c1.543,0.927,3.009,1.775,4.321,2.547l12.885,7.638l6.249,3.703c0.463,0.309,0.926,0.541,1.389,0.85 C511.768,189.386,512,190.852,512,192.55z">
                          </path>
                          <polygon style="fill:#7CBE3A;"
                            points="437.16,110.457 433.996,142.708 430.447,179.588 427.67,207.827 423.118,254.813 419.337,293.931 416.251,325.565 395.882,323.559 362.551,320.318 318.882,316.075 316.644,315.92 258.084,310.211 214.028,305.967 194.2,304.038 180.929,302.726 168.276,301.492 96.136,294.471 34.798,288.531 40.817,226.498 44.905,184.68 47.143,161.379 47.22,160.84 51.772,113.852 55.707,73.423 111.335,78.824 175.991,85.073 257.775,93.02 367.721,103.745 ">
                          </polygon>
                          <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="279.1855" y1="72.6514"
                            x2="279.1855" y2="326.2587">
                            <stop offset="0" style="stop-color:#FDFCE8"></stop>
                            <stop offset="0.9704" style="stop-color:#FBDCC6"></stop>
                          </linearGradient>
                          <polygon style="fill:url(#SVGID_2_);"
                            points="480.752,287.681 419.337,293.931 345.423,301.338 343.648,301.57 331.226,302.803 298.282,306.121 258.084,310.211 194.046,316.692 193.891,316.692 171.748,318.929 147.675,321.398 99.377,326.259 96.136,294.471 92.356,256.819 87.572,209.755 84.718,181.285 80.628,141.165 77.619,111.306 142.583,104.748 257.775,93.02 336.087,85.073 400.28,78.592 437.16,74.889 458.994,72.651 461.695,99.425 463.315,115.626 467.79,159.759 468.099,162.768 470.182,182.829 474.348,224.647 ">
                          </polygon>
                          <g>
                            <path style="fill:#F6BA69;"
                              d="M266.725,277.883c0,0-1.697,1.004-4.475,2.469c-1.697,0.926-3.858,2.006-6.25,3.394 c-1.157,0.618-2.468,1.312-3.858,2.006l-5.092,2.701l-0.695,0.308l-1.62,0.926l-11.188,5.864l-15.431,8.179 c-1.389,0.694-2.777,1.465-4.09,2.237c-2.392,1.235-4.706,2.546-6.789,3.55c-3.704,2.006-6.559,3.549-7.639,4.09 c-0.849,0.462-2.932,1.543-5.632,3.008l-0.077,0.077c-3.549,1.852-8.101,4.321-12.654,6.712l-55.551,29.473l-24.072,12.809 l-74.609,39.58c-3.009,1.543-6.25,3.318-9.258,4.861H8.489c-0.849,0-1.698,0-2.392-0.076c-1.929-0.155-3.318-0.463-4.398-0.927 c-0.54-0.309-1.003-0.54-1.312-0.849c-0.154-0.231-0.232-0.308-0.309-0.54c0-0.232-0.077-0.463,0-0.772 c-0.077-0.385-0.077-0.77-0.077-1.234V150.346c0-1.543,0.232-2.854,0.695-3.935c0-0.076,0.077-0.076,0.077-0.076 c1.003-2.315,2.855-3.704,5.401-3.935c0.694-0.232,1.389-0.232,2.237-0.154c1.852,0.077,4.012,0.617,6.327,1.929l28.316,14.968 l3.086,1.697l0.54,0.309l0.463,0.231l12.113,6.403c1.543,0.772,3.241,1.775,5.092,2.701c6.327,3.317,14.119,7.407,20.369,10.801 c1.389,0.695,2.7,1.466,3.935,2.083l78.467,41.664l71.059,37.729l3.935,2.083c0.154,0.077,0.309,0.077,0.386,0.155 c0.309,0.077,0.54,0.232,0.849,0.386c0.694,0.385,1.389,0.693,2.006,1.079c0.077,0.077,0.231,0.077,0.308,0.154 c0.926,0.463,1.774,0.926,2.623,1.388c3.395,1.775,6.173,3.241,7.715,4.167c0.926,0.386,1.389,0.695,1.543,0.772 c0.309,0.231,2.469,1.311,4.706,2.623c0.077,0,0.077,0.076,0.154,0.076c0.386,0.154,0.772,0.309,1.08,0.541 C265.336,277.111,266.725,277.805,266.725,277.883z">
                            </path>
                            <g>
                              <path style="fill:#F5A84F;"
                                d="M511.866,148.874c0.074,0.785,0.134,2.347,0.134,3.471v251.212c0,1.124,0,2.247,0,2.496 c0,0.249-0.089,0.98-0.089,1.114c0,0.134,0,0.244,0,0.523c0,0,0,0.016,0,0.035c0,0.019-0.76,0.552-1.689,1.184l-4.667,0.981 c-1.116,0.13-2.949,0.237-4.072,0.237h-5.19c-1.124,0-2.857-0.427-3.852-0.948l-5.658-2.977 c-0.995-0.522-2.622-1.379-3.614-1.906l-150.615-79.911c-0.993-0.527-2.617-1.388-3.61-1.915l-14.77-7.896 c-0.99-0.531-2.612-1.397-3.604-1.925l-14.858-7.897c-0.991-0.53-2.614-1.393-3.607-1.919l-24.665-13.061 c-0.993-0.526-2.618-1.386-3.612-1.911l-2.185-1.154c-0.993-0.525-2.622-1.379-3.618-1.898c0,0-0.864-0.45-2.024-1.076 c-6.155-3.343-10.704-5.781-10.704-5.85s1.963-1.044,4.282-2.298c2.318-1.254,3.106-1.678,3.106-1.678 c0.989-0.533,1.94-1.047,2.111-1.143c0.172-0.096,2.011-1.033,2.997-1.571c0,0,5.342-2.92,10.874-5.775 c0.268-0.139,0.268-0.139,0.268-0.139c0.294-0.153,0.595-0.309,0.668-0.348c0.073-0.038,0.954-0.484,1.739-0.905 s2.24-1.197,3.232-1.723l146.957-77.962c0.993-0.527,2.616-1.389,3.608-1.918l25.826-13.683c0.993-0.526,2.618-1.386,3.611-1.913 l40.9-21.693c0.993-0.527,2.652-1.314,3.687-1.751c0,0,1.34-0.616,2.444-0.808c1.104-0.192,2.911-0.18,4.016,0.027l4.211,2.211 C510.583,145.648,511.792,148.089,511.866,148.874z">
                              </path>
                            </g>
                          </g>
                          <path style="fill:#E68737;"
                            d="M512,374.821v30.883c0,0.476,0,0.884-0.091,1.292c0.091,0.272,0,0.477,0,0.749c0,0,0,0,0,0.068 c-0.641,1.428-3.566,2.312-8.594,2.312H34.81l92.238-61.424l0.091-0.068l115.458-76.865l11.245-7.415l3.015-2.041l9.965,4.354 L512,374.821z">
                          </path>
                          <path style="fill:#F6B154;"
                            d="M512,404.543v1.158c0,0.476,0,0.885-0.089,1.293c0.089,0.273,0,0.477,0,0.75c0,0,0,0,0,0.068 c-0.625,1.429-3.48,2.313-8.385,2.313H8.474c-4.905,0-7.76-0.884-8.385-2.313c0-0.068,0-0.068,0-0.068c0-0.272-0.089-0.477,0-0.75 C0,406.586,0,406.177,0,405.701v-1.158c0.803-0.817,1.963-1.634,3.479-2.451l238.07-133.296c0.089,0,0.089-0.067,0.179-0.135 c0.268-0.136,0.536-0.273,0.802-0.408c4.905-2.656,9.901-4.494,13.469-5.174c1.249,0.272,2.586,0.612,4.104,1.157 c2.854,0.885,6.154,2.315,9.365,4.017c0.356,0.204,0.624,0.34,0.981,0.543l238.07,133.296 C510.036,402.977,511.196,403.794,512,404.543z">
                          </path>
                        </g>
                      </g>
                    </svg>
                    <span class="flex-1 ms-3 whitespace-nowrap">Inbox</span>

                  </div>
                </NuxtLink>
              </li>

              <li>
                <NuxtLink to="/bidder/bidderleaderboards">
                  <div
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ml-0.5 mb-4">
                    <svg version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"
                      fill="#000000" class="flex-shrink-0 w-5 h-5">
                      <g>
                        <path style="fill:#F8CE72;"
                          d="M480.928,399.689V162.177C498.525,159.334,512,144.189,512,125.782 c0-20.433-16.56-36.993-36.985-36.993c-20.44,0-37,16.56-37,36.993c0,11.684,5.523,21.982,13.987,28.755l-65.783,82.222 L275.312,90.566c16.517-7.398,28.038-23.943,28.038-43.218C303.35,21.201,282.156,0,256.003,0 c-26.155,0-47.349,21.201-47.349,47.347c0,19.275,11.52,35.82,28.038,43.218l-110.91,146.193l-65.776-82.222 c8.461-6.773,13.987-17.071,13.987-28.755c0-20.433-16.563-36.993-37.003-36.993C16.56,88.789,0,105.349,0,125.782 c0,18.407,13.479,33.552,31.079,36.396v237.512C17.062,400.471,5.92,411.978,5.92,426.177c0,14.719,11.919,26.638,26.641,26.638 h60.67h139.09h247.128c14.712,0,26.638-11.919,26.638-26.638C506.087,411.97,494.936,400.471,480.928,399.689z">
                        </path>
                        <g>
                          <polygon style="fill:#F9F7BE;"
                            points="256.003,65.108 125.782,236.759 31.079,118.383 31.079,423.214 256.003,423.214 ">
                          </polygon>
                          <polygon style="fill:#F9EB97;"
                            points="256.003,65.108 386.219,236.759 480.928,118.383 480.928,423.214 256.003,423.214 ">
                          </polygon>
                        </g>
                        <path style="fill:#F5C351;"
                          d="M506.087,426.177c0,14.719-11.926,26.638-26.638,26.638H32.562 c-14.723,0-26.641-11.919-26.641-26.638l0,0c0-14.711,11.919-26.637,26.641-26.637h446.887 C494.161,399.54,506.087,411.466,506.087,426.177L506.087,426.177z">
                        </path>
                        <rect x="93.231" y="399.54" style="fill:#F8CE72;" width="139.09" height="53.275"></rect>
                      </g>
                    </svg>
                    <span class="flex-1 ms-3 whitespace-nowrap">Leaderboards</span>
                  </div>
                </NuxtLink>
              </li>
              <li>
                <div class="border my-4 border-custom-bluegreen border-opacity-25 ">

                </div>
              </li>
              <li>
                <button @click="logout"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg height="24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path opacity="0.5"
                        d="M15.9998 2L14.9998 2C12.1714 2 10.7576 2.00023 9.87891 2.87891C9.00023 3.75759 9.00023 5.1718 9.00023 8.00023L9.00023 16.0002C9.00023 18.8287 9.00023 20.2429 9.87891 21.1215C10.7574 22 12.1706 22 14.9976 22L14.9998 22L15.9998 22C18.8282 22 20.2424 22 21.1211 21.1213C21.9998 20.2426 21.9998 18.8284 21.9998 16L21.9998 8L21.9998 7.99998C21.9998 5.17157 21.9998 3.75736 21.1211 2.87868C20.2424 2 18.8282 2 15.9998 2Z"
                        fill="#1C274C"></path>
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M15.75 12C15.75 11.5858 15.4142 11.25 15 11.25L4.02744 11.25L5.98809 9.56943C6.30259 9.29986 6.33901 8.82639 6.06944 8.51189C5.79988 8.1974 5.3264 8.16098 5.01191 8.43054L1.51191 11.4305C1.34567 11.573 1.25 11.781 1.25 12C1.25 12.2189 1.34567 12.4269 1.51191 12.5694L5.01191 15.5694C5.3264 15.839 5.79988 15.8026 6.06944 15.4881C6.33901 15.1736 6.30259 14.7001 5.98809 14.4305L4.02744 12.75L15 12.75C15.4142 12.75 15.75 12.4142 15.75 12Z"
                        fill="#1C274C"></path>
                    </g>
                  </svg>
                  <span class="flex-1 ms-3 whitespace-nowrap">Logout</span>
                </button>
              </li>



            </ul>
          </div>
        </div>
      </div>
      <!--  -->


      <div class="flex items-center w-full ">
        <div class="flex space-x-4 mr-4 lg:mr-0 items-center flex-grow  justify-end">

          <!--Inbox Icon-->
          <div class="relative hidden lg:block">
            <button :class="isActiveInbox ? 'bg-custom-bluegreen bg-opacity-25' : 'bg-gray-200'"
              class="flex items-center p-2 flex-shrink-0 flex-grow-0 text-gray-900 hover:bg-gray-300  rounded-full  md:hover:text-blue-700  md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
              aria-label="View Inbox" aria-expanded="false" @click="handleClickInbox" title="Inbox">
              <svg height="27px" width="27px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="mail"
                class="icon glyph" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M22,8.32V18a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V8.69L4,9.78l7.52,4.1A1,1,0,0,0,12,14a1,1,0,0,0,.5-.14L20,9.49Z"
                    style="fill:#005262"></path>
                  <path d="M22,6h0L20,7.18l-8,4.67L4,7.5,2,6.4V6A2,2,0,0,1,4,4H20A2,2,0,0,1,22,6Z" style="fill:#005262">

                  </path>
                </g>
              </svg>
              <span v-if="inboxStore.unreadCount > 0"
                class="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full text-xs text-white"> {{
                  inboxStore.unreadCount }}</span>
            </button>


            <div v-if="inboxDropdownOpen"
              class="absolute right-0 mt-2 w-96 bg-white divide-y divide-gray-100 rounded-md shadow-md drop-shadow-lg dark:bg-gray-700 z-0">
              <!-- Message List -->
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto no-scrollbar">
                <li v-for="message in inboxStore.messages" :key="message.message_id" :class="{
                  'bg-gray-500 bg-opacity-20 hover:bg-custom-bluegreen hover:bg-opacity-20': !message.is_read,
                  'bg-white hover:bg-custom-bluegreen hover:bg-opacity-20': message.is_read,
                  'block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white': true
                }" role="button" tabindex="0" class="flex items-center space-x-4">
                  <!-- User profile image -->
                  <img v-if="message.user_profile_image.length > 0" :src="message.user_profile_image[0]"
                    alt="Auction Image" class="w-11 h-11 rounded-full object-cover flex-shrink-0" loading="lazy" />
                  <!-- Default fallback image -->
                  <img v-else src="/public/images/no-image.jpg" alt="No Image Available"
                    class="w-11 h-11 rounded-full object-cover flex-shrink-0" loading="lazy" />
                  <!-- Message content -->
                  <div class="flex-1">
                    <p class="font-medium">From: {{ message.sender_name }}</p>
                    <p class="text-gray-500">{{ message.message }}</p>
                    <p class="text-xs text-gray-400">{{ formatDate(message.created_at) }}</p>
                  </div>
                </li>

                <!-- No messages available -->
                <li v-if="inboxStore.messages.length === 0">
                  <p class="block px-4 py-2 text-gray-500">No Messages.</p>
                </li>
              </ul>
              <!-- Fixed buttons for 'See All' and 'Mark All as Read' -->
              <div class="flex flex-col px-4 py-2 border-t space-y-2">
                <div class="flex justify-between">
                  <NuxtLink :to="{ path: '/inbox', query: { userType: userType } }"
                    class="flex items-center text-gray-700 hover:text-red-500">
                    <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span class="text-xs hover:underline">See All</span>
                  </NuxtLink>
                  <button @click="addMessage = true" class="flex items-center text-gray-700 hover:text-green-500">
                    <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="text-xs hover:underline">Compose Message</span>
                  </button>

                </div>
                <button @click="markAllMessagesAsRead"
                  class="flex items-center w-full text-gray-700 hover:text-green-500">
                  <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-xs hover:underline">Mark All as Read</span>
                </button>
              </div>
            </div>

            <!-- Add Message Modal - Place it outside the dropdown -->
            <AddMessageModal v-if="addMessage" @closeAddMessageModal="addMessage = false" />
          </div>

          <!--Notification Bell-->
          <!--View Notification Bell-->
          <div class="relative flex justify-end">
            <button :class="isActiveNotification ? 'bg-custom-bluegreen bg-opacity-25' : 'bg-gray-200'"
              class="flex items-center p-2 text-gray-900 rounded-full   hover:bg-gray-300 md:border-0 md:hover:text-blue-700  md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
              aria-expanded="false" @click="handleClick" title="Notification">
              <svg class="w-7 h-7 fill-current text-[#005262]  " viewBox="0 0 28 28" version="1.1"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <title>ic_fluent_alert_28_filled</title>
                  <desc>Created with Sketch.</desc>
                  <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="ic_fluent_alert_28_filled" fill="#005262" fill-rule="nonzero">
                      <path
                        d="M17.4656511,22.0023722 C17.2225412,23.6986589 15.7635335,25.0024884 14,25.0024884 C12.2364665,25.0024884 10.7774588,23.6986589 10.5343489,22.0023722 L17.4656511,22.0023722 Z M13.9999998,3 C18.6097416,3 22.362545,6.66898984 22.4974867,11.2460464 L22.4974867,11.501244 L22.5012438,11.501244 L22.501,15.613 L23.9150137,19.2573205 C23.9531988,19.3557443 23.9789872,19.4583221 23.9919367,19.5626921 L24.0016764,19.7202958 C24.0016764,20.3830375 23.4979968,20.9281385 22.852549,20.9936873 L22.7216764,21.0002958 L5.27478822,21.0002958 C5.11608079,21.0002958 4.95875738,20.9707807 4.81084204,20.913256 C4.19316669,20.67304 3.86769517,20.0060343 4.04055137,19.3807182 L4.08182805,19.2563496 L5.498,15.612 L5.49875581,11.501244 C5.49875581,6.80613658 9.3048924,3 13.9999998,3 Z"
                        id="🎨-Color">

                      </path>
                    </g>
                  </g>
                </g>
              </svg>

              <span v-if="unreadCount > 0"
                class="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full text-xs text-white"> {{
                  unreadCount }}</span>
            </button>
            <div v-if="notificationDropdownOpen"
              class="absolute right-0  mt-13 sm:w-96 w-80 bg-white divide-y  divide-gray-100 rounded-md shadow-md drop-shadow-lg dark:bg-gray-700 z-0">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto no-scrollbar">
                <li v-for="notification in notifications" :key="notification.notification_id" :class="{
                  'bg-gray-500 bg-opacity-20 hover:bg-custom-bluegreen hover:bg-opacity-20': !notification.is_read,
                  'bg-white hover:bg-custom-bluegreen hover:bg-opacity-20': notification.is_read,
                  'block px-4 py-2  dark:hover:bg-gray-600 dark:hover:text-white': true
                }" @click="getClickHandler(notification)" role="button" tabindex="0"
                  class="flex items-center space-x-4">
                  <!-- Image -->
                  <img src="/images/logo-no-text.jpg" class="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    alt="Profile Icon" />
                  <!-- Notification content -->
                  <div class="flex-1">
                    <p class="font-medium">From: {{ notification.sender_full_name }}</p>
                    <p class="text-gray-500">{{ notification.message }}</p>
                    <p class="text-xs text-gray-400">{{ formatDate(notification.created_at) }}</p>
                  </div>
                </li>
                <!-- No notifications message -->
                <li v-if="notifications.length === 0">
                  <p class="block px-4 py-2 text-gray-500">No notifications</p>
                </li>
              </ul>
              <!-- Fixed buttons for 'See All' and 'Mark All as Read' -->
              <div class="flex gap-6 items-center px-4 py-2 border-t">
                <NuxtLink :to="{ path: '/notification', query: { userType: userType } }"
                  class="flex items-center text-gray-700 hover:text-red-500">
                  <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                  <span class="text-xs hover:underline">See All</span>
                </NuxtLink>
                <button @click="markAllNotificationsAsRead"
                  class="flex items-center text-gray-700 hover:text-green-500">
                  <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-xs hover:underline">Mark All As Read</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Profile Icon -->
          <div class="relative pr-8 hidden md:block ">
            <button @click="toggleProfileDropdown"
              class=" sm:flex items-center py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent cursor-pointer"
              aria-expanded="false">
              <img :src="userStore.userProfileImage" class="w-10 h-10 rounded-full object-cover" alt="Profile Icon" />
            </button>
            <div v-if="profileDropdownOpen"
              class="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 shadow-sm-light shadow-black">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button @click="viewProfile"
                    class="flex items-center px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" />
                    </svg>
                    My Profile
                  </button>
                </li>
                <li>
                  <button @click="logout"
                    class="flex items-center px-4 py-2 w-full hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6-10V5a3 3 0 00-6 0v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content Section -->
    <div class="pt-16">
      <slot />
      <!-- Add Message Modal - Place it outside the dropdown -->
      <AddMessageModal v-if="addMessage" @closeAddMessageModal="addMessage = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from '@/stores/user-profile-image';
import { useNotificationStore } from '@/stores/notification-store';
import { useInboxStore } from '@/stores/inbox-store';
import AddMessageModal from "~/components/add-message-modal.vue";
import { useInboxSocketStore } from '@/stores/socketStore';
import { toast } from 'vue3-toastify';

const inboxDropdownOpen = ref(false);
const notificationDropdownOpen = ref(false);
const profileDropdownOpen = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const notificationsStore = useNotificationStore();
const inboxStore = useInboxStore();
const addMessage = ref(false);
const userType = ref("");
const userName = ref("");
const socketStore = useInboxSocketStore();
const notifications = computed(() => notificationsStore.notifications);
const unreadCount = computed(() => notificationsStore.unreadCount);
const isAuctioneerDashboard = ref(true);
const isActiveInbox = ref(false);
const isActiveNotification = ref(false);
const drawerOpen = ref(false);

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const getClickHandler = async (notification) => {

  if (notification.message?.includes('marked your transaction as completed for auction')) {
    return;
  }
  else {
    viewAuction(notification);
  }
};






const toggleNotification = () => {
  isActiveNotification.value = !isActiveNotification.value;
};

const toggleInbox = () => {
  isActiveInbox.value = !isActiveInbox.value;
};

const handleClick = () => {
  toggleNotificationDropdown();
  isActiveInbox.value = false;
  toggleNotification();
};

const handleClickInbox = () => {
  toggleInboxDropdown();
  isActiveNotification.value = false;
  toggleInbox();
};

const updateRouteCheck = () => {
  isAuctioneerDashboard.value =
    route.path === "/auctioneer/auctioneerdashboard" ||
    route.path === "/auctioneer/auctioneer-manage-auction" ||
    route.path === "/auctioneer/auctioneerprofile";
};

watch(route, updateRouteCheck);

const toggleInboxDropdown = async () => {
  inboxDropdownOpen.value = !inboxDropdownOpen.value;
  profileDropdownOpen.value = false;
  notificationDropdownOpen.value = false;
};

const toggleNotificationDropdown = async () => {
  notificationDropdownOpen.value = !notificationDropdownOpen.value;
  profileDropdownOpen.value = false;
  inboxDropdownOpen.value = false;
};


const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
  notificationDropdownOpen.value = false;
  inboxDropdownOpen.value = false;
};

const markAllMessagesAsRead = () => {
  inboxStore.markAllAsRead()
}

const markAllNotificationsAsRead = () => {
  notificationsStore.markAllAsRead()
}

function viewProfile() {
  profileDropdownOpen.value = false;
  router.replace("/auctioneer/auctioneerprofile");
}

const viewAuction = async (notification) => {
  try {
    router.push({ path: '/auctioneer/auctioneer-manage-auction', query: { id: notification.auction_uuid } });
  } catch (error) {
    console.error("failed to view the auction:", error);
  }
};

const logout = async () => {
  try {
    await axios.post("/api/logout");

    localStorage.removeItem("user_profile_picture");

    // Disconnect the WebSocket
    socketStore.disconnectSocket();

    // Redirect to login page or homepage
    router.replace("/homepage");
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed. Please try again.");
  }
};

const handleIncomingMessage = (newMessage) => {
  console.log('Received message in inbox:', newMessage);
  inboxStore.messages.unshift(newMessage); // Update messages list
  inboxStore.unreadCount = newMessage.unreadCount;

  toast(`New message from ${newMessage.sender_name}: ${newMessage.subject}`, {
    type: 'info',
    autoClose: 3000,
    position: 'top-right',
  });
};

const handleIncomingBidNotification = (newBidNotificationMessage) => {
  console.log('Received new notification message in BidderNavbar:', newBidNotificationMessage);
  notifications.unshift(newBidNotificationMessage.notification);

  // Update unread count if necessary
  unreadCount = newBidNotificationMessage.notification.unreadCount;

  // Display a toast notification
  toast(`From AuctionWave System: ${newBidNotificationMessage.notification.message}`, {
    type: 'info',
    autoClose: 3000,
    position: 'top-right',
  });
};

const handleIncomingOfferNotification = (newOfferNotificationMessage) => {
  console.log('Received new notification message in BidderNavbar:', newOfferNotificationMessage);
  notifications.unshift(newOfferNotificationMessage.notification);


  // Update unread count if necessary
  unreadCount = newOfferNotificationMessage.notification.unreadCount;

  // Display a toast notification
  toast(`From AuctionWave System: ${newOfferNotificationMessage.notification.message}`, {
    type: 'info',
    autoClose: 3000,
    position: 'top-right',
  });
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const getUserType = async () => {
  try {
    const { data } = await axios.post("/api/get-usertype");
    userType.value = data.userType;
    userName.value = data.userName;
  } catch (error) {
    console.error("Failed to get:", error);
    // handle error
  }
};

onMounted(async () => {
  updateRouteCheck();
  userStore.initializeProfileImage(); // Initialize from localStorage
  await Promise.all([notificationsStore.fetchNotifications(), inboxStore.fetchInbox(), getUserType()]);

  if (!socketStore.socket) {
    socketStore.connectSocket();
  }
  // Listen for incoming messages specifically for this user
  socketStore.socket.on('message-channel', handleIncomingMessage);
  socketStore.socket.on('bid-channel', handleIncomingBidNotification);
  socketStore.socket.on('offer-channel', handleIncomingOfferNotification);
});

onBeforeUnmount(() => {
  if (socketStore.socket) {
    socketStore.socket.off('message-channel', handleIncomingMessage);
    socketStore.socket.off('bid-channel', handleIncomingBidNotification);
    socketStore.socket.off('offer-channel', handleIncomingOfferNotification);
  }
  socketStore.disconnectSocket();
});
</script>

<style scoped>
.no-scrollbar {
  overflow-x: hidden;
  /* Prevent horizontal scrollbar */
}
</style>
