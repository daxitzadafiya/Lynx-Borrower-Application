<template lang="pug">
    .sidebar-info.text-black--text
        .sidebar-info__row
            v-icon.sidebar-info__icon.icon-color-main mdi-home-outline
            span 64 Washington Street
        .sidebar-info__row
            v-icon.sidebar-info__icon.icon-color-main mdi-home-outline
            span 155 Valencia Drive
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/sidebarAdditional.scss";

.sidebar-info {
  &__icon {
    width: 15px;
    margin-right: 5px;
  }
}
</style>
