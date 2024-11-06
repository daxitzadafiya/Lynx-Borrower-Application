<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the gross monthly income for each compensation type you provided</div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <CompensationDetailsData></CompensationDetailsData>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>

</template>

<script>
import CompensationDetailsData from "./NewCompensationDetailsData";
import { mapGetters } from "vuex";
import moment from "moment";

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
    CompensationDetailsData,
  },
  beforeMount() {
    const { status, classification } = this.$route.meta;
    this.statusType = this.status || status;
    this.classificationType = this.classification || classification;
  }
};
</script>