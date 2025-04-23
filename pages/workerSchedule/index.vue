<template>
  <v-container width="1440">
    
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

const schedules = ref<any>([]);

</script>

<style scoped></style>
