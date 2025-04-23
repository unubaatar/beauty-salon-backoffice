<template>
  <div>
    <v-container max-width="1440" style="width: 100%;">
      <div
      v-if="checkTokenValue"
      class="d-flex justify-center"
      style="position: sticky; top: 0; z-index: 10"
      :style="isMobile ? 'margin-left: 90px' : 'margin-left: 300px'"
    >
      <v-card
        style="
          width: 100% !important;
          height: 72px;
          max-width: 1440px;
          border-bottom-right-radius: 16px;
          border-bottom-left-radius: 16px;
        "
        class="d-flex align-center justify-end px-8"
      >
        <div class="d-flex">
          <v-menu width="180">
            <template v-slot:activator="{ props }">
              <img
                v-bind="props"
                style="
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  cursor: pointer;
                "
                :src="user.avatar"
                alt=""
              />
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title style="cursor: pointer" class="py-3"
                  ><v-icon>mdi-account-box-outline</v-icon>
                  <span class="ml-2">Профайл</span></v-list-item-title
                >
                <v-list-item-title
                  @click="logout()"
                  style="cursor: pointer"
                  class="py-3"
                  ><v-icon>mdi-logout</v-icon>
                  <span class="ml-2">Гарах</span></v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>

          <div class="ml-4 d-flex flex-column justify-space-around">
            <span style="font-weight: bolder">{{ user.userName }}</span>
            <span style="font-size: 14px">{{ formatRoles(user.role) }}</span>
          </div>
        </div>
      </v-card>
    </div>

    </v-container>


    <NuxtLayout>
      <NuxtPage class="pa-8" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const { mdAndUp, smAndDown } = useDisplay();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const router = useRouter();
const route = useRoute();
const user = ref<any>({});

const checkTokenValue = ref<any>(false);
  const isMobile = computed(() => smAndDown.value);

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if(!token) {
    localStorage.clear();
    checkTokenValue.value =  false;
  };
  const response = await axios.post(`${baseURL}/users/checkToken` , {
    token: token
  });
  if(response.status === 200) {
    checkTokenValue.value =  response.data.valid;
    if(!checkTokenValue.value) {
        localStorage.clear();
    }  
  } else {
    console.log("jiijii");
  }
};

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

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

onMounted(async () => {
  await checkAuth();
  user.value.avatar = localStorage.getItem("avatar");
  user.value.userId = localStorage.getItem("userId");
  user.value.role = localStorage.getItem("role");
  user.value.userName = localStorage.getItem("userName");
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Commissioner:wght@100..900&display=swap");

* {
  margin: 0;
  padding: 0;
  font-family: "Commissioner", sans-serif;
}

::-webkit-scrollbar {
    width: 6px; 
    height: 12px; 
}

::-webkit-scrollbar-track {
    background: #f1f1f1; 
    border-radius: 10px; 
}

::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 10px; 
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

::-webkit-scrollbar-corner {
    background: #f1f1f1; 
} 
</style>
