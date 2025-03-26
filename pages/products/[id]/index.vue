<template>
  <div class="d-flex w-100 justify-center">
    <div style="width: 100%; max-width: 1440px">
      <div class="d-flex justify-center">
        <v-tabs v-model="tab">
          <v-tab value="one">Дэлгэрэнгүй</v-tab>
          <v-tab value="two">Бүтээгдэхүүний төрлүүд</v-tab>
        </v-tabs>
      </div>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-container class="mt-4">
            <div class="d-flex justify-end">
              <v-btn @click="updateProduct()" color="#101828">
                <v-icon class="pr-2">mdi-content-save</v-icon>Хадгалах</v-btn
              >
            </div>
            <v-row class="mb-4">
              <v-col cols="3" md="2">
                <v-card
                  color="#101828"
                  variant="outlined"
                  style="aspect-ratio: 1; cursor: pointer"
                  class="d-flex justify-center align-center"
                  @click="showImage = true"
                >
                  <v-icon style="font-size: 36px">mdi-plus</v-icon>
                </v-card></v-col
              >

              <v-col
                v-for="image in product.images"
                cols="3"
                md="2"
                color="#101828"
                variant="outlined"
                style="aspect-ratio: 1; cursor: pointer"
              >
                <img
                  :src="image"
                  alt=""
                  style="width: 100%; height: 100%; border-radius: 16px"
                />
              </v-col>
            </v-row>

            <v-row
              ><v-col cols="4"
                ><v-text-field
                  v-model="product.name"
                  variant="outlined"
                  hide-details
                  label="Нэр"
                >
                </v-text-field
              ></v-col>
              <v-col cols="4"
                ><v-text-field
                  v-model="product.price"
                  variant="outlined"
                  hide-details
                  label="Үнэ"
                >
                </v-text-field
              ></v-col>
              <v-col cols="4"
                ><v-text-field
                  v-model="product.sellPrice"
                  variant="outlined"
                  hide-details
                  label="Хямдасан үнэ"
                >
                </v-text-field
              ></v-col>
              <v-col cols="4"
                ><v-select
                  variant="outlined"
                  hide-details
                  v-model="product.category"
                  label="Ангилал"
                  :items="categories"
                  item-value="_id"
                  item-title="title"
                >
                </v-select
              ></v-col>

              <v-col cols="4"
                ><v-text-field
                  v-model="product.stock"
                  variant="outlined"
                  hide-details
                  label="Нөөц"
                  type="Number"
                >
                </v-text-field
              ></v-col>

              <v-col cols="12"
                ><v-textarea
                  style="height: 400px !important"
                  v-model="product.description"
                  variant="outlined"
                  hide-details
                  label="Тайлбар"
                >
                </v-textarea
              ></v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>

        <v-tabs-window-item value="two">
          <v-container class="mt-4">
            <div class="d-flex justify-end">
              <v-btn @click="showAddVariant = true" color="#101828">
                <v-icon class="ml-2">mdi-content-save</v-icon>Нэмэх</v-btn
              >
            </div>

            <v-data-table
              style="font-size: 18px"
              class="mt-4"
              hide-default-footer
              :items="product.variants"
              :headers="headers"
            >
              <template v-slot:item.seq="{ index }: any">
                <div class="pa-4">
                  {{ index + 1 }}
                </div>
              </template>

              <template v-slot:item.name="{ item }: any">
                <div class="pa-4">
                  {{ item.title }}
                </div>
              </template>

              <template v-slot:item.price="{ item }: any">
                <div class="pa-4">
                  {{ item.price.toLocaleString() }}
                </div>
              </template>

              <template v-slot:item.sellPrice="{ item }: any">
                <div class="pa-4">
                  {{ item?.sellPrice?.toLocaleString() }}
                </div>
              </template>

              <template v-slot:item.isActive="{ item }: any">
                <div class="pa-2">
                  <v-icon color="green" v-if="item.isActive"
                    >mdi-check-decagram-outline</v-icon
                  >
                  <v-icon color="red" v-else>mdi-close-circle-outline</v-icon>
                </div>
              </template>

              <template v-slot:item.action="{ item }: any">
                <div class="pa-2">
                  <v-btn
                    @click="
                      showUpdateDialog = true;
                      varianToUpdate = item;
                    "
                    variant="text"
                    size="small"
                    icon="mdi-pencil"
                  ></v-btn>
                </div>
              </template>
            </v-data-table>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <v-navigation-drawer
      v-model="showUpdateDialog"
      location="right"
      temporary
      width="500"
    >
      <v-container class="px-8">
        <div class="text-center my-6" style="font-size: 20px; font-weight: 550">
          Төрөл Засах
        </div>

        <v-text-field
          v-model="varianToUpdate.title"
          variant="outlined"
          label="Нэр"
        ></v-text-field>
        <v-text-field
          v-model="varianToUpdate.price"
          variant="outlined"
          label="Үнэ"
        ></v-text-field>
        <v-text-field
          v-model="varianToUpdate.sellPrice"
          variant="outlined"
          label="Зарагдах үнэ"
        ></v-text-field>

        <div class="mx-2 mb-2" style="font-weight: 550">Зураг</div>
        <v-row>
          <v-col cols="4" style="aspect-ratio: 1">
            <v-btn
              variant="outlined"
              color="#101828"
              style="height: 100%; width: 100%"
              @click="showVariantUpdateImage = true"
            >  <v-icon>mdi-plus</v-icon> </v-btn
          ></v-col>
          <v-col cols="4" v-for="img in varianToUpdate.images">
            <img
              :src="img"
              alt=""
              style="aspect-ratio: 1; width: 100%; object-fit: cover"
            />
          </v-col>
        </v-row>  
        <div class="d-flex mt-2 align-center"> <span class="mr-2">Идэвхтэй эсэх: </span>    <v-switch hide-details v-model="varianToUpdate.isActive" color="#101828"></v-switch></div>
    
        <div class="mt-4 d-flex justify-end">
          <v-btn color="#101828" @click="updateProductVariant()">Засах</v-btn>
        </div>
      </v-container>
    </v-navigation-drawer>

    <v-navigation-drawer
      location="right"
      temporary
      width="500"
      v-model="showAddVariant"
    >
      <v-container class="px-8">
        <div class="text-center my-6" style="font-size: 20px; font-weight: 550">
          Төрөл нэмэх
        </div>

        <v-text-field
          v-model="variantToCreate.title"
          variant="outlined"
          label="Нэр"
        ></v-text-field>
        <v-text-field
          v-model="variantToCreate.price"
          variant="outlined"
          label="Үнэ"
        ></v-text-field>
        <v-text-field
          v-model="variantToCreate.sellPrice"
          variant="outlined"
          label="Зарагдах үнэ"
        ></v-text-field>

        <div class="mx-2 mb-2" style="font-weight: 550">Зураг</div>
        <v-row>
          <v-col cols="4" style="aspect-ratio: 1">
            <v-btn
              variant="outlined"
              color="#101828"
              style="height: 100%; width: 100%"
              @click="showAddImageVariant = true"
            >  <v-icon>mdi-plus</v-icon> </v-btn
          ></v-col>
          <v-col cols="4" v-for="img in variantToCreate.images">
            <img
              :src="img"
              alt=""
              style="aspect-ratio: 1; width: 100%; object-fit: cover"
            />
          </v-col>
        </v-row>

        <div class="mt-4 d-flex justify-end">
          <v-btn color="primary" @click="createProductVariant()">Нэмэх</v-btn>
        </div>
      </v-container>
    </v-navigation-drawer>

    <v-dialog width="500" v-model="showImage">
      <v-card class="pa-6" rounded="lg">
        <div class="text-center mb-4" style="font-weight: 550">
          Нэмэх зурагны URL-аа оруулна уу
        </div>
        <v-text-field variant="outlined" v-model="addingImage"></v-text-field>
        <div class="d-flex justify-end">
          <v-btn
            @click="
              product.images.push(addingImage);
              showImage = false;
              addingImage = '';
            "
            color="#101828"
            >Нэмэх</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="showAddImageVariant">
      <v-card class="pa-6" rounded="lg">
        <div class="text-center mb-4" style="font-weight: 550">
          Нэмэх зурагны URL-аа оруулна уу
        </div>
        <v-text-field
          variant="outlined"
          v-model="variantAddingImage"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn
            @click="
              variantToCreate.images.push(variantAddingImage);
              showAddImageVariant = false;
              variantAddingImage = '';
            "
            color="#101828"
            >Нэмэх</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="showVariantUpdateImage">
      <v-card class="pa-6" rounded="lg">
        <div class="text-center mb-4" style="font-weight: 550">
          Нэмэх зурагны URL-аа оруулна уу
        </div>
        <v-text-field
          variant="outlined"
          v-model="variantAddingImage"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn
            @click="
              varianToUpdate.images.push(variantAddingImage);
              showVariantUpdateImage = false;
              variantAddingImage = '';
            "
            color="#101828"
            >Нэмэх</v-btn
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

