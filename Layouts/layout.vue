<template>
  <v-layout>
    <v-navigation-drawer
      app
      :width="drawerWidth"
      :mini-variant="isMini"
      :permanent="true"
      :temporary="isMobile"
      floating
      class="bg-dark"
    >
      <v-card
        class="pa-4 d-flex flex-column"
        style="
          height: 100%;
          background-color: #101828;
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
          overflow-y: scroll;
        "
      >
        <div>
          <div class="d-flex align-center justify-space-between mb-4">
            <img
              v-if="!isMini"
              style="width: 40px; height: 40px"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIIWju1ABYrb5DTkZ8mbDcaAekrgKnjmf0CA&s"
              alt="logo"
            />
            <v-btn
              icon
              variant="text"
              color="white"
              size="small"
              
              @click="isCollapsed = !isCollapsed"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </div>
          </div>

          <v-expansion-panels
            v-if="isMounted  && !isMini"
            variant="accordion"
            multiple
            class="bg-dark"
            style="color: white"
          >
            <v-expansion-panel
              v-for="category in filteredMenuItems"
              :key="category.title"
              elevation="0"
              class="bg-dark"
            >
              <v-expansion-panel-title
                class="text-subtitle-2 font-weight-medium"
              >
                <template v-if="showText">
                  <div style="color: white; font-size: 16px">
                    {{ category.title }}
                  </div>
                </template>
                <template v-else>
                  <v-icon style="color: white">mdi-folder</v-icon>
                </template>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="pl-0">
                <div
                  v-for="item in category.items"
                  :key="item.title"
                  class="pa-2 sideBarItem d-flex align-center"
                  style="cursor: pointer; border-radius: 4px"
                  :style="checkRoute(item.link) ? 'background-color: #0d0d0d ': ''"
                  @click="goToLink(item.link)"
                >
                  <v-icon style="color: white">{{ item.logo }}</v-icon>
                  <span class="ml-3" v-if="showText" style="color: white">{{
                    item.title
                  }}</span>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>


          <div v-if="isMounted && isMini" style="color: white">
            <div v-for="category in filteredMenuItems" :key="category.title">
              <div
                v-if="showText"
                class="mt-4 mb-2 ml-2 text-subtitle-2 font-weight-medium"
              >
                {{ category.title }}
              </div>
              <div
                v-for="item in category.items"
                :key="item.title"
                class="pa-2 sideBarItem d-flex align-center"
                style="cursor: pointer; border-radius: 4px"
                @click="goToLink(item.link)"
              >
                <v-icon>{{ item.logo }}</v-icon>
                <span class="ml-3" v-if="showText">{{ item.title }}</span>
              </div>
            </div>
        </div>
      </v-card>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { mdAndUp, smAndDown } = useDisplay();
const router = useRouter();

const isMounted = ref(false);
const userRole = ref<string | null>(null);
const isCollapsed = ref(false);

const isMobile = computed(() => smAndDown.value);
const showText = computed(() => !isMobile.value && !isCollapsed.value);

const drawerWidth = computed(() =>
  isMobile.value || isCollapsed.value ? 72 : 280
);
const isMini = computed(() => isMobile.value || isCollapsed.value);

onMounted(() => {
  userRole.value = localStorage.getItem("role");
  isMounted.value = true;
});

const sideBarMenuItems = ref([
  {
    title: "Dashboard",
    items: [
      {
        title: "Хяналтын самбар",
        logo: "mdi-view-dashboard",
        link: "/dashboard",
        allowedRoles: ["admin", "manager", "seller", "worker"],
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
        allowedRoles: ["admin"],
      },
      {
        title: "Ажилчидын түвшин",
        logo: "mdi-medal-outline",
        link: "/workerLevels",
        allowedRoles: ["admin"],
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
        allowedRoles: ["admin", "manager"],
      },
      {
        title: "Үйлчилгээний ангилалууд",
        logo: "mdi-shape-plus",
        link: "/serviceCategories",
        allowedRoles: ["admin", "manager"],
      },
      {
        title: "Цаг товлолт",
        logo: "mdi-timetable",
        link: "/timeRequests",
        allowedRoles: ["admin", "manager"],
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
        allowedRoles: ["admin", "seller"],
      },
      {
        title: "Бүтээгдэхүүнүүд",
        logo: "mdi-lipstick",
        link: "/products",
        allowedRoles: ["admin", "seller"],
      },
      {
        title: "Бүтээгдэхүүний ангилалууд",
        logo: "mdi-shape-plus",
        link: "/productCategories",
        allowedRoles: ["admin", "seller"],
      },
    ],
  },
  {
    title: "Report",
    items: [
      {
        title: "Ажилтан",
        logo: "mdi-chart-box",
        link: "/timeReserveReport",
        allowedRoles: ["admin", "manager"],
      },
      {
        title: "Үйлчилгээ",
        logo: "mdi-chart-box",
        link: "/serviceReport",
        allowedRoles: ["admin", "manager"],
      },
      {
        title: "Бүтээгдэхүүн",
        logo: "mdi-chart-box",
        link: "/productReport",
        allowedRoles: ["admin", "seller"],
      },
    ],
  },
  {
    title: "Schedule",
    items: [
      {
        title: "Цагийн хуваарь",
        logo: "mdi-calendar",
        link: "/workerSchedule",
        allowedRoles: ["worker"],
      },
    ],
  },
]);

const filteredMenuItems = computed(() => {
  if (!userRole.value) return [];
  return sideBarMenuItems.value
    .map((category) => {
      const filteredItems = category.items.filter((item) =>
        item.allowedRoles.includes(userRole.value!)
      );
      return {
        ...category,
        items: filteredItems,
      };
    })
    .filter((category) => category.items.length > 0);
});

const checkRoute = (link: any) => {
  const currentPath = router.currentRoute.value.fullPath;
  return currentPath === link;
}

const goToLink = (link: string) => {
  router.push(link);
};
</script>

<style scoped>
.sideBarItem:hover {
  background-color: #0d0d0d;
}
.bg-dark {
  background-color: #101828 !important;
}

:deep() .v-expansion-panel-text__wrapper {  
  padding: 0px !important;
  padding-left: 16px !important;
}

:deep() .v-expansion-panel-title__icon {
  color: white;
}
</style>
