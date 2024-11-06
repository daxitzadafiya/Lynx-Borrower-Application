<template lang="pug">
    .add-button.white--text(@click="$emit('add')" :class="customClass")
        .add-button__inner +    
</template>

<script>
export default {
  props: {
    customClass: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.add-button {
  width: 41px;
  height: 41px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  &__inner {
    font-size: 40px;
  }
}

.small {
  width: 24px;
  height: 24px;
  .add-button__inner {
    font-size: 20px;
    background: none;
  }
}
</style>
