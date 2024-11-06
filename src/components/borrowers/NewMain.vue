<template>
  <div class="d-flex flex-column justify-center align-center text-center greetingsContainer mx-auto">
    <div class="greetingsText primary-text py-5">Hi {{ name }}</div>
    <div class="greetingsSecondaryText py-3">Welcome, please click on ‘<span class="primary-text">Start</span>’ to continue with the Uniform Residential Loan application process.</div>
    <div class="contentText primary-text py-3" v-if="content">{{ content }}</div>
    <div class="contentText primary-text py-3" v-else>Our process is broken down into 6 simple sections to help speed up and simplify your mortgage process. At any time, in any section you can click the help icon at the top right to get instant answers to any questions you may have. Our entire process from start to finish can take as little as 5 minutes!</div>
    <NavigationButtons NextButtonText="Start" :HideProgresssAndPrevious="true" class="py-5"></NavigationButtons>
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
      secondaryFill: "lynx-secondary-svg",
    };
  },
  methods: {
  },
  computed: {
    ...mapGetters({
      introSlide: "introSlide", 
      getIsHostedMode: "getIsHostedMode",
      user: "getCurrentUser",
    }),
    title() {
      return (
        (this.getIsHostedMode && this.introSlide && this.introSlide.Title) ||
        "Thank you for choosing our company to help with YOUR mortgage"
      );
    },
    content() {
      return this.getIsHostedMode && this.introSlide && this.introSlide.Content;
    },
    name() {
      return this.user ? this.user.firstName : "";
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/colors.scss";
.greetingsText{
  font-weight: 600;
  font-size: 36px;
line-height: 32px;
}

.greetingsSecondaryText{
  font-weight: 500;
font-size: 26px;
line-height: 39px;
color: $gray2;
}

.contentText{
  font-weight: 600;
}

.greetingsContainer{
  max-width: 1000px;
  padding: $page-padding;
}
</style>
