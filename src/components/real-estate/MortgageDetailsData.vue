<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="loans.length">
      <v-row
        class="form-container deleteAbleItem"
        v-for="(mortgageLoan, loanIndex) in loans"
        :key="loanIndex"
      >
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense="dense" icon="icon" @click="remove(loanIndex)">
            <v-icon small="small">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <Input
          inputTitle="Mortgage Loans"
          :items="mortgageLoansOptions"
          defaultComponent="v-select"
          @change="e => populateLoanData(e, loanIndex)"
          :menu-props="{ bottom: true, offsetY: true }"
        />
        <Input
          defaultComponent="v-combobox"
          attach="attach"
          :menu-props="{ light: true }"
          :value="mortgageLoan.MortgageLoanType"
          :items="loanTypes"
          @change="
            e => setMortgageLoanProperty(e, loanIndex, 'MortgageLoanType')
          "
          inputTitle="Loan Type"
        />
        <Input
          defaultComponent="v-combobox"
          attach="attach"
          :menu-props="{ light: true }"
          :value="mortgageLoan.OwnershipType"
          :items="ownershipTypes"
          @change="e => setMortgageLoanProperty(e, loanIndex, 'OwnershipType')"
          inputTitle="Ownership Type"
        />
        <Input
          inputTitle="Credtior Name"
          :value="mortgageLoan.FullName"
          @input="e => setMortgageLoanProperty(e, 'FullName')"
        />
        <Input
          inputTitle="Account Number"
          :value="mortgageLoan.LiabilityAccountIdentifier"
          @input="
            e =>
              setMortgageLoanProperty(
                e,
                loanIndex,
                'LiabilityAccountIdentifier'
              )
          "
        />
        <Input
          inputTitle="Monthly Payment"
          :value="getFormattedValue(mortgageLoan.LiabilityMonthlyPaymentAmount)"
          prefix="$"
          @input="
            e =>
              setMortgageLoanProperty(
                +e.replace(/,/g, ''),
                loanIndex,
                'LiabilityMonthlyPaymentAmount'
              )
          "
          @keypress="e => isOnlyNum(e, true)"
        />
        <Input
          inputTitle="Unpaid Balance"
          :value="getFormattedValue(mortgageLoan.LiabilityUnpaidBalanceAmount)"
          prefix="$"
          @input="
            e =>
              setMortgageLoanProperty(
                +e.replace(/,/g, ''),
                loanIndex,
                'LiabilityUnpaidBalanceAmount'
              )
          "
          @keypress="e => isOnlyNum(e, true)"
        />
        <Input
          :prefix="mortgageLoan.LiabilityCreditLimit !== 'N/A' ? '$' : ''"
          inputTitle="Credit Limit"
          :value="getFormattedValue(mortgageLoan.LiabilityCreditLimit)"
          @input="
            e =>
              setMortgageLoanProperty(
                +e.replace(/,/g, ''),
                loanIndex,
                'LiabilityCreditLimit'
              )
          "
          @keypress="e => isOnlyNum(e, true)"
        />
        <v-col
          class="itemContainer"
          sm="6"
          cols="12"
          :adsfsdf="mortgageLoan.LiabilityPayoffStatusIndicator"
        >
          <v-checkbox
            class="defaultCheckbox mt-0 pt-2"
            :input-value="mortgageLoan.LiabilityPayoffStatusIndicator"
            hide-details="hide-details"
            :true-value="true"
            :false-value="false"
            @change="
              value =>
                setMortgageLoanProperty(
                  value,
                  loanIndex,
                  'LiabilityPayoffStatusIndicator'
                )
            "
          >
            <template v-slot:label>
              <div class="inputTitle">Payoff Prior to Closing</div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col class="itemContainer" sm="6" cols="12">
          <v-checkbox
            class="mt-0 pt-2 defaultCheckbox"
            :input-value="
              mortgageLoan.LiabilityPaymentIncludesTaxesInsuranceIndicator
                ? true
                : null
            "
            hide-details="hide-details"
            :true-value="true"
            :false-value="false"
            @change="
              value =>
                setMortgageLoanProperty(
                  value,
                  loanIndex,
                  'LiabilityPaymentIncludesTaxesInsuranceIndicator'
                )
            "
          >
            <template v-slot:label>
              <div class="inputTitle">Payment Includes Taxes and Insurance</div>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </div>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional = null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input
        defaultComponent="v-combobox"
        attach="attach"
        :menu-props="{ light: true }"
        :items="loanTypes"
        @change="e => addMortgageDetail(e)"
        inputTitle="Loan Type"
      />
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addAdditional"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add Additional Mortgage</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
  </v-form>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

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
      ],
      additional: false
    };
  },
  methods: {
    ...mapActions([
      "getCreditOrders",
      "toggleIsOnlay",
      "setMortgageLoan",
      "setRealEstate"
    ]),
    remove(index) {
      const filtered = this.loans.filter((item, i) => i !== index);
      const updatedRealEstate = {
        ...this.currentRealEstate,
        MortgageLoans: filtered
      };
      const realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = updatedRealEstate;
      this.setRealEstate(realEstates);
    },
    addAdditional() {
      this.additional = true;
    },
    addMortgageDetail(e) {
      const updatedRealEstate = {
        ...this.currentRealEstate,
        MortgageLoans: [...this.loans, { MortgageLoanType: e }]
      };
      const realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = updatedRealEstate;
      this.setRealEstate(realEstates);
      this.additional = null;
    },
    setMortgageLoanProperty(value, index, prop) {
      this.setMortgageLoan({
        prop,
        loanIndex: index,
        value
      });
      if (
        this.mortgageLoan.LiabilityPaymentIncludesTaxesInsuranceIndicator ==
        undefined
      ) {
        this.setMortgageLoan({
          prop: "LiabilityPaymentIncludesTaxesInsuranceIndicator",
          loanIndex: index,
          value: false
        });
      }
      if (!this.mortgageLoan.LiabilityType) {
        this.setMortgageLoan({
          prop: "LiabilityType",
          loanIndex: index,
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
    populateLoanData(value, index) {
      const [CompanyName, AccountNumber] = value.split(" - ");
      const data = this.mortgageDetails.find(
        item =>
          item.CompanyName === CompanyName &&
          item.AccountNumber === AccountNumber
      );
      for (let { model, api } of this.populatingReportFields) {
        const value = data[api];
        this.setMortgageLoanProperty(value, index, model);
      }
    }
  },
  mounted() {
    if (this.$route.query.newMortgage === "1" && this.loans.length === 0) {
      this.additional = true;
    }
    if (this.borrowersState.realEstateOwnedMortgage) {
      this.addAdditional();
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
      borrower: "getBorrower",
      borrowersState: "getBorrowersState"
    }),
    total() {
      return this.loans.length
        ? this.loans.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.LiabilityMonthlyPaymentAmount)
                ? +cur.LiabilityMonthlyPaymentAmount
                : 0),
            0
          )
        : 0;
    },
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
    },
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    },
    loans() {
      return this.currentRealEstate.MortgageLoans || [];
    }
  },
  created() {
    this.getCreditOrders(true);
  }
};
</script>
