<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <div
        class="titleSecondaryText primary-text font-weight-bold"
        v-if="content"
      >
        {{ content }}
      </div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        With some quick info we can let you know exactly what your credit score
        is. Don’t worry if your score isn’t what you expected, it is only one
        part of the overall decision.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/credit/credit_order.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["getCreditOrders"])
  },
  computed: {
    ...mapGetters(["getBrandingSection", "getIsHostedMode"]),
    section() {
      return this.getBrandingSection("Credit");
    },
    introSlide() {
      return this.getIsHostedMode && this.section && this.section.IntroSlide;
    },
    title() {
      return (
        (this.introSlide && this.introSlide.Title) ||
        "Credit is an important factor in obtaining a mortgage and your score can change often."
      );
    },
    content() {
      return this.getIsHostedMode && this.introSlide && this.introSlide.Content;
    }
  },
  created() {
    this.getCreditOrders(true);
  }
};
</script>
