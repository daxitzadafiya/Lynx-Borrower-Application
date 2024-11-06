<template>
  <div style="display:contents;">
    <v-row
      class="form-container deleteAbleItem"
      v-for="(item, index) in income"
      :key="index"
    >
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input
        defaultComponent="v-combobox"
        :menu-props="{ light: true }"
        :value="item.IncomeType"
        :items="filteredTypes"
        inputTitle="Compensation Type"
        @change="(e) =&gt; setType(e, index)"
      />
      <Input
        defaultComponent="v-combobox"
        attach="attach"
        v-if="item.IncomeType === 'Other'"
        :menu-props="{ light: true }"
        :value="item.IncomeTypeOtherDescription"
        :items="otherCompensationTypes(item.IncomeTypeOtherDescription)"
        inputTitle="Other Compensation Type"
        @update:search-input="(e) =&gt; setTypeText(e, index)"
      />
      <v-col
        class="itemContainer"
        cols="12"
        v-if="
          item.IncomeType === 'Overtime' ||
            item.IncomeType === 'Bonus' ||
            item.IncomeType === 'Commission'
        "
      >
        <div class="mb-3 agree-title">
          Will you continue to receive this type of income going forward?
        </div>
        <AgreeToggle
          :options="willContinueToReceiveTypes"
          :value="item.WillContinueToRecieveGoingForward"
          @input="(e) =&gt; setWillContinueToReceiveType(e, index)"
        ></AgreeToggle>
      </v-col>
      <Input
        prefix="$"
        inputTitle="Gross Monthly Income"
        :value="getFormattedValue(item.CurrentIncomeMonthlyTotalAmount)"
        @input="(e) =&gt; setAmount(+e.replace(/,/g, ''), index)"
        @keypress="(e) =&gt; isOnlyNum(e, true)"
      />
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional = null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input
        defaultComponent="v-combobox"
        attach="attach"
        :menu-props="{ light: true }"
        :value="additional.IncomeType"
        :items="filteredTypes"
        inputTitle="Compensation Type"
        @change="setAdditionalType"
      />
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addType"
          v-if="filteredTypes.length"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add Compensation</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import { mapGetters, mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  mixins: [onlyNum, currencyFormat, debtToIncomeAndhousingRatios],
  props: {
    status: {
      type: String,
      default: ""
    },
    classification: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      types: ["Base", "Overtime", "Bonus", "Commission", "Other"],
      willContinueToReceiveTypes: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Unsure", value: "Unsure" }
      ],
      additional: null,
      statusType: "Current",
      classificationType: "Primary"
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setEmploymentIncome(prop, val, index) {
      const Income = this.income.map((item, i) =>
        index !== i ? item : { ...item, [prop]: val }
      );
      this.setEmploymentProp("Income", Income);
    },
    setWillContinueToReceiveType(val, index) {
      const Income = this.income.map((item, i) =>
        index !== i
          ? item
          : { ...item, ["WillContinueToRecieveGoingForward"]: val }
      );
      this.setEmploymentProp("Income", Income);
    },
    setEmploymentProp(prop, value) {
      if (this.currentEmployment.EmploymentClassificationType === "Secondary") {
        return this.setAdditionalEmploymentProp(prop, value);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const employments = this.Employment.map(item => {
          return item.EmploymentClassificationType ===
            this.classificationType &&
            item.EmploymentStatusType === this.statusType
            ? { ...item, [prop]: value }
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
            [prop]: value
          }
        ]
      });
    },
    setAdditionalEmploymentProp(prop, val) {
      let additionals = [...this.additionalEmployments];
      additionals[this.employmentEditingIndex] = {
        ...this.currentEmployment,
        [prop]: val
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
    setTypeText(val, index) {
      this.setEmploymentIncome("IncomeTypeOtherDescription", val, index);
    },
    setType(val, index) {
      if (val !== "Other") {
        this.setEmploymentIncome("IncomeTypeOtherDescription", null, index);
      }
      this.setEmploymentIncome("IncomeType", val, index);
    },
    setAmount(val, index) {
      this.setEmploymentIncome("CurrentIncomeMonthlyTotalAmount", val, index);
    },
    setAdditionalType(type) {
      const Income = [
        ...this.income,
        {
          IncomeType: type,
          EmploymentIncomeIndicator: true
        }
      ];
      this.setEmploymentProp("Income", Income);
      this.additional = null;
    },
    remove(index) {
      const filtered = this.income.filter((item, i) => index !== i);
      this.setEmploymentProp("Income", filtered);
    },
    addType() {
      this.additional = { IncomeType: "" };
    },
    otherCompensationTypes(incomeTypeOtherDescription) {
      let compensationTypes = [
        "Tip Income",
        "Shift Differential",
        "Auto Allowance"
      ];
      if (
        incomeTypeOtherDescription == null ||
        incomeTypeOtherDescription === "" ||
        compensationTypes.includes(incomeTypeOtherDescription)
      ) {
        return compensationTypes;
      }
      compensationTypes.push(incomeTypeOtherDescription);
      return compensationTypes;
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment",
      additionalEmployments: "getAdditionalEmployments",
      employmentIndex: "getAdditionalEmploymentIndex"
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
    employmentEditingIndex() {
      return this.index !== -1 ? this.index : this.employmentIndex;
    },
    income() {
      return this.currentEmployment.Income || [];
    },
    total() {
      return this.income.length
        ? this.income.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
                ? +cur.CurrentIncomeMonthlyTotalAmount
                : 0),
            0
          )
        : 0;
    },
    filteredTypes() {
      const incomeTypes = this.income.map(item => item.IncomeType);
      return this.types.filter(item => incomeTypes.indexOf(item) === -1);
    }
  },
  watch: {
    total: function(val) {
      this.setEmploymentProp("EmploymentMonthlyIncomeAmount", val);
    },
    Employment: {
      deep: true,
      handler() {
        this.setDebtToIncomeAndHousingRatios();
      }
    }
  },
  beforeMount() {
    const { status, classification } = this.$route.meta;
    this.statusType = this.status || status;
    this.classificationType = this.classification || classification;
  },
  components: {
    AgreeToggle
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/variables";
.agree-title {
  color: #000;
  z-index: 5;
  position: relative;
}

:deep(.v-item-group) {
  background-color: transparent !important;
  justify-content: flex-start;
}
</style>
