import "@/App.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import VueSelect from "vue-select";
import App from "@/App.vue";

const app = createApp(App);
app.use(createPinia());
app.component("v-select", VueSelect);
app.mount("#app");
