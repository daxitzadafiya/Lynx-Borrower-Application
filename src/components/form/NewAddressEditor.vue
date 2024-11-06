<template lang="pug">
  div(style="display:contents;")
      v-col.text-block__col(:sm="addressSmVal" :md="addressMdVal" cols="12" style="position: relative;")
          div.mb-1
            span {{ addressText }}:
            span.red--text(v-if="validateNullCheck") *
          v-text-field(
              outlined
              dense
              attach=true
              :id="inputId"
              @focus="geolocate"
              placeholder="Address" 
              :value="address"
              hide-details
              class="AddressLineTextInput"
              @input="(e) => findAddressData(e)"
              )
          div(v-if="validateNullCheck && (address==null || address == '')").error--text Valid {{ addressText }} is required
      v-col.text-block__col(:sm="fixedWidthInputs?addressSmVal:4" :md="fixedWidthInputs?addressMdVal:2" cols="12" v-if="!isGoogleAddressFound")
          div.mb-1 Unit #:
            span.red--text(v-if="validateNullCheck") *
          v-text-field(
            dense
            outlined
            placeholder="Unit #" 
            hide-details
            :value="addressObj.AddressUnitIdentifier"
            @input="(e) => $emit('addressPropUpdated', {value: e, prop: 'AddressUnitIdentifier'})"
            )
          div(v-if="validateNullCheck && (addressObj.AddressUnitIdentifier==null || addressObj.AddressUnitIdentifier == '')").error--text Unit # is required
      v-col.text-block__col(sm="3" md="2" cols="8" v-if="showMailingAddressSelector")
          div.mb-3 Mailing Address:
          v-row.text-block__radios.sm-no-margin.justify-start.py-3
              .text-block__radio.mr-2
                  Radio(:isOn="!isMailing" label="NO" @toggleRadio="$emit('mailingUpdated', false)")
              .text-block__radio
                  Radio(:isOn="isMailing" label="YES" @toggleRadio="$emit('mailingUpdated', true)")
      v-col.text-block__col(:sm="fixedWidthInputs?addressSmVal:4" :md="fixedWidthInputs?addressMdVal:4" cols="12" v-if="!isGoogleAddressFound")
          div.mb-1 City:
            span.red--text(v-if="validateNullCheck") *
          v-text-field(
              dense
              outlined
              placeholder="City" 
              hide-details
              :value="addressObj.CityName"
              @input="(e) => $emit('addressPropUpdated', {value: e, prop: 'CityName'})"
              )
          div(v-if="validateNullCheck && (addressObj.CityName==null || addressObj.CityName == '')").error--text City is required
      v-col.text-block__col(:sm="fixedWidthInputs?addressSmVal:4" :md="fixedWidthInputs?addressMdVal:2" cols="12" v-if="!isGoogleAddressFound")
          div.mb-1 State:
            span.red--text(v-if="validateNullCheck") *
          v-text-field(
              dense
              outlined
              placeholder="State" 
              :value="addressObj.StateCode"
              @input="(e) => $emit('addressPropUpdated', {value: e, prop: 'StateCode'})"
              )
          div(v-if="validateNullCheck && (addressObj.StateCode==null || addressObj.StateCode == '')").error--text State is required
      v-col.text-block__col(:sm="fixedWidthInputs?addressSmVal:42" :md="fixedWidthInputs?addressMdVal:2" cols="12" v-if="!isGoogleAddressFound")
          div.mb-1 Zip Code:
          v-text-field(
              dense
              outlined
              placeholder="Zip Code" 
              :value="addressObj.PostalCode"
              hide-details
              @input="(e) => $emit('addressPropUpdated', {value: e, prop: 'PostalCode'})"
              )
      v-col.text-block__col.text-block_left(sm="3" v-if="!isGoogleAddressFound && showCountry")
          div.mb-1 Country:
          v-combobox(
              dense
              outlined
              attach=true
              :menu-props="{light: true}"
              :value="addressObj.CountryCode ? getCountryName(addressObj.CountryCode) : ''"
              :items="countries"
              hide-details
              @change="(e) => $emit('addressPropUpdated', {value: e, prop: 'CountryCode'})"
              placeholder="Country"
              )

      slot
