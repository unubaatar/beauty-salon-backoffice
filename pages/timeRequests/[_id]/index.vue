<template>
  <v-container max-width="1440">
    <v-row>
      <v-col cols="4">
        <v-card class="pa-4" rounded="lg">
          <div class="text-center" style="font-size: 20px; font-weight: 550">
            Дэлгэрэнгүй
          </div>
          <div class="mt-4">
            <v-row>
              <v-col cols="6">Захиалгын дугаар: </v-col>
              <v-col cols="6" style="font-weight: 550;">{{ timeReserve.timeReserveNumber }}</v-col>

              <v-col cols="6">Төлөв:</v-col>
              <v-col cols="6"
                ><v-select
                :items="states"
                item-value="value"
                item-title="title"
                v-model="timeReserve.state"
                  hide-details
                  density="compact"
                  variant="outlined"
                ></v-select
              ></v-col>

              <v-col cols="6">Захиалгын он, сар, өдөр:</v-col>
              <v-col cols="6" style="font-weight: 550;">{{ timeReserve.dateTitle }}</v-col>

              <v-col cols="6">Захиалгын цаг:</v-col>
              <v-col cols="6" style="font-weight: 550;">{{ timeReserve.startTime }}</v-col>

              <v-col cols="6">Нийт хугацаа:</v-col>
              <v-col cols="6" style="font-weight: 550;">{{ timeReserve.totalDuration }} минут</v-col>

              <v-col cols="6">Үүссэн огноо:</v-col>
              <v-col cols="6" style="font-weight: 550;">{{
                moment(timeReserve.createdAt).format("YYYY-MM-DD HH:mm:SS")
              }}</v-col>
            </v-row>
            <div class="d-flex justify-end mt-8">
              <v-btn color="#101828" elevation="0" @click="updateTimeReserve()">Хадгалах</v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mt-4 pa-4 align-center" rounded="lg">
          <div class="text-center" style="font-size: 20px; font-weight: 550">
            Ажилтан
          </div>

          <div class="py-8 d-flex justify-space-between">
            <img
              :src="timeReserve?.schedule?.worker?.avatar"
              style="height: 84px; width: 84px; object-fit: cover"
              alt=""
            />
            <article>
              <div>
                <v-icon>mdi-account</v-icon
                ><span class="ml-2">{{
                  timeReserve?.schedule?.worker?.firstName
                }}</span>
                <span class="ml-2">{{
                  timeReserve?.schedule?.worker?.lastName
                }}</span>
              </div>
              <div class="mt-2">
                <v-icon>mdi-phone</v-icon
                ><span class="ml-2">{{
                  timeReserve?.schedule?.worker?.phone
                }}</span>
              </div>
              <div class="mt-2">
                <v-icon>mdi-mail</v-icon
                ><span class="ml-2">{{
                  timeReserve?.schedule?.worker?.email
                }}</span>
              </div>
              <div class="mt-2">
                <v-icon>mdi-chevron-triple-up</v-icon
                ><span class="ml-2">{{
                  timeReserve?.schedule?.worker?.level?.description
                }}</span>
              </div>
            </article>
          </div>

          <div class="text-center" style="font-weight: 550; font-size: 18px">
            Үйлчлүүлэгч
          </div>

          <div class="py-8 d-flex justify-space-between">
            <img
              :src="timeReserve?.customer?.avatar"
              style="height: 84px; width: 84px; object-fit: cover"
              alt=""
            />
            <article>
              <div>
                <v-icon>mdi-account</v-icon
                ><span class="ml-2">{{
                  timeReserve?.customer?.firstName
                }}</span>
                <span class="ml-2">{{ timeReserve?.customer?.lastName }}</span>
              </div>
              <div class="mt-2">
                <v-icon>mdi-phone</v-icon
                ><span class="ml-2">{{ timeReserve?.customer?.phone }}</span>
              </div>
              <div class="mt-2">
                <v-icon>mdi-mail</v-icon
                ><span class="ml-2">{{ timeReserve?.customer?.email }}</span>
              </div>
            </article>
          </div>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card class="pa-4" rounded="lg">
          <div
            class="text-center"
            style="font-weight: 550; font-size: 20px; font-weight: 550"
          >
            Үйлчилгээнүүд
          </div>
          <br />

          <div v-for="service in timeReserve.services">
            <v-row class="d-flex align-center">
              <v-col cols="3">
                <img
                  style="
                    width: 100%;
                    object-fit: cover;
                    aspect-ratio: 1;
                    border-radius: 16px;
                  "
                  :src="service.service.image"
                  alt=""
                />
              </v-col>

              <v-col cols="6">
                <v-chip class="mb-1" size="small">{{
                  service?.service.category.title
                }}</v-chip>
                <div class="mb-1">{{ service.service.title }}</div>
                <div>{{ service?.variant?.title }}</div>
              </v-col>

              <v-col cols="3">
                <div class="mb-1" style="font-size: 18px; font-weight: 550">
                  {{ service.price.toLocaleString() }}₮
                </div>
              </v-col>
            </v-row>
          </div>

          <div
            class="d-flex justify-end mt-4"
            style="font-size: 20px; font-weight: 550"
          >
            <span class="mr-2">Нийт: </span>
            <span>{{ timeReserve?.totalAmount?.toLocaleString() }}₮</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "layout",
});

import axios from "axios";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const { mdAndUp } = useDisplay();
import moment from "moment";

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const timeReserveId = route.params._id;

const timeReserve = ref<any>({});

const states = ref<any>([
    {
        title: 'Хүлээгдэж буй',
        value: 'pending'
    },
    {
        title: 'Хийгдэж буй',
        value: 'in process'
    },
    {
        title: 'Дууссан',
        value: 'complete'
    },
]);

const updateTimeReserve = async () =>  {
    try {
        const response = await axios.post(`${baseURL}/timeReserves/update` , timeReserve.value);
        if(response.status === 200) {
            toast.success("Амжилттай");
            await fecthTimeReserve();
        } else {
            toast.error("Алдаа гарлаа");
        }
    } catch(err) {
        console.log(err);
    }
}

const fecthTimeReserve = async () => {
  try {
    const query = {
      _id: timeReserveId,
    };
    const response = await axios.post(`${baseURL}/timeReserves/getById`, query);
    if (response.status === 200) {
      timeReserve.value = response.data;
    } else {
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fecthTimeReserve();
});
</script>

<style scoped></style>
