<template>
  <v-container max-width="1680" style="width: 100%;">
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
      <v-col cols="12" sm="6" md="6" lg="4" xl="3" v-for="day in weekSchedule">
        <v-card variant="outlined" height="540" class="pa-4" rounded="lg">
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
                      Нийт цаг товлолт:
                      <span
                        class="ml-2"
                        style="font-weight: 500; font-size: 16px"
                        >{{ schedule.totalServices }}</span
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

          <div class="w-100 d-flex justify-center flex-column align-center">
            <v-btn
              @click="
                currentScheduleDetail = [];
                showScheduleDetailDialog = true;
                dateTitle = day.dateTitle;
                fetchScheduleByDay();
              "
              color="#101828"
              elevation="0"
              block
              variant="outlined"
            >
              <v-icon class="ml-1">mdi-plus</v-icon> Дэлгэрэнгүй</v-btn
            >

            <v-btn
              class="mt-4"
              @click="
                showAddScheduleDialog = true;
                dateTitle = day.dateTitle;
              "
              color="#101828"
              elevation="0"
              block
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

    <v-dialog v-model="showScheduleDetailDialog" max-width="1080">
      <v-card class="pa-8">
        <v-table>
          <thead>
            <tr style="height: 50px">
              <th>Цаг</th>
              <th v-for="schedule in currentScheduleDetail">
                <div class="d-flex justify-center align-center py-2">
                  <img
                    :src="schedule.worker.avatar"
                    style="height: 50px; width: 50px; border-radius: 50%"
                    alt=""
                  />
                  <span class="ml-4">{{ schedule.worker.firstName }}</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="time in times" style="height: 60px !important">
              <td style="height: 60px">{{ time }}</td>

                  <td
                    style="position: relative; overflow: visible"
                    v-for="schedule in currentScheduleDetail"
                  >
                    <v-card
                      @click="goToDetail(getResvervedTime(schedule, time)._id)"
                      class="pa-2"
                      variant="tonal"
                      style="background-color: white; cursor: pointer"
                      v-if="getResvervedTime(schedule, time)"
                      :style="{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height:
                          `${calcHeight(
                            getResvervedTime(schedule, time).totalDuration
                          )}` + 'px !important',
                      }"
                    >
                      <div>
                        <div class="mb-2 d-flex justify-space-between">
                          <div>
                            {{
                              getResvervedTime(schedule, time).customer
                                .firstName
                            }}
                          </div>
                          <div>
                            {{
                              getResvervedTime(schedule, time).customer.phone
                            }}
                          </div>
                        </div>
                        <div
                          v-for="service in getResvervedTime(schedule, time)
                            .services"
                        >
                          <div>
                            {{ service.service.title }}
                            <span v-if="service?.variant">
                              - {{ service?.variant.title }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </td>
            </tr>
          </tbody>
        </v-table>
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
import moment from "moment";
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
const showScheduleDetailDialog = ref<any>(false);
const weekDays = ref<any>([]);
const weekSchedule = ref<any>([]);
const users = ref<any>([]);
const currentScheduleDetail = ref<any>([]);
const userToAddSchedule = ref<any>("");
const scheduleToDelete = ref<any>("");
const dateTitle = ref<any>("");
const times = ref<any>([
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
]);

const calcHeight = (duration: any) => {
  return (duration / 30) * 60;
};

const getResvervedTime = (schedule: any, startTime: any) => {
  for (let timeReserve of schedule.timeReserves) {
    if (timeReserve.startTime === startTime) {
      return timeReserve;
    }
  }
};

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

const getPreviousWeekData = async () => {
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
    const filter = {
      role: "worker"
    };
    const query = {
      filter: filter
    }
    const response = await axios.post(`${baseURL}/users/list` , query );
    if (response.status === 200) {
      users.value = response.data.rows;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchScheduleByDay = async () => {
  try {
    const query = {
      dateTitle: dateTitle.value,
    };
    const response = await axios.post(`${baseURL}/schedules/getByDate`, query);
    if (response.status === 200) {
      currentScheduleDetail.value = response.data;
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

const goToDetail = (id: any) => {
  router.push(`/timeRequests/${id}`);
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
