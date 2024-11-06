<template>
  <v-row class="flex-wrap mt-3">
    <v-col
      cols="12"
      class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom"
    >
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L3. Mortgage Loan Information
      </p>
    </v-col>
    <v-col cols="6" class="pa-1 loan-border-bottom loan-border-right">
      <b>Mortgage Type Applied For</b>
      <div class="pa-0 ma-0 mx-0 d-flex flex-wrap">
        <div
          class="d-flex"
          v-for="(status, index) in mortgageTypes"
          :key="status.value"
          :style="{ width: index == 1 ? '70%' : '' }"
        >
          <span :id="'l3-1___' + index">
            <VuetifyRadio
              class="pb-1 mx-1"
              iconGeneralClass="v-icon v-icon--dense"
              labelClass="theme--light v-label"
              :key="index"
              :label="status.text"
              :isOn="status.value === mortgageLoanInformation.MortgageType"
              @toggleRadio="
                updateMortgageLoanRadioOption({
                  prop: 'MortgageType',
                  value: status.value
                })
              "
            />
          </span>
          <!-- <loan-tooltip id="l3-1" :activator="'#l3-1___'+index"></loan-tooltip> -->

          <v-text-field
            light
            dense
            class="my-0 ml-4"
            placeholder="Other Mortgage Type"
            hide-details
            v-if="status.value == 'Other'"
          ></v-text-field>
          <!--       :value="mortgageLoanInformation.MortgageType"-->
        </div>
      </div>
    </v-col>
    <v-col cols="6" class="pa-1 loan-border-bottom">
      <v-row class="pa-0 ma-0">
        <v-col cols="7" class="pa-0 d-flex flex-column">
          <b>Terms of Loan</b>
          <div class="d-flex">
            <span class="align-self-center" id="l3-2">Note Rate</span>
            <!-- <loan-tooltip id="l3-2"></loan-tooltip> -->
            <v-text-field
              light
              dense
              class="my-0 ml-4"
              :value="mortgageLoanInformation.NoteRatePercent"
              @input="
                e =>
                  updateMortgageLoanInfo({ prop: 'NoteRatePercent', value: +e })
              "
              placeholder="Note Rate"
              hide-details
              style="max-width:120px"
              type="number"
            ></v-text-field>
            <span class="align-self-center">%</span>
          </div>
          <div class="d-flex">
            <span class="align-self-center" id="l3-3">Loan Term</span>
            <!-- <loan-tooltip id="l3-3"></loan-tooltip> -->
            <v-text-field
              light
              dense
              class="my-0 ml-4"
              :value="mortgageLoanInformation.LoanAmortizationPeriodCount"
              @input="
                e =>
                  updateMortgageLoanInfo({
                    prop: 'LoanAmortizationPeriodCount',
                    value: +e
                  })
              "
              placeholder="Loan Term"
              hide-details
              style="max-width:120px"
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">(months)</span>
          </div>
        </v-col>
        <v-col cols="5" class="pa-0">
          <b>Mortgage Lien Type</b>
          <div class="pa-0 ma-0 mx-0 d-flex flex-wrap">
            <span id="l3-4___0">
              <VuetifyRadio
                class="pb-1 mx-1"
                iconGeneralClass="v-icon v-icon--dense"
                labelClass="theme--light v-label"
                label="First Lien"
                :isOn="mortgageLoanInformation.LienPriorityType === 'FirstLien'"
                @toggleRadio="
                  updateMortgageLoanRadioOption({
                    prop: 'LienPriorityType',
                    value: 'FirstLien'
                  })
                "
              />
            </span>
            <!-- <loan-tooltip id="l3-4" :activator="'#l3-4___0'"></loan-tooltip> -->
            <span id="l3-4___1">
              <VuetifyRadio
                class="pb-1 mx-1"
                iconGeneralClass="v-icon v-icon--dense"
                labelClass="theme--light v-label"
                label="Subordinate Lien"
                :isOn="
                  mortgageLoanInformation.LienPriorityType === 'SecondLien'
                "
                @toggleRadio="
                  updateMortgageLoanRadioOption({
                    prop: 'LienPriorityType',
                    value: 'SecondLien'
                  })
                "
              />
            </span>
            <!-- <loan-tooltip id="l3-4" :activator="'#l3-4___1'"></loan-tooltip> -->
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col
      cols="6"
      class="pa-1 loan-border-bottom loan-border-right d-flex flex-column"
    >
      <b>Amortization type</b>
      <div class="pa-0 ma-0 mx-0 d-flex flex-wrap">
        <v-row class="pa-0 ma-0">
          <v-col cols="6" class="pa-0">
            <v-select
              class="mx-1 my-0 pt-1"
              light
              dense
              :items="amortizationTypes"
              item-text="text"
              item-value="value"
              placeholder="Amortization type"
              :value="mortgageLoanInformation.AmortizationType"
              @change="
                value =>
                  updateMortgageLoanRadioOption({
                    prop: 'AmortizationType',
                    value
                  })
              "
              :menu-props="{ light: true }"
              style="max-width:300px; max-height:33px"
            >
            </v-select>

            <!-- <loan-tooltip id="l3-5" :activator="'#l3-5___0'"></loan-tooltip> -->

            <!-- <loan-tooltip id="l3-5" :activator="'#l3-5___1'"></loan-tooltip> -->

            <!-- <loan-tooltip id="l3-5" :activator="'#l3-5___2'"></loan-tooltip> -->
          </v-col>
          <v-col
            cols="6"
            class="pa-0"
            v-if="mortgageLoanInformation.AmortizationType === 'Other'"
          >
            <v-text-field
              light
              dense
              class="mx-1 my-0 pt-1"
              :value="mortgageLoanInformation.AmortizationTypeOtherDescription"
              @input="
                e =>
                  updateMortgageLoanInfo({
                    prop: 'AmortizationTypeOtherDescription',
                    value: e
                  })
              "
              placeholder="Other Explanation"
              hide-details
            >
            </v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="ml-10">
        <span class="font-weight-bold">If Adjustable Rate:</span>
        <div class="d-flex">
          <span class="align-self-center" id="l3-6"
            >Initial Period Prior to First Adjustment</span
          >
          <!-- <loan-tooltip id="l3-6"></loan-tooltip> -->
          <v-text-field
            light
            dense
            class="my-0 ml-4"
            :value="
              mortgageLoanInformation.InitialFixedPeriodEffectiveMonthsCount
            "
            @input="
              e =>
                updateMortgageLoanInfo({
                  prop: 'InitialFixedPeriodEffectiveMonthsCount',
                  value: +e
                })
            "
            placeholder="Initial Period"
            hide-details
            type="number"
            style="max-width:100px"
          ></v-text-field>
          <span class="font-italic align-self-center">(months)</span>
        </div>
        <div class="d-flex">
          <span class="align-self-center" id="l3-7"
            >Subsequent Adjustment Period</span
          >
          <!-- <loan-tooltip id="l3-7"></loan-tooltip> -->
          <v-text-field
            light
            dense
            class="my-0 ml-4"
            :value="
              mortgageLoanInformation.PerChangeRateAdjustmentFrequencyMonthsCount
            "
            @input="
              e =>
                updateMortgageLoanInfo({
                  prop: 'PerChangeRateAdjustmentFrequencyMonthsCount',
                  value: +e
                })
            "
            placeholder="Initial Period"
            hide-details
            type="number"
            style="max-width:100px"
          ></v-text-field>
          <span class="font-italic align-self-center">(months)</span>
        </div>
      </div>
      <span>Loan Features</span>

      <div class="d-flex">
        <span id="l3-8">
          <v-checkbox
            light
            label="Balloon / Balloon Term"
            :value="mortgageLoanInformation.BalloonIndicator"
            @change="updateMortgageLoanInfoBoolean('BalloonIndicator')"
            class="ma-0 pa-0"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <!-- <loan-tooltip id="l3-8"></loan-tooltip> -->

        <v-text-field
          light
          dense
          class="my-0 ml-4"
          :value="mortgageLoanInformation.BalloonLoanMaturityPeriodCount"
          @input="
            e =>
              updateMortgageLoanInfo({
                prop: 'BalloonLoanMaturityPeriodCount',
                value: +e
              })
          "
          placeholder="Balloon Term"
          hide-details
          type="number"
          style="max-width:100px"
        ></v-text-field>
        <span class="font-italic align-self-center">(months)</span>
      </div>

      <div class="d-flex">
        <span id="l3-9">
          <v-checkbox
            light
            label="Interest Only / Interest Only Term"
            :value="mortgageLoanInformation.InterestOnlyIndicator"
            @change="updateMortgageLoanInfoBoolean('InterestOnlyIndicator')"
            class="ma-0 pa-0"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <!-- <loan-tooltip id="l3-9"></loan-tooltip> -->
        <v-text-field
          light
          dense
          class="my-0 ml-4"
          :value="mortgageLoanInformation.InterestOnlyTermMonthsCount"
          @input="
            e =>
              updateMortgageLoanInfo({
                prop: 'InterestOnlyTermMonthsCount',
                value: +e
              })
          "
          placeholder="Interest Only Term"
          hide-details
          type="number"
          style="max-width:100px"
        ></v-text-field>
        <span class="font-italic align-self-center">(months)</span>
      </div>
      <span id="l3-10">
        <v-checkbox
          light
          label="Negative Amortization"
          :value="mortgageLoanInformation.NegativeAmortizationIndicator"
          @change="
            updateMortgageLoanInfoBoolean('NegativeAmortizationIndicator')
          "
          class="ma-0 pa-0"
          dense
          hide-details
        ></v-checkbox>
      </span>
      <!-- <loan-tooltip id="l3-10"></loan-tooltip> -->

      <div class="d-flex">
        <span id="l3-11">
          <v-checkbox
            light
            label="Prepayment Penalty / Prepayment Penalty Term"
            :value="mortgageLoanInformation.PrepaymentPenaltyIndicator"
            @change="
              updateMortgageLoanInfoBoolean('PrepaymentPenaltyIndicator')
            "
            class="ma-0 pa-0"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <!-- <loan-tooltip id="l3-11"></loan-tooltip> -->

        <v-text-field
          light
          dense
          class="my-0 ml-4"
          :value="
            mortgageLoanInformation.PrepaymentPenaltyExpirationMonthsCount
          "
          @input="
            e =>
              updateMortgageLoanInfo({
                prop: 'PrepaymentPenaltyExpirationMonthsCount',
                value: +e
              })
          "
          placeholder="Prepayment Penalty Term"
          hide-details
          type="number"
          style="max-width:100px"
        ></v-text-field>
        <span class="font-italic align-self-center">(months)</span>
      </div>

      <div class="d-flex">
        <span id="l3-12">
          <v-checkbox
            light
            label="Temporary Interest Rate Buydown / Initial Buydown Rate"
            :value="
              mortgageLoanInformation.BuydownTemporarySubsidyFundingIndicator
            "
            @change="
              updateMortgageLoanInfoBoolean(
                'BuydownTemporarySubsidyFundingIndicator'
              )
            "
            class="ma-0 pa-0"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <!-- <loan-tooltip id="l3-12"></loan-tooltip> -->

        <v-text-field
          light
          dense
          class="my-0 ml-4"
          :value="
            mortgageLoanInformation.BuydownInitialEffectiveInterestRatePercent
          "
          @input="
            e =>
              updateMortgageLoanInfo({
                prop: 'BuydownInitialEffectiveInterestRatePercent',
                value: +e
              })
          "
          placeholder="Initial Buydown Rate"
          hide-details
          type="number"
          style="max-width:100px"
        ></v-text-field>
        <span class="font-italic align-self-center">%</span>
      </div>

      <div class="d-flex">
        <span id="l3-13">
          <v-checkbox
            light
            label="Other (explain):"
            class="ma-0 pa-0"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <!-- <loan-tooltip id="l3-13"></loan-tooltip> -->

        <v-text-field
          light
          dense
          class="my-0 ml-4 mr-6"
          :value="mortgageLoanInformation.ProductDescription"
          @input="
            e =>
              updateMortgageLoanInfo({ prop: 'ProductDescription', value: e })
          "
          placeholder="Other"
          hide-details
        ></v-text-field>
      </div>
    </v-col>

    <v-col cols="6" class="pa-1 loan-border-bottom d-flex flex-column">
      <span class="mb-2 font-weight-bold"
        >Proposed Monthly Payment for Property</span
      >

      <v-row
        class="ma-0 pa-0"
        v-for="(item, index) in housingExpenseTypes"
        :key="item.value"
      >
        <v-col class="ma-0 pa-0 d-flex" cols="7">
          <span class="align-self-center" :id="'l3-14-' + (index + 1)">{{
            item.text
          }}</span>
          <!-- <loan-tooltip :id="'l3-14-'+(index+1)"></loan-tooltip> -->
        </v-col>
        <v-col class="ma-0 pa-0" cols="5">
          <v-text-field
            light
            dense
            class="ml-4"
            :value="housingExpenseValue(item.value)"
            @input="e => updateHousingExpense(index, +e.replace(/,/g, ''))"
            :placeholder="item.text"
            prefix="$"
            hide-details
            @keypress="e => isOnlyNum(e, true)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ma-0 pa-0">
        <v-col class="pa-0 d-flex" cols="7">
          <span class="font-weight-bold align-self-center" id="l3-14"
            >TOTAL</span
          >
          <!-- <loan-tooltip id="l3-14"></loan-tooltip> -->
        </v-col>
        <v-col class="pa-0" cols="5">
          <v-text-field
            light
            dense
            class="ml-4 font-weight-bold"
            :value="getFormattedValue(totalExpenses) || ''"
            placeholder="total"
            prefix="$"
            readonly
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import VuetifyRadio from "@/components/form/VuetifyRadio";

