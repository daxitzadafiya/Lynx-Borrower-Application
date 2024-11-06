<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text primary-text">
        Since your current employment is less than 2 years, you must provide the
        details of your previous employment.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/employment/previousemployment.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
export default {};
</script>
