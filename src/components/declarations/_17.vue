<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Have you had a property foreclosed upon in the last 7 years?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_7.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="PriorPropertyForeclosureCompletedIndicatorValue"
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
        PriorPropertyForeclosureCompletedIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    PriorPropertyForeclosureCompletedIndicatorValue() {
      if (
        this.declarations.PriorPropertyForeclosureCompletedIndicator === null
      ) {
        return null;
      } else {
        return this.declarations.PriorPropertyForeclosureCompletedIndicator;
      }
    }
  }
};
</script>
