<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text" v-if="currentRealEstate.PropertyDispositionStatusType === 'Sold'"> What is the Sales Price for {{ currentRealEstate.AddressLineText || 'this property' }}?</div>
      <div class="header-text" v-else> What is the value of {{ currentRealEstate.AddressLineText || 'this property' }}?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input prefix="$" inputTitle="Property Value" :value="getFormattedValue(currentRealEstate.PropertyEstimatedValueAmount)" @input="(e) => setRealEstateValue(+e.replace(/,/g, ''))" @keypress="(e) => isOnlyNum(e, true)"></Input>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import currencyFormat from "@/mixins/currencyFormat.js";
import onlyNum from "@/mixins/onlyNum.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  methods: {
    ...mapActions(["setRealEstate"]),
    setRealEstateValue(value) {
      const realEstate = {
        ...this.currentRealEstate,
        PropertyEstimatedValueAmount: value
      };
      let realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = realEstate;
      this.setRealEstate(realEstates);
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    }
  }
};
</script>
