<template lang="pug">
    .review-data
        v-card.main__card(width='100%' light)
            QualifyingBorrower
            PropertyNLoans
            TransactionsDetails
            v-divider
            .main__button
                .main_desktop-button
                    Button(value="Next" customClass="primary-button" @clicked="updateAndSave")
                .main_mobile-button
                    Button(value="Next" customClass="primary-button" width="200px" @clicked="updateAndSave")
</template>

<script>
import QualifyingBorrower from "./QualifyingBorrower";
import TransactionsDetails from "./TransactionsDetails";
import PropertyNLoans from "./PropertyNLoans";
import Button from "@/components/buttons/Button";
import scrollToTop from "@/mixins/scrollToTop.js";
import { mapActions } from "vuex";

export default {
  mixins: [scrollToTop],
  methods: {
    ...mapActions(["saveLoanPatches"]),
    async updateAndSave() {
      await this.saveLoanPatches();
      this.$router.push("/underwriting");
    }
  },
  components: {
    QualifyingBorrower,
    TransactionsDetails,
    PropertyNLoans,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

.review-data {
  @include main-data;
}

.text-block {
  padding: 0 30px;
}

@media (max-width: 760px) {
  .text-block {
    padding: 0;
  }
  .v-divider {
    margin-top: 15px;
  }
}
</style>
