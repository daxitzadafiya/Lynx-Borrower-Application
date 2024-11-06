<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Since you have not lived at your current residence for at least 2 years, please enter your
        previous residence.</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor :addressObj="priorResidence" @addressUpdated="updateAddress"
          @addressPropUpdated="updateAddressProp"> </AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import AddressEditor from "@/components/form/AddressEditor";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    AddressEditor,
  },
  data() {
    return {
      residenceType: "Prior",
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp", "updateResidence"]),
    updateAddress(addressData) {
      this.updateResidence({
        type: this.residenceType,
        value: addressData,
      });
    },
    updateAddressProp({ prop, value }) {
      this.updateResidenceProp({
        type: this.residenceType,
        value: value,
        prop: prop,
      });
    },
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence",
    }),
    priorResidence() {
      return this.getSpecificResidence(this.residenceType);
    },
  },
};
</script>