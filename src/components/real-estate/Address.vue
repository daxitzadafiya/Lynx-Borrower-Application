<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the property address</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor
          :addressObj="currentRealEstate"
          @addressUpdated="updateAddress"
          @addressPropUpdated="updateRealEstateAddressProp"
          uniqueInputId="mailing"
        ></AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        @previousClicked="previousClicked()"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddressEditor from "@/components/form/AddressEditor";

export default {
  data() {
    return {
      countries: ["United States"],
      isGoogleAddressFound: true
    };
  },
  methods: {
    ...mapActions(["setRealEstate"]),
    updateRealEstateAddressProp({ prop, value }) {
      let updatedRealEstate = {
        ...this.currentRealEstate,
        [prop]: prop !== "ContryCode" ? value : this.getCountryCode(value)
      };
      if (!updatedRealEstate.OwnershipType) {
        updatedRealEstate.OwnershipType = "Individual";
      }
      let RealEstates = [...this.RealEstate];
      RealEstates[this.currentIndex] = updatedRealEstate;
      this.setRealEstate(RealEstates);
    },
    updateAddress(value) {
      let updatedRealEstate = {
        ...this.currentRealEstate,
        ...value
      };
      if (!updatedRealEstate.OwnershipType) {
        updatedRealEstate.OwnershipType = "Individual";
      }
      let RealEstates = [...this.RealEstate];
      RealEstates[this.currentIndex] = updatedRealEstate;
      this.setRealEstate(RealEstates);
      this.checkOwnedPropertySubjectIndicator();
    },
    checkOwnedPropertySubjectIndicator() {
      const propertyAddress = this.property && this.property.AddressLineText;
      const realestateAddress =
        this.currentRealEstate && this.currentRealEstate.AddressLineText;
      if (!propertyAddress || !realestateAddress) return;

      const isIndicator = propertyAddress.trim() === realestateAddress.trim();
      this.updateRealEstateAddressProp({
        prop: "OwnedPropertySubjectIndicator",
        value: isIndicator
      });
    },
    previousClicked() {
      this.setRealEstate([]);
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex",
      property: "getProperty"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    }
  },
  components: {
    AddressEditor
  }
};
</script>
