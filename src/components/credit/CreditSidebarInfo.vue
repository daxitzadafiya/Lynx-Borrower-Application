<template lang="pug">
    .sidebar-info.text-black--text
        .sidebar-info__row
            span.sidebar-info_weight-500.left-nav-primary-text Decision Score: 
                span.left-nav-secondary-text {{ scoreValue }}
        .sidebar-info__row
            span.sidebar-info_weight-500.left-nav-primary-text Monthly Liabilities: 
                span.left-nav-secondary-text ${{ getFormattedValue(totalPayment) || 0 }}
</template>

<script>
import { mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [currencyFormat],
  computed: {
    ...mapGetters({
      reportDetails: "getCreditReportDetails",
      borrowers: "getBorrowers",
      selectedBorrower: "getBorrower"
    }),
    borrower() {
      if (!this.selectedBorrower.CoBorrower) return this.selectedBorrower;
      return this.borrowers.find(
        item =>
          item.LinkedBorrowerId === this.selectedBorrower.Id && !item.CoBorrower
      );
    },
    coBorrower() {
      if (this.selectedBorrower.CoBorrower) return this.selectedBorrower;
      return this.borrowers.find(
        item =>
          item.CoBorrower &&
          (this.selectedBorrower.Id === item.Id ||
            this.selectedBorrower.Id === item.LinkedBorrowerId)
      );
    },
    borrowerScores() {
      if (this.reportDetails) {
        const details = JSON.parse(
          JSON.stringify(this.reportDetails.ApplicantDetails)
        );
        const scores = details.find(
          item =>
            item.FirstName === this.borrower.FirstName &&
            item.LastName === this.borrower.LastName
        );
        return scores
          ? scores.CreditScores.sort((a, b) => (a.Source < b.Source ? -1 : 1))
          : [];
      }
      return [];
    },
    coBorrowerScores() {
      if (this.reportDetails) {
        const details = JSON.parse(
          JSON.stringify(this.reportDetails.ApplicantDetails)
        );
        if (this.coBorrower) {
          const coScores = details.find(
            item =>
              item.FirstName === this.coBorrower.FirstName &&
              item.LastName === this.coBorrower.LastName
          );
          return coScores
            ? coScores.CreditScores.sort((a, b) =>
                a.Source < b.Source ? -1 : 1
              )
            : [];
        }
      }
      return [];
    },
    scoreValue() {
      if (this.borrowerScores.length) {
        const midVal = this.borrowerScores.map(item => item.Score).sort()[1];
        if (this.coBorrowerScores.length) {
          const coMidVal = this.coBorrowerScores
            .map(item => item.Score)
            .sort()[1];
          return Math.min(midVal, coMidVal);
        }
        return midVal;
      }
      return 0;
    },
    liabilities() {
      return this.selectedBorrower && this.selectedBorrower.Liabilities
        ? this.selectedBorrower.Liabilities
        : [];
    },
    totalPayment() {
      if (this.liabilities.length) {
        return this.liabilities.reduce(
          (acc, cur) => acc + +cur.LiabilityMonthlyPaymentAmount,
          0
        );
      }
      return 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/sidebarAdditional.scss";
</style>
