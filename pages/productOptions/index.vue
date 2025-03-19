<template>
  <div>
    <v-btn
      @click="showOptionDialog = true"
      color="#101828"
      style="position: fixed; bottom: 5%; right: 5%"
    >
      <v-icon class="mr-2">mdi-plus</v-icon> Нэмэх</v-btn
    >

    <v-dialog width="500" v-model="showOptionDialog">
      <v-card class="pa-6">
        <div class="text-center mb-4" style="font-size: 20px; font-weight: 550">
          Ангилалын төрөл нэмэх
        </div>
        <v-text-field variant="outlined" label="Нэр" v-model="optionToCreate.name"></v-text-field>
        <div class="d-flex justify-end">
          <v-btn color="#101828" @click="createOption()">Нэмэх</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
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

const optionToCreate = ref<any>({});
const showOptionDialog = ref<any>(false);
const options = ref<any>([]);
const count = ref<any>(0);

const fetchOptions = async () => {
  try {
    const response = await axios.post(`${baseURL}/productOptions/all`, {});
    if (response.status == 200) {
      options.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const createOption = async() => {
    try {
        const response = await axios.post(`${baseURL}/productOptions/create`, optionToCreate.value);
        if(response.status == 201) {
            await fetchOptions();
            showOptionDialog.value = false;
            toast.success('Амжилттай нэмэгдлээ');
        } else {    
            console.log("jiijii");
        }
    } catch(err) {
        console.log(err);
    }
}

onMounted(async () => {
  await fetchOptions();
});
</script>

<style scoped></style>
