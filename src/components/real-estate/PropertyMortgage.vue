<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Is there a mortgage on
        {{ titleValue }}
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/real-estate/start.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle :value="hasMortgage" @input="setHasMortgage"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="hasMortgage === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  components: {
    AgreeToggle
  },
  data() {
    return {
      hasMortgage: null
    };
  },
  methods: {
    ...mapActions(["setRealEstateOwnedMortgage"]),
    setHasMortgage(value) {
      this.hasMortgage = value;
      this.setRealEstateOwnedMortgage(value);
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    },
    titleValue() {
      return this.currentRealEstate.AddressLineText || "this property";
    }
  }
};
</script>
