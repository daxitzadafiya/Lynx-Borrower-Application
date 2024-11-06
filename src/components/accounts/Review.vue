<template>
  <Review @clicked="()=>saveAndAdvance(true)"></Review>
</template>

<script>
import Review from "@/components/Review";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  components: {
    Review
  }
};
</script>
