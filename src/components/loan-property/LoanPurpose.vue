<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <inline-svg
        class="slide__image"
        :src="require('@/assets/images/credit/credit_response.svg')"
      />
    </div>
    <div class="inner-content-container">
      <v-form fast-fail="fast-fail">
        <v-btn-toggle
          class="btnToggleGroup"
          :value="LoanPurposeType"
          @change="setPurposeAndRedirect"
        >
          <v-row class="form-container">
            <ToggleCard
              v-for="{ src, title, value } in purposes"
              :key="title"
              :value="value"
            >
              <inline-svg :src="src"></inline-svg>
              <p>{{ title }}</p>
            </ToggleCard>
          </v-row>
        </v-btn-toggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="nextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import ToggleCard from "@/components/controls/ToggleCard";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      purposes: [
        {
          src: require("@/assets/images/loan-property/purchase.svg"),
          title: "Purchase",
          value: "Purchase"
        },
        {
          src: require("@/assets/images/loan-property/refinance.svg"),
          title: "Refinance",
          value: "Refinance"
        },
        {
          src: require("@/assets/images/loan-property/construction.svg"),
          title: "New Home Construction",
          value: "Construction"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setLoanPurposeType"]),
    async setPurposeAndRedirect(title) {
      this.setLoanPurposeType(title);
    }
  },
  computed: {
    ...mapGetters({
      LoanPurposeType: "getLoanPurposeType",
      getBrandingSection: "getBrandingSection",
      getIsHostedMode: "getIsHostedMode"
    }),
    section() {
      return this.getBrandingSection("LoanAndProperty");
    },
    introSlide() {
      return this.getIsHostedMode && this.section && this.section.IntroSlide;
    },
    title() {
      return (
        (this.introSlide && this.introSlide.Title) ||
        "What is the purpose of the Loan you are applying for?"
      );
    },
    nextDisabled() {
      return (
        this.LoanPurposeType == null || this.LoanPurposeType === "Construction"
      );
    }
  },
  components: {
    ToggleCard
  }
};
</script>

<style lang="scss" scoped>
.inner-content-container {
  width: 100%;
}
</style>
