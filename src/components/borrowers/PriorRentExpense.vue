<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">How much do you pay in rent {{ currentResidence.AddressLineText ? `at ${currentResidence.AddressLineText}` : 'per month' }}?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input inputTitle="Monthly Rent, $" :value="getFormattedValue(currentResidence.MonthlyRentAmount)" @input="(e) => updateResidenceProp({type, value: +e.replace(/,/g, ''), prop: 'MonthlyRentAmount'})" @keypress="(e) => isOnlyNum(e, true)"></Input>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import { mapGetters, mapActions } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      type: "Prior",
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp"]),
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence",
      borrowers: "getBorrowers",
    }),
    currentResidence() {
      return this.getSpecificResidence("Prior");
    }
  },
};
</script>

