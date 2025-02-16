<template>
    <div>{{ timeReserveId }}</div>
</template>


<script setup lang="ts">
definePageMeta({
    middleware: "auth",
    layout: "layout"
});

import axios from "axios";
import moment, { duration, weekdays } from "moment";
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
const timeReserveId = route.params._id;

onMounted(() => {

})

</script>

<style scoped>

</style>