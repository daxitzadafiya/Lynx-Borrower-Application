<template lang="pug">
.employment-data
        Current
        Additional
        Previous
        OtherIncome
        .d-flex.w-100.justify-end.mt-5.pt-3
          Button(value="Go to next section" width="auto" customClass="primary-button" @clicked="()=>saveAndAdvance(true)")
</template>

<script>
import Current from "./summaries/Current";
import Previous from "./summaries/Previous";
import Additional from "./summaries/Additional";
import OtherIncome from "./summaries/OtherIncome";
import Button from "@/components/buttons/Button";
import scrollToTop from "@/mixins/scrollToTop.js";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [scrollToTop, loanPatch],
  components: {
    Current,
    Previous,
    Additional,
    OtherIncome,
    Button
  }
};
</script>
