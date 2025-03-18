<template>
    <div>
      <v-container>
        <div class="d-flex justify-end">
          <v-btn color="#101828" @click="router.push('/products/create')"> <v-icon>mdi-plus</v-icon>Бүтээгдэхүүн нэмэх</v-btn>
        </div>

        <div>{{ products }}</div>
      </v-container>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "layout",
  middleware: "auth",
});

import axios from "axios";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const products = ref<any>([]);
const count = ref<any>(0);

const fetchProducts = async() => {
  try {
    const response = await axios.post(`${baseURL}/products/list` , {});
    if(response.status === 200) {
      products.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jiijii");
    }
  } catch(err) {
    console.log(err);
  }
}

onMounted(async() => {
  await fetchProducts();
})

</script>

<style scoped>
</style>