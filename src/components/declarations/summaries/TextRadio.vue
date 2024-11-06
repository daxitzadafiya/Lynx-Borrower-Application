<template lang="pug">
  v-col.itemContainer(sm="12" cols="12")
    .radioText {{ text }}
    .radioInputs
      v-radio-group.mt-0(row hide-details :value="value" @change="(val)=>{$emit('toggleRadio', val)}")
        v-radio(label="Yes" :value="yesNoValues?'Yes':true")
        v-radio(label="No" :value="yesNoValues?'No':false")
</template>

<script>

export default {
  props: {
    text: {
      type: String
    },
    value: {
      default: null
    },
    yesNoValues: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>

.text {
  font-size: 16px;
}

.radioText{
  flex: 7;
  padding-right: 10px;
}

.radioInputs{
  flex: 3;
  padding-left: 10px;
  align-items: flex-end;
  display: flex;
  flex-direction: column;
}

.itemContainer{
  display: flex;
}

</style>
