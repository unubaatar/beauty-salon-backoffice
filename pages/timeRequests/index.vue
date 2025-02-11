<template>
  <div>
    <div class="mb-8 d-flex justify-center">
      <div class="d-flex align-center">
        <v-btn
          @click="getPreviousWeekData()"
          class="mx-2"
          variant="outlined"
          color="#101828"
          size="small"
          icon="mdi-chevron-left"
        ></v-btn>
        <div class="mx-2" style="font-size: 22px; font-weight: 500">
          {{ weekDays[0] }}
          <v-icon style="font-size: 20px">mdi-arrow-right</v-icon>
          {{ weekDays[1] }}
        </div>
        <v-btn
          @click="getNextWeekData()"
          class="mx-2"
          variant="outlined"
          color="#101828"
          size="small"
          icon="mdi-chevron-right"
        ></v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" lg="3" md="3" v-for="day in weekSchedule">
        <v-card variant="outlined" height="500" class="pa-4" rounded="lg">
          <div class="text-center">
            <div style="font-size: 20px; font-weight: 500">
              {{ day.dateTitle }}
            </div>
            <div>{{ day.day }}</div>
          </div>
          <div
            class="w-100 my-2"
            style="height: 1px; background-color: #d3d3d3"
          ></div>
          <div><v-icon>mdi-account-hard-hat</v-icon> Ажиллах ажилчид:</div>

          <v-list style="height: 320px">
            <v-list-item class="my-2" v-for="schedule of day.schedules">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex">
                  <img
                    style="height: 48px; width: 48px; border-radius: 50%"
                    :src="schedule.worker.avatar"
                    alt=""
                  />
                  <div style="font-size: 14px" class="ml-4">
                    <span style="font-weight: 500; font-size: 16px">{{
                      schedule.worker.firstName
                    }}</span>
                    <div>
                      Нийт цагийн захиалга:
                      <span
                        class="ml-2"
                        style="font-weight: 500; font-size: 16px"
                        >{{ schedule.totalService }}</span
                      >
                    </div>
                  </div>
                </div>

                <div>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        variant="text"
                        size="small"
                        v-bind="props"
                      ></v-btn>
                    </template>

                    <v-list>
                      <v-list-item
                        style="cursor: pointer"
                        @click="
                          showConfirmDialog = true;
                          scheduleToDelete = schedule._id;
                        "
                        >Устгах</v-list-item
                      >
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-list-item>
          </v-list>

          <div class="d-flex justify-center">
            <v-btn
              @click="
                showAddScheduleDialog = true;
                dateTitle = day.dateTitle;
              "
              color="#101828"
              rounded="pill"
              elevation="0"
            >
              <v-icon class="ml-1">mdi-plus</v-icon> Хуваарь нэмэх</v-btn
            >
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showAddScheduleDialog" width="500">
      <v-card rounded="lg" class="pa-6">
        <div class="text-center" style="font-size: 20px; font-weight: 500">
          Хуваарь нэмэх
        </div>
        <v-select
          v-model="userToAddSchedule"
          :items="users"
          item-value="_id"
          item-title="firstName"
          class="mt-4"
          variant="outlined"
          label="Ажилтан нэмэх"
        >
        </v-select>

        <div class="mt-2 w-100 d-flex justify-end">
          <v-btn @click="addSchedule()" color="#101828"
            ><v-icon class="mr-2">mdi-plus</v-icon> Нэмэх</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showConfirmDialog" width="350">
      <v-card class="pa-8">
        <div style="font-size: 18px; font-weight: 500">
          Та хуваарийг устгахдаа итгэлтэй байна уу ?
        </div>
        <div class="mt-4 w-100 d-flex justify-space-around">
          <v-btn
            variant="outlined"
            color="#101828"
            @click="showConfirmDialog = false"
            >Үгүй</v-btn
          >
          <v-btn color="#101828" @click="deleteSchedule(scheduleToDelete)"
            >Тийм</v-btn
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
import moment, { weekdays } from "moment";
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
const showAddScheduleDialog = ref<any>(false);
const showConfirmDialog = ref<any>(false);
const weekDays = ref<any>([]);
const weekSchedule = ref<any>([]);
const users = ref<any>([]);
const userToAddSchedule = ref<any>("");
const scheduleToDelete = ref<any>("");
const dateTitle = ref<any>("");

const fetchWeekSchedule = async () => {
  try {
    const query = {
      dates: weekDays.value,
    };
    const response = await axios.post(
      `${baseURL}/schedules/getScheduleByWeek`,
      query
    );
    if (response.status === 200) {
      weekSchedule.value = response.data;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const getPreviousWeekData= async () => {
  try {
    const startDate = moment(weekDays.value[0])
      .subtract(7, "days")
      .format("YYYY-MM-DD");
    const endDate = moment(weekDays.value[1])
      .subtract(7, "days")
      .format("YYYY-MM-DD");
    weekDays.value[0] = startDate;
    weekDays.value[1] = endDate;
    await fetchWeekSchedule();
  } catch (err) {
    console.log(err);
  }
};

const getNextWeekData = async () => {
  try {
    const startDate = moment(weekDays.value[0])
      .add(7, "days")
      .format("YYYY-MM-DD");
    const endDate = moment(weekDays.value[1])
      .add(7, "days")
      .format("YYYY-MM-DD");
    weekDays.value[0] = startDate;
    weekDays.value[1] = endDate;
    await fetchWeekSchedule();
  } catch (err) {
    console.log(err);
  }
};



const fetchUsers = async () => {
  try {
    const response = await axios.post(`${baseURL}/users/all`);
    if (response.status === 200) {
      users.value = response.data.rows;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const addSchedule = async () => {
  try {
    const query = {
      dateTitle: dateTitle.value,
      day: moment().format("dddd"),
      worker: userToAddSchedule.value,
    };
    const response = await axios.post(`${baseURL}/schedules/create`, query);
    if (response.status === 201) {
      showAddScheduleDialog.value = false;
      await fetchWeekSchedule();
      userToAddSchedule.value = "";
      toast.success("Амжилттай");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteSchedule = async (id: any) => {
  const query = {
    _id: id,
  };
  const response = await axios.post(`${baseURL}/schedules/delete`, query);
  if (response.status === 200) {
    showConfirmDialog.value = false;
    toast.success("Амжилттай усгалаа");
    await fetchWeekSchedule();
  } else {
    toast.error("Алдаа заалаа.");
  }
};

onMounted(async () => {
  weekDays.value[0] = moment()
    .startOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  weekDays.value[1] = moment()
    .endOf("week")
    .add(1, "days")
    .format("YYYY-MM-DD");
  await fetchWeekSchedule();
  await fetchUsers();
});
</script>
