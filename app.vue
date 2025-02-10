<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
  </div>
</template>



<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute , useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  router.push("/dashboard");
})

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}


</style>