</template>

<script>
import googleAutoComplete from "@/mixins/googleAutoComplete.js";
import countryHandling from "@/mixins/countryHandling.js";
import Radio from "@/components/form/Radio";

export default {
  mixins: [googleAutoComplete, countryHandling],
  props: {
    addressObj: {
      type: Object,
      required: false
    },
    uniqueInputId: {
      type: String,
      required: false
    },
    showMailingAddressSelector: {
      type: Boolean,
      default: false
    },
    isMailing: {
      type: Boolean,
      required: false
    },
    showCountry: {
      type: Boolean,
      default: true
    },
    addressSmVal: {
      type: Number,
      default: 6
    },
    addressMdVal: {
      type: Number,
      default: 6
    },
    fixedWidthInputs: {
      type: Boolean,
      default: false
    },
    addressText: {
      type: String,
      default: "Address"
    },
    validateNullCheck: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.address.length != 0) {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.address}&key=AIzaSyBsEdcuR5dCQVp4cL1cCAbPR6XlEEMpJEQ&language=en`
      )
        .then(stream => stream.json())
        .then(data => {
          if (data.results.length === 0) {
            this.isGoogleAddressFound = false;
          } else {
            this.isGoogleAddressFound = true;
          }
        });
    }
  },
  data() {
    return {
      countries: ["United States"],
      isGoogleAddressFound: true
    };
  },
  methods: {
    findAddressData(value) {
      if (value.length === 0) {
        this.$emit("addressUpdated", {
          AddressLineText: "",
          CityName: "",
          PostalCode: "",
          StateCode: ""
        });
        this.isGoogleAddressFound = false;
        return;
      }
      if (value && this.isGoogleAddressFound) {
        // if needed filtering by US country a query parameter should be added -- &components=country:US -- //
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyBsEdcuR5dCQVp4cL1cCAbPR6XlEEMpJEQ&language=en`
        )
          .then(stream => stream.json())
          .then(data => {
            if (data.results.length === 0) {
              // this.parseAddressData(data.results[0]);
              this.formattedAddress = "";
              // this.isGoogleAddressFound = true;
            } else {
              this.isGoogleAddressFound = false;
            }
          })
          .catch(error => console.error(error));
      } else if (!this.isGoogleAddressFound) {
        this.$emit("addressPropUpdated", {
          value: value,
          prop: "AddressLineText"
        });
      }
    },
    handleAddressData(addressData) {
      this.isGoogleAddressFound = !!addressData;
      if (addressData) {
        this.isGoogleAddressFound =
          addressData.CityName != null &&
          addressData.CountryCode != null &&
          addressData.PostalCode != null &&
          addressData.StateCode != null &&
          addressData.AddressLineText != null;
      }
      let propertyData = {
        CityName: addressData.CityName,
        CountryCode: addressData.CountryCode,
        PostalCode: addressData.PostalCode,
        StateCode: addressData.StateCode,
        AddressLineText: addressData.AddressLineText
      };
      let property = this.addressObj
        ? { ...this.addressObj, ...propertyData }
        : propertyData;
      this.$emit("addressUpdated", property);
    }
  },
  computed: {
    address() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.addressObj) {
        if (!this.isGoogleAddressFound) {
          return this.addressObj.AddressLineText;
        }
        return keys.reduce((acc, cur) => {
          if (this.addressObj[cur]) {
            acc += `${this.addressObj[cur]}${
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
    Radio
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/residency.scss";
::v-deep(.AddressLineTextInput input::placeholder) {
  opacity: 0;
}

.text-block {
  &__radios {
    justify-content: space-around;
  }
}
.radio-block {
  text-align: center;
  &__label {
    font-size: 12px;
    margin-bottom: 10px;
  }
}

@media (max-width: 760px) {
  .radio-block {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    align-items: flex-start;
    padding-left: 20px;
    &__label {
      font-size: 12px;
      margin-bottom: 10px;
    }
    .sm-no-margin {
      margin-top: 0;
    }
  }
}

@media (max-width: 350px) {
  .radio-block {
    padding-left: 0;
  }
}
</style>
