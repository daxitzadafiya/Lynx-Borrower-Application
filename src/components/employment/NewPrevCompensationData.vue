<template>
  <Input inputTitle="Monthly Income" prefix="$" :value="getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount) || ''" @input="(e) => setIncomeAmount(+e.replace(/,/g, ''))" @keypress="(e) => isOnlyNum(e, true)"></Input>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  methods: {
    ...mapActions(["updateBorrower"]),
    setIncomeAmount(value) {
      if (this.currentEmployment.EmploymentClassificationType) {
        const employments = this.Employment.map(item => {
          return item.EmploymentStatusType === "Previous"
            ? { ...item, EmploymentMonthlyIncomeAmount: value }
            : item;
        });
        return this.updateBorrower({ prop: "Employment", value: employments });
      }
      this.updateBorrower({
        prop: "Employment",
        value: [
          ...this.Employment,
          {
            EmploymentStatusType: "Previous",
            EmploymentMonthlyIncomeAmount: value
          }
        ]
      });
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment"
    }),
    currentEmployment() {
      if (this.Employment.length) {
        const employment = this.Employment.find(
          item => item.EmploymentStatusType === "Previous"
        );
        return employment || {};
      }
      return {};
    }
  }
};
</script>