const tab = ref<any>(null);
const product = ref<any>({});
const categories = ref<any>([]);
const count = ref<any>(0);

const showImage = ref<any>(false);
const addingImage = ref<any>("");
const variantAddingImage = ref<any>("");
const showAddVariant = ref<any>(false);
const showUpdateDialog = ref<any>(false);
const showAddImageVariant = ref<any>(false);
const showVariantUpdateImage = ref<any>(false);

const variantToCreate = ref({
  title: "",
  price: "",
  sellPrice: "",
  images: [] as any,
});
const varianToUpdate = ref<any>({
  title: "",
  price: "",
  sellPrice: "",
  images: [] as any,
});

const headers = ref<any>([
  {
    title: "№",
    value: "seq",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Нэр",
    value: "name",
    align: "center",
    width: "50px",
    sortable: false,
  },
  // {
  //   title: "Зураг",
  //   value: "image",
  //   align: "center",
  //   width: "50px",
  //   sortable: false,
  // },
  {
    title: "Үнэ",
    value: "price",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Хямдарсан үнэ",
    value: "sellPrice",
    align: "center",
    width: "50px",
    sortable: false,
  },
  {
    title: "Идэвхтэй эсэх",
    value: "isActive",
    align: "center",
    width: "50px",
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

const fetchProduct = async () => {
  try {
    const query = {
      _id: route.params.id,
    };
    const response = await axios.post(`${baseURL}/products/getById`, query);
    if (response.status === 200) {
      product.value = response.data;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateProduct = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/products/update`,
      product.value
    );
    if (response.status === 200) {
      await fetchProduct();
      toast.success("Амжилттай шинэчлэгдлээ");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.post(`${baseURL}/productCategories/all`, {});
    if (response.status === 200) {
      categories.value = response.data.rows;
      count.value = response.data.count;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const createProductVariant = async () => {
  try {
    const query = {
      productId: product.value._id,
      variant: variantToCreate.value,
    };
    const response = await axios.post(
      `${baseURL}/productVariants/create`,
      query
    );
    if (response.status === 201) {
      variantToCreate.value = {
        title: "",
        sellPrice: "",
        price: "",
        images: [],
      };
      showAddVariant.value = false;
      toast.success("Амжилттай");
      await fetchProduct();
    } else {
      console.log("jiiji");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateProductVariant = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/productVariants/update`,
      varianToUpdate.value
    );
    if (response.status === 200) {
      showUpdateDialog.value = false;
      varianToUpdate.value = {};
      toast.success("Амжилттай");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await fetchProduct();
  await fetchCategories();
});
</script>

<style scoped></style>
