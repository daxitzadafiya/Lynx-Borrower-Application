<template lang="pug">
Review(@clicked="()=>saveAndAdvance(true)")
</template>

<script>
import Review from "@/components/Review";
import scrollToTop from "@/mixins/scrollToTop.js";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [scrollToTop, loanPatch],
  components: {
    Review
  }
};
</script>

<style lang="scss" scoped></style>
