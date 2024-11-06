<template>
  <v-btn-toggle v-model="booleanValue" mandatory>
    <v-btn
      v-for="(item, index) in options"
      :key="index"
      :value="item.value"
      min-width="80"
      :class="[
        'primary-button',
        'lynx-primary',
        item.value !== booleanValue ? 'bordered' : ''
      ]"
      @click="handleClick(item.value)"
    >
      {{ item.label }}
      <v-icon class="checkCircle">check_circle</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  props: {
    value: {
      type: [Boolean, String, null]
    },
    options: {
      type: Array,
      default: () => [
        { value: true, label: "Yes" },
        { value: false, label: "No" }
      ]
    }
  },
  data() {
    return {
      booleanValue: this.value
    };
  },
  mounted() {
    this.booleanValue = this.value;
  },
  methods: {
    handleClick(value) {
      this.booleanValue = value;
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors";
@import "@/assets/styles/variables";

.variableButtonWidth {
  @media (max-width: $tablet-width) {
    width: 100px !important;
  }
  @media (max-width: $mobile-width) {
    width: 75px !important;
  }
}

.v-item-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  .theme--light.v-btn.primary-button {
    height: 60px !important;
    padding: 0 16px !important;
    border-radius: 5px !important;
    font-size: 13px;
    opacity: 1;
    .checkCircle {
      position: absolute;
      right: -26px;
      top: -28px;
      border-radius: 50%;
      color: $icon-color !important;
      z-index: 2;
      background-color: white;
      display: none;
    }
    &.v-btn--active {
      &:hover {
        &::before {
          opacity: 0.08;
        }
      }
      &::before {
        opacity: 0;
      }
    }
    &:not(.bordered) {
      border: 1px solid $icon-color !important;
      background-color: #fff !important;
      :deep(span) {
        color: $icon-color !important;
      }
      &::before {
        display: none;
      }
      .checkCircle {
        display: block;
      }
    }
    &.bordered {
      border: 1px solid transparent !important;
      background-color: #f4f3f2 !important;
      box-shadow: none !important;
      :deep(span) {
        color: $icon-inactive-color !important;
      }
    }
  }
}
</style>
