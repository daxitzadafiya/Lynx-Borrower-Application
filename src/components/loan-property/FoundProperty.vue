<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">Have you found a property yet?</div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/loan-property/found-property.svg')"
      />
      <AgreeToggle
        class="my-5"
        :value="foundPropertyValue"
        @input="setFoundProperty"
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
    setFoundProperty(val) {
      this.setCurrentLoan({ ...this.currentLoan, FoundProperty: val });
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    }),
    canGoNextPage() {
      return (
        this.currentLoan === null ||
        this.currentLoan.FoundProperty === undefined ||
        this.currentLoan.FoundProperty === null
      );
    },
    foundPropertyValue() {
      if (this.currentLoan.FoundProperty === null) {
        return null;
      } else {
        return this.currentLoan.FoundProperty;
      }
    }
  }
};
</script>
