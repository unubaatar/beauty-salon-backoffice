<template>
  <v-container max-width="1680">
    <v-row>
      <v-col v-for="user in users" cols="12" md="6" lg="4" xl="3">
        <v-card style="cursor: pointer; position: relative" rounded="lg" elevation="3">
          <v-btn @click="
            showEditDialog = true;
          currentWorker = user;
          " style="position: absolute; top: 3%; right: 3%" icon="mdi-pencil">
          </v-btn>
          <div :style="user.role == 'admin'
            ? 'background-color: #d7e1f4'
            : user.role == 'worker'
              ? 'background-color: #e6e6e6'
              : user.role == 'seller'
                ? 'background-color: #ffffe6'
                : 'background-color: #d9f2e6'
            " style="height: 160px"></div>
          <div style="margin-top: -60px" class="d-flex justify-center">
            <img :src="user.avatar" style="width: 120px; height: 120px; border-radius: 50%" alt="" />
          </div>

          <div class="pa-6 pt-0 d-flex justify-center flex-column align-center">
            <v-list>
              <v-list-item align="center">
                <div style="font-size: 16px; color: gray; font-weight: 500">
                  {{ user.lastName }}
                </div>
                <div style="font-size: 19px; font-weight: 500">
                  {{ user.firstName }}
                </div>
              </v-list-item>

              <v-list-item align="center">
                <div class="my-1">
                  <v-icon style="font-size: 18px">mdi-hand-pointing-right</v-icon>
                  <span class="ml-1">{{ formatRoles(user.role) }}</span>
                </div>

                <div class="my-1" v-if="user.level">
                  <v-icon style="font-size: 18px">mdi-medal-outline</v-icon>
                  <span class="ml-1">{{ user?.level?.level }}</span>
                </div>

                <div class="my-1">
                  <v-icon style="font-size: 18px">mdi-phone</v-icon>
                  <span class="ml-1">{{ user.phone }}</span>
                </div>

                <div class="my-1">
                  <v-icon style="font-size: 18px">mdi-email</v-icon>
                  <span class="ml-1">{{ user.email }}</span>
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog width="500" v-model="showEditDialog">
      <v-card class="pa-4 px-8">
        <div class="text-center" style="font-size: 20px; font-weight: 550">
          Ажилтан засах
        </div>
        <v-select :items="workerLevels" item-value="_id" item-title="level" v-model="currentWorker.level"
          variant="outlined" class="my-4" label="Түвшин" hide-details>
        </v-select>

        <div class="d-flex align-center">
          <span class="mr-2">Идэвхтэй эсэх: </span>
          <v-switch color="#101828" hide-details v-model="currentWorker.isActive"></v-switch>
        </div>

        <div class="mb-4 d-flex justify-end">
          <v-btn @click="updateUser()" color="#101828"><v-icon>mdi-content-save</v-icon>Хадгалах</v-btn>
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

const users = ref<any>([]);
const count = ref<any>(0);
const workerLevels = ref<any>([]);
const showEditDialog = ref<any>(false);
const currentWorker = ref<any>({});

const formatRoles = (role: any) => {
  switch (role) {
    case "admin":
      return "Админ";
    case "worker":
      return "Ажилтан";
    case "seller":
      return "Борлуулагч";
    case "manager":
      return "Менежер";
  }
};

const formatRolesColors = (role: any) => {
  switch (role) {
    case "admin":
      return "red";
    case "worker":
      return "blue";
    case "seller":
      return "yellow";
    case "manager":
      return "green";
  }
};

const fetchWorkerLevels = async () => {
  try {
    const response = await axios.post(`${baseURL}/workerLevels/all`);
    if (response.status === 200) {
      workerLevels.value = response.data.rows;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchUsers = async () => {
  try {
    const response = await axios.post(`${baseURL}/users/all`);
    if (response.status === 200) {
      users.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async () => {
  try {
    const bearerToken = localStorage.getItem("authToken");
    const response = await axios.post(`${baseURL}/users/update`, currentWorker.value, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
    if (response.status === 200) {
      showEditDialog.value = false;
      toast.success("Амжилттай");
      await fetchUsers();
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
}


onMounted(async () => {
  await fetchUsers();
  await fetchWorkerLevels();
});
</script>
