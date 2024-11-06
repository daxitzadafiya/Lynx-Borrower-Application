<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/borrowers/start_borrowers.svg')"
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
      return this.getBrandingSection("Borrowers");
    },
    introSlide() {
      return this.getIsHostedMode && this.section && this.section.IntroSlide;
    },
    title() {
      return (
        (this.introSlide && this.introSlide.Title) ||
        "Please tell us about yourself so we can get started customizing YOUR mortgage!"
      );
    }
  },
  mounted() {}
};
</script>
