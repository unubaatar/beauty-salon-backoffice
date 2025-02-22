<template>
  <div>
    <v-btn
      @click="showDialog = true"
      color="#101828"
      style="position: fixed; bottom: 5%; right: 5%"
      ><v-icon>mdi-plus</v-icon>Ангилал нэмэх</v-btn
    >

    <v-dialog width="500" v-model="showDialog">
      <v-card class="pa-4">
        <div class="text-center mb-4" style="font-size: 20px; font-weight: 550">
          Ангиалал нэмэх
        </div>
        <v-text-field
          v-model="categoryDetails.title"
          variant="outlined"
          label="Ангилал"
        ></v-text-field>
        <v-textarea
          variant="outlined"
          label="Тайлбар"
          v-model="categoryDetails.description"
        ></v-textarea>
        <div class="d-flex justify-end">
          <v-btn @click="createCategory()" color="#101828">Нэмэх</v-btn>
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

const categories = ref<any>([]);
const count = ref<any>(0);
const showDialog = ref<any>(false);
const categoryDetails = ref<any>({});

const createCategory = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/serviceCategories/create`,
      categoryDetails.value
    );
    if (response.status === 201) {
      categoryDetails.value = {};
      toast.success("Амжилттай нэмэгдлээ");
      await fetchAllCategories();
      showDialog.value = false;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchAllCategories = async () => {
  try {
    const response = await axios.post(`${baseURL}/serviceCategories/list`, {});
    if (response.status === 200) {
      categories.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jijii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchAllCategories();
});
</script>

<style scoped></style>
