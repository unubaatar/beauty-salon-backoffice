<template>
  <div
    style="height: 100vh; background-color: rgb(216, 195, 250)"
    class="d-flex justify-center align-center"
  >
    <v-card
      rounded="lg"
      elevation="0"
      fluid
      style="max-width: 1440px; width: 100%; height: 90%; max-height: 840px"
    >
      <v-row style="height: 100%" class="pa-0 ma-0">
        <v-col :cols="mdAndUp ? '5' : '12'">
          <div style="height: 100%" class="d-flex justify-center align-center">
            <div style="width: 400px">
              <div class="d-flex justify-center align-center">
                <img
                  style="height: 60px; width: 60px"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIIWju1ABYrb5DTkZ8mbDcaAekrgKnjmf0CA&s"
                  alt=""
                />
                <span style="font-weight: bolder">Гоо сайхны салон</span>
              </div>
              <div style="font-size: 40px" class="mb-10 text-center">
                Welcome Back
              </div>
              <v-text-field
                v-model="userData.phone"
                label="Утасны дугаар"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="userData.password"
                label="Нууц үг"
                variant="outlined"
                :type="passwordVisible ? 'text' : 'password'"
                append-inner-icon="mdi-eye"
                @click:append-inner="togglePasswordVisibility"
                outlined
              ></v-text-field>
              <v-btn @click="login()" color="pink" height="48" elevation="0" block
                >Нэвтрэх</v-btn
              >
              <hr class="my-4" />
              <div>
                <v-btn
                  style="
                    font-size: 12px;
                    font-weight: bolder;
                    height: 36px !important;
                  "
                  block
                  variant="text"
                  >Шинээр бүртгүүлэх</v-btn
                >
              </div>
            </div>
          </div>
        </v-col>
        <v-col class="pa-0" v-if="mdAndUp">
          <div style="width: 100%; height: 100%" class="d-flex justify-end">
            <img
              style="height: 100%"
              src="https://img.freepik.com/free-vector/flat-hand-drawn-girl-using-jade-roller_52683-56308.jpg"
              alt=""
            />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "login",
});

import axios from "axios";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useRoute , useRouter } from "vue-router";
import { useAuthStore  } from "@/stores/auth";


const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const auth = useAuthStore();

const passwordVisible = ref(false);
const userData = ref<any>({});

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const login = async() => {
  try {
    const response = await axios.post(`${baseURL}/users/login` , userData.value);
    if(response.status === 200) {
      localStorage.setItem("token" , response.data.token);
      localStorage.setItem("authToken" , response.data.bearerToken)
      auth.setUser(response.data.user)
      auth.setToken(response.data.token);
      window.location.reload();
      router.push("/dashboard");
    } else {
      console.log("jiijii");
    }
  } catch(err) {
    console.log(err);
  }
}


</script>

<style scoped></style>
