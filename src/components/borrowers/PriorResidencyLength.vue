<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        How long have you lived at
        {{ priorResidence ? priorResidence.AddressLineText : "" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input
          :isRequired="true"
          inputTitle="Years"
          pattern="[0-9]*"
          :value="period.years"
          @change="e => updatePeriod(e, 'years')"
          @keypress="e => isOnlyNum(e)"
        />
        <Input
          :isRequired="true"
          inputTitle="Months"
          pattern="[0-9]*"
          :value="period.months"
          @change="e => updatePeriod(e, 'months')"
          @keypress="e => isOnlyNum(e)"
        />
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
import onlyNum from "@/mixins/onlyNum.js";
import residencyLength from "@/mixins/residencyLength.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, residencyLength],
  data() {
    return {
      type: "Prior"
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp"])
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence"
    }),
    priorResidence() {
      return this.getSpecificResidence("Prior");
    },
    period() {
      let result = { years: "", months: "" };
      if (this.priorResidence.ResidencyDurationMonthsCount) {
        if (this.priorResidence.ResidencyDurationMonthsCount >= 12) {
          const years =
            Math.floor(
              +this.priorResidence.ResidencyDurationMonthsCount / 12
            ) || "";
          const months =
            this.priorResidence.ResidencyDurationMonthsCount % 12 || "";
          result = { years, months };
        } else {
          result.months = this.priorResidence.ResidencyDurationMonthsCount;
        }
      }
      return result;
    },
    isNextButtonDisabled() {
      return this.period.years === "" || this.period.months === "";
    }
  }
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
}
</style>
