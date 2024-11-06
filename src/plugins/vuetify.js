import Vue from "vue";
import Vuetify from "vuetify/lib";
import { Ripple } from "vuetify/lib/directives";
import "@/assets/styles/settings.scss";

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
});

export default new Vuetify({
  theme: {
    light: true,
    themes: {
      light: {
        primary: "#023DA7",
        secondary: "#F28B00",
        tertiary: "#fab702",
        accent: "#82B1FF",
        error: "#f55a4e",
        info: "#00d3ee",
        success: "#5cb860",
        warning: "#ffa21a",
        nautical: "#E0E7F4",
        "primary-light-1": "#1b50b0",
        "primary-dark-1": "#033780",
        "blue-lighten-4": "#EBEFF4",
        "main-back": "#F5F8FB",
        "process-green": "#34C082",
        "text-black": "#424248",
        "light-gray": "#F4F5F7",
        "menu-gray": "#738CB2",
        "icon-gray": "#A8AFBB"
      }
    }
  }
});
