<template lang="pug">
    v-card.pb-1(light)
        v-card-title Mortgage Details
        v-card-text
            v-row.ma-0.pa-0.d-flex.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Product Name
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="mortgageLoanInformation.ProductName || ''" 
                        @input="(e) => updateMortgageLoanInfo({prop: 'ProductName', value: e})"
                        placeholder="Product Name" 
                        style="max-width:300px" 
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Loan Amortization Period
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="loanAmortizationPeriods" 
                        placeholder="Loan Amortization Period" 
                        :value="mortgageLoanInformation.LoanAmortizationPeriodType"
                        @change="(value) => updateMortgageLoanInfo({prop: 'LoanAmortizationPeriodType', value})"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Negative Amortization Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="negativeAmortizationTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Negative Amortization Type" 
                        :value="mortgageLoanInformation.NegativeAmortizationType"
                        @change="(value) => updateMortgageLoanInfo({prop: 'NegativeAmortizationType', value})"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Disclosed Index Rate Percent
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.DisclosedIndexRatePercent || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'DisclosedIndexRatePercent', value: +e})"
                        placeholder="Disclosed Index Rate Percent" 
                        style="max-width:300px" 
                        prefix="%"
                        :rules="[rules.decimals]"
                        type="number"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Index Source Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="indexSourceTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Index Source Type" 
                        :value="additionalInfo.IndexSourceType"
                        @change="(value) => updateAdditionalInfo({prop: 'IndexSourceType', value})"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Index Source Type Other Description
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="indexSourceTypeOthers" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Index Source Type Other Description" 
                        :value="additionalInfo.IndexSourceTypeOtherDescription"
                        @change="(value) => updateAdditionalInfo({prop: 'IndexSourceTypeOtherDescription', value})"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Margin Rate Percent
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.MarginRatePercent || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'MarginRatePercent', value: +e})"
                        placeholder="Margin Rate Percent" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="%"
                        :rules="[rules.decimals]"
                        type="number"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Qualifying Rate Percent
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.QualifyingRatePercent || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'QualifyingRatePercent', value: +e})"
                        placeholder="Qualifying Rate Percent" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="%"
                        :rules="[rules.decimals]"
                        type="number"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Government Mortgage Credit Certificate Amount
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="getFormattedValue(additionalInfo.GovernmentMortgageCreditCertificateAmount) || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'GovernmentMortgageCreditCertificateAmount', value: +e.replace(/,/g, '')})"
                        placeholder="Government Mortgage Credit Certificate Amount" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="$"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Section Of Act Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="sectionOfActTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Section Of Act Type" 
                        :value="additionalInfo.SectionOfActType"
                        @change="(value) => updateAdditionalInfo({prop: 'SectionOfActType', value})"
                        style="max-width:300px; max-height:33px"
                        )               
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Community Seconds Repayment Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="communitySecondsRepaymentTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Community Seconds Repayment Type" 
                        :value="additionalInfo.CommunitySecondsRepaymentType"
                        @change="(value) => updateAdditionalInfo({prop: 'CommunitySecondsRepaymentType', value})"
                        style="max-width:300px; max-height:33px"
                        )             
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center HUD Income Limit Adjustment Percent
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.HUDIncomeLimitAdjustmentPercent || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'HUDIncomeLimitAdjustmentPercent', value: +e})"
                        placeholder="HUD Income Limit Adjustment Percent" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="%"
                        :rules="[rules.decimals]"
                        type="number"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Ceiling Rate Percent
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.CeilingRatePercent || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'CeilingRatePercent', value: +e})"
                        placeholder="Ceiling Rate Percent" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="%"
                        :rules="[rules.decimals]"
                        type="number"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center MI Coverage Percent
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.MICoveragePercent || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'MICoveragePercent', value: +e})"
                        placeholder="MI Coverage Percent" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="%"
                        :rules="[rules.decimals]"
                        type="number"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center HMDA Rate Spread Percen
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.HMDARateSpreadPercent || ''" 
                        @input="(e) => updateAdditionalInfo({prop: 'HMDARateSpreadPercent', value: +e})"
                        placeholder="HMDA Rate Spread Percen" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="%"
                        :rules="[rules.decimals]"
                        type="number"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center HMDA HOEPA Loan Status Indicator
                v-col.pa-1(lg="10" cols="6")
                    v-checkbox(
                        label=""
                        :input-value="additionalInfo.HMDAHOEPALoanStatusIndicator"
                        @change="(value) => updateAdditionalInfo({prop: 'HMDAHOEPALoanStatusIndicator', value})"
                        class="ma-0 pa-0"
                        dense
                        hide-details
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Investor Product Plan Identifier
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="investorProductPlanIdentifiers" 
                        placeholder="Investor Product Plan Identifier" 
                        :value="additionalInfo.InvestorProductPlanIdentifier"
                        @change="(value) => updateAdditionalInfo({prop: 'InvestorProductPlanIdentifier', value})"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Community Lending Product Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="communityLendingProductTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Community Lending Product Type" 
                        :value="additionalInfo.CommunityLendingProductType"
                        @change="(value) => updateAdditionalInfo({prop: 'CommunityLendingProductType', value})"
                        style="max-width:300px; max-height:33px"
                        ) 
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import Button from "@/components/buttons/Button";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      rules: {
        decimals: value => {
          if (!value) return "";
          return this.regex.test(value) || "Invalid value.";
        }
      },
      regex: /^([1-9][\d]{0,2}|0)(\.\d{1,4})?$/,
      negativeAmortizationTypes: [
        {
          text: "Potential Negative Amortization",
          value: "PotentialNegativeAmortization"
        },
        {
          text: "Scheduled Negative Amortization",
          value: "ScheduledNegativeAmortization"
        }
      ],
      indexSourceTypes: [
        {
          text: "Other",
          value: "Other"
        }
      ],
      indexSourceTypeOthers: [
        {
          text: "11th District COF",
          value: "11thDistrictCOF"
        },
        {
          text: "Daily CD Rate",
          value: "DailyCDRate"
        },
        {
          text: "Fannie Mae 60 Day Required Net Yield",
          value: "FannieMae60DayRequiredNetYield"
        },
        {
          text: "Fannie Mae LIBOR",
          value: "FannieMaeLIBOR"
        },
        {
          text: "Federal Cost Of Funds",
          value: "FederalCostOfFunds"
        },
        {
          text: "Freddie Mac 60 Day Required Net Yield",
          value: "FreddieMac60DayRequiredNetYield"
        },
        {
          text: "Freddie Mac LIBOR",
          value: "FreddieMacLIBOR"
        },
        {
          text: "Monthly Average CMT",
          value: "MonthlyAverageCMT"
        },
        {
          text: "National Average Contract Rate",
          value: "NationalAverageContractRate"
        },
        {
          text: "National Monthly Median Cost Of Funds",
          value: "NationalMonthlyMedianCostOfFunds"
        },
        {
          text: "TBill Daily Value",
          value: "TBillDailyValue"
        },
        {
          text: "Wall Street Journal LIBOR",
          value: "WallStreetJournalLIBOR"
        },
        {
          text: "Weekly Ave Prime Rate",
          value: "WeeklyAvePrimeRate"
        },
        {
          text: "Weekly Average CD Rate",
          value: "WeeklyAverageCDRate"
        },
        {
          text: "Weekly Average CMT",
          value: "WeeklyAverageCMT"
        },
        {
          text: "Weekly Average SMTI",
          value: "WeeklyAverageSMTI"
        },
        {
          text: "Weekly Average TAABD",
          value: "WeeklyAverageTAABD"
        },
        {
          text: "Weekly Average TAAI",
          value: "WeeklyAverageTAAI"
        }
      ],
      sectionOfActTypes: [
        {
          text: "203B",
          value: "203B"
        },
        {
          text: "203B251",
          value: "203B251"
        },
        {
          text: "203K",
          value: "203K"
        },
        {
          text: "203K251",
          value: "203K251"
        },
        {
          text: "234C",
          value: "234C"
        },
        {
          text: "234C251",
          value: "234C251"
        }
      ],
      communitySecondsRepaymentTypes: [
        {
          text: "Deferred Fully Forgiven",
          value: "DeferredFullyForgiven"
        },
        {
          text: "Deferred Not Fully Forgiven",
          value: "DeferredNotFullyForgiven"
        },
        {
          text: "Non Deferred",
          value: "NonDeferred"
        }
      ],
      loanAmortizationPeriods: [
        "Month"
      ],
      investorProductPlanIdentifiers: [
        "57",
        "251",
        "649",
        "650",
        "651",
        "652",
        "660",
        "661",
        "681",
        "682",
        "710",
        "720",
        "721",
        "750",
        "751",
        "760",
        "761",
        "861",
        "1030",
        "1423",
        "1437",
        "3252",
        "3846",
        "FHAHY",
        "GEN06",
        "GEN10",
        "GEN1A",
        "GEN1B",
        "GEN3",
        "GEN5",
        "GEN7",
        "VAARM",
        "VA1YR"
      ],
      communityLendingProductTypes: [
        {
          text: "HFA Preferred",
          value: "HFAPreferred"
        },
        {
          text: "HFA Preferred Risk Sharing",
          value: "HFAPreferredRiskSharing"
        },
        {
          text: "Home Ready",
          value: "HomeReady"
        }
      ]
    };
  },
  methods: {
    ...mapActions([
      "updateAdditionalInfo",
      "updateMortgageLoanInfo",
      "saveLoanPatches"
    ])
  },
  computed: {
    ...mapGetters({
      mortgageLoanInformation: "getMortgageLoanInformation",
      additionalInfo: "getAdditionalLoanInformation"
    })
  },
  components: {
    Button
  }
};
</script>
