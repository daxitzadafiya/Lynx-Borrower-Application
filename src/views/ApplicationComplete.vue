<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText" v-html="message"></div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        Our processors are already hard at work gathering the remaining details
        to finalize your loan application. We'll send you a link via email
        shortly so that you may review your application details and submit your
        loan application for an approval.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/credit/credit_order.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons
        NextButtonText="Log Out"
        :HideProgresssAndPrevious="true"
        :HasDefaultNavigation="false"
        :NextClicked="logOut"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      message: `Nice work completing your loan application!`
    };
  },
  methods: {
    ...mapActions(["setUnderwriteMessage1", "setFindingMessages", "logOut"])
  },
  computed: {
    ...mapGetters({
      underwriteMessage: "getUnderwriteMessage1"
    })
  },
  created() {
    this.setUnderwriteMessage1(this.message);
    this.setFindingMessages("");
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
    font-size: 22px;
  }
}
</style>
