<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Within the past 7 years, have you completed a pre-foreclosure sale or
        short sale, whereby the property was sold to a third party and the
        Lender agreed to accept less than the outstanding mortgage balance due?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_7.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="PriorPropertyShortSaleCompletedIndicatorValue"
          @input="setDeclarationsProp"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  components: {
    AgreeToggle
  },
  props: {
    declarations: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setDeclarationsProp(bool) {
      const Declarations = {
        ...this.declarations,
        PriorPropertyShortSaleCompletedIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    PriorPropertyShortSaleCompletedIndicatorValue() {
      if (this.declarations.PriorPropertyShortSaleCompletedIndicator === null) {
        return null;
      } else {
        return this.declarations.PriorPropertyShortSaleCompletedIndicator;
      }
    }
  }
};
</script>
