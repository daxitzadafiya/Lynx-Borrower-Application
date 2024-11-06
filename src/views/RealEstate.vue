<template lang="pug">
    .real-estate
        .main-header
            img.main-header__image(:src="require('../assets/images/loan-property/house.png')")
            span.main-header__title Real Estate Owned
        router-view
</template>

<script>
export default {
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 6 });
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/start.scss";

.real-estate {
  box-sizing: border-box;
  @media (max-width: 350px) {
    overflow-y: auto;
  }
}

.main-header {
  @include main-header;
}
</style>
