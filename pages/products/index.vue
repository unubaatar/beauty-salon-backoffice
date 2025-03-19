<template>
  <div>
    <v-container>
      <div class="d-flex justify-end">
        <v-btn color="#101828" @click="router.push('/products/create')">
          <v-icon>mdi-plus</v-icon>Бүтээгдэхүүн нэмэх</v-btn
        >
      </div>
      <v-data-table
        :headers="headers"
        class="mt-4"
        hide-default-footer
        :items="products"
        style="font-size: 18px"
      >
        <template v-slot:item.seq="{ index }: any">
          <div class="pa-4">
            {{ index + 1 }}
          </div>
        </template>
        <template v-slot:item.image="{ item }: any">
          <div class="pa-2">
            <img
              :src="item.images[0]"
              style="width: 60px; height: 60px; object-fit: cover"
              alt=""
            />
          </div>
        </template>

        <template v-slot:item.price="{ item }: any">
          <div class="pa-2">
            <p
              :style="item?.sellPrice ? 'text-decoration: line-through' : ''"
              style="font"
            >
              {{ item?.price.toLocaleString() }}₮
            </p>
          </div>
        </template>

        <template v-slot:item.sellPrice="{ item }: any">
          <div class="pa-2">
            <p v-if="item?.sellPrice">
              {{ item?.sellPrice?.toLocaleString() }}₮
            </p>
          </div>
        </template>

        <template v-slot:item.isActive="{ item }: any">
          <div class="pa-2">
            <v-icon color="green" v-if="item.isActive"
              >mdi-check-decagram-outline</v-icon
            >
            <v-icon color="red" v-else>mdi-close-circle-outline</v-icon>
          </div>
        </template>

        <template v-slot:item.edit="{ item }: any">
          <div class="pa-2">
            <v-btn
              variant="text"
              size="small"
              icon="mdi-pencil"
              @click="router.push(`/products/${item._id}`)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>

      <v-pagination
        class="mt-4"
        :length="length"
        v-model="page"
        @update:modelValue="fetchProducts()"
      >
      </v-pagination>
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
const length = ref<any>(0);
const page = ref<any>(1);
const per_page = ref<any>(10);

const headers = ref<any>([
  {
    title: "№",
    value: "seq",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Нэр",
    value: "name",
    align: "center",
    width: "300px",
    sortable: false,
  },
  {
    title: "Зураг",
    value: "image",
    align: "center",
    sortable: false,
  },
  {
    title: "Үнэ",
    value: "price",
    align: "center",
    sortable: false,
  },
  {
    title: "Хямдарсан үнэ",
    value: "sellPrice",
    align: "center",
    sortable: false,
  },
  {
    title: "Нөөц",
    value: "stock",
    align: "center",
    sortable: false,
  },
  {
    title: "Идэвхтэй эсэх",
    value: "isActive",
    align: "center",
    sortable: false,
  },
  {
    title: "Засах",
    value: "edit",
    align: "center",
    sortable: false,
  },
]);

const fetchProducts = async () => {
  try {
    const query = {
      page: page.value,
      per_page: per_page.value,
    };
    const response = await axios.post(`${baseURL}/products/list`, query);
    if (response.status === 200) {
      products.value = response.data.rows;
      count.value = response.data.count;

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchProducts();
  length.value = Math.ceil(count.value / per_page.value);
});
</script>

<style scoped></style>
