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

              <v-col cols="4"
                ><v-select
                  v-model="product.optionTypes"
                  variant="outlined"
                  hide-details
                  label="Нөөц"
                  :items="optionTypes"
                  item-value="_id"
                  item-title="name"
                  multiple
                >
                </v-select
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
                  <span v-for="option in item.options"> {{ option.name + " " }}</span>
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
        <div style="font-weight: 550; font-size: 20px" class="text-center mb-4">
          Төрлийн сонголтууд
        </div>

        <div v-for="(option, index) in varianToUpdate.options">
          <v-text-field
            v-if="option.name"
            variant="outlined"
            v-model="option.name"
            :label="option.optionType.name"
          >
          </v-text-field>
        </div>
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
        <div style="font-weight: 550; font-size: 20px" class="text-center mb-4">
          Төрлийн сонголтууд
        </div>

        <div v-for="(option, index) in product.optionTypes">
          <v-text-field
            v-if="variantToCreate.options[index]?.name"
            variant="outlined"
            :label="option.name"
            v-model="variantToCreate.options[index].name"
          >
          </v-text-field>
        </div>
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

const optionTypes = ref<any>([]);
const showImage = ref<any>(false);
const addingImage = ref<any>("");
const showAddVariant = ref<any>(false);
const showUpdateDialog = ref<any>(false);
const variantToCreate = ref({
  title: "",
  price: 0,
  sellPrice: 0,
  options: [] as { name: String; _id: String }[],
});
const varianToUpdate = ref<any>({});

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
        sellPrice: 0,
        price: 0,
        options: [],
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

const updateProductVariant = async() => {
  try {
    const response = await axios.post(`${baseURL}/productVariants/update` , varianToUpdate.value);
    if(response.status === 200) {
      showUpdateDialog.value = false;
      varianToUpdate.value = {};
      toast.success("Амжилттай");
    } else {  
      console.log("jiijii");
    }
  } catch(err) {
    console.log(err);
  }
}

const fetchOptionTypes = async () => {
  try {
    const response = await axios.post(`${baseURL}/productOptions/all`, {});
    if (response.status === 200) {
      optionTypes.value = response.data.rows;
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
  await fetchOptionTypes();

  variantToCreate.value.options = optionTypes.value.map((option: any) => ({
    optionType: option._id,
    name: " ",
  }));
});
</script>

<style scoped></style>
