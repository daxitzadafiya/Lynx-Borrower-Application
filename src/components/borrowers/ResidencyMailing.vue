<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Is this your current mailing address?</div>
    </div>
    <div class="inner-content-container">
      <div class="primary-text text-subtitle-1 font-weight-bold text-center">
        {{ address }}
      </div>
      <AgreeToggle
        class="my-5"
        :value="isMailingAddressSame"
        @input="setMailingAddress"
      ></AgreeToggle>
      <v-row class="form-container" justify="center">
        <AddressEditor
          v-if="showAddressEditor"
          mainAddressInputText="Current Mailing Address"
          :addressObj="
            copiedMailingResidence === null
              ? mailingResidence
              : copiedMailingResidence
          "
          @addressUpdated="updateMailingAddress"
          @addressPropUpdated="updateMailingAddressProp"
        >
        </AddressEditor>
      </v-row>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import AddressEditor from "@/components/form/AddressEditor";
import AgreeToggle from "@/components/controls/AgreeToggle";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isMailingAddressSame: null,
      residenceType: "Mailing",
      copiedMailingResidence: null,
      mailingKeys: [
        "AddressLineText",
        "CityName",
        "CountryCode",
        "PostalCode",
        "StateCode"
      ],
      showAddressEditor: false
    };
  },
  methods: {
    ...mapActions([
      "setInitialMailingResidence",
      "removeResidence",
      "updateResidenceProp",
      "updateResidence"
    ]),
    async removeMailing() {
      this.removeResidence("Mailing");
    },
    updateMailingAddress(addressData) {
      this.updateResidence({
        type: this.residenceType,
        value: addressData
      });
      this.copiedMailingResidence = addressData;
      if (this.isMailingResidencySameAsCurrent) {
        this.removeMailing();
        this.updateCurrentAddressProp({
          prop: "IsMailingAddress",
          value: true
        });
      } else {
        this.updateCurrentAddressProp({
          prop: "IsMailingAddress",
          value: null
        });
      }
    },
    updateMailingAddressProp({ prop, value }) {
      this.updateResidenceProp({
        type: this.residenceType,
        value: value,
        prop: prop
      });
    },
    updateMailingResidenceAddress(value) {
      this.updateResidence({
        type: this.residenceType,
        value: value
      });
    },
    updateCurrentAddressProp({ prop, value }) {
      this.updateResidenceProp({
        type: "Current",
        value: value,
        prop: prop
      });
    },
    setMailingAddress(val) {
      this.isMailingAddressSame = val;
      this.showAddressEditor = !val;
      if (val) {
        this.removeMailing();
        this.updateCurrentAddressProp({ prop: "IsMailingAddress", value: val });
      } else {
        this.updateCurrentAddressProp({
          prop: "IsMailingAddress",
          value: null
        });
      }
    }
  },
  components: {
    AddressEditor,
    AgreeToggle
  },
  created() {
    if (this.currentResidence.IsMailingAddress) {
      this.setMailingAddress(true);
    } else if (this.currentResidence.IsMailingAddress === false) {
      this.setMailingAddress(false);
    } else {
      this.setMailingAddress(null);
    }
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence"
    }),
    mailingResidence() {
      return this.getSpecificResidence(this.residenceType);
    },
    currentResidence() {
      return this.getSpecificResidence("Current");
    },
    isMailingResidencySameAsCurrent() {
      if (!this.mailingResidence || !this.currentResidence) {
        return false;
      }
      for (let i = 0; i < this.mailingKeys.length; i++) {
        const key = this.mailingKeys[i];
        if (this.mailingResidence[key] !== this.currentResidence[key]) {
          return false;
        }
      }
      return true;
    },
    address() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.currentResidence) {
        return keys.reduce((acc, cur) => {
          if (this.currentResidence[cur]) {
            acc += `${this.currentResidence[cur]}${
              cur === "PostalCode" ? " " : ", "
            }`;
          }
          return acc;
        }, "");
      }
      return "";
    },
    isNextDisabled() {
      return !this.isMailingAddressSame && !this.copiedMailingResidence;
    }
  }
};
</script>
