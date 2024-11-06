<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ title }}</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor
          :addressObj="Property"
          :isAddressRequired="true"
          @addressUpdated="updateAddress"
          @addressPropUpdated="updateAddressProp"
          :USOnly="true"
        ></AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddressEditor from "@/components/form/AddressEditor";

export default {
  methods: {
    ...mapActions(["setProperty"]),
    updateAddress(addressData) {
      let property = this.Property
        ? { ...this.Property, ...addressData }
        : addressData;
      this.setProperty(property);
    },
    updateAddressProp({ prop, value }) {
      this.setProperty({
        ...this.Property,
        [prop]: value
      });
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty",
      LoanPurposeType: "getLoanPurposeType"
    }),
    isNextDisabled() {
      return (
        this.Property == null ||
        this.Property.AddressLineText == null ||
        this.Property.AddressLineText.length === 0 ||
        this.Property.CityName == null ||
        this.Property.CityName.length === 0 ||
        this.Property.StateCode == null ||
        this.Property.StateCode.length === 0 ||
        this.Property.PostalCode == null ||
        this.Property.PostalCode.length === 0
      );
    },
    title() {
      return this.LoanPurposeType === "Purchase"
        ? "Great News! Please enter the property address"
        : "Please, enter the address for the property you would like to Refinance.";
    }
  },
  components: {
    AddressEditor
  }
};
</script>
