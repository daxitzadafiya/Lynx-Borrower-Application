<template lang="pug">
    .qualifying-borrower
        v-card-title.main__card-title
            h3.main__title.table-header-text.table-header-back Details of Transaction
        v-expansion-panels.panels.mb-5
          v-card-text.text-block
              BorrowerDue.mb-1(:tableData="borrowerDueBinded")
              TotalMortgageLoans.mb-1.light(:tableData="mortgageBinded")
              TotalCredits.mb-1(:tableData="creditsBinded")
              Calculations.mb-1(:tableData="calculationsBinded")
</template>

<script>
import BorrowerDue from "../transactions/BorrowerDue";
import TotalMortgageLoans from "../transactions/TotalMortgageLoans";
import TotalCredits from "../transactions/TotalCredits";
import Calculations from "../transactions/Calculations";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      borrowerDueData: [
        {
          title: "Sales Contract Price",
          amount: 0,
          prop: "SalesContractAmount"
        },
        {
          title: "Improvements, Renovations, Repairs",
          amount: 0,
          prop: "AlterationsImprovementsAndRepairsAmount"
        },
        {
          title: "Land (if acquired separately)",
          amount: 0,
          prop: "LandOriginalCostAmount"
        },
        {
          title:
            "For Refinance: Balance of Mortgage Loans on the Property to be paid off in the Transaction",
          amount: 0,
          prop: "TotalSubjectPropertyPayoffsAndPaymentsAmount"
        },
        {
          title: "Credit Cards and Other Debts Paid Off",
          amount: 0,
          prop: "TotalNonSubjectPropertyDebtsToBePaidOffAmount"
        },
        {
          title:
            "Borrower Closing Costs (including Prepaid and Initial Escrow Payments)",
          amount: 0,
          prop1: "TotalNonSubjectPropertyDebtsToBePaidOffAmount",
          prop2: "EstimatedClosingCostsAmount"
        },
        {
          title: "Discount Points",
          amount: 0,
          prop: "DiscountPointsTotalAmount"
        }
      ],
      mortgageData: [
        {
          title:
            "Loan Amount Excluding Financed Mortgage Insurance (or Mortgage Insurance Equivalent)",
          amount: 0,
          prop: "BaseLoanAmount"
        },
        {
          title:
            "Financed Mortgage Insurance (or Mortgage Insurance Equivelant)",
          amount: 0,
          prop: "MIAndFundingFeeFinancedAmount"
        },
        {
          title:
            "Other New Mortgage Loans on the Property the Borrower(s) is Buying or Refinancing",
          amount: 0,
          prop: "TotalSubordinateFinancingAmount"
        }
      ],
      creditsData: [
        {
          title: "Seller Credits",
          amount: 0,
          prop: "ULADURLATotalSellerCreditsAmount"
        },
        { title: "Other Credits", amount: 0, prop: "PurchaseCreditAmount" }
      ],
      calculations: [
        { title: "Total Due From Borrowers", amount: 0 },
        {
          title: "Less Total Mortgage Loans and Total Credits",
          amount: 0,
          isNegative: true
        },
        { title: "Cash From/To the Borrower at Closing", amount: 0 }
      ]
    };
  },
  computed: {
    ...mapGetters({
      TransactionDetails: "getTransactionDetails",
      OtherNewMortgageLoans: "getOtherNewMortgageLoans",
      PurchaseCredits: "getPurchaseCredits",
      ClosingAdjustments: "getClosingAdjustments"
    }),
    borrowerDueBinded() {
      const allData = this.borrowerDueData.reduce((acc, cur) => {
        const { prop, prop1, prop2 } = cur;
        let amount = this.TransactionDetails[prop] || 0;
        if (prop1 && prop2) {
          amount =
            (this.TransactionDetails[prop1] || 0) +
            (this.TransactionDetails[prop2] || 0);
        }
        acc.push({ ...cur, amount });
        return acc;
      }, []);
      const total = allData.reduce((acc, cur) => acc + +cur.amount, 0);
      return [...allData, { title: "Total due from borrower", amount: total }];
    },
    mortgageBinded() {
      const allData = this.mortgageData.reduce((acc, cur) => {
        const { prop } = cur;
        let amount = this.TransactionDetails[prop] || 0;
        if (prop === "NoteAmount" && this.OtherNewMortgageLoans.length) {
          amount = this.OtherNewMortgageLoans.reduce(
            (a, c) => a + (c.NoteAmount ? c.NoteAmount : 0),
            0
          );
        }
        acc.push({ ...cur, amount });
        return acc;
      }, []);
      const total = allData.reduce((acc, cur) => acc + +cur.amount, 0);
      return [...allData, { title: "Total mortgage loans", amount: total }];
    },
    creditsBinded() {
      const allData = this.creditsData.reduce((acc, cur) => {
        const { prop } = cur;
        let amount = this.TransactionDetails[prop] || 0;
        if (prop === "PurchaseCreditAmount" && this.PurchaseCredits.length) {
          amount = this.PurchaseCredits.reduce(
            (a, c) => a + (c.PurchaseCreditAmount ? c.PurchaseCreditAmount : 0),
            0
          );
          amount += this.ClosingAdjustments.length ? this.ClosingAdjustments.reduce((a, c) => a + c.ClosingAdjustmentItemAmount, 0 ): 0;
        }
        acc.push({ ...cur, amount });
        return acc;
      }, []);
      const total = allData.reduce((acc, cur) => acc + +cur.amount, 0);
      return [...allData, { title: "Total credits", amount: total }];
    },
    calculationsBinded() {
      return this.calculations.map(item => {
        const borrowerTotal = this.borrowerDueBinded[
          this.borrowerDueBinded.length - 1
        ].amount;
        const mortgageAndCreditsTotal =
          this.mortgageBinded[this.mortgageBinded.length - 1].amount +
          this.creditsBinded[this.creditsBinded.length - 1].amount;
        if (item.title === "Total Due From Borrowers") {
          item.amount = borrowerTotal;
        } else if (
          item.title === "Less Total Mortgage Loans and Total Credits"
        ) {
          item.amount = mortgageAndCreditsTotal;
        } else {
          item.amount = borrowerTotal - mortgageAndCreditsTotal;
        }
        return item;
      });
    }
  },
  components: {
    BorrowerDue,
    TotalMortgageLoans,
    TotalCredits,
    Calculations
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

.transactions-data {
  @include main-data;
}

.text-block {
  padding: 0 30px;
}

.tablet {
  display: none;
}

@media (max-width: 1024px) {
  .desktop {
    display: none;
  }
  .tablet {
    display: block;
  }
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
