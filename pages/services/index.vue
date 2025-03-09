<template>
  <div>
    <v-row>
      <v-col v-for="service in services" cols="12" md="4" xl="3">
        <v-card style="cursor: pointer" rounded="lg">
          <img
            style="width: 100%; height: 200px; object-fit: cover"
            :src="service.image"
            alt=""
          />

          <v-chip
            variant="flat"
            color="white"
            size="small"
            rounded="xl"
            style="position: absolute; top: 2%; right: 3%; border-radius: 4px"
            class="pa-2 mt-2 mb-2 d-flex align-center"
            ><v-icon>mdi-clock</v-icon
            ><span class="ml-2">{{ service.duration }} минут</span></v-chip
          >

          <v-chip
            variant="flat"
            color="#101828"
            size="small"
            rounded="xl"
            style="position: absolute; top: 2%; left: 3%; border-radius: 4px"
            class="pa-2 mt-2 mb-2 d-flex align-center"
            ><span class="ml-2">{{ service.category.title }} </span></v-chip
          >

          <div class="pa-4 pt-2">
            <div style="font-size: 18px; font-weight: 500">
              {{ service.title }}
            </div>
            <div style="font-size: 14px; font-weight: 400; color: gray">
              {{ service.description.split(" ").slice(0, 10).join(" ") }} ...
            </div>
            <!-- <div class="mb-2">Хийх ажилчид:</div> -->

            <div class="mt-2">
              <v-chip
                variant="outlined"
                color="grey"
                class="mr-2"
                v-for="worker in service.workers"
                size="small"
              >
                {{ worker.firstName }}
              </v-chip>
            </div>
            <div
              class="d-flex mt-4 justify-space-between"
              style="font-size: 20px; font-weight: bolder"
            >
              <div>{{ service.price.toLocaleString() }}₮</div>
              <v-btn
                @click="
                  // showUpdateServiceDialog = true;
                  currentService = service;
                  router.push(`/services/${currentService._id}`);
                "
                color="#101828"
                icon="mdi-pencil"
                size="small"
                elevation="0"
              ></v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      color="#101828"
      @click="showAddServiceDialog = true"
      style="position: fixed; bottom: 5%; right: 5%"
      ><v-icon>mdi-plus</v-icon> Үйлчилгээ нэмэх
    </v-btn>

    <v-dialog v-model="showAddServiceDialog" max-width="600">
      <v-card rounded="lg" class="pa-4">
        <div
          class="d-flex justify-center mb-4"
          style="font-size: 24px; font-weight: 450"
        >
          Үйлчилгээ нэмэх
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="serviceToAdd.title"
              label="Үйлчилгээний нэр"
              variant="outlined"
              hide-details
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="serviceToAdd.price"
              label="Үнэ"
              variant="outlined"
              type="number"
              hide-details
            ></v-text-field
          ></v-col>
          <v-col cols="12">
            <v-textarea
              v-model="serviceToAdd.description"
              hide-details
              label="Тайлбар"
              variant="outlined"
            >
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="serviceToAdd.category"
              label="Ангилал"
              :items="serviceCategories"
              item-value="_id"
              item-title="title"
              variant="outlined"
              hide-details
            >
            </v-select>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="serviceToAdd.workers"
              multiple
              :items="workers"
              item-value="_id"
              item-title="firstName"
              hide-details
              label="Ажилтан"
              variant="outlined"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="serviceToAdd.duration"
              label="Хугацаа (минут)"
              variant="outlined"
              hide-details
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="serviceToAdd.image"
              label="Зурагны URL"
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="pt-4 d-flex justify-end">
          <v-btn color="#101828" @click="addService()"
            ><v-icon>mdi-plus</v-icon> <span class="ml-2">Нэмэх</span>
          </v-btn>
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
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const services = ref<any>([]);
const showAddServiceDialog = ref<any>(false);
const serviceToAdd = ref<any>({});
const currentService = ref<any>({});
const workers = ref<any>([]);
const serviceCategories = ref<any>([]);

const fetchCategories = async () => {
  try {
    const response = await axios.post(`${baseURL}/serviceCategories/list`, {});
    if (response.status === 200) {
      serviceCategories.value = response.data.rows;
    } else {
      console.log("jiijiii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchServices = async () => {
  try {
    const response = await axios.post(`${baseURL}/services/all`);
    if (response.status === 200) {
      services.value = response.data.rows;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchWorkers = async () => {
  try {
    const response = await axios.post(`${baseURL}/users/getWorkers`);
    if (response.status === 200) {
      workers.value = response.data;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const addService = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/services/create`,
      serviceToAdd.value
    );
    if (response.status === 201) {
      showAddServiceDialog.value = false;
      serviceToAdd.value = {};
      await fetchServices();
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchServices();
  await fetchWorkers();
  await fetchCategories();
});
</script>
