<template>
  <div>
    <v-btn
      color="#101828"
      @click="showAddLevelDialog = true"
      style="position: fixed; bottom: 5%; right: 5%"
      ><v-icon>mdi-plus</v-icon> Зэрэглэл нэмэх
    </v-btn>

    <v-row>
      <v-col v-for="level in levels" cols="2">
        <v-card @click="showUpdateDialog = true; levelToUpdate = level;" class="pa-4 d-flex justify-center align-center flex-column" height="200" rounded="lg" style="cursor: pointer">
            <img :src="level.image" style="height: 72px; width: 72px;" alt="">
            <div style="font-weight: 550;" class="mt-2">{{ level.level }}</div>
            <div style="font-weight: 550;">{{ level.description }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog width="500" v-model="showAddLevelDialog">
      <v-card class="pa-4">
        <div class="text-center mb-4" style="font-size: 20px; font-weight: 550">
          Түвшин нэмэх
        </div>
        <v-text-field
          v-model="levelToCreate.level"
          variant="outlined"
          label="Нэр"
        ></v-text-field>
        <v-textarea
          v-model="levelToCreate.description"
          variant="outlined"
          label="Тайлбар"
        ></v-textarea>
        <v-text-field
          v-model="levelToCreate.image"
          variant="outlined"
          label="Зураг"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn @click="createLevels()" color="#101828"
            ><v-icon>mdi-content-save</v-icon> Хадгалах</v-btn
          >
        </div>
      </v-card>
    </v-dialog>


    
    <v-dialog width="500" v-model="showUpdateDialog">
      <v-card class="pa-4">
        <div class="text-center mb-4" style="font-size: 20px; font-weight: 550">
          Түвшин шинэчлэх
        </div>
        <v-text-field
          v-model="levelToUpdate.level"
          variant="outlined"
          label="Нэр"
        ></v-text-field>
        <v-textarea
          v-model="levelToUpdate.description"
          variant="outlined"
          label="Тайлбар"
        ></v-textarea>
        <v-text-field
          v-model="levelToUpdate.image"
          variant="outlined"
          label="Зураг"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn @click="updateLevels()" color="#101828"
            ><v-icon>mdi-content-save</v-icon> Хадгалах</v-btn
          >
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
import moment  from "moment";
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

const showAddLevelDialog = ref<any>(false);
const showUpdateDialog = ref<any>(false);
const levelToCreate = ref<any>({});
const levelToUpdate = ref<any>({});
const levels = ref<any>([]);
const count = ref<any>();

const fetchLevels = async () => {
  try {
    const response = await axios.post(`${baseURL}/workerLevels/all`, {});
    if (response.status === 200) {
      levels.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const createLevels = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/workerLevels/create`,
      levelToCreate.value
    );
    if (response.status === 201) {
      toast.success("Амжилттай үүслээ");
      showAddLevelDialog.value = false;
      levelToCreate.value = {};
      await fetchLevels();
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};


const updateLevels = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/workerLevels/update`,
      levelToUpdate.value
    );
    if (response.status === 200) {
      toast.success("Амжилттай үүслээ");
      showUpdateDialog.value = false;
      levelToUpdate.value = {};
      await fetchLevels();
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchLevels();
});
</script>

<style scoped></style>
