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
        style="width: 100%; height: 100%; background-color: #101828; border-top-right-radius: 24px; border-bottom-right-radius: 24px;"
      >
        <div>
          <div>
            <img
              style="width: 48px; height: 48px"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIIWju1ABYrb5DTkZ8mbDcaAekrgKnjmf0CA&s"
              alt="logo"
            />
          </div>

          <div v-if="isMounted" style="color: white">
            <div v-for="category in filteredMenuItems" :key="category.title">
              <div class="mt-4 mb-2 ml-2">
                {{ category.title }}
              </div>
              <div
                v-for="item in category.items"
                :key="item.title"
                class="pa-2 sideBarItem"
                style="cursor: pointer; border-radius: 4px"
                @click="goToLink(item.link)"
              >
                <v-icon>{{ item.logo }}</v-icon>
                <span class="ml-2">{{ item.title }}</span>
              </div>
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

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();
const router = useRouter();

const isMounted = ref(false);
const userRole = ref<string | null>(null);

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
        allowedRoles: ["admin", "manager", "seller" , "worker"],
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
        allowedRoles: ["admin", "seller", "manager"],
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
  }
]);

const filteredMenuItems = computed(() => {
  if (!userRole.value) return [];

  return sideBarMenuItems.value
    .map(category => {
      const filteredItems = category.items.filter(item =>
        item.allowedRoles.includes(userRole.value!)
      );
      return {
        ...category,
        items: filteredItems,
      };
    })
    .filter(category => category.items.length > 0);
});

const goToLink = (link: string) => {
  router.push(link);
};
</script>

<style scoped>
.sideBarItem:hover {
  background-color: #0d0d0d;
}
</style>
