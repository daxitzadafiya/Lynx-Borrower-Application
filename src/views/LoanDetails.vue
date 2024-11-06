<template lang="pug">
    .loan-details.fill-height
        v-row
            v-col.d-flex.justify-start.flex-wrap
                v-tabs.rounded(v-model="currentTab" grow height="30px" hide-slider)
                    v-tab.text-capitalize.px-2(v-for="(tab, index) in tabs" :key="index" active-class="current-tab") {{ tab }}
                v-tabs-items(v-model="currentTab" style="width:100%")
                    v-tab-item
                        GeneralInfo
                    v-tab-item
                        PropertyAndLoanInfo
                    v-tab-item
                        MortgageDetails
                    v-tab-item
                        ClosingAdjustments
                    v-tab-item
                        Origination
                    v-tab-item
                        DemographicsCollectionMethod
                    v-tab-item
                        GovernmentBorrower(:governmentBorrower="governmentBorrower" :additionalInfo="additionalInfo")
                    v-tab-item
                        Counseling

</template>

<script>
import { mapGetters } from "vuex";
import GovernmentBorrower from "@/components/loanDetails/GovernmentBorrower";
import PropertyAndLoanInfo from "@/components/loanDetails/PropertyAndLoanInfo";
import Counseling from "@/components/loanDetails/Counseling";
import Origination from "@/components/loanDetails/Origination";
import DemographicsCollectionMethod from "@/components/loanDetails/DemographicsCollectionMethod";
import ClosingAdjustments from "@/components/loanDetails/ClosingAdjustments";
import MortgageDetails from "@/components/loanDetails/MortgageDetails";
import GeneralInfo from "@/components/loanDetails/GeneralInfo";

export default {
  data() {
    return {
      currentTab: "",
      tabs: [
        "General Info",
        "Property & Loan",
        "Mortgage Details",
        "Closing Adjustments",
        "Origination",
        "Demographics Collection",
        "Government Borrower",
        "Counseling"
      ]
    };
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      additionalInfo: "getAdditionalLoanInformation",
      borrower: "getBorrower"
    }),
    governmentBorrower() {
      return this.borrower.GovernmentBorrower || {};
    }
  },
  components: {
    GovernmentBorrower,
    PropertyAndLoanInfo,
    Counseling,
    Origination,
    DemographicsCollectionMethod,
    ClosingAdjustments,
    MortgageDetails,
    GeneralInfo
  },
  mounted() {
    if (!this.currentLoan) this.$router.push("/borrowers");
  }
};
</script>

<style lang="scss">
.loan-details {
  max-width: 100%;
  .v-slide-group__prev,
  .v-slide-group__next {
    display: none;
  }
  .v-tab {
    border: 0.5px solid rgba(0, 0, 0, 0.3);
    border-bottom: none;
    border-right: none;
    border-top-right-radius: 15px;
    background-color: #eee;
    font-size: 12px !important;
    &:last-child {
      border-right: 0.5px solid rgba(0, 0, 0, 0.3);
    }
  }
  .current-tab {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 100%;
      background: #023da7;
    }
  }
  .v-input,
  .v-label {
    font-size: 13px !important;
  }
  @media (max-width: 1024px) {
    margin-top: 65px;
  }
  @media (max-width: 768px) {
    max-width: 738px;
  }
  .button {
    margin: 15px;
  }
}
</style>
