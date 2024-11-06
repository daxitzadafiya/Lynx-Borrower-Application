<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">How long have you lived at {{ currentResidence ? currentResidence.AddressLineText : '' }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input :isRequired="true" inputTitle="Years" pattern="[0-9]*" :value="period.years" @change="(e) => updatePeriod(e, 'years')"
          @keypress="(e) => isOnlyNum(e)"></Input>
        <Input :isRequired="true" inputTitle="Months" pattern="[0-9]*" :value="period.months" @change="(e) => updatePeriod(e, 'months')"
          @keypress="(e) => isOnlyNum(e)"> </Input>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import residencyLength from "@/mixins/residencyLength.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, residencyLength],
  data() {
    return {
      type: "Current",
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp"]),
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence",
    }),
    currentResidence() {
      return this.getSpecificResidence("Current");
    },
    period() {
      let result = { years: "", months: "" };
      if (this.currentResidence.ResidencyDurationMonthsCount) {
        if (this.currentResidence.ResidencyDurationMonthsCount >= 12) {
          const years =
            Math.floor(+this.currentResidence.ResidencyDurationMonthsCount / 12) || "";
          const months = this.currentResidence.ResidencyDurationMonthsCount % 12 || "";
          result = { years, months };
        } else {
          result.months = this.currentResidence.ResidencyDurationMonthsCount;
        }
      }
      return result;
    },
    isNextButtonDisabled() {
      return (
        (this.period.years == null || this.period.years.length === 0) &&
        (this.period.months == null || this.period.months.length === 0)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/residency.scss";

@media (max-width: 768px) {
  .text-block {
    &__row {
      &:last-child {
        justify-content: flex-start;
      }
    }
  }
}

@media (max-width: 450px) {
  .text-block {
    &__row {
      &:last-child {
        justify-content: space-between;
      }
    }
  }
}</style>
