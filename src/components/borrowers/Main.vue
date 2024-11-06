<template>
  <div
    class="d-flex flex-column justify-center align-center text-center greetingsContainer mx-auto"
  >
    <div class="titleText primary-text">{{ title }}</div>
    <div class="titleSecondaryText" v-if="content">{{ content }}</div>
    <div class="titleSecondaryText" v-else>
      Our process is broken down into 6 simple sections to help speed up and
      simplify YOUR | mortgage process. At any time, in any section you can
      click the help icon at the top right to | get instant answers to any
      questions you may have. Our entire process from start to finish | can take
      as little as 5 minutes!
    </div>
    <img
      class="titleImage"
      :src="require('@/assets/images/borrowers/main.png')"
    />
    <NavigationButtons
      NextButtonText="Start"
      :HideProgresssAndPrevious="true"
    ></NavigationButtons>
  </div>
</template>

<script>
import loanPatch from "@/mixins/loanPatch.js";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [loanPatch],
  data() {
    return {
      primaryFill: "lynx-primary-svg",
      secondaryFill: "lynx-secondary-svg"
    };
  },
  methods: {
    NextClicked() {

    }
  },
  computed: {
    ...mapGetters(["introSlide", "getIsHostedMode"]),
    title() {
      return (
        (this.getIsHostedMode && this.introSlide && this.introSlide.Title) ||
        "Thank you for choosing our company to help with YOUR mortgage"
      );
    },
    content() {
      return this.getIsHostedMode && this.introSlide && this.introSlide.Content;
    }
  },
  mounted() {
    this.$emit("setProgressVisibility", { name: this.$route.name });
  },
  destroyed() {
    this.$emit("setProgressVisibility", { name: "" });
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.greetingsContainer {
  max-width: 1000px;
  padding: $page-padding;
}

.titleText {
  font-weight: 500;
  font-size: 26px;
  line-height: 39px;
  margin: 20px 0px;
  max-width: 800px;
  text-align: center;
  @media (max-width: $mobile-width) {
    font-size: 16px;
    line-height: 28px;
    margin: 0px 0px 15px 0px;
  }
}

.titleSecondaryText {
  font-size: 17px;
  margin-bottom: 20px;
  max-width: 800px;
  text-align: center;
  @media (max-width: $mobile-width) {
    font-size: 15px;
  }
}

.titleImage {
  margin: 20px 0px;
  width: auto;
  height: auto;
  max-height: 375px;
  @media (max-width: $mobile-width) {
    width: 100%;
  }
}
</style>
