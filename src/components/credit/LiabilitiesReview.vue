<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please take a moment to review the liabilites we've obtained from your credit report </div>
    </div>
    <div class="inner-content-container">
      <Table></Table>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import Table from "@/components/credit/liabilities/NewTable";
import { mapGetters } from "vuex";

export default {
  components: {
    Table,
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    nextRoute() {
      if (this.borrower.PublicRecords == null || this.borrower.PublicRecords.length === 0) {
        return "credit/other-liabilities"
      } else {
        return "credit/derogatory-items"
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.infoText{
  color: $gray2;
}
</style>
