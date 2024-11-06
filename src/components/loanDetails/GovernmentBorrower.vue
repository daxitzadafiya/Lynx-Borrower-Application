<template lang="pug">
    v-card(light)
        v-card-title Government Borrower Details
        v-card-text
            v-row.ma-0.pa-0.d-flex.flex-wrap
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center VA Federal Tax Amount
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="governmentBorrower.VAFederalTaxAmount" 
                        @input="(e) => updateGovernmentBorrower({prop: 'VAFederalTaxAmount', value: +e})"
                        placeholder="VA Federal Tax Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center VA State Tax Amount                
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="governmentBorrower.VAStateTaxAmount" 
                        @input="(e) => updateGovernmentBorrower({prop: 'VAStateTaxAmount', value: +e})"
                        placeholder="VA State Tax Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center VA Local Tax Amount                
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="governmentBorrower.VALocalTaxAmount" 
                        @input="(e) => updateGovernmentBorrower({prop: 'VALocalTaxAmount', value: +e})"
                        placeholder="VA Local Tax Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$"
                        )                
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center VA Social Security Tax Amount                
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="governmentBorrower.VASocialSecurityTaxAmount"
                        @input="(e) => updateGovernmentBorrower({prop: 'VASocialSecurityTaxAmount', value: +e})"
                        placeholder="VA Social Security Tax Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$"
                        )                
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.mr-6.font-weight-medium.align-self-center VA Co-Borrower Non Taxable Income Amount                
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="governmentBorrower.VACoBorrowerNonTaxableIncomeAmount"
                        @input="(e) => updateGovernmentBorrower({prop: 'VACoBorrowerNonTaxableIncomeAmount', value: +e})"
                        placeholder="VA Co-Borrower Non Taxable Income Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$")                
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.mr-6.font-weight-medium.align-self-center VA Co-Borrower Taxable Income Amount                
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="governmentBorrower.VACoBorrowerTaxableIncomeAmount"
                        @input="(e) => updateGovernmentBorrower({prop: 'VACoBorrowerTaxableIncomeAmount', value: +e})"
                        placeholder="VA Co-Borrower Taxable Income Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$")
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.mr-6.font-weight-medium.align-self-center VA Maintenance Expense Monthly Amount
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.VAMaintenanceExpenseMonthlyAmount"
                        @input="(e) => updateAdditionalInfo({prop: 'VAMaintenanceExpenseMonthlyAmount', value: +e})"
                        placeholder="VA Maintenance Expense Monthly Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$")
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.mr-6.font-weight-medium.align-self-center VA Utility Expense Monthly Amount
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.VAUtilityExpenseMonthlyAmount"
                        @input="(e) => updateAdditionalInfo({prop: 'VAUtilityExpenseMonthlyAmount', value: +e})"
                        placeholder="VA Utility Expense Monthly Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$")
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.mr-6.font-weight-medium.align-self-center VA Entitlement Amount
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="additionalInfo.VAEntitlementAmount"
                        @input="(e) => updateAdditionalInfo({prop: 'VAEntitlementAmount', value: +e})"
                        placeholder="VA Entitlement Amount" 
                        hide-details 
                        type="number" 
                        style="max-width:300px" 
                        prefix="$")
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.mr-6.font-weight-medium.align-self-center VA Borrower Co Borrower Married Indicator
                v-col.pa-1(lg="7" cols="6")
                    v-checkbox(
                    label=""
                    :input-value="additionalInfo.VABorrowerCoBorrowerMarriedIndicator"
                    @change="(value) => updateAdditionalInfo({prop: 'VABorrowerCoBorrowerMarriedIndicator', value})"
                    class="ma-0 pa-0"
                    dense
                    hide-details
                    )
            Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapActions } from "vuex";
import Button from "@/components/buttons/Button";

export default {
  props: {
    governmentBorrower: {
      type: Object,
      default: () => {
        return {};
      }
    },
    additionalInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    ...mapActions([
      "updateBorrower",
      "updateAdditionalInfo",
      "saveLoanPatches"
    ]),
    updateGovernmentBorrower({ prop, value }) {
      const goverBorrower = { ...this.governmentBorrower, [prop]: value };
      this.updateBorrower({ prop: "GovernmentBorrower", value: goverBorrower });
    }
  },
  components: {
    Button
  }
};
</script>
