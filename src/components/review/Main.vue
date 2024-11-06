<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        We've completed our review of your loan application!
      </div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        Take a moment to look over everything that you have entered in the
        previous sections, as well as the information regarding closing costs
        and other details of the transaction.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/borrowers/review.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons
        NextButtonText="OK"
        :HideProgresssAndPrevious="true"
        :HasDefaultNavigation="false"
        :NextClicked="updateAndRedirect"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";
import scrollToTop from "@/mixins/scrollToTop.js";
import { mapGetters } from "vuex";

export default {
  mixins: [scrollToTop],
  methods: {
    async updateAndRedirect() {
      this.$router.push("/review/details");
    }
  },
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
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.review-main {
  @include main-generic;
  .main-container {
    height: 500px;
    max-width: 880px;
    @media (max-width: 768px) {
      max-width: 500px;
      height: 580px;
    }
    @media (max-width: 450px) {
      max-height: 350px;
    }
  }
}

.slide {
  &__message {
    font-size: 34px;
  }
  &__description {
    font-size: 24px;
  }
}
</style>
