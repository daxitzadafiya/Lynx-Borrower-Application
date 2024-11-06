<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/loan-property/start.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
export default {
  methods: {},
  computed: {
    title() {
      return "Please provide us with some details about the Property and Loan you are applying for";
    }
  },
  mounted() {}
};
</script>
