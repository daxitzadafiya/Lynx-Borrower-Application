<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Have you or will you be applying for a mortgage loan on another property
        (not the property securing this loan) on or before closing this
        transaction that is not disclosed on this loan application?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_7.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="UndisclosedMortgageApplicationIndicatorValue"
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
        UndisclosedMortgageApplicationIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    UndisclosedMortgageApplicationIndicatorValue() {
      if (this.declarations.UndisclosedMortgageApplicationIndicator === null) {
        return null;
      } else {
        return this.declarations.UndisclosedMortgageApplicationIndicator;
      }
    }
  }
};
</script>
