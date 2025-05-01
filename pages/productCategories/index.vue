<template>
  <v-container max-width="1680">
    <v-btn
      @click="showAddProductDialog = true"
      color="#101828"
      style="position: fixed; bottom: 5%; right: 5%"
      >Ангилал нэмэх</v-btn
    >

    <v-row
      ><v-col v-for="category in categories" cols="6" md="4" lg="3" xl="2">
        <v-card
          @click="
            showUpdateDialog = true;
            currentCategory = category;
          "
          rounded="lg"
          style="height: 220px; cursor: pointer"
          class="pa-4 d-flex justify-center align-center flex-column"
        >
          <img
            :src="category.image"
            alt=""
            style="height: 72px; width: 72px; object-fit: cover"
          />
          <div style="font-weight: 550" class="mt-2">{{ category.title }}</div>
        </v-card>
      </v-col></v-row
    >

    <v-dialog width="500" v-model="showAddProductDialog">
      <v-card rounded="lg" class="pa-6 px-6">
        <div class="text-center mb-4" style="font-weight: 550; font-size: 20px">
          Бүтээгдэхүүний ангилал нэмэх
        </div>
        <v-text-field
          v-model="categoryToAdd.title"
          variant="outlined"
          label="Нэр"
        ></v-text-field>
        <v-text-field
          v-model="categoryToAdd.image"
          variant="outlined"
          label="Зураг"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn @click="createCategory()" color="#101828"
            ><v-icon>mdi-plus</v-icon>Нэмэх</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="showUpdateDialog">
      <v-card rounded="lg" class="pa-6 px-6">
        <div class="text-center mb-4" style="font-weight: 550; font-size: 20px">
          Бүтээгдэхүүний ангилал засах
        </div>
        <v-text-field
          v-model="currentCategory.title"
          variant="outlined"
          label="Нэр"
        ></v-text-field>
        <v-text-field
          v-model="currentCategory.image"
          variant="outlined"
          label="Зураг"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn @click="updateCategory()" color="#101828"
            ><v-icon>mdi-pencil</v-icon>Засах</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-container>
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

const categories = ref<any>([]);

const showAddProductDialog = ref<any>(false);
const showUpdateDialog = ref<any>(false);
const categoryToAdd = ref<any>({});
const count = ref<any>(0);
const currentCategory = ref<any>({});

const createCategory = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/productCategories/create`,
      categoryToAdd.value
    );
    if (response.status === 201) {
      await fetchCategories();
      categoryToAdd.value = {};
      showAddProductDialog.value = false;
      toast.success("Амжилттай");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.post(`${baseURL}/productCategories/all`, {});
    if (response.status === 200) {
      categories.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateCategory = async () => {
  try {
    const response = await axios.post(`${baseURL}/productCategories/update`, currentCategory.value);
    if(response.status === 200) {
      showUpdateDialog.value = false;
      await fetchCategories();
      toast.success("Амжилттай шинэчлэгдлээ");
    } else {
      console.log("jiiji");
    }
  } catch(err) {
    console.log(err);
  }
}

onMounted(async () => {
  await fetchCategories();
});
</script>

<style scoped></style>
