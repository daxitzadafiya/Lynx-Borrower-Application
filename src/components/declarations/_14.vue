<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Are you a party to a lawsuit in which you potentially have any personal
        financial liability?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_7.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="PartyToLawsuitIndicatorValue"
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
        PartyToLawsuitIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    PartyToLawsuitIndicatorValue() {
      if (this.declarations.PartyToLawsuitIndicator === null) {
        return null;
      } else {
        return this.declarations.PartyToLawsuitIndicator;
      }
    }
  }
};
</script>
