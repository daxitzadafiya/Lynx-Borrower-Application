<template>
  <div class="content-container">
    <DecisionScore></DecisionScore>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import DecisionScore from "./scoreAndAccounts/DecisionScore";
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
  }
};
</script>