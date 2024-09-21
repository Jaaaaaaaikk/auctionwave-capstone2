<template>
  <transition name="modal-fade">
    <div class="font-mono fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div class="bg-gray-300 shadow-lg rounded-3xl overflow-hidden w-11/12 max-w-lg mx-auto p-5">
        <!-- Modal Header -->
        <header class="p-4 border-b">
          <h1 class="text-2xl font-bold text-center">Verify OTP</h1>
        </header>

        <!-- Modal Body -->
        <section class="p-4">
          <form @submit.prevent="submitOtp">
            <!-- OTP Input Field -->
            <div class="relative z-0 w-full mb-5 group">
              <span class="text-gray-600">An OTP has been sent to your email address: {{ props.form.email }}.</span>
              <div class="relative z-0 w-full group mt-4">
                <!-- Updated Input for Floating Label -->
                <input v-model="otp" id="otp" type="text"
                  class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-gray-500 border-2 rounded-md focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" " required />
                <label for="otp"
                  class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] left-2.5 bg-gray-300 px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                  OTP
                </label>
              </div>
            </div>

            <!-- Resend OTP Button and Timer -->
            <div class="flex justify-between items-center mb-4">
              <button type="button" :disabled="timer > 0" @click="resendOtp"
                class="font-semibold px-4 py-2 bg-teal-500 border border-teal-500 rounded-full shadow-sm-light shadow-black hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 text-gray-900 disabled:bg-gray-400">
                Resend OTP
              </button>
              <span class="text-gray-700">{{ timer > 0 ? `Resend available in ${timer}s` : '' }}</span>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center mt-4">
              <button type="submit"
                class="w-52 font-semibold px-4 py-2 bg-teal-500 border border-teal-500 rounded-full shadow-sm-light shadow-black hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-500 text-gray-900">
                Submit
              </button>
            </div>
          </form>
        </section>

        <!-- Modal Footer -->
        <footer class="p-4 border-t text-center">
          <button @click="$emit('close_otp_modal')" class="text-red-500 hover:underline">Cancel</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';

const emit = defineEmits();
const otp = ref('');
const timer = ref(0); // Timer for resend OTP

const props = defineProps({ // Receive email from parent component
  form: Object
});

const startTimer = () => {
  timer.value = 10; // Set timer duration
  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const resendOtp = async () => {
  if (timer.value > 0) return;

  try {
    const response = await axios.post('/api/generate-otp', { email: props.form.email });
    console.log(response);
    if (response.data.status === 400) {
      toast.warning(response.data.json.message);
    } else if (response.data.status === 200) {
      toast.info(response.data.json.message);
      startTimer(); // Start or restart the timer after resending OTP
    }
  } catch (error) {
    toast.error(`Error resending OTP: ${error.response?.data?.message || error.message}`);
  }
};

const submitOtp = async () => {
  try {
    // Validate OTP
    const response = await axios.post('/api/validate-otp', {
      email: props.form.email,
      otp: otp.value
    });

    console.log(response);

    if (response.data.success) {
      // OTP is valid, proceed to sign up
      const signUpResponse = await axios.post('/api/signup', {
        firstname: props.form.firstname,
        middlename: props.form.middlename,
        lastname: props.form.lastname,
        email: props.form.email,
        location_id: props.form.location_id,
        password: props.form.password,
        userType: props.form.userType,
        categories: props.form.categories,
      });

      console.log(signUpResponse);

      if (signUpResponse.data.status === 201) {
        toast.success(signUpResponse.data.json.message);
        emit('show-signin')
      } else {
        toast.warning(`Sign up failed: ${signUpResponse.data.json.message}`);
      }
    } else {
      toast.warning(`${response.data.message}`); // Invalid OTP
    }
  } catch (error) {
    toast.error(signUpResponse.data.json.message || response.data.message);
  }
};


// Start timer on modal mount
onMounted(() => {
  startTimer();
});

// Cleanup timer on component unmount
onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>