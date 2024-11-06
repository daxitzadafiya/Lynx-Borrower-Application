<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Take some time to review the liabilities that we have found on your
        credit report.
      </div>
      <div class="titleSecondaryText">
        If you see any errors or changes just let us know utilizing the system.
        Keep in mind that in many cases (especially with credit cards) the
        balances and payments may vary slightly from what they actually are,
        this is due to slight delays in reporting. Those changes, unless
        significant, do not typically need to be addressed. We have extracted
        the important details from your report for you to review on the
        following pages.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/credit/credit_response.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons
        NextButtonText="OK"
        :SaveOnNextClick="false"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";

export default {
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.credit-main {
  @include main-generic;
  .main-container {
    @media (max-width: 450px) {
      margin-top: 15px;
      margin-bottom: 20px;
      height: 500px;
    }
  }
}

.slide {
  &__message {
    max-width: 870px;
  }
  &__description {
    max-width: 870px;
  }
}

@media (max-width: 768px) {
  .slide {
    &__message {
      max-width: 600px;
    }
    &__description {
      max-width: 600px;
    }
  }
}

@media (max-width: 760px) {
  .slide {
    &__image {
      width: 200px;
    }
  }
}
</style>
