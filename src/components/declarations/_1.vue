<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">
        Will you occupy the property as your primary residence?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_1.svg')"
      />
      <v-form class="text-block my-5">
        <AgreeToggle
          :options="options"
          :value="IntentToOccupyTypeValue"
          @input="setDeclarationsProp"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
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
  data() {
    return {
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" }
      ]
    };
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
    setDeclarationsProp(val) {
      let Declarations = { ...this.declarations, IntentToOccupyType: val };
      if (val === "No") {
        delete Declarations.HomeownerPastThreeYearsType;
        delete Declarations.PriorPropertyUsageType;
        delete Declarations.PriorPropertyTitleType;
      }
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    nextRoute() {
      return this.declarations.IntentToOccupyType === "Yes"
        ? "declarations/_2"
        : "declarations/_5";
    },
    IntentToOccupyTypeValue() {
      if (this.declarations.IntentToOccupyType === null) {
        return null;
      } else {
        return this.declarations.IntentToOccupyType;
      }
    }
  }
};
</script>
