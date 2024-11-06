<template>
  <div class="content-container ">
    <div class="content-header-container">
      <div class="header-text">
        Do you expect to receive any rental income on the property you are
        purchasing?
      </div>
    </div>
    <div class="image-container">
      <div class="titleSecondaryText primary-text font-weight-bold">
        This is only necessary if the subject property is a 2 to 4 Unit Primary
        Residence or an Investment Property.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/loan-property/rental-income.svg')"
      />
      <v-form class="text-block my-5">
        <AgreeToggle
          :value="rentalIncomeExpectation"
          @input="setRentalIncomeExpectation"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="nextClicked"
        :ConditionsMet="rentalIncomeExpectation === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  mixins: [loanPatch],
  components: {
    AgreeToggle
  },
  data() {
    return {
      rentalIncomeExpectation: null
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay"]),
    nextClicked() {
      if (this.rentalIncomeExpectation) {
        this.toggleIsOnlay({ isOnlay: true, onlayComponent: "rentalIncome" });
      } else {
        // this.saveAndAdvance(true,"/loanandproperty/review");
      }
    },
    setRentalIncomeExpectation(value) {
      this.rentalIncomeExpectation = value;
    }
  }
};
</script>
