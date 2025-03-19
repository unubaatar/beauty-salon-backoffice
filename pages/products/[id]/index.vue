<template>
  <div class="d-flex w-100 justify-center">
    <div style="width: 100%; max-width: 1440px">
      <div class="d-flex justify-center">
        <v-tabs v-model="tab">
          <v-tab value="one">Дэлгэрэнгүй</v-tab>
          <v-tab value="two">Бүтээгдэхүүний төрлүүд</v-tab>
        </v-tabs>
      </div>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-container class="mt-4">
            <div class="d-flex justify-end">
              <v-btn @click="updateProduct()" color="#101828">
                <v-icon class="pr-2">mdi-content-save</v-icon>Хадгалах</v-btn
              >
            </div>
            <v-row class="mb-4">
              <v-col cols="3" md="2">
                <v-card
                  color="#101828"
                  variant="outlined"
                  style="aspect-ratio: 1; cursor: pointer"
                  class="d-flex justify-center align-center"
                  @click="showImage = true"
                >
                  <v-icon style="font-size: 36px">mdi-plus</v-icon>
                </v-card></v-col
              >

              <v-col
                v-for="image in product.images"
                cols="3"
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
                  v-model="product.name"
                  variant="outlined"
                  hide-details
                  label="Нэр"
                >
                </v-text-field
              ></v-col>
              <v-col cols="4"
                ><v-text-field
                  v-model="product.price"
                  variant="outlined"
                  hide-details
                  label="Үнэ"
                >
                </v-text-field
              ></v-col>
              <v-col cols="4"
                ><v-text-field
                  v-model="product.sellPrice"
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
                  v-model="product.category"
                  label="Ангилал"
                  :items="categories"
                  item-value="_id"
                  item-title="title"
                >
                </v-select
              ></v-col>

              <v-col cols="4"
                ><v-text-field
                  v-model="product.stock"
                  variant="outlined"
                  hide-details
                  label="Нөөц"
                  type="Number"
                >
                </v-text-field
              ></v-col>

              <v-col cols="12"
                ><v-textarea
                  style="height: 400px !important"
                  v-model="product.description"
                  variant="outlined"
                  hide-details
                  label="Тайлбар"
                >
                </v-textarea
              ></v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>

        <v-tabs-window-item value="two"> </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <v-dialog width="500" v-model="showImage">
      <v-card class="pa-6" rounded="lg">
        <div class="text-center mb-4" style="font-weight: 550">
          Нэмэх зурагны URL-аа оруулна уу
        </div>
        <v-text-field variant="outlined" v-model="addingImage"></v-text-field>
        <div
          class="d-flex justify-end"
          @click="
            addingImage = '';
            product.images.push(addingImage);
            showImage = false;
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

const tab = ref<any>(null);
const product = ref<any>({});
const categories = ref<any>([]);
const count = ref<any>(0);
const showImage = ref<any>(false);
const addingImage = ref<any>("");

const fetchProduct = async () => {
  try {
    const query = {
      _id: route.params.id,
    };
    const response = await axios.post(`${baseURL}/products/getById`, query);
    if (response.status === 200) {
      product.value = response.data;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateProduct = async() => {
    try {
        const response = await axios.post(`${baseURL}/products/update`, product.value);
        if(response.status === 200) {
            await fetchProduct();
            toast.success("Амжилттай шинэчлэгдлээ");
        } else {    
            console.log("jiijii");
        }
    } catch(err) {
        console.log(err);
    }
}

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

onMounted(async () => {
  await fetchProduct();
  await fetchCategories();
});
</script>

<style scoped></style>
