<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please indicate your current and intended usage of
        {{ currentRealEstate.AddressLineText || "this property" }}?
      </div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <v-row class="form-container">
        <UsageTypesData></UsageTypesData>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import UsageTypesData from "./NewUsageTypesData";
import { mapGetters } from "vuex";

export default {
  components: {
    UsageTypesData
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    },
    isNextDisabled() {
      return (
        (this.currentRealEstate.PropertyDispositionStatusType === "Retain" &&
          !this.currentRealEstate.PropertyIntendedUsageType) ||
        !this.currentRealEstate.PropertyCurrentUsageType
      );
    }
  }
};
</script>
