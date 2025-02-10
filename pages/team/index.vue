<template>
  <div class="pa-8">
    <v-row>
      <v-col v-for="user in users" cols="12" md="3">
        <v-card style="cursor: pointer;" rounded="lg" elevation="3">
          <div
            :style="
              user.role == 'admin'
                ? 'background-color: #d7e1f4'
                : user.role == 'worker'
                ? 'background-color: #e6e6e6'
                : user.role == 'seller'
                ? 'background-color: #ffffe6'
                : 'background-color: #d9f2e6'
            "
            style="height: 160px"
          ></div>
          <div style="margin-top: -60px" class="d-flex justify-center">
            <img
              :src="user.avatar"
              style="width: 120px; height: 120px; border-radius: 50%"
              alt=""
            />
          </div>

          <div class="pa-6 pt-0 d-flex justify-center flex-column align-center">
            <v-list>
              <v-list-item align="center"
                ><div style="font-size: 16px; color: gray; font-weight: 500">
                  {{ user.lastName }}
                </div>
                <div style="font-size: 19px; font-weight: 500">
                  {{ user.firstName }}
                </div>
              </v-list-item>

              <v-list-item align="center">
                <div class="my-1">
                  <v-icon style="font-size: 18px"
                    >mdi-hand-pointing-right</v-icon
                  >
                  <span class="ml-1">{{ formatRoles(user.role) }}</span>
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

const users = ref<any>([]);
const count = ref<any>(0);

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

onMounted(async () => {
  await fetchUsers();
});
</script>
