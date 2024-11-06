<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the amount of the deposit(s)</div>
    </div>
    <DepositDetailsData
      @validation-status="updateValidationStatus"
    ></DepositDetailsData>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="depositDetailsValidation"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import DepositDetailsData from "./DepositDetailsData";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  components: {
    DepositDetailsData
  },
  data() {
    return {
      isFormValid: false
    };
  },
  methods: {
    updateValidationStatus(isValid) {
      this.isFormValid = isValid;
    }
  },
  computed: {
    depositDetailsValidation() {
      return this.isFormValid;
    }
  }
};
</script>
