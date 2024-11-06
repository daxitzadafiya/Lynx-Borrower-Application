<template lang="pug">
    v-card.pb-1(light)
        v-card-title Property & Loan Information
        v-card-text
            v-row.ma-0.pa-0.d-flex.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Refinance Improvements Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense
                        :items="refinanceImprovementsTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Refinance Improvements Type" 
                        :value="PropertyAndLoanInformation.RefinanceImprovementsType"
                        @change="(value) => updatePropertyAndLoanInfo({prop: 'RefinanceImprovementsType', value})"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Refinance Improvement Cost
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="getFormattedValue(PropertyAndLoanInformation.RefinanceImprovementCostsAmount) || ''" 
                        @input="(e) => updatePropertyAndLoanInfo({prop: 'RefinanceImprovementCostsAmount', value: +e.replace(/,/g, '')})"
                        placeholder="Refinance Improvement Cost" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="$"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Energy Improvement Cost           
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="getFormattedValue(PropertyAndLoanInformation.DUEnergyImprovementAmount) || ''" 
                        @input="(e) => updatePropertyAndLoanInfo({prop: 'DUEnergyImprovementAmount', value: +e.replace(/,/g, '')})"
                        placeholder="Energy Improvement Cost" 
                        hide-details 
                        style="max-width:300px" 
                        prefix="$"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Project Design Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense
                        :items="[{text: 'Highrise Project', value: 'HighriseProject'}]"
                        item-text="text" 
                        item-value="value" 
                        placeholder="Project Design Type" 
                        :value="PropertyAndLoanInformation.ProjectDesignType"
                        @change="(value) => updatePropertyAndLoanInfo({prop: 'ProjectDesignType', value})"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )                
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Attachment Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0.pt-1(light dense
                        :items="attachmentTypes"
                        item-text="text" 
                        item-value="value" 
                        placeholder="Attachment Type" 
                        :value="PropertyAndLoanInformation.AttachmentType"
                        @change="(value) => updatePropertyAndLoanInfo({prop: 'AttachmentType', value})"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )                 
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.mr-6.font-weight-medium.align-self-center Property Structure Built Year
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="PropertyAndLoanInformation.PropertyStructureBuiltYear"
                        @input="(e) => updatePropertyAndLoanInfo({prop: 'PropertyStructureBuiltYear', value: +e})"
                        placeholder="Property Structure Built Year" 
                        hide-details 
                        type="number"
                        min="1800"
                        style="max-width:300px" 
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.mr-6.font-weight-medium.align-self-center Property Valuation Amount
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="getFormattedValue(Property.PropertyValuationAmount) || ''"
                        @input="(e) => setValuationAmount(+e.replace(/,/g, ''))"
                        placeholder="Property Valuation Amount" 
                        hide-details 
                        prefix="$"
                        @keypress="(e) => isOnlyNum(e, true)"
                        style="max-width:300px" 
                        )                
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.mr-6.font-weight-medium.align-self-center Appraisal Identifier
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="PropertyAndLoanInformation.AppraisalIdentifier"
                        @input="(value) => updatePropertyAndLoanInfo({prop: 'AppraisalIdentifier', value})"
                        placeholder="Appraisal Identifier" 
                        hide-details
                        style="max-width:300px" 
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.mr-6.font-weight-medium.align-self-center Property Ground Lease Expiration Date
                v-col.pa-1(lg="10" cols="6")
                    v-menu(light
                        v-model="isDatePicker"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        )
                        template(v-slot:activator="{ on }")
                            v-text-field(light
                                dense
                                :value="formattedDate"
                                placeholder="Property Ground Lease Expiration Date"
                                prepend-icon="date_range"
                                readonly
                                v-on="on"
                                style="max-width:300px !important"
                                hide-details
                                class="ma-0 pa-0"
                                )
                        v-date-picker(light
                            :value="PropertyAndLoanInformation.PropertyGroundLeaseExpirationDate"
                            @input="setGroundLeaseExpirationDate"
                            )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Property Estate Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0.pt-1(light dense
                        :items="propertyEstateTypes"
                        item-text="text" 
                        item-value="value" 
                        placeholder="Property Estate Type" 
                        :value="PropertyAndLoanInformation.PropertyEstateType"
                        @change="(value) => updatePropertyAndLoanInfo({prop: 'PropertyEstateType', value})"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Construction Loan Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0.pt-1(light dense
                        :items="[{text: 'Construction To Permanent', value: 'ConstructionToPermanent'}]"
                        item-text="text" 
                        item-value="value" 
                        placeholder="Construction Loan Type" 
                        :value="PropertyAndLoanInformation.ConstructionLoanType"
                        @change="(value) => updatePropertyAndLoanInfo({prop: 'ConstructionLoanType', value})"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Refinance Primary Purpose Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0.pt-1(light dense
                        :items="refinancePrimaryPurposeTypes"
                        item-text="text" 
                        item-value="value" 
                        placeholder="Refinance Primary Purpose Type" 
                        :value="PropertyAndLoanInformation.RefinancePrimaryPurposeType"
                        @change="(value) => updatePropertyAndLoanInfo({prop: 'RefinancePrimaryPurposeType', value})"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import Button from "@/components/buttons/Button";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      isDatePicker: false,
      refinanceImprovementsTypes: [
        {
          text: "Made",
          value: "Made"
        },
        {
          text: "To Be Made",
          value: "ToBeMade"
        },
        {
          text: "Unknown",
          value: "Unknown"
        }
      ],
      attachmentTypes: [
        {
          text: "Attached",
          value: "Attached"
        },
        {
          text: "Detached",
          value: "Detached"
        }
      ],
      propertyEstateTypes: [
        {
          text: "Fee Simple",
          value: "FeeSimple"
        },
        {
          text: "Leashold",
          value: "Leashold"
        }
      ],
      refinancePrimaryPurposeTypes: [
        {
          text: "Debt Consolidation",
          value: "DebtConsolidation"
        },
        {
          text: "Home Improvement",
          value: "HomeImprovement"
        },
        {
          text: "Other",
          value: "Other"
        }
      ]
    };
  },
  methods: {
    ...mapActions([
      "updatePropertyAndLoanInfo",
      "setProperty",
      "saveLoanPatches"
    ]),
    setGroundLeaseExpirationDate(date) {
      const formatted = moment(new Date(date)).format("YYYY-MM-DD");
      this.updatePropertyAndLoanInfo({
        prop: "PropertyGroundLeaseExpirationDate",
        value: formatted
      });
      this.isDatePicker = false;
    },
    setValuationAmount(val) {
      const property = this.Property
        ? { ...this.Property, PropertyValuationAmount: val }
        : { PropertyValuationAmount: val };
      this.setProperty(property);
    }
  },
  computed: {
    ...mapGetters({
      PropertyAndLoanInformation: "getPropertyAndLoanInformation",
      Property: "getProperty"
    }),
    formattedDate() {
      return this.PropertyAndLoanInformation.PropertyGroundLeaseExpirationDate
        ? moment(
            new Date(
              this.PropertyAndLoanInformation.PropertyGroundLeaseExpirationDate
            )
          ).format("DD/MM/YYYY")
        : "";
    }
  },
  components: {
    Button
  }
};
</script>
