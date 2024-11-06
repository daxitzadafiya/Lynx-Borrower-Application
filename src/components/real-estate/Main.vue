<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Do you own any {{ realEstate.length ? "additional" : "" }} Real Estate?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/real-estate/start.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle :value="ownAnyRealEstate" @input="setIndex"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="ownAnyRealEstate === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  mixins: [loanPatch],
  components: {
    AgreeToggle
  },
  data() {
    return {
      ownAnyRealEstate: null
    };
  },
  methods: {
    ...mapActions(["setRealEstateEditingIndex","setRealEstateOwned"]),
    setIndex(val) {
      this.ownAnyRealEstate = val;
      if (val) {
        this.setRealEstateEditingIndex(this.realEstate.length);
        this.setRealEstateOwned(val);
      }
    }
  },
  computed: {
    ...mapGetters({
      realEstate: "getRealEstate"
    })
  }
};
</script>
