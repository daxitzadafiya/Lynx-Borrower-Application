<template lang="pug">
    .form-checkbox
        img.form-checkbox__unselected(v-if="!isChecked" :src="require('@/assets/images/Unselected.png')" @click="(e) => toggle(e, true)")
        img.form-checkbox__selected(v-else :src="require('@/assets/images/Selected.png')" @click="(e) => toggle(e, false)")
</template>

<script>
export default {
  props: {
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle(e, value) {
      this.$emit("toggle", { value });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-checkbox {
  height: 19px;
  &__unselected,
  &__selected {
    width: 19px;
    margin-left: -2px;
    cursor: pointer;
  }
}
</style>
