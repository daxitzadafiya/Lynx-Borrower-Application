<template lang="pug">
    v-col.no-pad(sm="9" md="7" cols="6")
        v-row.chapters
            v-col(v-for="(value, name) in chapters" :key="name" sm="3" cols="12")
                        v-checkbox.defaultCheckbox.mt-0.pt-0(
                            :value="chapter === name"
                            color='primary'
                            ripple=false
                            :label="value"
                            :disabled="isDisabled"
                            dense
                            @input="$emit('setChapter', name)"
                        )
</template>

<script>
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: true
    },
    chapter: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chapters: {
        ChapterSeven: "Chapter 7",
        ChapterEleven: "Chapter 11",
        ChapterTwelve: "Chapter 12",
        ChapterThirteen: "Chapter 13"
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.chapters {
  position: relative;
  margin-top: 20px;
  margin-bottom: 0px;
  &__item {
    align-items: center;
  }
  &__title {
    margin-left: 5px;
  }
  &_disabled {
    opacity: 0.5;
  }
}

@media (max-width: 450px) {
  .chapters {
    flex-direction: column;
  }
  .no-pad-mobile {
    padding: 0 12px;
  }
}
</style>
