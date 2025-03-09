<template>
  <div class="d-flex justify-center w-100">
    <div style="max-width: 1080px; width: 100%">
      <v-tabs
        v-model="tab"
        style="display: flex; justify-content: center"
        class="mb-6"
      >
        <v-tab value="service"> Үйлчилгээ </v-tab>
        <v-tab value="variants">Төрөл</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="service">
          <div
            class="d-flex justify-center mb-4"
            style="font-size: 24px; font-weight: 450"
          >
            Үйлчилгээ засах
          </div>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="service.title"
                label="Үйлчилгээний нэр"
                variant="outlined"
                hide-details
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="service.price"
                label="Үнэ"
                variant="outlined"
                type="number"
                hide-details
              ></v-text-field
            ></v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="service.category"
                label="Ангилал"
                variant="outlined"
                :items="serviceCategories"
                item-value="_id"
                item-title="title"
                hide-details
              >
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="service.description"
                hide-details
                label="Тайлбар"
                variant="outlined"
              >
              </v-textarea>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="service.workers"
                multiple
                :items="workers"
                item-value="_id"
                item-title="firstName"
                hide-details
                label="Ажилтан"
                variant="outlined"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="service.duration"
                label="Хугацаа (минут)"
                variant="outlined"
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="service.image"
                label="Зурагны URL"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

            <v-btn style="position: fixed; bottom: 5%; right: 5%;" color="#101828" @click="updateService() "
              ><v-icon>mdi-content-save</v-icon>
              <span class="ml-2">Хадгалах</span>
            </v-btn>
        </v-tabs-window-item>

        <v-tabs-window-item value="variants">
          <v-container fluid>
            <v-data-table
              :items="variants"
              :headers="headers"
              hide-default-footer
            >
              <template v-slot:item.seq="{ index }: any">
                <div class="pa-2">
                  {{ index + 1 }}
                </div>
              </template>

              <!-- <template v-slot:item.image="{ item }: any">
                <div class="pa-2">
                  <img
                    :src="item.image"
                    style="width: 48x; height: 48px"
                    alt=""
                  />
                </div>
              </template> -->

              <template v-slot:item.duration="{ item }: any">
                <div class="pa-2">
                  <span class="mr-1">{{ item.duration }}</span
                  >минут
                </div>
              </template>

              <template v-slot:item.isActive="{ item }: any">
                <div class="pa-2">
                  <v-icon  v-if="item.isActive" color="green">mdi-check-circle-outline</v-icon>
                  <v-icon  v-else color="red">mdi-close-circle-outline</v-icon>
                </div>
              </template>

              <template v-slot:item.action="{ item }: any">
                <div class="pa-2">
                  <v-btn
                    @click="
                      showUpdateVariant = true;
                      variantToUpdate = item;
                    "
                    icon="mdi-pencil"
                    size="small"
                    color="#101828"
                    variant="text"
                  ></v-btn>
                </div>
              </template>
            </v-data-table>

            <div class="mt-4 d-flex justify-end">
              <v-btn
                @click="showAddVariant = true"
                elevation="0"
                color="#101828"
                ><v-icon>mdi-plus</v-icon>Нэмэх</v-btn
              >
            </div>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <v-navigation-drawer
      temporary
      location="right"
      width="600"
      v-model="showAddVariant"
    >
      <v-container fluid class="d-flex flex-column justify-space-between h-100">
        <div>
          <div
            class="text-center py-4"
            style="font-size: 24px; font-weight: 550"
          >
            Төрөл нэмэх
          </div>
          <v-container class="pa-4 px-8">
            <v-text-field
              variant="outlined"
              label="Нэр"
              v-model="variantToAdd.title"
            ></v-text-field>
            <v-textarea
              variant="outlined"
              label="Тайлбар"
              v-model="variantToAdd.body"
            ></v-textarea>
            <v-text-field
              variant="outlined"
              label="Үнэ"
              type="Number"
              v-model="variantToAdd.price"
            ></v-text-field>

            <v-text-field
              variant="outlined"
              type="Number"
              label="Хугацаа ( Минут )"
              v-model="variantToAdd.duration"
            ></v-text-field>

            <!-- <v-text-field
              variant="outlined"
              label="Зураг"
              v-model="variantToAdd.image"
            ></v-text-field> -->
          </v-container>
        </div>

        <div class="d-flex justify-end pa-8 pb-8">
          <v-btn @click="addVariant()" color="#101828"
            ><v-icon>mdi-content-save</v-icon>Хадгалах</v-btn
          >
        </div>
      </v-container>
    </v-navigation-drawer>

    <v-navigation-drawer
      temporary
      location="right"
      width="600"
      v-model="showUpdateVariant"
    >
      <v-container fluid class="d-flex flex-column justify-space-between h-100">
        <div>
          <div
            class="text-center py-4"
            style="font-size: 24px; font-weight: 550"
          >
            Төрөл шинэчлэх
          </div>
          <v-container class="pa-4 px-8">
            <v-text-field
              variant="outlined"
              label="Нэр"
              v-model="variantToUpdate.title"
            ></v-text-field>
            <v-textarea
              variant="outlined"
              label="Тайлбар"
              v-model="variantToUpdate.body"
            ></v-textarea>
            <v-text-field
              variant="outlined"
              label="Үнэ"
              type="Number"
              v-model="variantToUpdate.price"
            ></v-text-field>

            <v-text-field
              variant="outlined"
              type="Number"
              label="Хугацаа ( Минут )"
              v-model="variantToUpdate.duration"
            ></v-text-field>
            <div class="d-flex align-center">
              <div style="font-weight: 500; font-size: 18px;" class="mr-3">Идэвхтэй эсэх:</div>
              <v-switch
              color="#101828"
                hide-details
                v-model="variantToUpdate.isActive"
              ></v-switch>
            </div>
          </v-container>
        </div>

        <div class="d-flex justify-end pa-8 pb-8">
          <v-btn @click="updateVariant()" color="#101828"
            ><v-icon>mdi-content-save</v-icon>Хадгалах</v-btn
          >
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
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
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const service = ref<any>({});
const serviceCategories = ref<any>([]);
const variants = ref<any>([]);
const count = ref<any>(null);
const workers = ref<any>([]);
const tab = ref<any>(null);
const showAddVariant = ref<any>(false);
const showUpdateVariant = ref<any>(false);
const variantToAdd = ref<any>({});
const variantToUpdate = ref<any>({});

