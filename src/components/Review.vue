<template lang="pug">
.content-container.image-content-type
  .image-container
    .titleText Let's review the information you just entered
    .titleSecondaryText.primary-text If you need to make any corrections, you may do so on the following screen.
    inline-svg.titleImage(:src="require('@/assets/images/borrowers/review.svg')")
  .navigation-container
    NavigationButtons(
      NextButtonText="Ok" 
      NextBtnWidth="200px" 
        :HideProgresssAndPrevious="true")
</template>

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.review-wrapper {
  @include main-generic;
}

.slide {
  &__message {
    max-width: 100%;
  }
  &__comment {
    font-size: 16px;
    font-weight: 400;
    margin-top: 30px;
    @media (max-width: 760px) {
      font-size: 15px;
      margin: 20px 0 0;
      max-width: 100%;
    }
  }
}

.main-container {
  height: 470px;
  @media (max-width: 1024px) {
    padding-top: 60px;
    max-height: 760px;
  }
  @media (max-width: 768px) {
    padding-top: 10px;
    height: 600px;
    box-sizing: border-box;
  }
  @media (max-width: 760px) {
    padding-top: 0;
    height: 354px;
  }
}

.sm-pad-top-60 {
  @media (max-width: 768px) {
    padding-top: 60px;
  }
  @media (max-width: 760px) {
    height: 454px;
  }
}
</style>
