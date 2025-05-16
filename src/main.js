import "./assets/main.css";

import { createApp } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, md } from "vuetify/iconsets/md";


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "md",
    aliases,
    sets: {
      md,
    },
  },
});

createApp(App).use(vuetify).use(router).mount("#app");
