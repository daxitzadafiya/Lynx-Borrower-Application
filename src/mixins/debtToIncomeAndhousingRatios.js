import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["setCurrentLoan"]),
    setDebtToIncomeAndHousingRatios() {
      if (this.borrowers.length) {
        const dataObj = this.borrowers.reduce((acc, cur) => {
          const income = acc.income || 0;
          const liabilities = acc.liabilities || 0;
          acc.income = income + this.getIncomeSum(cur);
          acc.liabilities = liabilities + this.getLiabilitiesSum(cur);
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
        }
      } else {
        this.setCurrentLoan({
          ...this.currentLoan,
          DebtToIncomeRatio: 0,
          HousingRatio: 0
        });
      }
    },
    getHousingIncome(income) {
      const expenses = this.housingExpenses.length
        ? this.housingExpenses.reduce((acc, cur) => {
            if (cur.HousingExpenseTimingType === "Proposed") {
              acc += +cur.HousingExpensePaymentAmount;
            }
            return acc;
          }, 0)
        : 0;
      return +((expenses / income) * 100).toFixed(2);
    },
    getIncomeSum(borrower) {
      let employment =
        borrower && borrower.Employment ? borrower.Employment : [];
      let otherIncome =
        borrower && borrower.OtherIncome ? borrower.OtherIncome : [];
      return this.getCalculatedIncome(employment, otherIncome);
    },
    getCalculatedIncome(employment, otherIncome) {
      const income = employment.length
        ? employment.reduce((acc, cur) => {
            if (cur.Income && cur.EmploymentStatusType === "Current") {
              return [...acc, ...cur.Income];
            }
            return acc;
          }, [])
        : [];
      const monthlyincomeorloss = employment.length
        ? employment.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.EmploymentMonthlyIncomeAmount)
                ? +cur.EmploymentMonthlyIncomeAmount
                : 0),
            0
          )
        : 0;
      const incomeSum = income.length
        ? income.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
                ? +cur.CurrentIncomeMonthlyTotalAmount
                : 0),
            0
          )
        : 0;
      const otherIncomeSum = otherIncome.length
        ? otherIncome.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
                ? +cur.CurrentIncomeMonthlyTotalAmount
                : 0),
            0
          )
        : 0;
      const otherIncomeMonthlyincomeorloss = otherIncome.length
        ? otherIncome.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.EmploymentMonthlyIncomeAmount)
                ? +cur.EmploymentMonthlyIncomeAmount
                : 0),
            0
          )
        : 0;
      return (
        incomeSum +
        otherIncomeSum +
        monthlyincomeorloss +
        otherIncomeMonthlyincomeorloss
      );
    },
    getLiabilitiesSum(borrower) {
      let liabilities =
        borrower && borrower.Liabilities ? borrower.Liabilities : [];
      return liabilities.length
        ? liabilities.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.LiabilityMonthlyPaymentAmount)
                ? +cur.LiabilityMonthlyPaymentAmount
                : 0),
            0
          )
        : 0;
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      borrowers: "getBorrowers",
      housingExpenses: "getHousingExpenses"
    })
  }
};
