<template lang="pug">
  <v-form class="fast-fail form-outer-container">
    <v-row class="form-container deleteAbleItem" v-for="(item, index) in OtherIncome" :key="index">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-combobox" :menu-props="{light: true}" :value="item.IncomeType ? item.IncomeType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''" :items="filteredTypes" inputTitle="Compensation Type" @change="(e) => setType(e, index)"></Input>
      <DateInput inputTitle="Start Date of Income" @dateUpdated="(date) => setOtherIncome('StartDate', date, index)" @dateCleared="()=>clearDate(index, 'StartDate')" :value="item.StartDate"></DateInput>
      <Input prefix="$" inputTitle="Gross Monthly Income" :value="getFormattedValue(item.CurrentIncomeMonthlyTotalAmount)" @input="(e) => setAmount(+e.replace(/,/g, ''), index)" @keypress="(e) => isOnlyNum(e, true)"></Input>
      <v-col class="itemContainer pb-0" sm="12">
        <div class="titleText">For how long do you expect to receive this type of income</div>
      </v-col>
      <v-col class="itemContainer d-flex pt-0" sm="auto">
        <v-checkbox class="defaultCheckbox" label="Ongoing" :input-value="item.Ongoing" @change="(e) => setOngoing(e, index)" hide-details="hide-details"></v-checkbox>
        <div class="titleText pt-5 mt-4 pl-3">Or</div>
      </v-col>
      <v-col class="itemContainer d-flex pt-0" sm="auto">
        <v-checkbox class="defaultCheckbox" label="Unsure" :input-value="item.Unsure" @change="(e) => setUnsure(e, index)" hide-details="hide-details"></v-checkbox>
        <div class="titleText pt-5 mt-4 pl-3"> Or</div>
      </v-col>
      <DateInput class="pt-0" inputTitle="Expected End Date" :disabled="item.OngoingUnsure == true" @dateUpdated="(date) => setEndDate(date, index)" @dateCleared="()=>clearDate(index, 'EndDate')" :value="item.EndDate"></DateInput>
      <v-col class="itemContainer d-flex pt-0 pl-0" sm="auto">
        <div class="titleText pt-5 mt-4">?</div>
      </v-col>
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional=null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input attach="attach" defaultComponent="v-combobox" :menu-props="{light: true}" :value="additional.IncomeType" :items="filteredTypes" inputTitle="Compensation Type" @change="setAdditionalType"></Input>
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn class="addItemBtn" dense="dense" plain="plain" elevation="0" @click="addType" v-if="filteredTypes.length">
          <v-icon small="small">mdi-plus</v-icon><span class="addBtnText">Add Other Income Source</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12">Total: ${{ getFormattedValue(total) || 0 }}</v-col>
    </v-row>
  </v-form>

</template>

