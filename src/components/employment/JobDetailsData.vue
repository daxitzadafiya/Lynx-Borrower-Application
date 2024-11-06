<template>
  <v-form class="fast-fail form-outer-container">
    <v-row class="form-container">
      <Input inputTitle="Position or Title" :value="currentEmployment.EmploymentPositionDescription" @input="setPosition" hide-details="hide-details"></Input>
      <DateInput inputTitle="Start Date" @dateUpdated="updateDate" @dateCleared="clearUpdateDate" :value="currentEmployment==null?null:currentEmployment.EmploymentStartDate" :maxDate="maxDate"></DateInput>
      <Input inputTitle="Time on job" :value="timeOnJob" disabled="disabled" v-if="statusType === 'Current'" hide-details="hide-details" placeholder=""></Input>
      <DateInput inputTitle="End Date" v-if="statusType === 'Previous'" @dateUpdated="updateEndDate" @dateCleared="clearEndDate" :value="currentEmployment==null?null:currentEmployment.EmploymentEndDate" :maxDate="maxDate"></DateInput>
      <template v-else>
        <v-col class="itemContianer pb-0" sm="12" cols="8" v-if="statusType === 'Current'">How long have you been employed in this line of work?</v-col>
        <v-col class="itemContianer pb-0" sm="12" cols="8" v-else>How long had you been employed in this line of work?</v-col>
        <Input :smVla="4" :mdVal="3" :lgVal="3" inputTitle="Years" inputmode="numeric" pattern="[0-9]*" :value="duration.years" @input="setYears" @keypress="isOnlyNum" v-mask="'##'" hide-details="hide-details"></Input>
        <Input :smVal="4" :mdVal="3" :lgVal="3" inputTitle="Months" inputmode="numeric" pattern="[0-9]*" :value="duration.months" @input="setMonths" @keypress="isOnlyNum" v-mask="'##'"></Input>
      </template>
      <Input inputTitle="Employer or Business Name" :value="currentEmployment.FullName" hide-details="hide-details" @input="(val) => setEmploymentProp('FullName', val)"></Input>
      <Input inputTitle="Employer Phone" inputmode="tel" pattern="[0-9]*" :value="currentEmployment.PhoneNumber ? this.getFormattedPhone(currentEmployment.PhoneNumber) : ''" @input="(e) => setEmploymentProp('PhoneNumber', e)" @keypress="(e) => validatePhone(e)" hide-details="hide-details"></Input>
      <Input inputTitle="Ext" :value="currentEmployment.Ext || ''" type="number" hide-details="hide-details"></Input>
      <Input :id="inputId" @focus="geolocate" placeholder="" inputTitle="Employer Address" :value="currentEmployment.AddressLineText" @change="(val) => setEmploymentProp('AddressLineText', val)" hide-details="hide-details"></Input>
      <Input inputTitle="Unit #" :value="currentEmployment.AddressUnitIdentifier" @input="(val) => setEmploymentProp('AddressUnitIdentifier', val)" hide-details="hide-details"></Input>
      <Input inputTitle="Zip Code" :value="currentEmployment.PostalCode" @input="(val) => setEmploymentProp('PostalCode', val ? val.replace(/-/g,'') : '')" v-mask="'#####-####'" hide-details="hide-details"></Input>
      <Input inputTitle="City" :value="currentEmployment.CityName" @input="(val) => setEmploymentProp('CityName', val)" hide-details="hide-details"></Input>
      <Input inputTitle="State" :value="currentEmployment.StateCode" @input="(val) => setEmploymentProp('StateCode', val)" hide-details="hide-details"></Input>
      <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" :value="currentEmployment.CountryCode" :items="countries" inputTitle="Country" @change="(val) => setEmploymentProp('CountryCode', val)" hide-details="hide-details"></Input>
      <Input inputTitle="Monthly Income or Loss" prefix="$" :value="currentEmployment.EmploymentMonthlyIncomeAmount ? getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount) : ''" @input="(e) => setEmploymentProp('EmploymentMonthlyIncomeAmount', parseInt(e.replace(/,/g, '')))" @keypress="(e) => isOnlyNum(e, true, true)" hide-details="hide-details"></Input>
    </v-row>
  </v-form>
</template>

<script>
import moment from "moment";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
import phoneFormat from "@/mixins/phoneFormat";
import googleAutoComplete from "@/mixins/googleAutoComplete.js";
import DateInput from "@/components/form/DateInput";

export default {
  mixins: [phoneFormat, onlyNum, googleAutoComplete, currencyFormat],
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
  components: {
    DateInput
  },
  data() {
    return {
      isMenu: false,
      isEndMenu: false,
      countries: ["United States"],
      statusType: "Current",
      classificationType: "Primary"
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    validatePhone(e) {
      if (e.target.value.length === 14) {
        e.preventDefault();
        return false;
      }
      return this.isOnlyNum(e);
    },
    clearEndDate(){
      this.updateEndDate(null);
      this.isEndMenu=false;
    },
    clearUpdateDate(){
      this.updateDate(null);
      this.isMenu=false
    },
    handleAddressData(addressData) {
      const Employments = [...this.Employment];
      const updatedEmployment = { ...this.currentEmployment, ...addressData };
      if (this.classificationType !== "Secondary") {
        const primaryIndex = Employments.findIndex(
          item =>
            item &&
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
        );
        if (primaryIndex !== -1) {
          Employments[primaryIndex] = updatedEmployment;
        } else {
          Employments.push(updatedEmployment);
        }
        this.updateBorrower({ prop: "Employment", value: Employments });
      } else {
        this.setAdditionalEmploymentProp(null, updatedEmployment);
      }
    },
    setEmploymentProp(prop, val) {
      if (prop.indexOf("Phone") !== -1) {
        val = val.replace(/[()]|-| /g, "");
      }
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
    setAdditionalEmploymentProp(prop, val) {
      if (prop.indexOf("Phone") !== -1) {
        val = val.replace(/[()]|-| /g, "");
      }
      let additionals = [...this.additionalEmployments];
      if (!prop) {
        additionals[this.employmentEditingIndex] = { ...val };
      } else {
        additionals[this.employmentEditingIndex] = {
          ...this.currentEmployment,
          [prop]: val
        };
      }
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
        date==null?null:moment(date).format("YYYY-MM-DD")
      );
    },
    updateEndDate(date) {
      this.setEmploymentProp(
        "EmploymentEndDate",
        date==null?null:moment(date).format("YYYY-MM-DD")
      );
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment",
      additionalEmployments: "getAdditionalEmployments",
      employmentIndex: "getAdditionalEmploymentIndex"
    }),
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
  },
  beforeMount() {
    const { status, classification } = this.$route.meta;
    this.statusType = this.status || status;
    this.classificationType = this.classification || classification;
    this.inputId = this.statusType.toLowerCase();
  }
};
</script>