<template lang="pug">
  SummaryControl(header="Current Employment/Self Employment and Income" :desktopIcon="desktopIcon" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked")
    template(v-slot:displayContent)
        v-row.summary-content-container
          template(v-if="currentEmployment")
            v-col(sm="12" cols="12").summaryItem
              .summaryValue Currently Employed by 
                span.font-weight-bold {{ currentEmployment.FullName?currentEmployment.FullName:'' }}
                span as a
                span.font-weight-bold {{currentEmployment.EmploymentPositionDescription?currentEmployment.EmploymentPositionDescription:'' }}
                span , for {{currentEmploymentWorkExperience}}.
            v-col(sm="12" cols="12").summaryItem
              .summaryValue I have been in this line of work for {{ duration.years<=0?'':duration.years==1?duration.months+' year':duration.years +' years' }} {{ duration.years>0&&duration.months>0?'and':'' }} {{ duration.months<=0?'':duration.months==1?duration.months+'month':duration.months+'months' }}
            v-col(sm="12" cols="12").summaryItem
              .summaryValue
                span.font-weight-bold Address:
                span {{ address }}
                span.font-weight-bold Phone:
                span {{ currentEmployment.PhoneNumber ? getFormattedPhone(currentEmployment.PhoneNumber) : '' }}

            v-col(sm="12" cols="12").summaryItem
              .summaryValue
                span I am 
                span.font-weight-bold(v-if="!currentEmployment.SpecialBorrowerEmployerRelationshipIndicator") Not 
                span(:class="{'font-weight-bold': !!currentEmployment.SpecialBorrowerEmployerRelationshipIndicator}") Employed by a family member, property seller, real estate agent, or other party to the transaction.

            v-col(sm="12" cols="12").summaryItem
              .summaryValue
                span(v-if="!!currentEmployment.EmploymentBorrowerSelfEmployedIndicator") I am Self Employed and have {{ percentage }}, with
                span(v-else) I have 
                span a Monthly Income/Loss of ${{ currentEmployment.EmploymentMonthlyIncomeAmount ? getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount) : '' }}
            v-col(sm="12" cols="12").summaryItem.position-relative
              v-data-table.content-table(
                :headers="headers"
                :items="income"
                disable-sort
                disable-pagination
                hide-default-footer
                :mobile-breakpoint="0"
            )
                template(v-slot:item.CurrentIncomeMonthlyTotalAmount="{ item }")
                    span ${{ getFormattedValue(item.CurrentIncomeMonthlyTotalAmount) || 0 }}
                template(v-slot:body.append)
                    tr.appended-row
                        td.text-end.font-weight-bold Total:
                        td.font-weight-bold ${{ getFormattedValue(total) }}
          template(v-else)
            v-col(sm="12" cols="12").summaryItem
              .summaryValue No current employment.
    template(v-slot:editContent)
      v-form(fast-fail).form-outer-container
        v-row.form-container
            template(v-if="currentEmployment")
              v-col(sm="12" cols="12")
                .remove-wrapper
                    v-icon.remove-additional(color="error" @click="isDialog=true") mdi-close
              PositionTitleData(status="Current" classification="Primary" :hasIncomeLossData="true")
                ContactDetailsData(status="Current" classification="Primary")
              EmploymentTypeAndPartyTransaction(status="Current" classification="Primary")
              v-col(cols="12" sm="12")
                CompensationDetailsData(status="Current" classification="Primary")
            v-col.itemContainer(cols="12" sm="12" v-if="!currentEmployment")
                v-btn(dense plain elevation="0" @click="addEmployment").addItemBtn
                  v-icon(small) mdi-plus
                  span.addBtnText Add Current Employment
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
import CompensationDetailsData from "../NewCompensationDetailsData";
import EmploymentTypeAndPartyTransaction from "./EmploymentTypeAndPartyTransaction";
import currencyFormat from "@/mixins/currencyFormat.js";
import SummaryControl from "@/components/controls/SummaryControl";
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import { mapGetters, mapActions } from "vuex";
import phoneFormat from "@/mixins/phoneFormat";

export default {
  mixins: [phoneFormat, currencyFormat],
  data() {
    return {
      isDialog: false,
      desktopIcon: require("@/assets/images/employment/employed.svg"),
      dataBeforeEdit: [],
      headers:[{
        text: "Income Type",
        value: "IncomeType"
      },{
        text: "Gross Monthly Amount",
        value: "CurrentIncomeMonthlyTotalAmount"
      }]
    };
  },
  methods: {
    ...mapActions(["updateBorrower", "saveLoanPatches"]),
    addEmployment() {
      const employments = [
        ...this.Employment,
        { EmploymentClassificationType: "Primary" }
      ];
      this.updateBorrower({ prop: "Employment", value: employments });
    },
    removeEmployment() {
      let filtered = this.Employment.filter(
        item => item.EmploymentClassificationType !== "Primary"
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
        this.currentEmployment = null
      }
    },
    onCancelClicked() {
      const Employments = [...this.Employment];
      const primaryIndex = Employments.findIndex(
        item =>
          item &&
          item.EmploymentClassificationType === "Primary"
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
        return this.Employment.find(
          item => item.EmploymentClassificationType === "Primary"
        );
      }
      return null;
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
    currentEmploymentWorkExperience() {
      if (!this.currentEmployment.EmploymentStartDate) {
        return '';
      }

      const today = new Date();
      const start = new Date(this.currentEmployment.EmploymentStartDate);

      const yearsDiff = today.getFullYear() - start.getFullYear();
      const monthsDiff = today.getMonth() - start.getMonth();

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
    percentage() {
      if (this.currentEmployment.OwnershipInterestType == undefined) return "";
      return this.currentEmployment.OwnershipInterestType ===
        "GreaterThanOrEqualTo25Percent"
        ? "an ownership Share is 25% or Greater"
        : "an ownership Share is < 25%";
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
  },
  components: {
    ContactDetailsData,
    PositionTitleData,
    CompensationDetailsData,
    EmploymentTypeAndPartyTransaction,
    Add,
    Button,
    SummaryControl
  }
};
</script>

<style lang="scss" scoped>

.remove-wrapper {
  position: relative;
}

.remove-additional {
  position: absolute;
  top: -10px;
  right: -5px;
  cursor: pointer;
  @media (max-width: 450px) {
    right: 10px;
    top: -15px;
  }
}

:deep(th){
  width: 170px;
}
</style>
