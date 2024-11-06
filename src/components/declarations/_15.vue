<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Have you conveyed title to any property in lieu of foreclosure in the
        past 7 years?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_7.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="PriorPropertyDeedInLieuConveyedIndicatorValue"
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
        PriorPropertyDeedInLieuConveyedIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    PriorPropertyDeedInLieuConveyedIndicatorValue() {
      if (this.declarations.PriorPropertyDeedInLieuConveyedIndicator === null) {
        return null;
      } else {
        return this.declarations.PriorPropertyDeedInLieuConveyedIndicator;
      }
    }
  }
};
</script>
