<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        If you are occupying this property, will you set aside space within the
        property to operate your own business?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/declarations_5.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="mixedUseValue"
          @input="setMixedUseProp"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
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
  methods: {
    ...mapActions(["setProperty"]),
    setMixedUseProp(val) {
      const property = this.Property
        ? { ...this.Property, PropertyMixedUsageIndicator: val }
        : { PropertyMixedUsageIndicator: val };
      this.setProperty(property);
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty",
      LoanPurposeType: "getLoanPurposeType"
    }),
    mixedUseValue() {
      if (
        this.Property &&
        this.Property.hasOwnProperty("PropertyMixedUsageIndicator")
      ) {
        return this.Property.PropertyMixedUsageIndicator;
      } else {
        return null;
      }
    }
  }
};
</script>
