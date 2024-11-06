<template lang="pug">
    .approved
        .main-header
            img.main-header__image(:src="require('../assets/images/declarations/envelope.png')")
            span.main-header__title Underwriting Decision
        router-view
</template>

<script>
export default {
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 12 });
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.review {
  box-sizing: border-box;
  @media (max-width: 350px) {
    overflow-y: auto;
  }
}

.main-header {
  @include main-header;
}
</style>
