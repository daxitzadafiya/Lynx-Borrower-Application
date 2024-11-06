<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter your Income from Other Sources</div>
    </div>
    <OtherIncomeDetails></OtherIncomeDetails>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
            
</template>

<script>
import OtherIncomeDetails from "./NewOtherIncomeDetails";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      statusType: "Current",
      classificationType: "Primary"
    };
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment"
    }),
    currentEmployment() {
      if (this.Employment.length) {
        const employment = this.Employment.find(
          item =>
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
        );
        return employment || {};
      }
      return {};
    }
  },
  components: {
    OtherIncomeDetails,
  },
  beforeMount() {
    const { status, classification } = this.$route.meta;
    this.statusType = this.status || status;
    this.classificationType = this.classification || classification;
  }
};
</script>
