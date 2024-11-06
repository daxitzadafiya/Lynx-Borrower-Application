<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select the types of compensation you receive from {{ currentEmployment.FullName || "your current employment" }}</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="typesTitles" multiple="multiple" @change="setTypes">
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in types" :key="index" :value="item.title" mdVal="" smVal="4">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  data() {
    return {
      types: [
        {
          src: require("@/assets/images/employment/base.svg"),
          title: "Base"
        },
        {
          src: require("@/assets/images/employment/overtime.svg"),
          title: "Overtime"
        },
        {
          src: require("@/assets/images/employment/bonus.svg"),
          title: "Bonus"
        },
        {
          src: require("@/assets/images/employment/commission.svg"),
          title: "Commission"
        },
        {
          src: require("@/assets/images/employment/other.svg"),
          title: "Other"
        }
      ],
      statusType: "Current",
      classificationType: "Primary",
      routePrepend: ""
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setTypes(types) {
      let Income = this.currentEmployment.Income || [];
      let position = types.findIndex(x=>Income.findIndex(y=>y.IncomeType===x)===-1);
      if (position !== -1) {
        Income.push({ IncomeType: types[position], EmploymentIncomeIndicator: true });
      } else {
        position = Income.findIndex(x=>!types.includes(x.IncomeType));
        Income.splice(position, 1);
      }
      this.updateEmloymentIncome(Income);
    },
    updateEmloymentIncome(Income) {
      if (this.currentEmployment.EmploymentClassificationType === "Secondary") {
        return this.setAdditionalEmploymentType(Income);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const employments = this.Employment.map(item => {
          return item.EmploymentClassificationType ===
            this.classificationType &&
            item.EmploymentStatusType === this.statusType
            ? { ...item, Income }
            : item;
        });
        return this.updateBorrower({ prop: "Employment", value: employments });
      }
      this.updateBorrower({
        prop: "Employment",
        value: [
          ...this.Employment,
          {
            EmploymentStatusType: this.statusType,
            EmploymentClassificationType: this.classificationType,
            Income
          }
        ]
      });
    },
    setAdditionalEmploymentType(Income) {
      let additionals = [...this.additionalEmployments];
      additionals[this.employmentEditingIndex] = {
        ...this.currentEmployment,
        Income
      };
      const filtered = this.Employment.length
        ? this.Employment.filter(
            item => item.EmploymentClassificationType !== "Secondary"
          )
        : [];
      this.updateBorrower({
        prop: "Employment",
        value: [...filtered, ...additionals]
      });
    },
    handleRouteMeta() {
      const { status, classification } = this.$route.meta;
      this.statusType = status;
      this.classificationType = classification;
      if (status !== "Current" || classification !== "Primary") {
        this.routePrepend =
          status !== "Current" ? `${status.toLowerCase()}-` : "additional-";
      }
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment",
      additionalEmployments: "getAdditionalEmployments",
      employmentEditingIndex: "getAdditionalEmploymentIndex"
    }),
    currentEmployment() {
      if (this.classificationType === "Secondary") {
        return (
          this.additionalEmployments[this.employmentEditingIndex] || {
            EmploymentClassificationType: "Secondary"
          }
        );
      }
      if (this.Employment.length) {
        const employment = this.Employment.find(
          item =>
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
        );
        return employment || {};
      }
      return {};
    },
    typesTitles() {
      if (!this.currentEmployment.Income) return [];
      return this.currentEmployment.Income.map(item => item.IncomeType);
    }
  },
  components: {
    ToggleCard
  },
  beforeMount() {
    this.handleRouteMeta();
  }
};
</script>