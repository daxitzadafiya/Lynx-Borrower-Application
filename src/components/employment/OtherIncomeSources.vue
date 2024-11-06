<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please indicate if you receive income from any other sources</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="typesTitles" multiple="multiple" @change="setTypes">
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in types" :key="index" :value="item.value" lgVal="" :mdVal="3">
            <inline-svg :src="item.src" class="noStroke"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
    </div>
  </div>
            
</template>

<script>
import ToggleCard from "@/components/controls/ToggleCard";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      types: [
        {
          src: require("@/assets/images/employment/pension1.svg"),
          title: "Pension",
          value: "Pension"
        },
        {
          src: require("@/assets/images/employment/social-security.svg"),
          title: "Social Security",
          value: "SocialSecurity"
        },
        {
          src: require("@/assets/images/employment/dividends.svg"),
          title: "Dividends/Interest",
          value: "DividendsInterest"
        },
        {
          src: require("@/assets/images/employment/child.svg"),
          title: "Child Support",
          value: "ChildSupport"
        },
        {
          src: require("@/assets/images/employment/loupe.svg"),
          title: "Other",
          value: "Other"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setTypes(types) {
      let income = [...this.OtherIncome];
      let position = types.findIndex(x => income.findIndex(y => y.IncomeType === x) === -1);
      if (position !== -1) {
        income.push({ IncomeType: types[position], EmploymentIncomeIndicator: true });
      } else {
        position = income.findIndex(x => !types.includes(x.IncomeType));
        income.splice(position, 1);
      }
      this.updateBorrower({ prop: "OtherIncome", value: income });
    }
  },
  computed: {
    ...mapGetters({
      OtherIncome: "getOtherIncome"
    }),
    typesTitles() {
      return this.OtherIncome.map(item => item.IncomeType);
    },
    nextRoute() {
      return this.OtherIncome.length
        ? "/employmentandincome/other-income-details"
        : "/employmentandincome/review";
    }
  },
  components: {
    ToggleCard
  }
};
</script>
