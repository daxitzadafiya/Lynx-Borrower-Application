<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Do you have sales contract on
        {{ propertyAddress }}?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/loan-property/sales-contract.svg')"
      />
      <AgreeToggle
        class="my-5"
        :value="salesContractValue"
        @input="setFoundPropertyAndRedirect"
      ></AgreeToggle>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="canGoNextPage"></NavigationButtons>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  components: {
    AgreeToggle
  },
  methods: {
    ...mapActions(["setCurrentLoan"]),
    setFoundPropertyAndRedirect(val) {
      this.setCurrentLoan({ ...this.currentLoan, SalesContract: val });
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    }),
    canGoNextPage() {
      return (
        this.currentLoan == null ||
        this.currentLoan.SalesContract === undefined ||
        this.currentLoan.SalesContract === null
      );
    },
    salesContractValue() {
      if (this.currentLoan.SalesContract === null) {
        return null;
      } else {
        return this.currentLoan.SalesContract;
      }
    },
    propertyAddress() {
      return this.currentLoan && this.currentLoan.Property
        ? this.currentLoan.Property.AddressLineText
        : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.titleImage {
  max-height: 30vh;
}
</style>
