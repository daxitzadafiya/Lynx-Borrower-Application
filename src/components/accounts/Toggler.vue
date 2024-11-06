<template lang="pug">
    .deposit-toggler.d-flex.align-center
        .deposit-toggler__item.px-2.py-1(
            :class="isLeftSelected ? 'primary white--text' : 'white text-black--text'"
            @click="$emit('toggleMode', {mode: leftText})"
            ) {{ leftText }}
        .deposit-toggler__item.px-2.py-1(
            :class="isRightSelected ? 'primary white--text' : 'white text-black--text'"
            @click="$emit('toggleMode', {mode: rightText})"
            ) {{ rightText }}
</template>

<script>
export default {
  props: {
    isLeftSelected: {
      type: Boolean,
      default: false
    },
    isRightSelected: {
      type: Boolean,
      default: false
    },
    leftText: {
      type: String,
      default: ""
    },
    rightText: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.deposit-toggler {
  width: 230px;
  &__item {
    cursor: pointer;
    text-align: center;
    border: 1px solid $text-black !important;
    width: 50%;
    &:last-child {
      border-left: none !important;
    }
  }
}
</style>
