<template lang="pug">
    .other-loans
        v-card-title.main__card-title
            h3.main__title.light-gray.primary--text Rental Income
        v-card-text.text-block.text-black--text
            v-row.text-block__row
                v-col.text-block__col(sm="6" md="8" cols="12")
                    p.text-16 Complete for purchases only, if the subject property is a 2 to 4 Unit Primary Residence or an Investment Property
                v-col.text-block__col(sm="6" md="4" cols="12")
                    v-text-field(
                        prefix="$"
                        label="Expected Monthly Rental Income"
                        :value="getFormattedValue(RentalEstimatedGrossMonthlyRentAmount)"
                        @input="(e) => setPropertyValue(+e.replace(/,/g, ''))"
                        @keypress="(e) => isOnlyNum(e, true)"
                        ) 
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  props: {
    Property: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  methods: {
    ...mapActions(["setProperty"]),
    toggleAndRedirect() {
      this.toggleIsOnlay({ isOnlay: false });
      this.$router.push("/loan/review", () => {});
    },
    setPropertyValue(e) {
      const property = this.Property || {};
      const RentalIncome = property.RentalIncome
        ? { ...property.RentalIncome, RentalEstimatedGrossMonthlyRentAmount: e }
        : { RentalEstimatedGrossMonthlyRentAmount: e };
      this.setProperty({ ...property, RentalIncome });
    }
  },
  computed: {
    RentalEstimatedGrossMonthlyRentAmount() {
      return this.Property && this.Property.RentalIncome
        ? this.Property.RentalIncome.RentalEstimatedGrossMonthlyRentAmount
        : "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";
</style>
