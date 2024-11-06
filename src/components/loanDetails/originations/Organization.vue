<template lang="pug">
    v-card(light flat)
        v-card-text
            v-row.ma-0.pa-0.d-flex.flex-wrap
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center Organization Name
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        dense 
                        :value="origination.FullName" 
                        @input="(value) => updateOrigination('FullName', value)"
                        placeholder="Organization Name" 
                        hide-details 
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center Address
                v-col.pa-1(lg="7" cols="6")
                    v-text-field.mx-1.my-0(
                        id="autocomplete"
                        @focus="geolocate"
                        dense 
                        :value="origination.AddressLineText" 
                        @change="(e) => findAddressData(e)"
                        placeholder="Organization Name" 
                        hide-details 
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center Unit
                v-col.pa-1(lg="7" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Unit #" 
                        :value="origination.AddressUnitIdentifier"
                        @input="(e) => updateOrigination('AddressUnitIdentifier', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center City
                v-col.pa-1(lg="7" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="City"
                        :value="origination.CityName"
                        @input="(e) => updateOrigination('CityName', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center State
                v-col.pa-1(lg="7" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="State" 
                        :value="origination.StateCode"
                        @input="(e) => updateOrigination('StateCode', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center Postal Code
                v-col.pa-1(lg="7" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="Postal Code" 
                        :value="origination.PostalCode"
                        @input="(e) => updateOrigination('PostalCode', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center Orginization Party Role Type
                v-col.pa-1(lg="7" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        readonly
                        placeholder="Orginization Party Role Type" 
                        :value="origination.OrginizationPartyRoleType"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center License Authority Level Type
                v-col.pa-1(lg="7" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="licenseTypes"
                        item-text="text" 
                        item-value="value" 
                        placeholder="License Authority Level Type" 
                        :value="origination.OrganizationLicenseAuthorityLevelType"
                        @change="(value) => updateOrigination('OrganizationLicenseAuthorityLevelType', value)"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center License Identifier
                v-col.pa-1(lg="7" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="License Identifier" 
                        :value="origination.OrganizationLicenseIdentifier"
                        @input="(e) => updateOrigination('OrganizationLicenseIdentifier', e)"
                        style="max-width:300px"
                        )
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center State License Authority Level Type
                v-col.pa-1(lg="7" cols="6")
                    v-select.mx-1.my-0(light dense clearable
                        :items="licenseTypes"
                        item-text="text" 
                        item-value="value" 
                        placeholder="State License Authority Level Type" 
                        :value="origination.OrganizationStateLicenseAuthorityLevelType"
                        @change="(value) => updateOrigination('OrganizationStateLicenseAuthorityLevelType', value)"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )                
                v-col.pa-1.d-flex(lg="3" cols="4")
                    span.font-weight-medium.align-self-center State License Identifier
                v-col.pa-1(lg="7" cols="6")
                    v-text-field(
                        dense
                        hide-details 
                        placeholder="State License Identifier" 
                        :value="origination.OrganizationStateLicenseIdentifier"
                        @input="(e) => updateOrigination('OrganizationStateLicenseIdentifier', e)"
                        style="max-width:300px"
                        )
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import googleAutoComplete from "@/mixins/googleAutoComplete.js";
import Button from "@/components/buttons/Button";

export default {
  mixins: [googleAutoComplete],
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
      let Origination = {
        ...this.origination,
        [prop]: value,
        OrginizationPartyRoleType: "LoanOriginationCompany",
        OriginatorPartyRoleType: "LoanOriginator"
      };
      if (!value) {
        delete Origination[prop];
      }
      this.setCurrentLoan({ ...this.currentLoan, Origination });
    },
    handleAddressData(addressData) {
      this.isGoogleAddressFound = !!addressData;
      if (addressData) {
        this.isGoogleAddressFound = !(
          Object.keys(addressData).length === 1 &&
          Object.keys(addressData)[0] === "name"
        );
      }
      if (this.isGoogleAddressFound) {
        const Origination = { ...this.origination, ...addressData };
        this.setCurrentLoan({ ...this.currentLoan, Origination });
      }
    },
    findAddressData(value) {
      if (value && this.isGoogleAddressFound) {
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyBsEdcuR5dCQVp4cL1cCAbPR6XlEEMpJEQ&language=en`
        )
          .then(stream => stream.json())
          .then(data => {
            if (data.results.length) {
              this.parseAddressData(data.results[0]);
              this.formattedAddress = "";
            }
            this.isGoogleAddressFound = false;
          })
          .catch(error => console.error(error));
      } else if (!this.isGoogleAddressFound) {
        const Origination = { ...this.origination, AddressLineText: value };
        this.setCurrentLoan({ ...this.currentLoan, Origination });
      }
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
    address() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.origination) {
        if (!this.isGoogleAddressFound) {
          return this.origination.AddressLineText;
        }
        return keys.reduce((acc, cur) => {
          if (this.origination[cur]) {
            acc += `${this.origination[cur]}${
              cur === "PostalCode" ? " " : ", "
            }`;
          }
          return acc;
        }, "");
      }
      return this.formattedAddress;
    }
  },
  components: {
    Button
  }
};
</script>
