<template lang="pug">
    .radio
        v-icon.main-header__image.mr-1.icon-color-main(v-if="isOn" @click="$emit('toggleRadio')").icon-color-main radio_button_checked
        v-icon.main-header__image.mr-1.icon-color-main(v-else @click="$emit('toggleRadio')").icon-color-main radio_button_unchecked
        .radio__label(:class="labelClass") {{ label }}
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    isOn: {
      type: Boolean,
      default: false
    },
    labelClass: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.radio {
  display: flex;
  align-items: center;
  &__image {
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
