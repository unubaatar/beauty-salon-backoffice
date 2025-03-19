<template>
  <div class="d-flex justify-center w-100">
    <div style="max-width: 1260px; width: 100%">
      <div style="position: fixed; bottom: 5%; right: 5%">
        <v-btn @click="createProduct()" color="#101828"
          ><v-icon class="mr-2">mdi-content-save</v-icon> Хадгалах</v-btn
        >
      </div>

      <div class="text-center mb-4" style="font-size: 24px; font-weight: 550">
        Бүтээгдэхүүн нэмэх
      </div>

      <v-container>
        <v-row class="mb-4">
          <v-col cols="12" md="2">
            <v-card
              color="#101828"
              variant="outlined"
              style="aspect-ratio: 1; cursor: pointer"
              class="d-flex justify-center align-center"
              @click="showImageDialog = true"
            >
              <v-icon style="font-size: 36px">mdi-plus</v-icon>
            </v-card></v-col
          >

          <v-col
            v-for="image in productToCreate.images"
            cols="12"
            md="2"
            color="#101828"
            variant="outlined"
            style="aspect-ratio: 1; cursor: pointer"
          >
            <img
              :src="image"
              alt=""
              style="width: 100%; height: 100%; border-radius: 16px"
            />
          </v-col>
        </v-row>

        <v-row
          ><v-col cols="4"
            ><v-text-field
              v-model="productToCreate.name"
              variant="outlined"
              hide-details
              label="Нэр"
            >
            </v-text-field
          ></v-col>
          <v-col cols="4"
            ><v-text-field
              v-model="productToCreate.price"
              variant="outlined"
              hide-details
              label="Үнэ"
            >
            </v-text-field
          ></v-col>
          <v-col cols="4"
            ><v-text-field
              v-model="productToCreate.sellPrice"
              variant="outlined"
              hide-details
              label="Хямдасан үнэ"
            >
            </v-text-field
          ></v-col>
          <v-col cols="4"
            ><v-select
              variant="outlined"
              hide-details
              v-model="productToCreate.category"
              label="Ангилал"
              :items="categories"
              item-value="_id"
              item-title="title"
            >
            </v-select
          ></v-col>

          <v-col cols="4"
            ><v-text-field
              v-model="productToCreate.stock"
              variant="outlined"
              hide-details
              label="Нөөц"
              type="Number"
            >
            </v-text-field
          ></v-col>

          <v-col cols="12"
            ><v-textarea
              v-model="productToCreate.description"
              variant="outlined"
              hide-details
              label="Тайлбар"
            >
            </v-textarea
          ></v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog width="500" v-model="showImageDialog">
      <v-card class="pa-6" rounded="lg">
        <div class="text-center mb-4" style="font-weight: 550">
          Нэмэх зурагны URL-аа оруулна уу
        </div>
        <v-text-field variant="outlined" v-model="addingImage"></v-text-field>
        <div
          class="d-flex justify-end"
          @click="
            addingImage = '';
            productToCreate.images.push(addingImage);
            showImageDialog = false;
          "
        >
          <v-btn>Нэмэх</v-btn>
        </div>
      </v-card>
    </v-dialog>
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

const productToCreate = ref<any>({
  images: [],
});
const categories = ref<any>([]);
const count = ref<any>(0);
const showImageDialog = ref<any>(false);
const addingImage = ref<any>("");

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

const createProduct = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/products/create`,
      productToCreate.value
    );
    if (response.status === 201) {
      toast.success("Амжилттай үүслээ");
      router.push("/products");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>

<style scoped></style>
