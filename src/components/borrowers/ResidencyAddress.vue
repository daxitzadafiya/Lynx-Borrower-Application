<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        You must provide at least 2 years of residency information. Let's start
        with your current residence
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor
          :isAddressRequired="true"
          :addressObj="currentResidence"
          @addressUpdated="updateAddress"
          @addressPropUpdated="updateAddressProp"
        ></AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="isNextButtonDisabled"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import AddressEditor from "@/components/form/AddressEditor";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    AddressEditor
  },
  data() {
    return {
      residenceType: "Current"
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp", "updateResidence"]),
    updateAddress(addressData) {
      this.updateResidence({
        type: this.residenceType,
        value: addressData
      });
    },
    updateAddressProp({ prop, value }) {
      this.updateResidenceProp({
        type: this.residenceType,
        value: value,
        prop: prop
      });
    }
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence"
    }),
    currentResidence() {
      return this.getSpecificResidence(this.residenceType);
    },
    isNextButtonDisabled() {
      return (
        this.currentResidence == null ||
        this.currentResidence.AddressLineText == null ||
        this.currentResidence.AddressLineText.length === 0 ||
        this.currentResidence.CityName == null ||
        this.currentResidence.CityName.length === 0 ||
        this.currentResidence.StateCode == null ||
        this.currentResidence.StateCode.length === 0 ||
        this.currentResidence.PostalCode == null ||
        this.currentResidence.PostalCode.length === 0
      );
    }
  }
};
</script>
