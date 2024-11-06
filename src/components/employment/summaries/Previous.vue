<template lang="pug">
  SummaryControl(header="Previous Employment/Self Employment and Income" :desktopIcon="desktopIcon" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked")
    template(v-slot:displayContent)
        v-row.summary-content-container
          template(v-if="currentEmployment")
            v-col(sm="12" cols="12").summaryItem
              .summaryValue Previously Employed by 
                span.font-weight-bold {{ currentEmployment.FullName?currentEmployment.FullName:'' }}
                span as a
                span.font-weight-bold {{currentEmployment.EmploymentPositionDescription?currentEmployment.EmploymentPositionDescription:'' }}
                span , from {{currentEmployment.EmploymentStartDate ? new Date(currentEmployment.EmploymentStartDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '') : ''}} to {{currentEmployment.EmploymentEndDate ? new Date(currentEmployment.EmploymentEndDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '') : ''}} with Gross Monthly Income of ${{ currentEmployment.EmploymentMonthlyIncomeAmount ? getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount) : '' }}.
            v-col(sm="12" cols="12").summaryItem
                .summaryValue
                  span.font-weight-bold Address:
                  span {{ address }}
                  span.font-weight-bold Phone:
                  span {{ currentEmployment.PhoneNumber ? getFormattedPhone(currentEmployment.PhoneNumber) : '' }}
          template(v-else)
            v-col(sm="12" cols="12").summaryItem
              .summaryValue No previous employment.
    template(v-slot:editContent)
      v-form(fast-fail).form-outer-container
        v-row.form-container
          template(v-if="currentEmployment")
              v-col(sm="12" cols="12")
                .remove-wrapper
                        v-icon.remove-previous(color="error" @click="isDialog=true") mdi-close
              PositionTitleData(status="Previous" classification="Primary" :hasIncomeLossData="true")
                ContactDetailsData(status="Previous" classification="Primary" inputIdNumber="2")
                PrevCompensationData
          v-col.itemContainer(cols="12" sm="12" v-if="!currentEmployment")
            v-btn(dense plain elevation="0" @click="addEmployment").addItemBtn
              v-icon(small) mdi-plus
              span.addBtnText Add Previous Employment

          v-dialog(
                  v-model="isDialog"
                  max-width="390"
              )
                  v-card
                      v-card-title.mb-4.text-black--text 
                          span(style="word-break: break-word; text-align:center;") Please, confirm you are going to remove employment information? 
                      v-card-text
                          v-row.justify-space-around
                              Button(
                                  customClass="button-yes"
                                  value="Yes"
                                  width="130px"
                                  @clicked="removeEmployment")
                              Button(
                                  value="No"
                                  width="130px"
                                  customClass="button-no"
                                  isOutlined=true
                                  @clicked="isDialog=false")
</template>

<script>
import ContactDetailsData from "../NewContactDetailsData";
import PositionTitleData from "../NewPositionTitleData";
import PrevCompensationData from "../NewPrevCompensationData";
import SummaryControl from "@/components/controls/SummaryControl";
import phoneFormat from "@/mixins/phoneFormat";
import currencyFormat from "@/mixins/currencyFormat.js";
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [phoneFormat, currencyFormat],
  data() {
    return {
      isDialog: false,
      desktopIcon: require("@/assets/images/employment/employed.svg"),
      dataBeforeEdit: [],
    };
  },
  methods: {
    ...mapActions(["updateBorrower", "saveLoanPatches"]),
    addEmployment() {
      const employments = [
        ...this.Employment,
        { EmploymentStatusType: "Previous" }
      ];
      this.updateBorrower({ prop: "Employment", value: employments });
    },
    removeEmployment() {
      const filtered = this.Employment.filter(
        item => item.EmploymentStatusType !== "Previous"
      );
      this.updateBorrower({ prop: "Employment", value: filtered });
      this.isDialog = false;
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      if(this.currentEmployment!=null){
        this.dataBeforeEdit = JSON.parse(JSON.stringify(this.currentEmployment))
      }
      else{
        this.dataBeforeEdit = null
      }
    },
    onCancelClicked() {
      const Employments = [...this.Employment];
      const primaryIndex = Employments.findIndex(
        item =>
          item &&
          item.EmploymentStatusType === "Previous"
      );
      if (primaryIndex !== -1) {
        Employments[primaryIndex] = this.dataBeforeEdit;
      } else {
        if(this.dataBeforeEdit!=null){
          Employments.push(this.dataBeforeEdit);
        }
      }
      this.updateBorrower({ prop: "Employment", value: Employments });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment"
    }),
    currentEmployment() {
      if (this.Employment.length) {
        const employment = this.Employment.find(
          item => 
            item.EmploymentStatusType === "Previous"
        );
        return employment;
      }
      return null;
    },
    employmentWorkExperience() {
      if (!this.currentEmployment.EmploymentStartDate || !this.currentEmployment.EmploymentEndDate) {
        return '';
      }

      const end = new Date(this.currentEmployment.EmploymentEndDate);
      const start = new Date(this.currentEmployment.EmploymentStartDate);

      const yearsDiff = end.getFullYear() - start.getFullYear();
      const monthsDiff = end.getMonth() - start.getMonth();

      let result = '';

      if (yearsDiff > 0) {
        if (yearsDiff === 1) {
          result += '1 year';
        } else {
          result += `${yearsDiff} years`;
        }
      }

      if (monthsDiff > 0) {
        if (result !== '') {
          result += ' and ';
        }

        if (monthsDiff === 1) {
          result += '1 month';
        } else {
          result += `${monthsDiff} months`;
        }
      }

      return result;
    },
    address() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.currentEmployment) {
        return keys.reduce((acc, cur) => {
          if (this.currentEmployment[cur]) {
            acc += `${this.currentEmployment[cur]}${
              cur === "PostalCode" ? " " : ", "
            }`;
          }
          return acc;
        }, "");
      }
      return ""
    },
  },
  components: {
    ContactDetailsData,
    PositionTitleData,
    PrevCompensationData,
    Add,
    Button,
    SummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";

.font-weigth-500 {
  font-weight: 500;
}

.remove-wrapper {
  position: relative;
}

.remove-previous {
  position: absolute;
  top: -10px;
  right: -5px;
  cursor: pointer;
  @media (max-width: 450px) {
    right: 10px;
    top: -15px;
  }
}
</style>
