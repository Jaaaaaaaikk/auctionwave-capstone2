<template>
  <div>
    <NuxtRedirect to="/homepage" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
router.push("/homepage");
</script>

<style scoped></style>
