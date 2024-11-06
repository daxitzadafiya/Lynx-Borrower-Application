<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ mainTitle }}</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :value="activeType"
        @change="setType"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in allTypes"
            :key="index"
            :value="item.title"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="!activeType"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  data() {
    return {
      types: [
        { src: require("@/assets/images/employment/w2.svg"), title: "W2" },
        {
          src: require("@/assets/images/employment/self-employed.svg"),
          title: "Self Employed"
        },
        {
          src: require("@/assets/images/employment/retired-unemployed.svg"),
          title: "Not Employed"
        }
      ],
      statusType: "Current",
      classificationType: "Primary",
      routePrepend: "",
      isNotEmployed: false
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setType(type) {
      if (type === "Not Employed") {
        return this.handleNotEmployed();
      }
      this.isNotEmployed = false;
      const isSelfEmployed = type === "Self Employed";
      if (this.classificationType === "Secondary") {
        return this.setAdditionalEmploymentType(isSelfEmployed);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const Employment = this.Employment.map(item => {
          if (
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
          ) {
            item.EmploymentBorrowerSelfEmployedIndicator = isSelfEmployed;
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
              EmploymentBorrowerSelfEmployedIndicator: isSelfEmployed
            }
          ]
        });
      }
    },
    setAdditionalEmploymentType(isSelfEmployed) {
      let additionals = [...this.additionalEmployments];
      additionals[this.employmentEditingIndex] = {
        ...this.currentEmployment,
        EmploymentBorrowerSelfEmployedIndicator: isSelfEmployed
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
    handleNotEmployed() {
      this.isNotEmployed = true;
      const employments = this.Employment.filter(
        item =>
          item.EmploymentClassificationType !== this.classificationType &&
          item.EmploymentStatusType !== this.statusType
      );
      this.updateBorrower({ prop: "Employment", value: employments });
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
    activeType() {
      if (this.isNotEmployed) return "Not Employed";
      if (
        this.currentEmployment.EmploymentBorrowerSelfEmployedIndicator ==
        undefined
      ) {
        return "";
      }
      return this.currentEmployment.EmploymentBorrowerSelfEmployedIndicator
        ? "Self Employed"
        : "W2";
    },
    allTypes() {
      return this.classificationType === "Primary"
        ? this.types
        : this.types.slice(0, 2);
    },
    mainTitle() {
      let result = "Please select your employment status below.  If you are not currently employed or receive income from other sources such as retirement, interest income, child support, then please indicate not employed.";
      if (this.classificationType === "Secondary") {
        result =
          "For this Additional Employment, are you earning W2 or Self Employed Wages?";
      }
      if (this.statusType === "Previous") {
        result = "Did you earn W2 or Self-Employed Wages?";
      }
      return result;
    }
  },
  // For dev purposes
  watch: {
    "$route.meta": {
      handler: function() {
        this.handleRouteMeta();
      },
      deep: true,
      immediate: true
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
