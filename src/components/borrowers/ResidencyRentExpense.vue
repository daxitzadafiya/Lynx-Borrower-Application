<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        How much do you pay in rent
        {{
          currentResidence.AddressLineText
            ? `at ${currentResidence.AddressLineText}`
            : "per month"
        }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input
          :isRequired="true"
          inputTitle="Monthly Rent $"
          :value="getFormattedValue(currentResidence.MonthlyRentAmount)"
          @input="
            e =>
              updateResidenceProp({
                type,
                value: +e.replace(/,/g, ''),
                prop: 'MonthlyRentAmount'
              })
          "
          @keypress="e => isOnlyNum(e, true)"
        />
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="isNextButtonDisabled"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
import loanPatch from "@/mixins/loanPatch";

export default {
  mixins: [onlyNum, currencyFormat, loanPatch],
  data() {
    return {
      type: "Current"
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp"])
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence",
      borrowers: "getBorrowers"
    }),
    currentResidence() {
      return this.getSpecificResidence("Current");
    },
    isNextButtonDisabled() {
      return (
        this.currentResidence.MonthlyRentAmount == null ||
        this.currentResidence.MonthlyRentAmount.length === 0
      );
    }
  },
  created() {
  },
};
</script>
