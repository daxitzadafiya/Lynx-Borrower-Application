<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText" v-if="title">{{ title }}</div>
      <div class="titleText" v-else>
        We are almost done!<br /><span class="lg-block"
          >Take your time and answer the questions in this section.</span
        >
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/declarations/start.svg')"
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
      return this.getBrandingSection("Declarations");
    },
    introSlide() {
      return this.getIsHostedMode && this.section && this.section.IntroSlide;
    },
    title() {
      return this.introSlide && this.introSlide.Title;
    }
  }
};
</script>
