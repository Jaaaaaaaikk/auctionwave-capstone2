<template>
    <div class="relative">
      <button @click="toggleDropdown" class="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md">
        {{ selectedOption || 'Select an option' }}
      </button>
      <div v-if="isOpen" class="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
        <ul class="max-h-60 overflow-auto">
          <li
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option.value)"
            class="block w-full px-4 py-2 text-gray-900 cursor-pointer hover:bg-gray-100"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    options: {
      type: Array,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  const selectedOption = ref('');
  const isOpen = ref(false);
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  const selectOption = (value) => {
    selectedOption.value = value;
    emit('update:modelValue', value);
    isOpen.value = false;
  };
  
  watch(() => props.modelValue, (newValue) => {
    selectedOption.value = props.options.find(option => option.value === newValue)?.label || '';
  });
  </script>
  
  <style scoped>
  /* Optional: Add custom styles for dropdown here */
  </style>
  