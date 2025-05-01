<template>
  <v-container width="1440">
    <v-row>
      <v-col cols="8">
        <v-card rounded="lg" class="pa-8" style="height: 250px">
          <div class="mt-2 d-flex">
            <img
              :src="user.avatar"
              style="
                border-radius: 50%;
                width: 150px;
                border: 2px solid #f2f2f2;
                aspect-ratio: 1;
                object-fit: cover;
              "
              alt=""
            />

            <article class="ml-8">
              <div class="d-flex justify-end">
                <div style="font-weight: 550" class="text-h5 mr-4">
                  {{ currentDate }}
                </div>
                <div style="font-weight: 550" class="text-h5">
                  {{ currentTime }}
                </div>
              </div>
              <div style="font-size: 24px">
                Сайн байна уу ?
                <span class="ml-2" style="font-size: 32px; font-weight: 550">{{
                  user.firstName
                }}</span>
              </div>

              <div class="mt-8" style="font-size: 32px">{{ user.role }}</div>
            </article>
          </div>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card
          rounded="lg"
          style="height: 250px"
          class="pa-8 d-flex flex-column justify-space-between"
        >
          <h3 style="font-size: 32px; font-weight: 550">Өнөөдөр:</h3>

          <div style="font-size: 24px" class="d-flex">
            <v-icon> mdi-cart </v-icon>
            <div class="ml-2">Захиалга:</div>
            <span class="ml-2">{{ todayData.orderCount }}</span>
          </div>

          <div style="font-size: 24px" class="d-flex">
            <v-icon> mdi-calendar </v-icon>
            <div class="ml-2">Цаг товлолт:</div>
            <span class="ml-2">{{ todayData.timeReserveCount }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="6">
            <v-card
              rounded="lg"
              class="pa-8 d-flex flex-column justify-space-around"
              style="height: 250px"
            >
              <div class="text-end" style="font-size: 32px; font-weight: 550">
                Бүтээгдэхүүний нийт орлого
              </div>
              <div class="text-end" style="font-size: 48px; font-weight: 550">
                {{ todayData.totalIncomeFromOrder?.toLocaleString() }}₮
              </div>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card
              rounded="lg"
              style="height: 250px"
              class="pa-8 d-flex flex-column justify-space-around"
            >
              <div class="text-end" style="font-size: 32px; font-weight: 550">
                Үйлчилгээний нийт орлого
              </div>
              <div class="text-end" style="font-size: 48px; font-weight: 550">
                {{ todayData.totalIncomeFromTimeReserve?.toLocaleString() }}₮
              </div>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card
              rounded="lg"
              class="pa-4 d-flex justify-center align-center flex-column"
              style="height: 250px"
            >
              <div style="font-size: 20px; font-weight: 550" class="mb-2">
                Өнөөдрийн орлого
              </div>
              <canvas ref="canvasRef" style="width: 80%; height: 80%"></canvas>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              rounded="lg"
              style="height: 250px"
              class="pa-8 d-flex flex-column justify-space-around"
            >
              <div class="text-end" style="font-size: 32px; font-weight: 550">
                Энэ сарын нийт орлого:
              </div>
              <div class="text-end" style="font-size: 48px; font-weight: 550">
                {{ totalMonthIncome.totalIncome?.toLocaleString() }}₮
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="4">
        <v-card rounded="lg" class="pa-8" style="height: 524px">
          <div class="text-center" style="font-weight: 550; font-size: 20px">
            Сүүлийн 10 хоног
          </div>

          <v-list class="mt-2" style="overflow-y: auto; max-height: 424px">
            <v-list-item
              class="d-flex"
              v-for="day of last10DayIncome"
              :key="day.dateTitle"
            >
              <span style="font-size: 16px;">{{ day.dateTitle }}</span>
              <span style="font-weight: 550; font-size: 20px;"  class="ml-4">{{ day.totalIncome?.toLocaleString() }}₮</span>
            </v-list-item>
          </v-list>
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(PieController, ArcElement, Tooltip, Legend);

const canvasRef = ref<any>(null);
let chartInstance: Chart | null = null;

const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const todayData = ref<any>({});
const last10DayIncome = ref<any>([]);
const totalMonthIncome = ref<any>({});
const user = ref<any>({});
const currentTime = ref("");
const currentDate = ref("");

const drawPieChart = () => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Цагийн захиалга", "Захиалга"],
      datasets: [
        {
          label: "Нийт орлого",
          data: [
            todayData.value.totalIncomeFromTimeReserve || 0,
            todayData.value.totalIncomeFromOrder || 0,
          ],
          backgroundColor: ["#3b82f6", "#10b981"],
          hoverOffset: 20,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ₮${value.toLocaleString()}`;
            },
          },
        },
      },
    },
  });
};

const fetchTodayData = async () => {
  try {
    const response = await axios.post(`${baseURL}/reports/getTodayData`);
    if (response.status === 200) {
      todayData.value = response.data;
      drawPieChart();
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchLast10DaysData = async () => {
  try {
    const response = await axios.post(`${baseURL}/reports/getLastTenDaysData`);
    if (response.status === 200) {
      last10DayIncome.value = response.data;
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchMonthData = async () => {
  try {
    const response = await axios.post(`${baseURL}/reports/getTotalMonthIncome`);
    if (response.status === 200) {
      totalMonthIncome.value = response.data;
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchUser = async () => {
  try {
    const query = {
      _id: localStorage.getItem("userId"),
    };
    const response = await axios.post(`${baseURL}/users/getById`, query);
    if (response.status === 200) {
      user.value = response.data;
    }
  } catch (err) {
    console.log(err);
  }
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  currentDate.value = `${year} оны ${month} сарын ${day}`;
};

onMounted(async () => {
  await fetchUser();
  await fetchTodayData();
  await fetchMonthData();
  await fetchLast10DaysData();
  updateTime();
  window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>

<style scoped></style>
