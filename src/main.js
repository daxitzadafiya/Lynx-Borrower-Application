import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueTheMask from "vue-the-mask";
import config from "./configs";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  installComponents: true
});
Vue.use(VueTheMask);
Vue.config.productionTip = false;

import InlineSvg from "vue-inline-svg";
Vue.component("inline-svg", InlineSvg);
import NavigationButtons from "@/components/controls/NavigationButtons";
import Input from "@/components/form/Input";
import Button from "@/components/buttons/Button";
Vue.component("NavigationButtons", NavigationButtons);
Vue.component("Input", Input);
Vue.component("Button", Button);

axios.interceptors.request.use(
  config => {
    let pathName = new URL(config.url).pathname;
    if (
      pathName !== "/LynxWebApi/document/uploadDocuments" &&
      pathName !== "/document/uploadDocuments" &&
      pathName !== "/LynxWebApi/document/getDocuments" &&
      pathName !== "/document/getDocuments" &&
      pathName !== "/LynxWebApi/document/uploadDocumentsUsingToken" &&
      pathName !== "/document/uploadDocumentsUsingToken" &&
      pathName !== "/LynxWebApi/financial-institution/search" &&
      pathName !== "/financial-institution/search"
    ) {
      store.dispatch("increaseRequestCounter");
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => {
    store.dispatch("decreaseRequestCounter");
    return response;
  },
  error => {
    store.dispatch("decreaseRequestCounter");
    const loginNames = ["login-form", "recover-password", "reset-password"];
    if (error.response && error.response.status === 401) {
      if (router.app._route.name !== "loan-tech-info") {
        const redirect =
          router.app._route.path !== "/" && router.app._route.path !== ""
            ? router.app._route.path
            : null;
        if (router.app._route.name !== "login-form") {
          store.dispatch("logOut");
        }
        if (loginNames.indexOf(router.app._route.name) === -1) {
          router.push({ path: "/login", query: { redirect } });
        }
        // return router.app._route.name !== 'login-form' ? router.push({path: '/login', query: { redirect }}) : Promise.reject(401);
        return Promise.resolve({ status: 401 });
      }
    }
    return Promise.reject(error);
  }
);

Vue.directive("click-out", {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // if it did, call method provided in attribute value
        if (binding.expression) vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  }
});

axios
  .get(config.hostedBrandingDataUrl)
  .then(res => {
    if (res.data.Data) {
      const { BorrowerApplication } = res.data.Data;
      store.dispatch("setHostedBranding", BorrowerApplication);
    }
    Vue.prototype.$lynxSlogan = "Your Trusted Software Partner";
  })
  .catch(e => console.log(e))
  .finally(() => {
    Vue.prototype.$brandingBaseUrl =
      store.getters.brandingPath || config.brandingUrl;
    new Vue({
      router,
      store,
      vuetify,
      axios,
      render: h => h(App)
    }).$mount("#app");
  });
