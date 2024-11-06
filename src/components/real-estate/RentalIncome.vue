<template lang="pug">
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Does or will {{ currentRealEstate.AddressLineText || 'this property' }} generate any rental income?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <v-col class="itemContainer pb-0" sm="12">
          <div>Just click next if you do not or will not receive any rental income. </div>
        </v-col>
        <Input prefix="$" inputTitle="Monthly Rental Income" :value="getFormattedValue(currentRealEstate.PropertyRentalIncomeGrossAmount)" @input="(e) => setRentalIncome(+e.replace(/,/g, ''))" @keypress="(e) => isOnlyNum(e, true)"></Input>
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
    setRentalIncome(value) {
      const realEstate = {
        ...this.currentRealEstate,
        PropertyRentalIncomeGrossAmount: value
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
  },
};
</script>
