<template>
  <div>
    <v-container>
      <div style="font-size: 20px" class="d-flex justify-end">
        Нийт захиалгын тоо: <span class="ml-2">{{ count }}</span>
      </div>
      <v-data-table
        style="font-size: 16px"
        class="mr-4 mt-8"
        :items="orders"
        :headers="headers"
        hide-default-footer
      >
        <template v-slot:item.seq="{ index }: any">
          <div class="pa-4">
            {{ (page - 1) * per_page + index + 1 }}
          </div>
        </template>

        <template v-slot:item.customer="{ item }: any">
          <div class="pa-4">
            <p>{{ item.customer.lastName }}</p>
            <p>{{ item.customer.firstName }}</p>
          </div>
        </template>

        <template v-slot:item.phone="{ item }: any">
          <div class="pa-4">
            {{ item.customer.phone }}
          </div>
        </template>

        <template v-slot:item.products="{ item }: any">
          <div class="pa-4" style="font-size: 16px">
            <div v-for="orderItem in item.items" class="d-flex my-2">
              <img
                style="
                  width: 60px;
                  height: 60px;
                  object-fit: cover;
                  border-radius: 8px;
                "
                :src="
                  orderItem.variant
                    ? orderItem.variant.images[0]
                    : orderItem.product.images[0]
                "
                alt=""
              />
              <div class="ml-4">
                <div>{{ orderItem.price.toLocaleString() }}₮</div>
                <div>Тоо ширхэг: {{ orderItem.qty }}</div>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.totalPrice="{ item }: any">
          <div class="pa-4">{{ item.totalAmount.toLocaleString() }}₮</div>
        </template>

        <template v-slot:item.orderType="{ item }: any">
          <div class="pa-4">
            <v-chip
              style="color: white"
              variant="flat"
              :color="formatTypeColor(item.orderType)"
              >{{ formatType(item.orderType) }}</v-chip
            >
          </div>
        </template>

        <template v-slot:item.state="{ item }: any">
          <div class="pa-4">
            <v-chip
              style="color: white"
              variant="flat"
              :color="formatStateColor(item.state)"
              >{{ formatState(item.state) }}</v-chip
            >
          </div>
        </template>

        <template v-slot:item.createdAt="{ item }: any">
          <div style="font-size: 16px" class="pa-4">
            <div>{{ moment(item.createdAt).format("YYYY-MM-DD") }}</div>
            <div>{{ moment(item.createdAt).format("HH:mm:SS") }}</div>
          </div>
        </template>

        <template v-slot:item.action="{ item }: any">
          <div class="pa-4">
            <v-btn icon="mdi-pencil" variant="text" @click="router.push(`/orders/${item._id}`)"></v-btn>
          </div>
        </template>
      </v-data-table>

      <v-pagination
        class="my-4"
        :length="length"
        v-model="page"
        @update:modelValue="fetchOrders()"
      ></v-pagination>
    </v-container>
  </div>
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

const orders = ref<any>([]);
const count = ref<any>(0);

const page = ref<any>(1);
const per_page = ref<any>(10);
const length = ref<any>();

const headers = ref<any>([
  {
    title: "№",
    value: "seq",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Хэрэглэгч",
    value: "customer",
    align: "center",
    width: "200px",
    sortable: false,
  },
  {
    title: "Утасны дугаар",
    value: "phone",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Бүтээгдэхүүн",
    value: "products",
    align: "center",
    sortable: false,
  },
  {
    title: "Үнийн дүн",
    value: "totalPrice",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Төлөв",
    value: "state",
    align: "center",
    sortable: false,
  },
  {
    title: "Төрөл",
    value: "orderType",
    align: "center",
    sortable: false,
  },
  {
    title: "Үүссэн огноо",
    value: "createdAt",
    align: "center",
    width: "200px",
    sortable: false,
  },
  {
    title: "Үйлдэл",
    value: "action",
    align: "center",
    width: "50px",
    sortable: false,
  },
]);

const fetchOrders = async () => {
  try {
    let query = {
      page: page.value,
      per_page: per_page.value,
    };
    const response = await axios.post(`${baseURL}/orders/list`, query);
    if (response.status === 200) {
      orders.value = response.data.rows;
      count.value = response.data.count;
      length.value = Math.ceil(count.value / per_page.value);
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const formatState = (state: any) => {
  switch (state) {
    case "pending":
      return "Хүлээгдэж буй";
    case "in_process":
      return "Хийгдэж буй";
    case "arrived":
      return "Ирсэн";
    case "complete":
      return "Дууссан";
  }
};

const formatStateColor = (state: any) => {
  switch (state) {
    case "pending":
      return "#a4c404";
    case "in_process":
      return "#18b1ed";
    case "arrived":
      return "#088a3c";
    case "complete":
      return "#1cd44d";
  }
};

const formatType = (type: any) => {
  switch (type) {
    case "arrival":
      return "Ирж авах";
    case "delivery":
      return "Хүргэлт";
  }
};

const formatTypeColor = (type: any) => {
  switch (type) {
    case "arrival":
      return "#10c92f";
    case "delivery":
      return "#10c92f";
  }
};

onMounted(async () => {
  await fetchOrders();
});
</script>

<style scoped></style>
