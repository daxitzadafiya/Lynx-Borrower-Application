<template lang="pug">
    v-app(
        id="lynx-app" 
        :style="{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}"
        :class="isHostedMode ? 'hosted-app-back' : ''"
        )
        v-layout(style="height: 100%; width: 100%;")
            router-view
            Spinner(v-show="requestCounter")
            Alerts(v-if="isAlert")
</template>

<script>
import Spinner from "./components/Spinner";
import Alerts from "./components/Alerts";
import { mapGetters, mapActions } from "vuex";
import { loanStreamingService } from "@/services/LoanStreamingService";

export default {
  name: "App",

  data: () => ({}),
  methods: {
    ...mapActions(["getLoanById", "getUsStates"])
  },
  computed: {
    ...mapGetters({
      requestCounter: "getRequestCounter",
      isAlert: "getIsAlert",
      isHostedMode: "getIsHostedMode",
      hostedLoanId: "getHostedLoanId"
    })
  },
  components: {
    Spinner,
    Alerts
  },
  mounted() {
      this.getUsStates();
    if (this.isHostedMode) {
      this.getLoanById(this.hostedLoanId);
    }
  },
  beforeDestroy() {
    loanStreamingService.unsubscribe();
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/reset.scss";
@import "@/assets/styles/base.scss";

// #app > .v-application--wrap {
//     height: 100%;
//     min-height: 100%;
// }

#lynx-app > .v-application--wrap {
  height: 100%;
  min-height: 100%;
}

.hosted-app-back {
  background: #f6f9fc !important;
}
</style>
