<template lang="pug">
    v-card(light flat)
        v-card-text
            v-row.ma-0.pa-0.d-flex.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Loan Lender Identifier
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="origination.FHALoanLenderIdentifier" 
                        @input="(value) => updateOrigination('FHALoanLenderIdentifier', value)"
                        placeholder="Loan Lender Identifier" 
                        hide-details 
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Loan Sponsor Identifier
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="origination.FHALoanSponsorIdentifier" 
                        @input="(value) => updateOrigination('FHALoanSponsorIdentifier', value)"
                        placeholder="Loan Sponsor Identifier" 
                        hide-details 
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Taxpayer Identifier Type
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="origination.TaxpayerIdentifierType"
                        readonly
                        placeholder="Taxpayer Identifier Type" 
                        hide-details 
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Taxpayer Identifier
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="origination.TaxpayerIdentifierValue" 
                        @input="(value) => updateOrigination('TaxpayerIdentifierValue', value)"
                        placeholder="Taxpayer Identifier" 
                        hide-details 
                        style="max-width:300px"
                        )
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Button from "@/components/buttons/Button";

export default {
  data() {
    return {
      isGoogleAddressFound: true,
      licenseTypes: [
        {
          text: "Private",
          value: "Private"
        },
        {
          text: "Public State",
          value: "PublicState"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan", "saveLoanPatches"]),
    updateOrigination(prop, value) {
      const Origination = { ...this.origination, [prop]: value };
      this.setCurrentLoan({ ...this.currentLoan, Origination });
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    }),
    origination() {
      return this.currentLoan && this.currentLoan.Origination
        ? this.currentLoan.Origination
        : {};
    }
  },
  components: {
    Button
  }
};
</script>
