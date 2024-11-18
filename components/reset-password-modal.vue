<template>
    <div class="w-full max-w-md mx-auto h-auto p-6 fixed inset-0">
        <div
            class="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Remember your password?
                        <button @click="$emit('closeResetPasswordModal')"
                            class="text-blue-600 decoration-2 hover:underline font-medium">
                            Login here
                        </button>
                    </p>
                </div>

                <div class="mt-5">
                    <div>
                        <div class="grid gap-y-4">
                            <div class="relative z-0 w-full mb-5 group">
                                <input v-model="email" id="email" type="email"
                                    class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" " required />
                                <span class="absolute inset-y-0 right-3 flex items-center">
                                    <svg @click="sendOtp"
                                        class="w-8 h-10 text-custom-bluegreen cursor-pointer hover:text-green-500"
                                        fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M12 2a7 7 0 00-7 7c0 4.418 7 13 7 13s7-8.582 7-13a7 7 0 00-7-7zm0 9a2 2 0 110-4 2 2 0 010 4z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                <label for="email"
                                    class="peer-focus:font-medium pl-2 left-1 bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Email address
                                </label>
                                <p v-if="error" class="text-xs text-red-600 mt-2" id="email-error">
                                    {{ error }}
                                </p>
                            </div>
                            <div v-if="otpVisible" class="relative z-0 w-full mb-2 group">
                                <span class="text-gray-500">
                                    An OTP has been sent to your email address: <span class="font-bold">{{ email
                                        }}</span>.<br />
                                    Please enter the OTP sent to your email.
                                </span>

                                <div class="flex justify-center gap-4 my-6">
                                    <input v-model="otp[0]" type="text" maxlength="1" @input="validateOtpInput(0)"
                                        class="w-12 h-12 text-center border-2 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        required />
                                    <input v-model="otp[1]" type="text" maxlength="1" @input="validateOtpInput(1)"
                                        class="w-12 h-12 text-center border-2 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        required />
                                    <input v-model="otp[2]" type="text" maxlength="1" @input="validateOtpInput(2)"
                                        class="w-12 h-12 text-center border-2 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        required />
                                    <input v-model="otp[3]" type="text" maxlength="1" @input="validateOtpInput(3)"
                                        class="w-12 h-12 text-center border-2 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        required />
                                </div>

                                <div class="flex justify-between items-center mb-6">
                                    <span class="text-gray-500 ml-2">
                                        Didn't receive code?
                                        <a @click="timer === 0 ? sendOtp() : null"
                                            class="cursor-pointer text-custom-bluegreen font-bold hover:underline"
                                            :class="{ 'opacity-50 text-gray-500 cursor-not-allowed': timer > 0 }"
                                            tabindex="0">
                                            Resend
                                        </a>
                                        <span class="text-gray-500 text-sm opacity-50">{{ timer > 0 ? `(${timer}s)` : ''
                                            }}</span>
                                    </span>
                                </div>
                            </div>

                            <div v-if="showPasswordFields">
                                <div class="relative z-0 w-full mb-5 group">
                                    <input v-model="password" id="password" type="password"
                                        class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " required autocomplete="off" />
                                    <label for="password"
                                        class="peer-focus:font-medium pl-2 left-1 bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                        Password
                                    </label>
                                </div>
                                <div class="relative z-0 w-full mb-5 group">
                                    <input v-model="confirmPassword" id="confirmPassword" type="password"
                                        class="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent rounded-md border-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " required autocomplete="off" />
                                    <label for="confirmPassword"
                                        class="peer-focus:font-medium pl-2 left-1 bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                        Confirm Password
                                    </label>
                                    <span v-if="errorMessageInPasswords" class="text-red-500 text-xs ml-3">{{
                                        errorMessageInPasswords }}</span>
                                </div>
                            </div>
                            <!-- OTP Verification Button -->
                            <button v-if="otpVisible && !showPasswordFields" @click="validateOtp"
                                class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-custom-bluegreen text-white hover:border-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Verify OTP
                            </button>

                            <button v-if="showPasswordFields" @click="resetPassword"
                                class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-custom-bluegreen text-white hover:border-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Reset password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';

const emit = defineEmits();
const email = ref('');
const otp = ref(['', '', '', '']);
const timer = ref(0);
const showPasswordFields = ref(false);
const otpVisible = ref(false);
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const errorMessageInPasswords = ref('');
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;  // Regex for password validation
let countdown;

const startTimer = () => {
    if (timer.value > 0) return;  // If timer is already running, do nothing
    timer.value = 30;  // Set timer to 30 seconds
    countdown = setInterval(() => {
        if (timer.value > 0) {
            timer.value--;
        } else {
            clearInterval(countdown);
        }
    }, 1000);
};

// Call timer function onMounted
onMounted(() => {
    startTimer();  // Start the timer when the component is mounted
});

// Cleanup on unmount
onUnmounted(() => {
    clearInterval(countdown);  // Clear the countdown when the component is unmounted
});

// Handle OTP sending
const sendOtp = async () => {

    if (email.value === '') {
        toast.error('Please enter a valid email address.');
        return;
    }

    try {
        const response = await axios.post('/api/generate-otp', { email: email.value });
        if (response.data.status === 400) {
            toast.warning(response.data.json.message);
        } else if (response.data.status === 200) {
            toast.info(response.data.json.message);
            otpVisible.value = true;
            startTimer();  // OTP valid for 30 seconds;
        }
    } catch (error) {
        toast.error('Error sending OTP.');
    }
};

// Validate OTP input fields
const validateOtpInput = (index) => {
    if (!/^\d$/.test(otp.value[index])) {
        otp.value[index] = '';  // Reset if it's not a valid number
    }
};

// Validate OTP and proceed to password input
const validateOtp = async () => {
    const otpCode = otp.value.join('');
    if (otpCode.length !== 4) {
        toast.error('Please enter a valid 4-digit OTP.');
        return;
    }
    try {
        const response = await axios.post('/api/validate-otp', { email: email.value, otp: otpCode });
        if (response.data.success) {
            toast.success('OTP verified!');
            otpVisible.value = false;
            showPasswordFields.value = true;
        } else {
            toast.error('Invalid OTP.');
        }
    } catch (error) {
        toast.error('Error verifying OTP.');
    }
};

// Handle password reset 
const resetPassword = async () => {
    if (password.value !== confirmPassword.value) {
        toast.error('Passwords do not match.');
        return;
    }
    if (!passwordPattern.test(password.value)) {
        toast.error('Password must be at least 8 characters, including a letter, a number, and a special character.');
        return;
    }

    try {
        const response = await axios.post('/api/reset-password', { email: email.value, password: password.value });

        // Ensure the response matches the expected structure
        if (response.data.status === 200) {
            toast.success(response.data.message);  // Use the message field here
            emit('closeResetPasswordModal');
        } else {
            toast.warning(response.data.message);  // Use the message field here
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        toast.error('Error resetting password.');
    }
};


watch([() => password.value, () => confirmPassword.value], ([newPassword, newConfirmPassword]) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validate the password
    if (newPassword && !passwordRegex.test(newPassword) || newConfirmPassword && !passwordRegex.test(newConfirmPassword)) {
        errorMessageInPasswords.value = "Password must be at least 8 characters long, contain a number, and a special character (e.g., @, $, !).";
    } else if (newConfirmPassword !== newPassword) {
        errorMessageInPasswords.value = "Passwords do not match.";
    } else {
        errorMessageInPasswords.value = "";
    }
});



</script>
