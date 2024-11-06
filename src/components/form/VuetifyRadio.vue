<template lang="pug">
    .radio
        i.mdi.mdi-radiobox-blank.theme--light(v-if="!isOn" @click="$emit('toggleRadio')" :class="[inactiveIconClass, iconGeneralClass]")
        i.mdi.mdi-radiobox-marked.primary--text(v-else @click="$emit('toggleRadio')"  :class="[activeIconClass, iconGeneralClass]")
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
    },
    iconGeneralClass: {
      type: String,
      default: ""
    },
    activeIconClass: {
      type: String,
      default: ""
    },
    inactiveIconClass: {
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
  &:deep(.v-icon) {
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>
