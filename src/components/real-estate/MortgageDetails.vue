<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Mortgage details for
        {{ currentRealEstate.AddressLineText || "this property" }}
      </div>
    </div>
    <MortgageDetailsData></MortgageDetailsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import MortgageDetailsData from "./MortgageDetailsData";
import { mapGetters } from "vuex";

export default {
  components: {
    MortgageDetailsData
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    },
    loans() {
      return this.currentRealEstate.MortgageLoans || [];
    }
  }
};
</script>
