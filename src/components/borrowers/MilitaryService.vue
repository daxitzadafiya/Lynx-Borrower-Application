<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Did you (or your deceased spouse) ever serve, or are you currently
        serving, in the United States Armed Forces?
      </div>
    </div>
    <div class="d-flex justify-center inner-content-container">
      <div class="military-icon" v-for="(icon, index) in icons" :key="index">
        <img class="borrowers__icon" :src="icon" />
      </div>
    </div>
    <v-form class="form-container pt-0">
      <div class="v-row itemContainer">
        <AgreeToggle
          :value="borrower.SelfDeclaredMilitaryServiceIndicator"
          @input="setMilitaryService"
        ></AgreeToggle>
      </div>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="isNextDisabled"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";
import loanPatch from "@/mixins/loanPatch";

export default {
  mixins: [loanPatch],
  components: {
    AgreeToggle
  },
  data() {
    return {
      icons: [
        require("@/assets/images/military-logos/army.png"),
        require("@/assets/images/military-logos/space-force.png"),
        require("@/assets/images/military-logos/marine-corps.png"),
        require("@/assets/images/military-logos/navy.png"),
        require("@/assets/images/military-logos/air-force.png"),
        require("@/assets/images/military-logos/coast-guard.png")
      ]
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setMilitaryService(value) {
      this.updateBorrower({
        prop: "SelfDeclaredMilitaryServiceIndicator",
        value: value
      });
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    isNextDisabled() {
      return (
        this.borrower.SelfDeclaredMilitaryServiceIndicator === undefined ||
        this.borrower.SelfDeclaredMilitaryServiceIndicator === null
      );
    }
  },
  created() {
    if (this.borrower.SelfDeclaredMilitaryServiceIndicator === null) {
      this.updateBorrower({
        prop: "SelfDeclaredMilitaryServiceIndicator",
        value: null
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.military-icon {
  width: calc(100% / 6);
  max-width: 100px;
  height: auto;
  padding: 0px 5px;

  img {
    width: calc(100% - 10px);
  }

  img {
    height: auto;
  }

  @media (max-width: $tablet-width) {
    padding: 0px 4px;

    img {
      width: calc(100% - 8px);
    }
  }

  @media (max-width: $tablet-width) {
    padding: 0px 2px;

    img {
      width: calc(100% - 4px);
    }
  }
}
</style>
