<template lang="pug">
    .qualifying-borrower
        v-card-title.main__card-title
            h3.main__title.table-header-text.table-header-back Qualifying the Borrower - Minimum Required Funds or Cash Back
        v-card-text.text-block
            .desktop
                DesktopQualifyingTable(:tableData="bindedBorrowersData" @toggleInclude="toggleInclude" @setBorrowerAndRedirect="setBorrowerAndRedirect")
            .tablet
                TabletQualifyingTable(:tableData="bindedBorrowersData" @toggleInclude="toggleInclude" @setBorrowerAndRedirect="setBorrowerAndRedirect")
            .mobile
                MobileQualifyingTable(:tableData="bindedBorrowersData" @toggleInclude="toggleInclude" @setBorrowerAndRedirect="setBorrowerAndRedirect")
</template>

<script>
import DesktopQualifyingTable from "./DesktopQualifyingTable";
import TabletQualifyingTable from "./TabletQualifyingTable";
import MobileQualifyingTable from "./MobileQualifyingTable";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [debtToIncomeAndhousingRatios],
  data() {
    return {
      fields: {
        name: "",
        status: "Completed",
        fico: 0,
        assets: 0,
        income: 0,
        liabilities: 0,
        dti: 0,
        housing: 0,
        isInclude: true
      },
      notIncludeIndexes: []
    };
  },
  methods: {
    ...mapActions(["setCurrentBorrower", "setCurrentLoan"]),
    getAssetsSum(borrower) {
      let assets = borrower && borrower.Assets ? borrower.Assets : [];
      return this.getCalculatedAssetsAmount(assets);
    },
    getCalculatedAssetsAmount(assets) {
      if (assets.length) {
        return assets.reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.AssetCashOrMarketValueAmount)
              ? +cur.AssetCashOrMarketValueAmount
              : 0),
          0
        );
      }
      return 0;
    },
    getTotalsRow(arr) {
      return arr.reduce(
        (acc, cur, index) => {
          if (this.notIncludeIndexes.indexOf(index) === -1) {
            const assets = acc.assets || 0;
            const income = acc.income || 0;
            const liabilities = acc.liabilities || 0;
            acc.fico = acc.fico
              ? acc.fico > cur.fico
                ? cur.fico
                : acc.fico
              : cur.fico;
            acc.assets = assets + (cur.isInclude ? cur.assets : 0);
            acc.income = income + (cur.isInclude ? cur.income : 0);
            acc.liabilities =
              liabilities + (cur.isInclude ? cur.liabilities : 0);
            acc.dti = acc.income
              ? +((acc.liabilities / acc.income) * 100).toFixed(2)
              : 0;
            acc.housing = acc.income ? this.getHousingIncome(acc.income) : 0;
          }
          return acc;
        },
        {
          name: "Totals:",
          fico: 0,
          assets: 0,
          income: 0,
          liabilities: 0,
          dti: 0,
          housing: 0
        }
      );
    },
    toggleInclude({ index }) {
      const position = this.notIncludeIndexes.indexOf(index);
      if (position === -1) {
        this.notIncludeIndexes.push(index);
      } else {
        this.notIncludeIndexes.splice(position, 1);
      }
      this.setDebtToIncomeAndHousingRatios();
    },
    setBorrowerAndRedirect({ index }) {
      if (this.borrowers.length) {
        const borrowerIndex = this.borrowers.findIndex(
          item =>
            `${item.FirstName} ${item.LastName}` ===
            this.bindedBorrowersData[index].name
        );
        this.setCurrentBorrower(borrowerIndex);
        this.$router.push("/borrowers/name");
      }
    },
    getBorrowerScores(borrower) {
      if (this.reportDetails) {
        const details = JSON.parse(
          JSON.stringify(this.reportDetails.ApplicantDetails)
        );
        const borrowerScores = details.find(
          item =>
            item.FirstName === borrower.FirstName &&
            item.LastName === borrower.LastName
        );
        const scores = borrowerScores
          ? borrowerScores.CreditScores.sort((a, b) =>
              a.Source < b.Source ? -1 : 1
            )
          : [];
        return scores.length ? scores.map(item => item.Score).sort()[1] : 0;
      }
      return 0;
    },
    setDebtToIncomeAndHousingRatios() {
      if (this.borrowers.length) {
        const dataObj = this.borrowers.reduce((acc, cur, index) => {
          const isIncluded = this.notIncludeIndexes.indexOf(index) === -1;
          const income = acc.income || 0;
          const liabilities = acc.liabilities || 0;
          acc.income = income + (isIncluded ? this.getIncomeSum(cur) : 0);
          acc.liabilities =
            liabilities + (isIncluded ? this.getLiabilitiesSum(cur) : 0);
          return acc;
        }, {});
        if (dataObj.income) {
          const DebtToIncomeRatio = +(
            dataObj.liabilities / dataObj.income
          ).toFixed(4);
          const HousingRatio = +(
            this.getHousingIncome(dataObj.income) / 100
          ).toFixed(4);
          this.setCurrentLoan({
            ...this.currentLoan,
            DebtToIncomeRatio,
            HousingRatio
          });
        } else {
          this.setCurrentLoan({
            ...this.currentLoan,
            DebtToIncomeRatio: 0,
            HousingRatio: 0
          });
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      reportDetails: "getCreditReportDetails",
      borrowers: "getBorrowers",
      housingExpenses: "getHousingExpenses",
      currentLoan: "getCurrentLoan"
    }),
    bindedBorrowersData() {
      const filtered = new Array(this.borrowers.length).fill(this.fields, 0);
      const binded = filtered.map((item, i) => {
        const name = `${this.borrowers[i].FirstName || ""} ${this.borrowers[i]
          .LastName || ""}`;
        const fico = this.getBorrowerScores(this.borrowers[i]);
        const assets = this.getAssetsSum(this.borrowers[i]);
        const income = this.getIncomeSum(this.borrowers[i]);
        const liabilities = this.getLiabilitiesSum(this.borrowers[i]);
        const dti = income ? +((liabilities / income) * 100).toFixed(2) : 0;
        const housing = income ? this.getHousingIncome(income) : 0;
        return {
          ...item,
          name,
          fico,
          assets,
          income,
          liabilities,
          dti,
          housing
        };
      });
      const totalsRow = this.getTotalsRow(binded);
      return [...binded, totalsRow];
    }
  },
  components: {
    DesktopQualifyingTable,
    TabletQualifyingTable,
    MobileQualifyingTable
  },
  mounted() {
    this.setDebtToIncomeAndHousingRatios();
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

.tablet,
.mobile {
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
  .tablet {
    display: none;
  }
  .mobile {
    display: block;
  }
  .text-block {
    padding: 0;
  }
  .v-divider {
    margin-top: 15px;
  }
}
</style>
