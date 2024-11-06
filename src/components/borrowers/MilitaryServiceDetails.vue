<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select all that apply</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <v-col class="itemContainer" cols="12" sm="12">
          <v-checkbox
            dense
            hide-details
            class="defaultCheckbox mt-0 pt-0"
            :input-value="isServing"
            @change="toggleService('isServing')"
            label="Currently serving on active duty with projected expitation date of service/tour"
          ></v-checkbox>
          <v-row class="form-container ml-3 pl-1 pt-1" v-if="isPicker">
            <DateInput
              :isRequired="true"
              inputTitle="Projected expiration date"
              @dateUpdated="updateExpirationDate"
              @dateCleared="cancelDate"
              :value="selectedDate"
            ></DateInput>
          </v-row>
        </v-col>
        <v-col class="itemContainer" cols="12" sm="12">
          <v-checkbox
            dense
            hide-details
            class="defaultCheckbox mt-0 pt-0"
            :input-value="isRetired"
            @change="toggleService('isRetired')"
            label="Currently retired, discharged, or seperated from service"
          ></v-checkbox>
        </v-col>
        <v-col class="itemContainer" cols="12" sm="12">
          <v-checkbox
            dense
            hide-details
            class="defaultCheckbox mt-0 pt-0"
            :input-value="isPeriod"
            @change="toggleService('isPeriod')"
            label="Only period of service was as a non-activated member of the Reserve or National Guard"
          ></v-checkbox>
        </v-col>
        <v-col class="itemContainer" cols="12" sm="12">
          <v-checkbox
            dense
            hide-details
            class="defaultCheckbox mt-0 pt-0"
            label="Surviving spouse"
            :input-value="isSpouse"
            @change="toggleService('isSpouse')"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import military from "@/mixins/military.js";
import { mapGetters, mapActions } from "vuex";
import DateInput from "@/components/form/DateInput";

export default {
  mixins: [military],
  methods: {
    ...mapActions(["updateBorrower", "updateMilitary"])
  },
  data() {
    return {
      minDate: new Date().toISOString().slice(0, 10)
    };
  },
  computed: {
    ...mapGetters({
      MilitaryServices: "getMilitaryServices",
      Borrower: "getBorrower"
    }),
    selectedDate() {
      const activeType = this.MilitaryServices.find(
        item => item.MilitaryStatusType === "ActiveDuty"
      );
      return activeType == null
        ? null
        : activeType.MilitaryServiceExpectedCompletionDate;
    },
    isSpouse() {
      return this.Borrower.SpousalVABenefitsEligibilityIndicator || false;
    },
    isPicker() {
      const activeType = this.MilitaryServices.find(
        item => item.MilitaryStatusType === "ActiveDuty"
      );
      return !!activeType;
    },
    isDisabled() {
      const activeType = this.MilitaryServices.find(
        item => item.MilitaryStatusType === "ActiveDuty"
      );
      return activeType && !activeType.MilitaryServiceExpectedCompletionDate;
    }
  },
  components: {
    DateInput
  }
};
</script>
