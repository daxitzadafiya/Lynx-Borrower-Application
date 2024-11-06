<template>
  <div style="display:contents;">
    <Input inputTitle="Position or Title" :value="currentEmployment.EmploymentPositionDescription" @input="setPosition" :lgVal="statusType === 'Current'?4:null"></Input>
    <DateInput inputTitle="Start Date" :lgVal="statusType === 'Current'?4:null" @dateUpdated="updateDate" @dateCleared="clearStartDate" :value="currentEmployment.EmploymentStartDate" :maxDate="maxDate"></DateInput>
    <Input inputTitle="Time on job" :value="timeOnJob" disabled="disabled" v-if="statusType === 'Current'" hide-details="hide-details" placeholder="" :lgVal="4"></Input>
    <DateInput v-if="statusType === 'Previous'" inputTitle="End Date" @dateUpdated="updateEndDate" @dateCleared="clearEndDate" :value="currentEmployment.EmploymentEndDate" :maxDate="maxDate"></DateInput>
    <template v-else>
      <v-col class="pb-0" sm="12" cols="12">
        <div class="titleText">How long have you been employed in this line of work?</div>
      </v-col>
      <Input inputTitle="Line of Work Years" inputmode="numeric" pattern="[0-9]*" :value="duration.years" @input="setYears" @keypress="isOnlyNum" v-mask="'##'"></Input>
      <Input inputTitle="Line of Work Months" inputmode="numeric" pattern="[0-9]*" :value="duration.months" @input="setMonths" @keypress="isOnlyNum" v-mask="'##'"></Input>
    </template>
    <slot></slot>
    <Input v-if="hasIncomeLossData" inputTitle="Monthly Income or Loss" prefix="$" :value="currentEmployment.EmploymentMonthlyIncomeAmount ? getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount) : ''" @input="(e) => setEmploymentProp('EmploymentMonthlyIncomeAmount', parseInt(e.replace(/,/g, '')))" @keypress="(e) => isOnlyNum(e, true, true)"></Input>
  </div>
</template>

<script>
import moment from "moment";
import currencyFormat from "@/mixins/currencyFormat.js";
import onlyNum from "@/mixins/onlyNum.js";
import { mapGetters, mapActions } from "vuex";
import DateInput from "@/components/form/DateInput"

export default {
  mixins: [onlyNum, currencyFormat],
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
    },
    hasIncomeLossData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMenu: false,
      isEndMenu: false,
      statusType: "Current",
      classificationType: "Primary"
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setEmploymentProp(prop, val) {
      if (this.currentEmployment.EmploymentClassificationType === "Secondary") {
        return this.setAdditionalEmploymentProp(prop, val);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const Employment = this.Employment.map(item => {
          if (
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
          ) {
            item[prop] = val;
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
              [prop]: val
            }
          ]
        });
      }
    },
    clearEndDate(){
      this.updateEndDate(null);
      this.isMenu=false;
    },
    clearStartDate(){
      this.updateDate(null);
      this.isMenu=false;
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
    setPosition(val) {
      this.setEmploymentProp("EmploymentPositionDescription", val);
    },
    setYears(val) {
      const totalMonths = this.duration.months + +val * 12;
      this.setEmploymentProp(
        "EmploymentTimeInLineOfWorkMonthsCount",
        totalMonths
      );
    },
    setMonths(val) {
      const totalMonths = this.duration.years * 12 + +val;
      this.setEmploymentProp(
        "EmploymentTimeInLineOfWorkMonthsCount",
        totalMonths
      );
    },
    updateDate(date) {
      this.setEmploymentProp(
        "EmploymentStartDate",
        date == null ? null: moment(date).format("YYYY-MM-DD")
      );
    },
    updateEndDate(date) {
      this.setEmploymentProp(
        "EmploymentEndDate",
        date == null ? null: moment(date).format("YYYY-MM-DD")
      );
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
    selectedDate() {
      return this.currentEmployment.EmploymentStartDate
        ? moment(this.currentEmployment.EmploymentStartDate).format(
            "MMMM DD, YYYY"
          )
        : "";
    },
    selectedEndDate() {
      return this.currentEmployment.EmploymentEndDate
        ? moment(this.currentEmployment.EmploymentEndDate).format(
            "MMMM DD, YYYY"
          )
        : "";
    },
    maxDate() {
      return new Date().toISOString().slice(0, 10);
    },
    duration() {
      let years = 0;
      let months = 0;
      if (this.currentEmployment.EmploymentTimeInLineOfWorkMonthsCount) {
        months =
          this.currentEmployment.EmploymentTimeInLineOfWorkMonthsCount % 12;
        years =
          (this.currentEmployment.EmploymentTimeInLineOfWorkMonthsCount -
            months) /
          12;
      }
      return { years, months };
    },
    startPickerDate() {
      return this.selectedDate
        ? moment(new Date(this.selectedDate)).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");
    },
    endPickerDate() {
      return this.selectedEndDate
        ? moment(new Date(this.selectedEndDate)).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");
    },
    timeOnJob() {
      if (this.currentEmployment.EmploymentStartDate) {
        var currenDate = moment(new Date());
        var endDate = moment(this.currentEmployment.EmploymentStartDate);
        let returnText = "";
        let yearDiff = currenDate.diff(endDate, "year");
        if (yearDiff !== 0) {
          endDate.add(yearDiff, "years");
          returnText += `${yearDiff} year${yearDiff === 1 ? "" : "s"}`;
        }
        let monthsDiff = currenDate.diff(endDate, "months");
        if (monthsDiff !== 0) {
          if (returnText !== "") {
            returnText += " and ";
          }
          returnText += `${monthsDiff} month${monthsDiff === 1 ? "" : "s"}`;
        }
        return returnText;
      }
      return "";
    },
  },
  beforeMount() {
    const { status, classification } = this.$route.meta;
    this.statusType = this.status || status;
    this.classificationType = this.classification || classification;
  },
  components:{
    DateInput
  }
};
</script>