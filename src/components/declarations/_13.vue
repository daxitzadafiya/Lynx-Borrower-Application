<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Are you currently delinquent or in default on a federal debt?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_7.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="PresentlyDelinquentIndicatorValue"
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
        PresentlyDelinquentIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    PresentlyDelinquentIndicatorValue() {
      if (this.declarations.PresentlyDelinquentIndicator === null) {
        return null;
      } else {
        return this.declarations.PresentlyDelinquentIndicator;
      }
    }
  }
};
</script>
