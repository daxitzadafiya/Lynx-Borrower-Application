<template lang="pug">
    .credit-data
        .credit-data__report-link.primary-text(v-if="creditOrderId" @click="getFullReportAndRedirect") See Full Report
        v-card.main__card(width='100%' light)
            DecisionScore
            AccountDetails
            NegativeItems
            v-divider
            .main__button
                router-link(to="/credit/liabilities-review")
                    .main_desktop-button
                        Button(value="Next" customClass="primary-button")
                    .main_mobile-button
                        Button(value="Next" customClass="primary-button" width="200px")
</template>

<script>
import DecisionScore from "./scoreAndAccounts/DecisionScore";
import AccountDetails from "./scoreAndAccounts/AccountDetails";
import NegativeItems from "./scoreAndAccounts/NegativeItems";
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
    AccountDetails,
    NegativeItems,
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
