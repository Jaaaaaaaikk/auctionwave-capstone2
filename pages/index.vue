<template>
    <!-- <NuxtRedirect to="/homepage" /> -->
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
router.replace("/homepage");
</script>

<style scoped></style>