export default {
  mixins: [onlyNum, currencyFormat, debtToIncomeAndhousingRatios],
  data() {
    return {
      mortgageTypes: [
        {
          text: "Conventional",
          value: "Conventional"
        },
        {
          text: "FHA",
          value: "FHA"
        },
        {
          text: "USDA Rural Development",
          value: "USDARuralDevelopment"
        },
        {
          text: "VA",
          value: "VA"
        },
        {
          text: "Other",
          value: "Other"
        }
      ],
      amortizationTypes: [
        {
          text: "Adjustable Rate",
          value: "AdjustableRate"
        },
        {
          text: "Fixed",
          value: "Fixed"
        },
        {
          text: "GEM",
          value: "GEM"
        },
        {
          text: "GPM",
          value: "GPM"
        },
        {
          text: "Other",
          value: "Other"
        }
      ],
      housingExpenseTypes: [
        {
          text: "First Mortgage Principal And Interest",
          value: "FirstMortgagePrincipalAndInterest"
        },
        {
          text: "Homeowners Association Dues And Condominium Fees",
          value: "HomeownersAssociationDuesAndCondominiumFees"
        },
        {
          text: "Homeowners Insurance",
          value: "HomeownersInsurance"
        },
        {
          text: "M I Premium",
          value: "MIPremium"
        },
        {
          text: "Other",
          value: "Other"
        },
        {
          text: "Other Mortgage Loan Principal And Interest",
          value: "OtherMortgageLoanPrincipalAndInterest"
        },
        {
          text: "Real Estate Tax",
          value: "RealEstateTax"
        },
        {
          text: "Rent",
          value: "Rent"
        },
        {
          text: "Supplemental Property Insurance",
          value: "SupplementalPropertyInsurance"
        }
      ]
    };
  },
  methods: {
    ...mapActions([
      "updateMortgageLoanInfoBoolean",
      "updateMortgageLoanInfo",
      "updateMortgageLoanRadioOption",
      "setCurrentLoan"
    ]),
    housingExpenseValue(type) {
      const expense = this.housingExpenses.find(
        item => item && item.HousingExpenseType === type
      );
      return expense
        ? this.getFormattedValue(expense.HousingExpensePaymentAmount)
        : "";
    },
    updateHousingExpense(index, value) {
      const type = this.housingExpenseTypes[index].value;
      let HousingExpenses = [...this.housingExpenses];
      const expenseIndex = HousingExpenses.findIndex(
        item => item.HousingExpenseType === type
      );
      if (expenseIndex !== -1) {
        HousingExpenses = !value
          ? HousingExpenses.filter((item, i) => expenseIndex !== i)
          : (HousingExpenses = HousingExpenses.map((item, i) =>
              expenseIndex !== i
                ? item
                : { ...item, HousingExpensePaymentAmount: value }
            ));
      } else {
        HousingExpenses.push({
          HousingExpenseTimingType: "Proposed",
          HousingExpenseType: type,
          HousingExpensePaymentAmount: value
        });
      }
      this.updateMortgageLoanInfo({
        prop: "HousingExpenses",
        value: HousingExpenses
      });
    }
  },
  computed: {
    ...mapGetters({
      mortgageLoanInformation: "getMortgageLoanInformation",
      housingExpenses: "getHousingExpenses",
      currentLoan: "getCurrentLoan",
      borrowers: "getBorrowers"
    }),
    totalExpenses() {
      if (this.housingExpenses.length) {
        const result = this.housingExpenses.reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.HousingExpensePaymentAmount)
              ? +cur.HousingExpensePaymentAmount
              : 0),
          0
        );
        return result ? +result.toFixed(2) : 0;
      }
      return "";
    }
  },
  watch: {
    "mortgageLoanInformation.LoanAmortizationPeriodCount": function(val) {
      if (val) {
        this.updateMortgageLoanInfo({
          prop: "LoanAmortizationPeriodType",
          value: "Month"
        });
      } else {
        this.updateMortgageLoanInfo({
          prop: "LoanAmortizationPeriodType",
          value: ""
        });
      }
    },
    housingExpenses: function() {
      this.setDebtToIncomeAndHousingRatios();
    }
  },
  components: {
    VuetifyRadio
  }
};
</script>
