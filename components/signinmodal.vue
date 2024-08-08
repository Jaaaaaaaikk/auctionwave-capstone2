<template>
  <transition name="modal-fade">
    <div class="font-mono fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div class="bg-gray-300 shadow-lg rounded-3xl overflow-hidden w-11/12 max-w-lg mx-auto p-5">
        <header class="p-4 border-b">
          <button type="button" @click="$emit('close')" class="text-gray-600 hover:text-gray-800">
            <svg class="w-full h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-center">Log In</h1>
        </header>
        <section class="p-4">
          <form @submit.prevent="login">
            <div class="relative z-0 w-full mb-5 group">
              <input v-model="email" id="email" type="email"
                class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 border-black-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " required />
              <label for="email"
                class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email
                address</label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <input v-model="password" id="password" type="password"
                class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 border-black-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " required />
              <label for="password"
                class="peer-focus:font-medium pl-2 left-1 bg-gray-300 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            </div>
            <div class="mb-4">
              <input type="checkbox" id="rememberMe" class="mr-2">
              <label for="rememberMe">Remember me</label>
            </div>
            <div class="flex justify-center mt-4">
              <button type="submit"
                class="w-52 font-semibold px-4 py-2 rounded-3xl bg-teal-500 border-teal-500 text-gray-900 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600">Login</button>
            </div>
          </form>
        </section>
        <footer class="p-4 border-t text-center">
          <button @click="$emit('show-signup')" class="text-blue-500 hover:underline">Don't have an account? Sign
            up</button>
        </footer>
      </div>
    </div>
  </transition>
</template>


<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value
    });

    const { accessToken, refreshToken, user } = response.data;

    // Store tokens in localStorage or Vuex
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userType', user.userType);

    // Redirect based on userType
    if (user.userType === 'Bidder') {
      router.replace('/bidderdashboard');
    } else if (user.userType === 'Auctioneer') {
      router.replace('/auctioneerdashboard');
    } else {
      toast.error('Invalid user type'); 
    }
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
      toast.error(errorMessage.value);
    } else {
      toast.error('An unexpected error occurred'); 
    }
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 1s;
}

.modal-fade-enter,
.modal-fade-leave-to

/* .modal-fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>
