<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Since you've indicated you're self employed, please select your ownership percentage</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="percentage" @change="setPercentage">
        <v-row class="form-container">
          <ToggleCard v-for="item in percentages" :key="item.title" :value="item.title">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!percentage"></NavigationButtons>
    </div>
  </div>
            
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  data() {
    return {
      percentages: [
        {
          src: require("@/assets/images/employment/ownership-share.svg"),
          title: "My Ownership Share is < 25%"
        },
        {
          src: require("@/assets/images/employment/ownership-share.svg"),
          title: "My Ownership Share is 25% or Greater"
        }
      ],
      statusType: "Current",
      classificationType: "Primary",
      routePrepend: ""
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setPercentage(percentage) {
      const interest =
        percentage === "My Ownership Share is 25% or Greater"
          ? "GreaterThanOrEqualTo25Percent"
          : "LessThan25Percent";
      if (this.currentEmployment.EmploymentClassificationType === "Secondary") {
        return this.setAdditionalEmploymentPercentage(interest);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const Employment = this.Employment.map(item => {
          if (
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
          ) {
            item.OwnershipInterestType = interest;
          }
          return item;
        });
        this.updateBorrower({ prop: "Employment", value: Employment });
      } else {
        this.updateBorrower({
          prop: "Employment",
          value: [
            ...this.Employment,
            {
              EmploymentStatusType: this.statusType,
              EmploymentClassificationType: this.classificationType,
              OwnershipInterestType: interest
            }
          ]
        });
      }
    },
    setAdditionalEmploymentPercentage(interest) {
      let additionals = [...this.additionalEmployments];
      additionals[this.employmentEditingIndex] = {
        ...this.currentEmployment,
        OwnershipInterestType: interest
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
    percentage() {
      if (this.currentEmployment.OwnershipInterestType == undefined) return "";
      return this.currentEmployment.OwnershipInterestType ===
        "GreaterThanOrEqualTo25Percent"
        ? "My Ownership Share is 25% or Greater"
        : "My Ownership Share is < 25%";
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
