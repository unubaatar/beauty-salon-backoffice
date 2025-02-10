<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  router.push("/dashboard");
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@100..900&display=swap');

* {
  margin: 0;
  padding: 0;
  font-family: 'Commissioner', sans-serif; 
}
</style>
