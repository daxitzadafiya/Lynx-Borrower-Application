<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText" v-if="title">{{ title }}</div>
      <div class="titleText" v-else>
        We are almost done!<br />Take your time and upload the documents in this
        section.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/documents/start.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :RequestedNextPath="'documents/upload'"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getBrandingSection", "getIsHostedMode"]),
    section() {
      return this.getBrandingSection("Documents");
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

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.declarations-main {
  @include main-generic;
  display: flex;
  flex-direction: column;
  height: 100%;
  .main-container {
    height: 500px;
    @media (max-width: 450px) {
      max-height: 350px;
    }
  }
}

.lg-block {
  display: block;
  @media (max-width: 768px) {
    display: inline;
    margin-left: 5px;
  }
}
</style>
