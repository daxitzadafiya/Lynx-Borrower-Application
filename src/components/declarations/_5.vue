<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Do you have a family relationship or business affiliation with the
        seller of the property?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_5.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="ULADSpecialBorrowerSellerRelationshipIndicatorValue"
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
        ULADSpecialBorrowerSellerRelationshipIndicator: bool
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    ULADSpecialBorrowerSellerRelationshipIndicatorValue() {
      if (
        this.declarations.ULADSpecialBorrowerSellerRelationshipIndicator ===
        null
      ) {
        return null;
      } else {
        return this.declarations.ULADSpecialBorrowerSellerRelationshipIndicator;
      }
    }
  }
};
</script>
