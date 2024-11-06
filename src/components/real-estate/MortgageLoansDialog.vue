<template lang="pug">
    v-card.popup(mx-auto light)
        v-card-title.popup__title.dialog-header-back.dialog-header-text
            span.popup__title-text Mortgage Loans
            v-btn.popup__close-wrapper(icon @click="toggleIsOnlay({isOnlay: false})")
                v-icon.popup__close(color="white") mdi-close
        .subtitle
            .subtitle_bold {{ editingPropertyDetails.title }}
            .subtitle_normal {{editingPropertyDetails.location}}
        v-card-text.text-block.text-black--text
            v-row.text-block__row.py-0.my-0
                v-col.text-block__col.py-0.my-0(sm="6" cols="12")
                    v-select(
                        label="Mortgage Loans"
                        :items="mortgageLoansOptions"
                        @change="populateLoanData"
                        :menu-props="{bottom: true, offsetY: true }"
                    )
            v-row.text-block__row
                v-col.text-block__col(sm="4" cols="12")
                    v-combobox(
                        attach=true
                        :menu-props="{light: true}"
                        :value="mortgageLoan.MortgageLoanType"
                        :items="loanTypes"
                        @change="(e) => setMortgageLoanProperty(e, 'MortgageLoanType')"
                        label="Loan Type"
                        )
                v-col.text-block__col(sm="4" cols="12")
                    v-combobox(
                        attach=true
                        :menu-props="{light: true}"
                        :value="mortgageLoan.OwnershipType"
                        :items="ownershipTypes"
                        @change="(e) => setMortgageLoanProperty(e, 'OwnershipType')"
                        label="Ownership Type"
                        )
                v-col.text-block__col(sm="4" cols="12")
                    v-text-field(
                        label="Credtior Name" 
                        :value="mortgageLoan.FullName"
                        @input="(e) => setMortgageLoanProperty(e, 'FullName')"
                        )
            v-row.text-block__row
                v-col.text-block__col(sm="6" cols="12")
                    v-text-field(
                        label="Account Number" 
                        :value="mortgageLoan.LiabilityAccountIdentifier"
                        @input="(e) => setMortgageLoanProperty(e, 'LiabilityAccountIdentifier')"
                        )
                v-col.text-block__col(sm="6" cols="12")
                    v-text-field(
                        label="Monthly Payment" 
                        :value="getFormattedValue(mortgageLoan.LiabilityMonthlyPaymentAmount)"
                        prefix="$"
                        @input="(e) => setMortgageLoanProperty(+e.replace(/,/g, ''), 'LiabilityMonthlyPaymentAmount')"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
            v-row.text-block__row
                v-col.text-block__col(sm="6" cols="12")
                    v-text-field(
                        label="Unpaid Balance" 
                        :value="getFormattedValue(mortgageLoan.LiabilityUnpaidBalanceAmount)"
                        prefix="$"
                        @input="(e) => setMortgageLoanProperty(+e.replace(/,/g, ''), 'LiabilityUnpaidBalanceAmount')"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
                v-col.text-block__col(sm="6" cols="12")
                    v-text-field(
                        :prefix="mortgageLoan.LiabilityCreditLimit !== 'N/A' ? '$' : ''"
                        label="Credit Limit" 
                        :value="getFormattedValue(mortgageLoan.LiabilityCreditLimit)"
                        @input="(e) => setMortgageLoanProperty(+e.replace(/,/g, ''), 'LiabilityCreditLimit')"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
            v-row.text-block__row.check-row.text-black--text
                v-col.text-block__col(sm="4" cols="8") Payoff Prior to Closing
                v-col.text-block__col(cols="3")
                    CheckBox(:isChecked="mortgageLoan.LiabilityPayoffStatusIndicator" @toggle="({value}) => setMortgageLoanProperty(value, 'LiabilityPayoffStatusIndicator')")
            v-row.text-block__row.check-row.text-black--text
                v-col.text-block__col(sm="4" cols="8") Payment Includes Taxes and Insurance
                v-col.text-block__col(cols="3")
                    CheckBox(:isChecked="mortgageLoan.LiabilityPaymentIncludesTaxesInsuranceIndicator" @toggle="({value}) => setMortgageLoanProperty(value, 'LiabilityPaymentIncludesTaxesInsuranceIndicator')")
        v-divider
        .popup__button
            .popup_desktop-button
                Button(value="OK" customClass="primary-button" @clicked="toggleIsOnlay({isOnlay: false})")
            .popup_mobile-button
                Button(value="OK" customClass="primary-button" width="200px" @clicked="toggleIsOnlay({isOnlay: false})")    
</template>

<script>
import CheckBox from "@/components/form/CheckBox";
import Button from "@/components/buttons/Button";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      loanTypes: ["Conventional", "FHA", "VA", "USDA-RD", "Other"],
      ownershipTypes: ["Joint", "Individual"],
      populatingReportFields: [
        { model: "OwnershipType", api: "OwnershipType" },
        { model: "FullName", api: "CompanyName" },
        { model: "LiabilityAccountIdentifier", api: "AccountNumber" },
        { model: "LiabilityMonthlyPaymentAmount", api: "MonthlyPayment" },
        { model: "LiabilityUnpaidBalanceAmount", api: "UnpaidBalance" },
        { model: "LiabilityCreditLimit", api: "CreditLimitAmount" }
      ]
    };
  },
  methods: {
    ...mapActions([
      "getCreditOrders",
      "toggleIsOnlay",
      "setMortgageLoan",
      "setRealEstate"
    ]),
    setMortgageLoanProperty(value, prop) {
      this.setMortgageLoan({
        prop,
        loanIndex: this.editingMortgageLoanIndex,
        value
      });
      if (
        this.mortgageLoan.LiabilityPaymentIncludesTaxesInsuranceIndicator ==
        undefined
      ) {
        this.setMortgageLoan({
          prop: "LiabilityPaymentIncludesTaxesInsuranceIndicator",
          loanIndex: this.editingMortgageLoanIndex,
          value: false
        });
      }
      if (!this.mortgageLoan.LiabilityType) {
        this.setMortgageLoan({
          prop: "LiabilityType",
          loanIndex: this.editingMortgageLoanIndex,
          value: "MortgageLoan"
        });
      }
      if (prop === "LiabilityUnpaidBalanceAmount") {
        const realEstates = this.RealEstate.map((item, index) => {
          if (index === this.currentIndex) {
            item.PropertyLienUnPaidBalanceAmount = item.MortgageLoans.reduce(
              (a, c) =>
                (a += !isNaN(c.LiabilityUnpaidBalanceAmount)
                  ? +c.LiabilityUnpaidBalanceAmount
                  : 0),
              0
            );
          }
          return item;
        });
        this.setRealEstate(realEstates);
      }
    },
    populateLoanData(value) {
      const [CompanyName, AccountNumber] = value.split(" - ");
      const data = this.mortgageDetails.find(
        item =>
          item.CompanyName === CompanyName &&
          item.AccountNumber === AccountNumber
      );
      for (let { model, api } of this.populatingReportFields) {
        const value = data[api];
        this.setMortgageLoanProperty(value, model);
      }
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex",
      mortgageLoan: "getEditingMortgageLoan",
      editingPropertyDetails: "getEditingPropertyDetails",
      editingMortgageLoanIndex: "getEditingMortgageLoanIndex",
      reportDetails: "getCreditReportDetails",
      borrower: "getBorrower"
    }),
    mortgageDetails() {
      let result = [];
      if (this.reportDetails) {
        const details = this.reportDetails.ApplicantDetails.find(
          item => item.BorrowerId === this.borrower.Id
        );
        result = details.Liabilities.filter(
          item =>
            item.AccountType === "Mortgage" && item.AccountStatus === "Open"
        );
      }
      return result;
    },
    mortgageLoansOptions() {
      let result = [];
      if (this.mortgageDetails.length) {
        result = this.mortgageDetails.map(
          item => `${item.CompanyName} - ${item.AccountNumber}`
        );
      }
      return result;
    }
  },
  components: {
    Button,
    CheckBox
  },
  created() {
    this.getCreditOrders(true);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";
@import "@/assets/styles/popup.scss";

.popup {
  width: 720px;
  &__row {
    justify-content: flex-start;
  }
}

.subtitle {
  padding: 20px 0 0 45px;
  &_bold {
    font-weight: 500;
  }
}

.check-row {
  font-weight: 500;
  font-size: 16px;
}

@media (min-width: 768px) {
  .text-block {
    margin-top: 0;
  }
}

@media (max-width: 760px) {
  .popup {
    &__col {
      padding-bottom: 0;
    }
  }
  .subtitle {
    padding-left: 15px;
  }
}
</style>
