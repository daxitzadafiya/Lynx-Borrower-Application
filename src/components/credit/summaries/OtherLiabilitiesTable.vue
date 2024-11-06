<template lang="pug">
    .d-contents
        v-data-table.content-table(
                :headers="headers"
                :items="otherLiabilities"
                disable-sort
                disable-pagination
                hide-default-footer
                :mobile-breakpoint="0"
            )
                template(v-slot:item.ExpenseType="{ item }")
                    span {{ item.ExpenseType.replace(/([a-z])([A-Z])/g, '$1 $2') }}
                template(v-slot:item.ExpenseMonthlyPaymentAmount="{ item }")
                    span ${{ getFormattedValue(item.ExpenseMonthlyPaymentAmount) || 0 }}
                template(v-slot:body.append)
                    tr.appended-row
                        td
                        td
                        td Totals:
                        td ${{ getFormattedValue(total) }}
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Add from "@/components/buttons/Add";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import Button from "@/components/buttons/Button";

export default {
  mixins: [currencyFormat, debtToIncomeAndhousingRatios],
  data() {
    return {
      headers: [
        {
          text: "Liability/Expense",
          value: "ExpenseType",
        },
        { text: "Number of Months", value: "ExpenseRemainingTermMonthsCount" },
        {
          text: "Duration",
          value: "ExpenseRemainingMonthsType",
        },
        {
          text: "Monthly Payment",
          value: "ExpenseMonthlyPaymentAmount",
        },
      ],
      editIcon:require("@/assets/images/edit.svg"),
      deleteIcon:require("@/assets/images/delete.svg")
    };
  },
  methods: {
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    otherLiabilities() {
      return this.borrower && this.borrower.OtherLiabilitiesAndExpenses
        ? this.borrower.OtherLiabilitiesAndExpenses
        : [];
    },
    total() {
      if (this.otherLiabilities.length) {
        return this.otherLiabilities.reduce(
          (acc, cur) => acc + cur.ExpenseMonthlyPaymentAmount,
          0
        );
      }
      return 0;
    }
  },
  components: {
    Button,
    Add
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
@import "@/assets/styles/colors.scss";

.liabilities-table {
  &__footer {
    border-top: thin solid rgba(0, 0, 0, 0.12);
    padding: 10px;
  }
}

.appended-row {
  font-weight: 600;
}

#table {
  margin-bottom: 40px;
  &:deep(th) {
    padding: 10px;
    font-weight: 500;
  }
  &:deep(td) {
    padding: 10px;
  }
  &:deep(.centered) {
    text-align: center !important;
  }
}

.mw-220 {
  display: inline-block;
  min-width: 152px;
}

.mr-2 {
  cursor: pointer;
}

.v-input__slot {
  margin-bottom: 0 !important;
}
:deep(th) {
  background-color: $table-header-back-color;
  span {
    color: $table-header-text-color !important;
  }
}

</style>
