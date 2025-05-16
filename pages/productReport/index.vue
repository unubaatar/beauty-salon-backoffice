<template>
  <v-container width="1440">
    <div class="d-flex">
      <v-btn prepend-icon="mdi-clock" variant="outlined" color="#101828" @click="showDatePicker = true">Өдөр
        сонгох</v-btn>

      <div class="d-flex" style="font-weight: 550; font-size: 20px">
        <div class="ml-8">
          <span class="ml-2 mr-2"> {{ formatDate(startDate) }}</span>
        </div>
        -
        <div>
          <span class="mr-2 ml-1"> {{ formatDate(endDate) }}</span>
        </div>
      </div>
    </div>

    <v-data-table class="mt-8" hide-default-footer :headers="headers" :items="reportData">
      <template v-slot:item.seq="{ index }: any">
        <div class="pa-4" style="font-size: 16px; font-weight: 550">
          {{ index + 1 }}
        </div>
      </template>

      <template v-slot:item.image="{ item }: any">
        <div class="pa-4 d-flex align-center">
          <img :src="item.product.images[0]" style="
              border-radius: 50%;
              width: 48px;
              height: 48px;
              object-fit: cover;
            " alt="" />
        </div>
      </template>

      <template v-slot:item.product="{ item }: any">
        <div class="pa-4" style="font-size: 18px; font-weight: 550">
          {{ item.product.name }}
        </div>
      </template>

      <template v-slot:item.totalQty="{ item }: any">
        <div class="pa-4" style="font-size: 18px; font-weight: 550">
          {{ item.qty }}
        </div>
      </template>

      <template v-slot:item.totalIncome="{ item }: any">
        <div class="pa-4" style="font-size: 18px; font-weight: 550">
          {{ item.totalPrice.toLocaleString() }}₮
        </div>
      </template>

    </v-data-table>

    <v-dialog v-model="showDatePicker" max-width="800">
      <v-card class="pa-8">
        <div class="d-flex">
          <v-date-picker header="Эхлэх огноо" v-model="startDate">
            <!-- <template #title></template> -->
          </v-date-picker>

          <v-date-picker header="Дуусах огноо" v-model="endDate"></v-date-picker>
        </div>

        <div class="d-flex justify-end">
          <v-btn color="#101828" @click="
            showDatePicker = false;
          fetchProductReport();
          ">Сонгох</v-btn>
        </div>
      </v-card>
    </v-dialog>

  </v-container>
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
import moment from "moment";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const showDatePicker = ref(false);
const reportData = ref<any>([]);

const startDate = ref<any>();
const endDate = ref<any>();

const headers = ref<any>([
  {
    title: "№",
    value: "seq",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Зураг",
    value: "image",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Бүтээгдэхүүн",
    value: "product",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Нийт захиалсан тоо",
    value: "totalQty",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Нийт орлого",
    value: "totalIncome",
    align: "center",
    width: "50px",
    sortable: false,
  },
])

const fetchProductReport = async () => {
  try {
    const query = {
      dateFilter: [startDate.value, endDate.value],
    };
    const bearerToken = localStorage.getItem("authToken");
    const response = await axios.post(
      `${baseURL}/orders/getProductReport`,
      query,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      }
    );
    if (response.status === 200) {
      reportData.value = response.data;
    } else {
      console.log("jiiji");
    }
  } catch (err) {
    console.log(err);
  }
}

const formatDate = (date: string) => {
  return moment(date).format("YYYY-MM-DD");
};

onMounted(async () => {
  const now = new Date();
  startDate.value = new Date(now.getFullYear(), now.getMonth(), 1)
  endDate.value = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  await fetchProductReport();
})
</script>

<style scoped></style>