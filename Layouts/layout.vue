<template>
  <v-layout>
    <v-navigation-drawer
      width="300"
      permanent
      disable-route-watcher
      floating
      open-delay="false"
      style="height: 100vh"
      persistent
    >
      <v-card
        class="pa-4 d-flex flex-column justify-space-between"
        style="
          width: 100%;
          height: 100%;
          background-color: #101828;
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
        "
      >
        <div>
          <div>
            <img
              style="width: 48px; height: 48px"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIIWju1ABYrb5DTkZ8mbDcaAekrgKnjmf0CA&s"
              alt=""
            />
          </div>

          <div style="color: white">
            <div v-for="category in sideBarMenuItems">
              <div class="mt-4 mb-2 ml-2">
                {{ category.title }}
              </div>
              <div
                v-for="item in category.items"
                class="pa-2 sideBarItem"
                style="cursor: pointer; border-radius: 4px"
              >
                <div @click="goToLink(item.link)">
                  <v-icon>{{ item.logo }}</v-icon>
                  <span class="ml-2">{{ item.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="color: white; cursor: pointer" class="pa-2 sideBarItem">
          <v-icon>mdi-cog</v-icon>
          <span class="ml-2"> Settings</span>
        </div>
      </v-card>
    </v-navigation-drawer>
    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import axios from "axios";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const sideBarMenuItems = ref<any>([
  {
    title: "Dashboard",
    items: [
      {
        title: "Хяналтын самбар",
        logo: "mdi-view-dashboard",
        link: "/dashboard",
      },
    ],
  },
  {
    title: "Users",
    items: [
      {
        title: "Ажилчид",
        logo: "mdi-account-box",
        link: "/team",
      },
      {
        title: "Ажилчидын түвшин",
        logo: "mdi-medal-outline",
        link: "/workerLevels",
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        title: "Үйлчилгээнүүд",
        logo: "mdi-hair-dryer-outline",
        link: "/services",
      },
      {
        title: "Үйлчилгээний ангилалууд",
        logo: "mdi-shape-plus",
        link: "/serviceCategories",
      },
      {
        title: "Цаг захиалга",
        logo: "mdi-timetable",
        link: "/timeRequests",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        title: "Захиалгууд",
        logo: "mdi-cart",
        link: "/orders",
      },
      {
        title: "Бүтээгдэхүүнүүд",
        logo: "mdi-lipstick",
        link: "/products",
      },
      {
        title: "Бүтээгдэхүүний ангилалууд",
        logo: "mdi-shape-plus",
        link: "/productCategories",
      },
      {
        title: "Ангилалын төрлүүд",
        logo: "mdi-clipboard-list",
        link: "/productOptions",
      },
    ],
  },
]);

const goToLink = (link: any) => {
  router.push(link);
};
</script>

<style scoped>
.sideBarItem:hover {
  background-color: #0d0d0d;
}
</style>
