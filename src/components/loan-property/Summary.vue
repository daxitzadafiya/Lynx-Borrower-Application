<template lang="pug">
.loan-data
  Property(:Property="Property")
  Loan
  OtherLoans(:Property="Property" v-if="mortgages.length!=0")
  .d-flex.w-100.justify-end.mt-5.pt-3
    Button(value="Go to next section" customClass="primary-button" width="auto" @clicked="()=>saveAndAdvance(true)")
</template>

<script>
import Loan from "./summaries/Loan";
import Property from "./summaries/Property";
import OtherLoans from "./summaries/OtherLoans";
import Rental from "./summaries/Rental";
import Button from "@/components/buttons/Button";
import scrollToTop from "@/mixins/scrollToTop.js";
import { mapActions, mapGetters } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [scrollToTop, loanPatch],
  methods: {
    ...mapActions(["saveLoanPatches"]),
    async saveAndReplaceRoute() {
      await this.saveAndAdvance(true,"/credit");
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty"
    }),
    isRental() {
      return (
        this.Property &&
        (this.Property.PropertyType === "Two-to-fourUnitProperty" ||
          this.Property.PropertyUsageType === "Investment")
      );
    },
    mortgages() {
      return this.Property && this.Property.OtherNewMortgageLoans
        ? this.Property.OtherNewMortgageLoans
        : [];
    }
  },
  components: {
    Loan,
    Property,
    OtherLoans,
    Rental,
    Button
  }
};
</script>