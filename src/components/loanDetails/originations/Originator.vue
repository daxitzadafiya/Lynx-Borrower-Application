<template lang="pug">
    v-card(light flat)
        v-card-text
            v-row.ma-0.pa-0.d-flex.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Originator Party Role Type
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="origination.OriginatorPartyRoleType" 
                        readonly
                        placeholder="Originator Party Role Type" 
                        hide-details 
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center License Authority Level Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense
                        :items="licenseTypes"
                        item-text="text" 
                        item-value="value" 
                        placeholder="License Authority Level Type" 
                        :value="origination.OriginatorLicenseAuthorityLevelType"
                        @change="(value) => updateOrigination('OriginatorLicenseAuthorityLevelType', value)"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center License Identifier
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="License Identifier" 
                        :value="origination.OriginatorLicenseIdentifier"
                        @input="(e) => updateOrigination('OriginatorLicenseIdentifier', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center State License Authority Level Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense
                        :items="licenseTypes"
                        item-text="text" 
                        item-value="value" 
                        placeholder="State License Authority Level Type" 
                        :value="origination.OriginatorStateLicenseAuthorityLevelType"
                        @change="(value) => updateOrigination('OriginatorStateLicenseAuthorityLevelType', value)"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )                
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center State License Identifier
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="State License Identifier" 
                        :value="origination.OriginatorStateLicenseIdentifier"
                        @input="(e) => updateOrigination('OriginatorStateLicenseIdentifier', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center First Name
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="First Name" 
                        :value="origination.FirstName"
                        @input="(e) => updateOrigination('FirstName', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Middle Name
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Middle Name"
                        :value="origination.MiddleName"
                        @input="(e) => updateOrigination('MiddleName', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Last Name
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Last Name" 
                        :value="origination.LastName"
                        @input="(e) => updateOrigination('LastName', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Suffix
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Suffix" 
                        :value="origination.SuffixName"
                        @input="(e) => updateOrigination('SuffixName', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Email
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Email" 
                        :value="origination.ContactPointEmailValue"
                        @input="(e) => updateOrigination('ContactPointEmailValue', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Phone
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Phone" 
                        :value="formattedPhone"
                        @input="(e) => updateOrigination('ContactPointTelephoneValue', e ? e.replace(/[()]|-| /g,'') : '')"
                        @keypress="(e) => validatePhone(e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Signature
                v-col.pa-1(lg="10" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Signature" 
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Signed Date
                v-col.pa-1(lg="10" cols="6")
                    v-menu(
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        v-model="isDateMenu"
                        )
                        template(v-slot:activator="{ on }")
                            v-text-field(
                                label="Signed Date"
                                :value="formattedDate(origination.ApplicationSignedByLoanOriginatorDate)"
                                prepend-icon="date_range"
                                readonly
                                v-on="on"
                                style="max-width:300px !important"
                                hide-details
                                )
                        v-date-picker(
                            :value="origination.ApplicationSignedByLoanOriginatorDate"
                            @input="(date) => setDate(date)"
                            )         
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Button from "@/components/buttons/Button";
import onlyNum from "@/mixins/onlyNum.js";
import getFormattedPhone from "@/mixins/phoneFormat.js";
import moment from "moment";

export default {
  mixins: [onlyNum, getFormattedPhone],
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
      ],
      isDateMenu: false
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan", "saveLoanPatches"]),
    updateOrigination(prop, value) {
      const Origination = {
        ...this.origination,
        [prop]: value,
        OrginizationPartyRoleType: "LoanOriginationCompany",
        OriginatorPartyRoleType: "LoanOriginator"
      };
      this.setCurrentLoan({ ...this.currentLoan, Origination });
    },
    validatePhone(e) {
      if (e.target.value.length === 14) {
        e.preventDefault();
        return false;
      }
      return this.isOnlyNum(e);
    },
    formattedDate(date) {
      return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
    },
    setDate(date) {
      this.updateOrigination(
        "ApplicationSignedByLoanOriginatorDate",
        moment(date).format("YYYY-MM-DD")
      );
      this.isDateMenu = false;
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
    },
    formattedPhone() {
      if (this.origination.ContactPointTelephoneValue) {
        return this.getFormattedPhone(
          this.origination.ContactPointTelephoneValue
        );
      }
      return "";
    }
  },
  components: {
    Button
  }
};
</script>
