<template>
  <v-container max-width="1440">
    <v-row>
      <v-col
        v-for="timeReserve in schedule.timeReserves"
        rounded="lg"
        cols="12"
        lg="3"
        md="6"
      >
        <v-card rounded="xl" class="pa-4">
          <div class="text-center" style="font-weight: 550; font-size: 16px">
            {{ timeReserve.timeReserveNumber }}
          </div>

          <article class="d-flex justify-space-between">
            <div class="mt-2">
            <span class="mr-1">{{
              moment(timeReserve.startDate).format("HH:mm")
            }}</span>
            -
            <span class="ml-1">{{
              moment(timeReserve.endDate).format("HH:mm")
            }}</span>
          </div>


          <v-chip size="small">
            {{ timeReserve.state }}
          </v-chip>
          </article>



          <article class="d-flex mt-2 align-center">
            <img
              class="mr-2"
              :src="timeReserve.customer.avatar"
              style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
              "
              alt=""
            />

            <div>
              <div>
                <span class="mr-3">{{ timeReserve.customer.lastName }}</span>
                <span>{{ timeReserve.customer.firstName }}</span>
              </div>

              <p>{{ timeReserve.customer.phone }}</p>
            </div>
          </article>

          <v-expansion-panels elevation="0" class="mt-2">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-row> Үйлчилгээнүүд </v-row>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <article
                  class="d-flex align-center"
                  v-for="service in timeReserve.services"
                >
                  <img
                    class="mr-4"
                    style="
                      width: 60px;
                      height: 60px;
                      border-radius: 50%;
                      object-fit: cover;
                    "
                    :src="service.service.image"
                    alt=""
                  />

                  <div style="font-size: 14px" class="mr-2">
                    <p>{{ service?.service?.title }}</p>
                    <p>{{ service?.variant?.title }}</p>
                  </div>

                  <div>
                    <p>
                      {{
                        service.variant
                          ? service.variant.duration
                          : service.service.duration
                      }} мин
                    </p>
                  </div>
                </article>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
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
import moment from "moment";

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const schedule = ref<any>([]);

const fetchSchedule = async () => {
  try {
    const now = moment();
    const formattedDate = now.format("YYYY-MM-DD");
    const query = {
      dateTitle: formattedDate,
    };
    const response = await axios.post(
      `${baseURL}/timeReserves/getbyWorker`,
      query
    );
    if (response.status === 200) {
      schedule.value = response.data;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchSchedule();
});
</script>

<style scoped>
:deep() .v-expansion-panel-title__icon {
  color: black !important;
}
</style>
