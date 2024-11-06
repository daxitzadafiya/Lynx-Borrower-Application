<template lang="pug">
  .content-container
    .content-header-container
      .header-text Please enter the Cash or Market Value for these Assets
    OtherAssetDetailsData
    .navigation-container
            NavigationButtons(:RequestedNextPath="nextRoute")
            
</template>

<script>
import OtherAssetDetailsData from "./NewOtherAssetDetailsData";
import Button from "@/components/buttons/Button";
import scrollToTop from "@/mixins/scrollToTop.js";
import { mapGetters } from "vuex";

export default {
  mixins: [scrollToTop],
  computed: {
    ...mapGetters({
      LoanPurposeType: "getLoanPurposeType"
    }),
    nextRoute() {
      return this.LoanPurposeType === "Purchase"
        ? "/accountsandassets/required-deposit"
        : "/accountsandassets/loan-gifts";
    }
  },
  components: {
    OtherAssetDetailsData,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.accounts-data {
  @include main-data;
}

@media (max-width: 768px) {
  .main__title {
    max-width: 660px;
  }
}
</style>
