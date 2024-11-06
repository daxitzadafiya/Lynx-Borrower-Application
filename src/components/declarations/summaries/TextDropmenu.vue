<template lang="pug">
  v-col.itemContainer(sm="12" cols="12")
    .radioText {{ text }}
    .dropdownInputs
            Input(
              defaultComponent="v-select"
              :smVal="12"
                attach=true
                :value="value"
                :items="items"
                item-text="text"
                item-value="value"
                :inputTitle="label"
                @change="setItem"
                :menu-props="{ bottom: true, offsetY: true }"
            )
</template>

<script>
export default {
  props: {
    text: {
      type: String
    },
    label: {
      type: String
    },
    value: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    setItem(e) {
      this.$emit("setItem", e);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
.radioText{
  flex: 7;
  padding-right: 10px;
}

.dropdownInputs{
  flex: 3;
  padding-left: 10px;
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  :deep(.itemContainer){
    flex-direction: column;
  }
}
.text {
  font-size: 16px;
}

.drop-menu {
  margin-left: 30px;
  @media (max-width: 450px) {
    margin-left: 0;
  }
}

.itemContainer{
  display: flex;
  margin-top: -10px;
}

</style>
