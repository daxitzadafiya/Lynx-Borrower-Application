<template lang="pug">
  SummaryControl(header="Additional Employment/Self Employment and Income" :desktopIcon="desktopIcon" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked")
    template(v-slot:displayContent)
        v-row.summary-content-container
          template(v-if="additionalEmployments.length===0")
            v-col(sm="12" cols="12").summaryItem
              .summaryValue No additional employment.
          template(v-for="(additionalEmployment, index) in additionalEmployments")
            v-col(sm="12" cols="12").summaryItem
              .summaryValue Additionally Employed by 
                span.font-weight-bold {{ additionalEmployment.FullName?additionalEmployment.FullName:'' }}
                span as a
                span.font-weight-bold {{additionalEmployment.EmploymentPositionDescription?additionalEmployment.EmploymentPositionDescription:'' }}
                span , for {{additionalEmploymentExperience(additionalEmployment)}}.
            v-col(sm="12" cols="12").summaryItem
              .summaryValue I have been in this line of work for {{ lineOfWorkExperienceDuration(additionalEmployment) }}
            v-col(sm="12" cols="12").summaryItem
              .summaryValue
                span.font-weight-bold Address:
                span {{ additionalExperienceAddress(additionalEmployment) }}
                span.font-weight-bold Phone:
                span {{ additionalEmployment.PhoneNumber ? getFormattedPhone(additionalEmployment.PhoneNumber) : '' }}

            v-col(sm="12" cols="12").summaryItem
              .summaryValue
                span I am 
                span.font-weight-bold(v-if="!additionalEmployment.SpecialBorrowerEmployerRelationshipIndicator") Not 
                span(:class="{'font-weight-bold': !!additionalEmployment.SpecialBorrowerEmployerRelationshipIndicator}") Employed by a family member, property seller, real estate agent, or other party to the transaction.

            v-col(sm="12" cols="12").summaryItem.position-relative
              v-data-table.content-table(
                :headers="headers"
                :items="additionalEmployment.Income"
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
                        td.font-weight-bold ${{ getFormattedValue(additionalEmploymentTotal(additionalEmployment)) }}

    template(v-slot:editContent)
      v-form(fast-fail).form-outer-container
        v-row.form-container
          template(v-for="(item, index) in additionalEmployments")
              v-col(sm="12" cols="12")
                .remove-wrapper(:key="index")
                  v-icon.remove-additional(color="error" @click="setRemoveIndex(index)") mdi-close
              PositionTitleData(:index="index" :status="'Additional'+index" classification="Secondary" :hasIncomeLossData="true")
                ContactDetailsData(:index="index" :status="'Additional'+index" classification="Secondary")
              EmploymentTypeAndPartyTransaction(:index="index" :status="'Additional'+index" classification="Secondary")
              v-col(cols="12" sm="12")
                CompensationDetailsData(:index="index" :status="'Additional'+index" classification="Secondary")
          v-col.itemContainer(cols="12" sm="12")
            v-btn(dense plain elevation="0" @click="addEmployment").addItemBtn.addEmploymentBtn
                  v-icon(small) mdi-plus
                  span.addBtnText Add Additional Employment
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
                                  isOutlined=true
                                  customClass="button-no"
                                  @clicked="isDialog=false")
</template>

<script>
import ContactDetailsData from "../NewContactDetailsData";
import PositionTitleData from "../NewPositionTitleData";
import CompensationDetailsData from "../NewCompensationDetailsData";
import EmploymentTypeAndPartyTransaction from "./EmploymentTypeAndPartyTransaction";
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import currencyFormat from "@/mixins/currencyFormat.js";
import SummaryControl from "@/components/controls/SummaryControl";
import phoneFormat from "@/mixins/phoneFormat";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [phoneFormat, currencyFormat],
  data() {
    return {
      isDialog: false,
      removingIndex: -1,
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
        { EmploymentClassificationType: "Secondary" }
      ];
      this.updateBorrower({ prop: "Employment", value: employments });
    },
    setRemoveIndex(index) {
      this.removingIndex = index;
      this.isDialog = true;
    },
    removeEmployment() {
      const additionalsFiltered = this.additionalEmployments.filter(
        (item, i) => i !== this.removingIndex
      );
      let filtered = this.Employment.filter(
        item => item.EmploymentClassificationType !== "Secondary"
      );
      filtered.push(...additionalsFiltered);
      this.updateBorrower({ prop: "Employment", value: filtered });
      this.isDialog = false;
    },
    additionalExperienceAddress(additionalExperience) {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (additionalExperience) {
        return keys.reduce((acc, cur) => {
          if (additionalExperience[cur]) {
            acc += `${additionalExperience[cur]}${
              cur === "PostalCode" ? " " : ", "
            }`;
          }
          return acc;
        }, "");
      }
      return ""
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.additionalEmployments))
    },
    onCancelClicked() {
      const filtered = this.Employment.length
        ? this.Employment.filter(
            item => item.EmploymentClassificationType !== "Secondary"
          )
        : [];
      this.updateBorrower({
        prop: "Employment",
        value: [...filtered, ...this.dataBeforeEdit]
      });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    additionalEmploymentExperience(employment) {
      if (!employment.EmploymentStartDate) {
        return '';
      }

      const today = new Date();
      const start = new Date(employment.EmploymentStartDate);

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
    lineOfWorkExperienceDuration(employment) {
      let years = 0;
      let months = 0;
      if (employment.EmploymentTimeInLineOfWorkMonthsCount) {
        months =
          employment.EmploymentTimeInLineOfWorkMonthsCount % 12;
        years =
          (employment.EmploymentTimeInLineOfWorkMonthsCount -
            months) /
          12;
      }

      let result = '';

      if (years > 0) {
        if (years === 1) {
          result += '1 year';
        } else {
          result += `${years} years`;
        }
      }

      if (months > 0) {
        if (result !== '') {
          result += ' and ';
        }

        if (months === 1) {
          result += '1 month';
        } else {
          result += `${months} months`;
        }
      }
    },
    additionalEmploymentTotal(additionalEmployment){
      return additionalEmployment.Income && additionalEmployment.Income.length
        ? additionalEmployment.Income.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
                ? +cur.CurrentIncomeMonthlyTotalAmount
                : 0),
            0
          )
        : 0;
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment",
      additionalEmployments: "getAdditionalEmployments"
    })
  },
  components: {
    ContactDetailsData,
    PositionTitleData,
    CompensationDetailsData,
    EmploymentTypeAndPartyTransaction,
    Add,
    Button,
    currencyFormat,
    SummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

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

.addEmploymentBtn{
  margin-left: -16px;
}
</style>
