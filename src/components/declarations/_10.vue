<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will this property be subject to a lien that could take priority over
        the first mortgage lien, such as a clean energy lien paid through your
        property taxes (e.g., the Property Assessed Clean Energy Program)?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_7.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="PropertyProposedCleanEnergyLienIndicatorValue"
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
        PropertyProposedCleanEnergyLienIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    PropertyProposedCleanEnergyLienIndicatorValue() {
      if (this.declarations.PropertyProposedCleanEnergyLienIndicator === null) {
        return null;
      } else {
        return this.declarations.PropertyProposedCleanEnergyLienIndicator;
      }
    }
  }
};
</script>
