<template lang="pug">
    .credit-data
        v-card.main__card(width='100%' light)
            DecisionScore
            v-divider
            NavigationButtons
            
</template>

<script>
import DecisionScore from "./scoreAndAccounts/DecisionScore";
import Button from "@/components/buttons/Button";
import lynxApi from "@/api/lynxApi.js";
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["getCreditOrders"]),
    async getFullReportAndRedirect() {
      try {
        const result = await lynxApi.getFullCreditReport(this.creditOrderId);
        const newBlob = new Blob([result], { type: "application/pdf" });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement("a");
        link.href = data;
        link.target = "_blank";
        // link.download="file.pdf";
        link.click();
        setTimeout(function() {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
        }, 100);
      } catch (err) {
        console.log(err);
      }
    }
  },
  watch: {
    borrower: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal.Id !== oldVal.Id) {
          this.getCreditOrders();
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower",
      creditOrderId: "getCreditOrderId"
    })
  },
  components: {
    DecisionScore,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/general.scss";

.credit-data {
  @include main-data;
  .v-divider {
    margin-top: 25px;
  }
  &__report-link {
    font-size: 18px;
    font-weight: 500;
    text-decoration: underline;
    margin-bottom: 15px;
    margin-left: 35px;
    cursor: pointer;
  }
}
</style>
