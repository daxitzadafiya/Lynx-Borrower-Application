<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select your Citizenship Status</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input
          defaultComponent="v-select"
          inputTitle="Citizenship Status"
          :value="citizenshipResidencyType"
          :items="statuses"
          item-text="text"
          item-value="value"
          :menu-props="{ bottom: true, offsetY: true }"
          @change="
            e =>
              $emit('updateBorrower', {
                prop: 'CitizenshipResidencyType',
                value: e
              })
          "
        />
        <Input
          defaultComponent="v-select"
          inputTitle="Visa Type"
          v-if="isVisa"
          :value="currentBorrower.VisaType"
          :items="visaTypes"
          item-text="text"
          item-value="value"
          :menu-props="{ bottom: true, offsetY: true }"
          @change="e => $emit('updateBorrower', { prop: 'VisaType', value: e })"
        />
        <Input
          inputTitle="Other Description"
          v-if="isVisaTypeOther"
          :value="currentBorrower.VisaTypeOtherDescription"
          @input="
            e =>
              $emit('updateBorrower', {
                prop: 'VisaTypeOtherDescription',
                value: e
              })
          "
        />
        <DateInput
          v-if="isVisa"
          inputTitle="Visa Expiration Date"
          @dateUpdated="updateVisaExpirationDate"
          @dateCleared="clearExpirationDate"
          :value="
            currentBorrower == null ? null : currentBorrower.VisaExpirationDate
          "
          :isRequired="true"
        ></DateInput>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import DateInput from "@/components/form/DateInput";
import scrollToTop from "@/mixins/scrollToTop.js";
import loanPatch from "@/mixins/loanPatch.js";
import moment from "moment";

export default {
  mixins: [scrollToTop, loanPatch],
  props: {
    currentBorrower: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isMenu: false,
      maxDate: new Date().toISOString().slice(0, 10),
      statuses: [
        {
          text: "Non Permanent Resident",
          value: "NonPermanentResidentAlien"
        },
        {
          text: "Permanent Resident Card Holder",
          value: "PermanentResidentAlien"
        },
        {
          text: "US Citizen",
          value: "USCitizen"
        }
      ],
      visaTypes: [
        {
          text: "E-1",
          value: "E-1"
        },
        {
          text: "E-2",
          value: "E-2"
        },
        {
          text: "E-3",
          value: "E-3"
        },
        {
          text: "G-1",
          value: "G-1"
        },
        {
          text: "G-2",
          value: "G-2"
        },
        {
          text: "G-3",
          value: "G-3"
        },
        {
          text: "G-4",
          value: "G-4"
        },
        {
          text: "G-5",
          value: "G-5"
        },
        {
          text: "H-1",
          value: "H-1"
        },
        {
          text: "H-1B",
          value: "H-1B"
        },
        {
          text: "L1",
          value: "L1"
        },
        {
          text: "TC",
          value: "TC"
        },
        {
          text: "TN-1",
          value: "TN-1"
        },
        {
          text: "Other",
          value: "Other"
        }
      ]
    };
  },
  methods: {
    updateVisaExpirationDate(date) {
      this.$emit("updateBorrower", {
        prop: "VisaExpirationDate",
        value: date != null ? moment(date).format("YYYY-MM-DD") : null
      });
    },
    clearExpirationDate() {
      this.updateVisaExpirationDate(null);
      this.isMenu = false;
    }
  },
  computed: {
    isNextDisabled() {
      return (
        this.currentBorrower.CitizenshipResidencyType ===
          "NonPermanentResidentAlien" &&
        this.currentBorrower.VisaExpirationDate == null
      );
    },
    citizenshipResidencyType() {
      if (!this.currentBorrower.CitizenshipResidencyType) {
        this.$emit("updateBorrower", {
          prop: "CitizenshipResidencyType",
          value: "USCitizen"
        });
      }
      return this.currentBorrower.CitizenshipResidencyType;
    },
    isVisa() {
      return (
        this.currentBorrower.CitizenshipResidencyType &&
        this.currentBorrower.CitizenshipResidencyType !== "USCitizen" &&
        this.currentBorrower.CitizenshipResidencyType !==
          "PermanentResidentAlien"
      );
    },
    isVisaTypeOther() {
      return (
        this.currentBorrower.CitizenshipResidencyType &&
        this.currentBorrower.CitizenshipResidencyType ===
          "NonPermanentResidentAlien" &&
        this.currentBorrower.VisaType === "Other"
      );
    }
  },
  components: {
    DateInput
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/data.scss";
</style>
