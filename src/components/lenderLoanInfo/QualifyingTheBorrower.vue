<template>
  <v-row class="flex-wrap mt-3">
    <v-col
      cols="12"
      class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom"
    >
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L4. Qualifying the Borrower - Minimum Required Funds or Cash Back
      </p>
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">DUE FROM BORROWER(S)</span>
    </v-col>
    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-1">
        <b>A.</b> Sales Contract Price
      </span>
      <!-- <loan-tooltip id="l4-1"></loan-tooltip> -->

      <!--    <ToolTipLabel text="Sales Contract Price" id="l4-1" />-->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4"
        :value="getFormattedValue(transactionDetails.SalesContractAmount)"
        @input="
          e =>
            updateTransactionDetails({
              prop: 'SalesContractAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Sales Contract Price"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>
    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-2">
        <b>B.</b> Improvements, Renovations and Repairs
      </span>
      <!-- <loan-tooltip id="l4-2"></loan-tooltip> -->

      <!-- <ToolTipLabel text="Improvements, Renovations and Repairs" id="l4-1" />-->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4"
        :value="
          getFormattedValue(
            transactionDetails.AlterationsImprovementsAndRepairsAmount
          )
        "
        @input="
          e =>
            updateTransactionDetails({
              prop: 'AlterationsImprovementsAndRepairsAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Improvements, Renovations and Repairs"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>
    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-3">
        <b>C.</b> Land
        <i>(if acquired seperately)</i>
      </span>
      <!-- <loan-tooltip id="l4-3"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4"
        :value="getFormattedValue(transactionDetails.LandOriginalCostAmount)"
        @input="
          e =>
            updateTransactionDetails({
              prop: 'LandOriginalCostAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Land"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col
      cols="9"
      class="pa-1 d-flex loan-border-bottom loan-border-right"
      id="l4-4"
    >
      <span class="font-weight-bold align-self-center">D.&nbsp;</span>
      <span class="align-self-center">
        For Refinance: Balance of Mortgage Loans on the Property to be paid off
        in the Transaction
        <i>(See Table 3a. Property You Own)</i>
      </span>
      <!-- <loan-tooltip id="l4-4"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4"
        :value="
          getFormattedValue(
            transactionDetails.TotalSubjectPropertyPayoffsAndPaymentsAmount
          )
        "
        @input="
          e =>
            updateTransactionDetails({
              prop: 'TotalSubjectPropertyPayoffsAndPaymentsAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Balance of Mortgage Loans"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>

      <!--  <ToolTip id="l4-4" />-->
    </v-col>

    <v-col
      cols="9"
      class="pa-1 d-flex loan-border-bottom loan-border-right"
      id="l4-5"
    >
      <span class="align-self-center">
        <b>E.</b>
        Credit Cards and Other Debts Paid Off
        <i
          >(See Table 2c. Liabilities — Credit Cards, Other Debts, and Leases
          that You Owe)</i
        >
      </span>
      <!-- <loan-tooltip id="l4-5"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4"
        :value="
          getFormattedValue(
            transactionDetails.TotalNonSubjectPropertyDebtsToBePaidOffAmount
          )
        "
        @input="
          e =>
            updateTransactionDetails({
              prop: 'TotalNonSubjectPropertyDebtsToBePaidOffAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Credit Cards and Other Debts Paid Off"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
      <!--  <ToolTip id="l4-5" />-->
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right">
      <span class="align-self-center" id="l4-6">
        <b>F.</b>
        Borrower Closing Costs
        <i>(including Prepaid and Initial Escrow Payments)</i>
      </span>
      <!-- <loan-tooltip id="l4-6"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4"
        :value="
          getFormattedValue(transactionDetails.EstimatedClosingCostsAmount)
        "
        @input="
          e =>
            updateTransactionDetails({
              prop: 'EstimatedClosingCostsAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Borrower Closing Costs"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
      <!--         <ToolTip id="l4-6" />-->
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right">
      <span class="align-self-center" id="l4-7">
        <b>G.</b>
        Discount Points
      </span>
      <!-- <loan-tooltip id="l4-7"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4"
        :value="getFormattedValue(transactionDetails.DiscountPointsTotalAmount)"
        @input="
          e =>
            updateTransactionDetails({
              prop: 'DiscountPointsTotalAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Discount Points"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
      <!--         <ToolTipLabel text="Discount Points" id="l4-7" />-->
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right">
      <span class="align-self-center" id="l4-8___2">
        <b>H.</b> TOTAL DUE FROM BORROWER(s)
        <i>(Total of A thru G)</i>
      </span>
      <!-- <loan-tooltip id="l4-8" activator="#l4-8___2"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        dense
        class="ml-4 font-weight-bold"
        :value="getFormattedValue(totalDueFromBorrower) || ''"
        readonly
        placeholder="Total Due From Borrower"
        prefix="$"
        hide-details
      ></v-text-field>
      <!--          <ToolTip id="l4-8" />-->
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">TOTAL MORTGAGE LOANS</span>
    </v-col>
    <v-col
      cols="9"
      class="pa-1 loan-border-bottom loan-border-right d-flex flex-column"
    >
      <span> <b>I.</b> Loan Amount </span>
      <span class="ml-5 d-flex">
        <span class="align-self-center" id="l4-9-1">
          Loan Amount Excluding Financed Mortgage Insurance
          <i>(or Mortgage Insurance Equivalent)</i>
        </span>
        <!-- <loan-tooltip id="l4-9-1"></loan-tooltip> -->

        <v-text-field
          light
          dense
          class="pa-0 ma-0 ml-4 mr-4 align-self-bottom"
          style="width:150px"
          :value="getFormattedValue(transactionDetails.BaseLoanAmount)"
          @input="
            e =>
              updateTransactionDetails({
                prop: 'BaseLoanAmount',
                value: +e.replace(/,/g, '')
              })
          "
          placeholder="Loan Amount Excluding Financed Mortgage Insurance"
          prefix="$"
          hide-details
          @keypress="e => isOnlyNum(e, true)"
        ></v-text-field>
      </span>
      <span class="ml-5 d-flex">
        <span class="align-self-center" id="l4-9-2">
          Financed Mortgage Insurance
          <i>(or Mortgage Insurance Equivalent)</i> Amount $
        </span>
        <!-- <loan-tooltip id="l4-9-2"></loan-tooltip> -->

        <v-text-field
          light
          dense
          class="pa-0 ma-0 ml-4 mr-4 align-self-bottom"
          style="width:150px"
          :value="
            getFormattedValue(transactionDetails.MIAndFundingFeeFinancedAmount)
          "
          @input="
            e =>
              updateTransactionDetails({
                prop: 'MIAndFundingFeeFinancedAmount',
                value: +e.replace(/,/g, '')
              })
          "
          placeholder="Financed Mortgage Insurance"
          prefix="$"
          hide-details
          @keypress="e => isOnlyNum(e, true)"
        ></v-text-field>
      </span>
      <!--        <ToolTipLabel text="Loan Amount" id="l4-9" />
                  <ToolTip id="l4-9-1" />
                           <ToolTip id="l4-9-2" />
      -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        id="l4-9"
        dense
        class="ml-4 align-self-end"
        :value="getFormattedValue(totalLoanAmount) || ''"
        placeholder="Loan Amount"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
      <!-- <loan-tooltip id="l4-9"></loan-tooltip> -->
    </v-col>
    <v-col
      cols="9"
      class="pa-1 loan-border-bottom loan-border-right d-flex flex-column"
    >
      <span id="l4-10">
        <b>J.</b> Other New Mortgage Loans on the Property the Borrower(s) is
        Buying or Refinancing
        <br />
        <span class="ml-4 font-italic"
          >(See Table 4b. Other New Mortgage Loans on the Property You are
          Buying or Refinancing)</span
        >
      </span>
      <!-- <loan-tooltip id="l4-10"></loan-tooltip> -->

      <!--            <ToolTip id="l4-10" /> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end"
        :value="
          getFormattedValue(transactionDetails.TotalSubordinateFinancingAmount)
        "
        @input="
          e =>
            updateTransactionDetails({
              prop: 'TotalSubordinateFinancingAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Other New Mortgage Loans"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-11">
        <b>K.</b> TOTAL MORTGAGE LOANS
        <i>(Total of I and J)</i>
        <!--                <ToolTip id="l4-11" />
        -->
      </span>
      <!-- <loan-tooltip id="l4-11"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end font-weight-bold"
        :value="getFormattedValue(totalMortgageLoans) || ''"
        placeholder="Total Mortgage Loans"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">TOTAL CREDITS</span>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-12">
        <b>L.</b> Seller Credits
        <i
          >(Enter the amount of Borrower(s) costs paid by the property
          seller)</i
        >

        <!--                     <ToolTip id="l4-12" />
        -->
      </span>
      <!-- <loan-tooltip id="l4-12"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end"
        :value="
          getFormattedValue(transactionDetails.ULADURLATotalSellerCreditsAmount)
        "
        @input="
          e =>
            updateTransactionDetails({
              prop: 'ULADURLATotalSellerCreditsAmount',
              value: +e.replace(/,/g, '')
            })
        "
        placeholder="Seller Credits"
        prefix="$"
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center d-flex" id="l4-13">
        <b>M.&nbsp;</b>
        <span
          >Other Credits
          <i
            >(Enter the sum of all other credits — Borrower Paid Fees, Earnest
            Money, Employer Assisted Housing, Lease Purchase Fund, Lot Equity,
            Relocation Funds, Sweat Equity, Trade Equity, Other)</i
          >
        </span>
        <!--                                   <ToolTip id="l4-13" />
        -->
      </span>
      <!-- <loan-tooltip id="l4-13"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end"
        :value="getFormattedValue(otherCredits)"
        placeholder="Other Credits"
        prefix="$"
        readonly
        hide-details
        @keypress="e => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-14">
        <b>N.</b> TOTAL CREDITS
        <i>(Total of L and M)</i>
        <!--                      <ToolTip id="l4-14" />
        -->
      </span>
      <!-- <loan-tooltip id="l4-14"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end font-weight-bold"
        :value="getFormattedValue(totalCredits) || ''"
        placeholder="Total Mortgage Loans"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">CALCULATION</span>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-8">
        TOTAL DUE FROM BORROWER(s)
        <i>(Line H)</i>
        <!--                     <ToolTip id="l4-8" />
        -->
      </span>
      <!-- <loan-tooltip id="l4-8"></loan-tooltip> -->
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end font-weight-bold"
        :value="getFormattedValue(totalDueFromBorrower) || ''"
        placeholder="Total Due From Borrower(s)"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center">
        LESS TOTAL MORTGAGE LOANS
        <i>(Line K)</i> AND TOTAL CREDITS
        <i>(Line N)</i>
        <!--                     <ToolTip id="l4-8" />
        -->
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end font-weight-bold"
        :value="getFormattedValue(lessTotalMortgageLoans) || ''"
        placeholder="Less Total Mortgage Loans"
        prefix="- $"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="font-weight-bold align-self-center">
        Cash From/To the Borrower
        <i>(Line H minus Line K and Line N)</i>
        <br />
        NOTE: This amount does not include reserves or other funds that may be
        required by the Lender to be verified.
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        dense
        class="ml-4 align-self-end font-weight-bold"
        :value="getFormattedValue(cashFromToTheBorrower) || ''"
        placeholder="Cash From/To the Borrower"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [onlyNum, currencyFormat],
  props: {
    model: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(["updateTransactionDetails"]),
    getSum(arr) {
      return arr.filter(el => el != null).reduce((acc, cur) => acc + +cur, 0);
    }
  },
  computed: {
    ...mapGetters({
      transactionDetails: "getTransactionDetails",
      PurchaseCredits: "getPurchaseCredits",
      ClosingAdjustments: "getClosingAdjustments"
    }),
    totalDueFromBorrower() {
      const valuesForSum = [
        this.transactionDetails.SalesContractAmount,
        this.transactionDetails.AlterationsImprovementsAndRepairsAmount,
        this.transactionDetails.LandOriginalCostAmount,
        this.transactionDetails.TotalSubjectPropertyPayoffsAndPaymentsAmount,
        this.transactionDetails.TotalNonSubjectPropertyDebtsToBePaidOffAmount,
        this.transactionDetails.EstimatedClosingCostsAmount,
        this.transactionDetails.DiscountPointsTotalAmount
      ];
      return this.getSum(valuesForSum);
    },
    totalLoanAmount() {
      const valuesForSum = [
        this.transactionDetails.BaseLoanAmount,
        this.transactionDetails.MIAndFundingFeeFinancedAmount
      ];
      return this.getSum(valuesForSum);
    },
    totalMortgageLoans() {
      const valuesForSum = [
        this.transactionDetails.TotalSubordinateFinancingAmount,
        this.totalLoanAmount
      ];
      return this.getSum(valuesForSum);
    },
    otherCredits() {
      let result = this.PurchaseCredits.length
        ? this.PurchaseCredits.reduce(
            (a, c) => a + (c.PurchaseCreditAmount ? c.PurchaseCreditAmount : 0),
            0
          )
        : 0;
      result += this.ClosingAdjustments.length
        ? this.ClosingAdjustments.reduce(
            (a, c) => a + c.ClosingAdjustmentItemAmount,
            0
          )
        : 0;
      return result;
    },
    totalCredits() {
      if (this.transactionDetails.ULADURLATotalSellerCreditsAmount) {
        return (
          this.otherCredits +
          this.transactionDetails.ULADURLATotalSellerCreditsAmount
        );
      }
      return this.otherCredits;
    },
    lessTotalMortgageLoans() {
      return this.totalMortgageLoans + this.totalCredits;
    },
    cashFromToTheBorrower() {
      const result = this.totalDueFromBorrower - this.lessTotalMortgageLoans;
      return result ? +result.toFixed(2) : 0;
    }
  },
  watch: {
    cashFromToTheBorrower: function(value) {
      this.updateTransactionDetails({
        prop: "CashFromBorrowerAtClosingAmount",
        value
      });
    }
  }
};
</script>
