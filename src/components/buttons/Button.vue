<template lang="pug">
    .button
        v-btn.text-capitalize(
            :class="buttonClass + (isNotSelected ? ' unselected-button': '')"
            :color="background"
            :width="width"
            :height="height"
            :disabled="isDisabled"
            :outlined="isNotSelected"
            :type="butType"
            @click="clicked"
        ) {{ value }}
</template>

<script>
export default {
  props: {
    butType: {
      type: String,
      default: "button",
    },
    value: {
      type: String,
      value: "Button",
    },
    customClass: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "152px",
    },
    height: {
      type: String,
      default: "40px",
    },
    background: {
      type: String,
      default: "lynx-primary",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isNotSelected: {
      type: Boolean,
      default: false,
    },
    isOutlined: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clicked(e) {
      if (this.butType === "submit") {
        e.preventDefault();
      }
      this.$emit("clicked");
    },
  },
  computed: {
    buttonClass() {
      return !this.isOutlined ? this.customClass + " white--text" : this.customClass;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.button {
  -webkit-appearance: inherit;
  &:deep(.v-btn) {
    display: inline-block;
    letter-spacing: 0px;
  }
}
</style>
