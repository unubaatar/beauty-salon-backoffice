<template>
    
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "auth"
});

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
    router.push("/dashboard");
})
</script>