<script>
import DateInput from "@/components/form/DateInput";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  mixins: [onlyNum, currencyFormat, debtToIncomeAndhousingRatios],
  data() {
    return {
      startDateMenuOpenIndex: -1,
      endDateMenuOpenIndex: -1,
      menuOpenedStartDate: null,
      menuOpenedEndDate: null,
      types: [
        "Accessory Unit Iincome",
        "Alimony",
        "Automobile Allowance",
        "Boarder Income",
        "Capital Gains",
        "Child Support",
        "Defined Contribution Plan",
        "Disability",
        "Dividends Interest",
        "Employment Related Account",
        "Foster Care",
        "Housing Allowance",
        "Housing Choice Voucher Program",
        "Mortgage Credit Certificate",
        "Mortgage Differential",
        "Non Borrower Household Income",
        "Notes Receivable Installment",
        "Pension",
        "Public Assistance",
        "Royalties",
        "Separate Maintenance",
        "Social Security",
        "Temporary Leave",
        "Tip Income",
        "Trust",
        "Unemployment",
        "VABenefits Non Educational",
        " Other"
      ],
      additional: null,
      currentDate: new Date().toISOString().slice(0, 10)
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setOtherIncome(prop, val, index) {
      const Income = this.OtherIncome.map((item, i) =>
        index !== i ? item : { ...item, [prop]: val }
      );
      this.updateBorrower({ prop: "OtherIncome", value: Income });
    },
    clearDate(index, date) {
      this.removeProp(index, date);
      if (date == "StartDate") {
        this.startDateMenuOpenIndex = -1;
      } else {
        this.endDateMenuOpenIndex = -1;
      }
    },
    setType(val, index) {
      this.setOtherIncome("IncomeType", val.replace(/ /g, ""), index);
    },
    setAmount(val, index) {
      this.setOtherIncome("CurrentIncomeMonthlyTotalAmount", val, index);
    },
    setOngoing(val, index) {
      this.setOtherIncome("Ongoing", val, index);
      this.setOtherIncome("Unsure", !val, index);
      this.setOtherIncome("EndDate", null, index);
    },
    setUnsure(val, index) {
      this.setOtherIncome("Ongoing", !val, index);
      this.setOtherIncome("Unsure", val, index);
      this.setOtherIncome("EndDate", null, index);
    },
    setEndDate(val, index) {
      this.setOtherIncome("Ongoing", !val, index);
      this.setOtherIncome("Unsure", !val, index);
      this.setOtherIncome("EndDate", val, index);
    },
    setAdditionalType(type) {
      if (!type) return;
      const Income = [
        ...this.OtherIncome,
        {
          IncomeType: type.replace(/ /g, ""),
          EmploymentIncomeIndicator: false,
          StartDate: moment(new Date()).format("YYYY-MM-DD")
        }
      ];
      this.updateBorrower({ prop: "OtherIncome", value: Income });
      this.additional = null;
    },
    removeProp(index, prop) {
      let income = [...this.OtherIncome];
      delete income[index][prop];
      this.updateBorrower({ prop: "OtherIncome", value: income });
    },
    remove(index) {
      const filtered = this.OtherIncome.filter((item, i) => index !== i);
      this.updateBorrower({ prop: "OtherIncome", value: filtered });
    },
    addType() {
      this.additional = { IncomeType: "" };
    },
    getSelectedDateProp(index, propDateName) {
      const currentIncomeItem = this.OtherIncome[index];
      return currentIncomeItem && currentIncomeItem[propDateName]
        ? moment(currentIncomeItem[propDateName]).format("MMMM DD, YYYY")
        : "";
    },
    getFormatedDate(index, propDateName) {
      const selectedDate = this.getSelectedDateProp(index, propDateName);
      return selectedDate
        ? moment(new Date(selectedDate)).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");
    }
  },
  computed: {
    ...mapGetters({
      OtherIncome: "getOtherIncome"
    }),
    total() {
      return this.OtherIncome.length
        ? this.OtherIncome.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
                ? +cur.CurrentIncomeMonthlyTotalAmount
                : 0),
            0
          )
        : 0;
    },
    filteredTypes() {
      const incomeTypes = this.OtherIncome.map(item => item.IncomeType);
      return this.types.filter(item => incomeTypes.indexOf(item) === -1);
    }
  },
  watch: {
    OtherIncome: {
      deep: true,
      handler() {
        this.setDebtToIncomeAndHousingRatios();
      }
    },
    startDateMenuOpenIndex(val) {
      this.menuOpenedStartDate = this.getSelectedDateProp(val, "StartDate");
    },
    endDateMenuOpenIndex(val) {
      this.menuOpenedEndDate = this.getSelectedDateProp(val, "EndDate");
    }
  },
  components: {
    DateInput
  }
};
</script>

<style lang="scss" scoped>
.totals {
  font-weight: 500;
  font-size: 18px;
  &__title {
    margin-right: 10px;
  }
}


:deep() {
  .v-input--checkbox {
    .v-label {
      color: black !important;
    }
  }
}
</style>
