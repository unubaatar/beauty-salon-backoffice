<template>
  <v-container max-width="1440">
    <v-row>
      <v-col cols="4"
        ><v-card rounded="lg" class="pa-4"
          ><div class="text-center" style="font-weight: 550; font-size: 20px">
            Дэлгэрэнгүй
          </div>
          <v-spacer class="mt-4"></v-spacer>
          <v-row>
            <v-col cols="6">Захиалгын дугаар: </v-col>
            <v-col cols="6" style="font-weight: 550">{{
              order.orderNumber
            }}</v-col>

            <v-col cols="6">Төлөв:</v-col>
            <v-col cols="6"
              ><v-select
                v-model="order.state"
                :items="states"
                item-value="value"
                item-title="title"
                hide-details
                density="compact"
                variant="outlined"
              ></v-select
            ></v-col>

            <v-col cols="6">Захиалгын төрөл:</v-col>
            <v-col cols="6" style="font-weight: 550">{{
              order.orderType
            }}</v-col>

            <v-col cols="6">Нийт үнийн дүн:</v-col>
            <v-col cols="6" style="font-weight: 550"
              >{{ order.totalAmount?.toLocaleString() }} ₮</v-col
            >

            <v-col cols="6">Үүссэн огноо:</v-col>
            <v-col cols="6" style="font-weight: 550">{{
              moment(order.createdAt).format("YYYY-MM-DD HH:mm:SS")
            }}</v-col>
          </v-row>
          <div class="mt-8 d-flex justify-end">
            <v-btn color="#101828" elevation="0" @click="updateOrder()"
              >Хадгалах</v-btn
            >
          </div>
        </v-card></v-col
      >
      <v-col cols="4"
        ><v-card rounded="lg" class="pa-4">
          <div class="text-center" style="font-weight: 550; font-size: 20px">
            Үйлчлүүлэгч
          </div>

          <div class="py-8 d-flex justify-space-between">
            <img
              :src="order?.customer?.avatar"
              style="height: 84px; width: 84px; object-fit: cover"
              alt=""
            />
            <article>
              <div>
                <v-icon>mdi-account</v-icon
                ><span class="ml-2">{{ order?.customer?.firstName }}</span>
                <span class="ml-2">{{ order?.customer?.lastName }}</span>
              </div>
              <div class="mt-2">
                <v-icon>mdi-phone</v-icon
                ><span class="ml-2">{{ order?.customer?.phone }}</span>
              </div>
              <div class="mt-2">
                <v-icon>mdi-mail</v-icon
                ><span class="ml-2">{{ order?.customer?.email }}</span>
              </div>
            </article>
          </div>

          <div v-if="order.orderType === 'delivery'" class="text-center" style="font-weight: 550; font-size: 20px">
            Хаяг
          </div>

          <v-row class="mt-4" v-if="order.orderType === 'delivery'">
            <v-col cols="6">Аймаг/Хот</v-col>
            <v-col cols="6" style="font-weight: 550">{{
              order?.address?.province
            }}</v-col>

            <v-col cols="6">Сум/Дүүрэг</v-col>
            <v-col cols="6" style="font-weight: 550"
              >{{ order?.address?.district }}
            </v-col>

            <v-col cols="6">Баг/Хороо</v-col>
            <v-col cols="6" style="font-weight: 550">{{
              order?.address?.section
            }}</v-col>

            <v-col cols="6">Байр гудамж тоот</v-col>
            <v-col cols="6" style="font-weight: 550">{{
              order?.address?.address
            }}</v-col>
          </v-row>
        </v-card></v-col
      >
      <v-col cols="4"
        ><v-card rounded="lg" class="pa-4"
          ><div class="text-center" style="font-weight: 550; font-size: 20px">
            Бүтээгдэхүүн
          </div>
          <br />

          <div v-for="product in order.items">
            <v-row class="d-flex align-center">
              <v-col cols="3">
                <img
                  style="
                    width: 100%;
                    object-fit: cover;
                    aspect-ratio: 1;
                    border-radius: 16px;
                  "
                  :src="
                    product.variant != null
                      ? product?.variant?.images[0]
                      : product?.product?.images[0]
                  "
                  alt=""
                />
              </v-col>

              <v-col cols="6">
                <div class="mb-1" style="font-size: 14px">
                  {{ product.product.name }}
                </div>
                <div style="font-size: 12px; color: grey">
                  {{ product?.variant?.title }}
                </div>
                <div>Тоо ширхэг : {{ product.qty }}</div>
              </v-col>

              <v-col cols="3">
                <div class="mb-1" style="font-size: 18px; font-weight: 550">
                  {{ product.price.toLocaleString() }}₮
                </div>
              </v-col>
            </v-row>
          </div>

          <div
            class="d-flex justify-end mt-4"
            style="font-size: 20px; font-weight: 550"
          >
            <span class="mr-2">Нийт: </span>
            <span>{{ order?.totalAmount?.toLocaleString() }}₮</span>
          </div>
         </v-card
      ></v-col>
    </v-row>
  </v-container>
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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import moment from "moment";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const orderId = route.params._id;
const order = ref<any>({});

const states = ref<any>([
  {
    title: "Хүлээгдэж буй",
    value: "pending",
  },
  {
    title: "Хийгдэж буй",
    value: "in_process",
  },
  {
    title: "Ирсэн",
    value: "arrived",
  },
  {
    title: "Дууссан",
    value: "complete",
  },
]);

const fetchOrder = async () => {
  try {
    const query = {
      _id: orderId,
    };

    const response = await axios.post(`${baseURL}/orders/getById`, query);
    if (response.status === 200) {
      order.value = response.data;
    } else {
      console.log("jiijiii");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateOrder = async () => {
  try {
    const response = await axios.post(`${baseURL}/orders/update`, order.value);
    if (response.status === 200) {
      toast.success("Амжилттай");
      await fetchOrder();
    } else {
      console.log("jiijiii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchOrder();
});
</script>

<style scoped></style>
