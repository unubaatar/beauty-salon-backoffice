<template>
  <div>
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
          
          <v-list style="height: 320px;">
            <v-list-item class="my-2" v-for="schedule of day.schedules">
              <div class="d-flex align-center">
                <img
                  style="height: 48px; width: 48px; border-radius: 50%"
                  :src="schedule.worker.avatar"
                  alt=""
                />
                <div style="font-size: 14px" class="ml-4">
                  <!-- <span style="color: gray;" class="ml-4 mr-2">{{ schedule.worker.lastName }}</span> -->
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
            </v-list-item>
          </v-list>

          <div class="d-flex justify-center">
            <v-btn color="#101828" rounded="pill" elevation="0"> <v-icon class="ml-1">mdi-plus</v-icon> Ажилтан нэмэх</v-btn>
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
import moment, { weekdays } from "moment";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const weekDays = ref<any>([]);
const weekSchedule = ref<any>([]);

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
});
</script>
