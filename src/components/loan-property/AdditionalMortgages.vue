<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will you be taking out any additional mortgages on the property you are
        purchasing?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/loan-property/additionalmortgages.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="additionalMortgagesValue"
          @input="setAdditionalMortgage"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  methods: {
    ...mapActions(["setProperty"]),
    setAdditionalMortgage(bool) {
      this.setProperty({ ...this.Property, HasAdditionalMortgages: bool });
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty"
    }),
    additionalMortgagesValue() {
      if (
        this.Property.HasAdditionalMortgages === null ||
        this.Property.HasAdditionalMortgages === undefined
      ) {
        return null;
      } else {
        return this.Property.HasAdditionalMortgages;
      }
    },
    isNextDisabled() {
      return this.additionalMortgagesValue === null;
    }
  },
  components: {
    AgreeToggle
  }
};
</script>
