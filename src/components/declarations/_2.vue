<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">
        Have you had an ownership in another property in the last 3 years?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_2.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :options="options"
          :value="HomeownerPastThreeYearsTypeValue"
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
  props: {
    declarations: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" }
      ]
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setDeclarationsProp(value) {
      const Declarations = {
        ...this.declarations,
        HomeownerPastThreeYearsType: value
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    nextRoute() {
      return this.declarations.HomeownerPastThreeYearsType === "Yes"
        ? "declarations/_3"
        : "declarations/_5";
    },
    HomeownerPastThreeYearsTypeValue() {
      if (this.declarations.HomeownerPastThreeYearsType === null) {
        return null;
      } else {
        return this.declarations.HomeownerPastThreeYearsType;
      }
    }
  }
};
</script>
