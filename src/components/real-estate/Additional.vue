<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/real-estate/start.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="additionalRealEstate"
          @input="setAdditionalRealEstate"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="setIndexAndRedirect"
        :ConditionsMet="additionalRealEstate === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  mixins: [loanPatch],
  data() {
    return {
      additionalRealEstate: null
    };
  },
  methods: {
    ...mapActions(["setRealEstateEditingIndex"]),
    setIndexAndRedirect() {
      if (this.additionalRealEstate) {
        this.setRealEstateEditingIndex(this.realEstate.length);
        this.saveAndAdvance(true,"/accountsandassets/address");
      } else {
        this.saveAndAdvance(true,"/accountsandassets/review");
      }
    },
    setAdditionalRealEstate(bool) {
      this.additionalRealEstate = bool;
    }
  },
  computed: {
    ...mapGetters({
      realEstate: "getRealEstate",
      loanPurpose: "getLoanPurposeType"
    }),
    title() {
      if (this.loanPurpose == "Purchase") {
        if (this.realEstate.length == 0) {
          return "Do you currently own any Real Estate?";
        } else {
          return "Do you own any additional Real Estate?";
        }
      } else {
        return "Do you own any additional Real Estate?";
      }
    }
  },
  components: {
    AgreeToggle
  }
};
</script>