const headers = ref<any>([
  {
    title: "№",
    value: "seq",
    align: "center",
    sortable: false,
  },
  {
    title: "Нэр",
    value: "title",
    align: "center",
    sortable: false,
  },
  {
    title: "Тайлбар",
    value: "body",
    align: "center",
    sortable: false,
  },
  {
    title: "Хугацаа",
    value: "duration",
    align: "center",
    sortable: false,
  },
  // {
  //   title: "Зураг",
  //   value: "image",
  //   align: "center",
  //   sortable: false,
  // },
  {
    title: "Идэвхтэй эсэх",
    value: "isActive",
    align: "center",
    sortable: false,
  },
  {
    title: "Үйлдэл",
    value: "action",
    align: "center",
    sortable: false,
  },
]);

const fetchCategories = async () => {
  try {
    const response = await axios.post(`${baseURL}/serviceCategories/list`, {});
    if (response.status === 200) {
      serviceCategories.value = response.data.rows;
    } else {
      console.log("jiijiii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchWorkers = async () => {
  try {
    const response = await axios.post(`${baseURL}/users/getWorkers`);
    if (response.status === 200) {
      workers.value = response.data;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchService = async () => {
  try {
    const query = {
      _id: route.params._id,
    };
    const response = await axios.post(`${baseURL}/services/getById`, query);
    if (response.status === 200) {
      service.value = response.data;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateService = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/services/update`,
      service.value
    );
    if (response.status === 200) {
      await fetchService();
      toast.success("Амжилттай");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchVariants = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/serviceVariants/getByService`,
      {
        service: service.value._id,
        filter: {},
      }
    );
    if (response.status === 200) {
      variants.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const addVariant = async () => {
  try {
    variantToAdd.value.service = route.params._id;
    const response = await axios.post(
      `${baseURL}/serviceVariants/create`,
      variantToAdd.value
    );
    if (response.status === 201) {
      await fetchVariants();
      showAddVariant.value = false;
      variantToAdd.value = {};
      toast.success("Амжилттай нэмэгдлээ");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateVariant = async () => {
  try {
    variantToAdd.value.service = route.params._id;
    const response = await axios.post(
      `${baseURL}/serviceVariants/update`,
      variantToUpdate.value
    );
    if (response.status === 200) {
      await fetchVariants();
      showUpdateVariant.value = false;
      variantToUpdate.value = {};
      toast.success("Амжилттай хадгалагдлаа");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};




onMounted(async () => {
  await fetchService();
  await fetchWorkers();
  await fetchCategories();
  await fetchVariants();
});
</script>

<style scoped>
:deep() .v-slide-group__content {
  display: flex;
  justify-content: center;
}
</style>
