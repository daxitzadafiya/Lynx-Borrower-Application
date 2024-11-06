<template>
  <div style="display:contents;">
    <Input
      :class="[
        'AddressLineTextInput',
        {
          'col-sm-8': isGoogleAddressFound
        }
      ]"
      attach="attach"
      :id="inputId"
      @focus="geolocate"
      :mdVal="mdVal"
      :lgVal="lgVal"
      :inputTitle="mainAddressInputText"
      :isRequired="isAddressRequired"
      :value="address"
      hide-details="hide-details"
      @input="e => findAddressData(e)"
    />
    <Input
      v-if="!isGoogleAddressFound"
      inputTitle="Unit #"
      hide-details="hide-details"
      :value="addressUnit"
      :mdVal="mdVal"
      :lgVal="lgVal"
      @input="
        e =>
          $emit('addressPropUpdated', {
            value: e,
            prop: 'AddressUnitIdentifier'
          })
      "
    />
    <Input
      v-if="!isGoogleAddressFound"
      :isRequired="isAddressRequired"
      inputTitle="City"
      hide-details="hide-details"
      :value="addressObj.CityName"
      @input="e => $emit('addressPropUpdated', { value: e, prop: 'CityName' })"
      :mdVal="mdVal"
      :lgVal="lgVal"
    />
    <Input
      v-if="!isGoogleAddressFound"
      :isRequired="isAddressRequired"
      inputTitle="State"
      :value="addressObj.StateCode"
      @input="e => $emit('addressPropUpdated', { value: e, prop: 'StateCode' })"
      :mdVal="mdVal"
      :lgVal="lgVal"
    />
    <Input
      v-if="!isGoogleAddressFound"
      :isRequired="isAddressRequired"
      inputTitle="Postal Code"
      :value="addressObj.PostalCode"
      hide-details="hide-details"
      @input="
        e => $emit('addressPropUpdated', { value: e, prop: 'PostalCode' })
      "
      :mdVal="mdVal"
      :lgVal="lgVal"
    />
    <Input
      attach="attach"
      defaultComponent="v-combobox"
      v-if="!isGoogleAddressFound && showCountry"
      :menu-props="{ light: true }"
      inputTitle="Country"
      :value="
        addressObj.CountryCode ? getCountryName(addressObj.CountryCode) : ''
      "
      :items="USOnly ? ['United States'] : countriesNames"
      @input="
        e =>
          $emit('addressPropUpdated', {
            value: getCountryCode(e),
            prop: 'CountryCode'
          })
      "
      hide-details="hide-details"
      :mdVal="mdVal"
      :lgVal="lgVal"
      :disabled="USOnly"
    />
    <v-col
      class="itemContainer d-flex flex-column h-100"
      md="6"
      lg="6"
      v-if="showMailingAddressSelector"
    >
      <div class="titleText">Mailing Address</div>
      <div class="d-flex align-center flex-grow-1">
        <Radio
          :isOn="!isMailing"
          label="NO"
          @toggleRadio="$emit('mailingUpdated', false)"
        ></Radio>
        <Radio
          :isOn="isMailing"
          class="ml-4"
          label="YES"
          @toggleRadio="$emit('mailingUpdated', true)"
        ></Radio>
      </div>
    </v-col>
    <slot></slot>
  </div>
</template>

<script>
import googleAutoComplete from "@/mixins/googleAutoComplete.js";
import countryHandling from "@/mixins/countryHandling.js";
import Radio from "@/components/form/Radio";
import { countries } from "@/models/countries";

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
    mainAddressInputText: {
      type: String,
      default: "Address"
    },
    isAddressRequired: {
      type: Boolean,
      default: false
    },
    mdVal: {
      type: [Number, String]
    },
    lgVal: {
      type: [Number, String]
    },
    USOnly: {
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
    this.countriesNames = this.getCountriesNames();
  },
  data() {
    return {
      countriesNames: [],
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
        // Remove maybe
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
      if (this.isGoogleAddressFound) {
        this.$emit("addressUpdated", property);
      }
    },
    getCountriesNames() {
      return countries.map(country => country.longName);
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
    },
    addressUnit() {
      return this.addressObj.AddressUnitIdentifier
        ? this.addressObj.AddressUnitIdentifier
        : "";
    }
  },
  components: {
    Radio
  }
};
</script>
