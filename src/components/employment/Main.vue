<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <div
        class="titleSecondaryText primary-text font-weight-bold"
        v-if="content"
      ></div>
      <div class="titleSecondaryText primary-text font-weight-bold" v-else>
        Remember, your income isn’t just money received from your job; it could
        be social security, child support, alimony, or many other sources as
        long as you have been receiving it and will keep receiving it.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/employment/main.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getBrandingSection", "getIsHostedMode"]),
    section() {
      return this.getBrandingSection("EmploymentAndIncome");
    },
    introSlide() {
      return this.getIsHostedMode && this.section && this.section.IntroSlide;
    },
    title() {
      return (
        (this.introSlide && this.introSlide.Title) ||
        "Let us know about your employment and income."
      );
    },
    content() {
      return this.getIsHostedMode && this.introSlide && this.introSlide.Content;
    }
  }
};
</script>
