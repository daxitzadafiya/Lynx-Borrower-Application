<template lang="pug">
    SummaryControl(header="About You Finances" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked")
        template(v-slot:displayContent)
            v-row.summary-content-container
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Are you a co-signer or guarantor on any debt or loan that is not disclosed on this application?
                        .summaryAnswer.justify-end
                          .d-flex.flex-column.align-end
                            .d-flex
                              .yesNoAnswer  {{ (declarations.UndisclosedComakerOfNoteIndicator == undefined ? '': declarations.UndisclosedComakerOfNoteIndicator === true?'Yes': 'No') }}
                            .d-flex.mt-3(v-if="declarations.UndisclosedComakerOfNoteIndicator")
                              .primary-text Explanation:
                              .pl-1 {{ declarations.UndisclosedComakerOfNoteExplanation }}
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Are there any outstanding judgements against you?
                        .summaryAnswer.justify-end
                          .d-flex.flex-column.align-end
                            .d-flex
                              .yesNoAnswer  {{ (declarations.OutstandingJudgmentsIndicator == undefined ? '': declarations.OutstandingJudgmentsIndicator === true?'Yes': 'No') }}
                            .d-flex.mt-3(v-if="declarations.OutstandingJudgmentsIndicator")
                              .primary-text Explanation:
                              .pl-1 {{ declarations.OutstandingJudgmentsExplanation }}
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Are you currently delinquent or in default on a federal debt?
                        .summaryAnswer.justify-end
                          .d-flex.flex-column.align-end
                            .d-flex
                              .yesNoAnswer  {{ (declarations.PresentlyDelinquentIndicator == undefined ? '': declarations.PresentlyDelinquentIndicator === true?'Yes': 'No') }}
                            .d-flex.mt-3(v-if="declarations.PresentlyDelinquentIndicator")
                              .primary-text Explanation:
                              .pl-1 {{ declarations.PresentlyDelinquentExplanation }}
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Are you a party to a lawsuit in which you potentially have any personal financial liability?
                        .summaryAnswer.justify-end
                          .d-flex.flex-column.align-end
                            .d-flex
                              .yesNoAnswer  {{ (declarations.PartyToLawsuitIndicator == undefined ? '': declarations.PartyToLawsuitIndicator === true?'Yes': 'No') }}
                            .d-flex.mt-3(v-if="declarations.PartyToLawsuitIndicator")
                              .primary-text Explanation:
                              .pl-1 {{ declarations.PartyToLawsuitExplanation }}
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Have you conveyed title to any property in lieu of foreclosure in the past 7 years?
                        .summaryAnswer.justify-end
                          .d-flex.flex-column.align-end
                            .d-flex
                              .yesNoAnswer  {{ (declarations.PartyToLawsuitIndicator == undefined ? '': declarations.PartyToLawsuitIndicator === true?'Yes': 'No') }}
                            .d-flex.mt-3(v-if="declarations.PartyToLawsuitIndicator")
                              .primary-text Explanation:
                              .pl-1 {{ declarations.PartyToLawsuitExplanation }}
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Within the past 7 years, have you completed a pre-foreclosure sale or short sale, whereby the property was sold to a third party and the Lender agreed to accept less than the outstanding mortgage balance due?
                        .summaryAnswer.yesNoAnswer Yes
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Have you had a property foreclosed upon in the 7 years?
                        .summaryAnswer.yesNoAnswer Yes
                v-col(sm="12" cols="12").summaryItem
                    .summaryValue
                        .summaryQuestion Have you declared bankruptcy within the past 7 years?
                        .summaryAnswer.yesNoAnswer Yes

        template(v-slot:editContent)
            v-form(fast-fail)
              v-row.form-container

                TextRadio(
                    text="Are you a co-signer or guarantor on any debt or loan that is not disclosed on this application?"
                    :value="declarations.UndisclosedComakerOfNoteIndicator"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'UndisclosedComakerOfNoteIndicator')"
                )

                v-col.field-value(sm="4" cols="10" v-if="declarations.UndisclosedComakerOfNoteIndicator").itemContainer
                        Input(
                            auto-grow
                            defaultComponent="v-textarea"
                            :smVal="12"
                            rows="1"
                            inputTitle="Explanation"
                            :value="declarations.UndisclosedComakerOfNoteExplanation"
                            @input="(e) => setDeclarationsProp(e, 'UndisclosedComakerOfNoteExplanation')"
                        )
                TextRadio(
                    text="Are there any outstanding judgements against you?"
                    :value="declarations.OutstandingJudgmentsIndicator"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'OutstandingJudgmentsIndicator')"
                )

                v-col.field-value(sm="4" cols="10" v-if="declarations.OutstandingJudgmentsIndicator").itemContainer
                        Input(
                            defaultComponent="v-textarea"
                            auto-grow
                            rows="1"
                            :smVal="12"
                            inputTitle="Explanation"
                            :value="declarations.OutstandingJudgmentsExplanation"
                            @input="(e) => setDeclarationsProp(e, 'OutstandingJudgmentsExplanation')"
                        )
                TextRadio(
                    text="Are you currently deliquent or in default on a federal debt?"
                    :value="declarations.PresentlyDelinquentIndicator"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'PresentlyDelinquentIndicator')"
                )
                v-col.field-value(sm="4" cols="10" v-if="declarations.PresentlyDelinquentIndicator").itemContainer
                        Input(
                            defaultComponent="v-textarea"
                            auto-grow
                            rows="1"
                            :smVal="12"
                            inputTitle="Explanation"
                            :value="declarations.PresentlyDelinquentExplanation"
                            @input="(e) => setDeclarationsProp(e, 'PresentlyDelinquentExplanation')"
                        )
                TextRadio(
                    text="Are you a party to a lawsuit in which you potentially have any personal financial liability?"
                    :value="declarations.PartyToLawsuitIndicator"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'PartyToLawsuitIndicator')"
                )
                v-col.field-value(sm="4" cols="10" v-if="declarations.PartyToLawsuitIndicator").itemContainer
                        Input(
                            defaultComponent="v-textarea"
                            auto-grow
                            rows="1"
                            inputTitle="Explanation"
                            :smVal="12"
                            :value="declarations.PartyToLawsuitExplanation"
                            @input="(e) => setDeclarationsProp(e, 'PartyToLawsuitExplanation')"
                        )
                TextRadio(
                    text="Have you conveyed title to any property in lieu of foreslosure in the past 7 years?"
                    :value="declarations.PriorPropertyDeedInLieuConveyedIndicator"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'PriorPropertyDeedInLieuConveyedIndicator')"
                )
                v-col.field-value(sm="4" cols="10" v-if="declarations.PriorPropertyDeedInLieuConveyedIndicator").itemContainer
                        Input(
                            defaultComponent="v-textarea"
                            auto-grow
                            rows="1"
                            :smVal="12"
                            inputTitle="Explanation"
                            :value="declarations.PriorPropertyDeedInLieuConveyedExplanation"
                            @input="(e) => setDeclarationsProp(e, 'PriorPropertyDeedInLieuConveyedExplanation')"
                        )
                TextRadio(
                    text="Within the past 7 years, have you completed a pre-foreclosure sale or short sale, whereby the property was sold to a third party and the Lender agreed to accept less than the outstanding mortgage balance due?"
                    :value="declarations.PriorPropertyShortSaleCompletedIndicator"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'PriorPropertyShortSaleCompletedIndicator')"
                )
                v-col.field-value(sm="4" cols="10" v-if="declarations.PriorPropertyShortSaleCompletedIndicator").itemContainer
                        Input(
                            auto-grow
                            defaultComponent="v-textarea"
                            rows="1"
                            :smVal="12"
                            inputTitle="Explanation"
                            :value="declarations.PriorPropertyShortSaleCompletedExplanation"
                            @input="(e) => setDeclarationsProp(e, 'PriorPropertyShortSaleCompletedExplanation')"
                        )
                TextRadio(
                    text="Have you had a property foreclosed upon in the last 7 years?"
                    :value="declarations.PriorPropertyForeclosureCompletedIndicator"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'PriorPropertyForeclosureCompletedIndicator')"
                )
                v-col.field-value(sm="4" cols="10" v-if="declarations.PriorPropertyForeclosureCompletedIndicator").itemContainer
                        Input(
                            auto-grow
                            rows="1"
                            defaultComponent="v-textarea"
                            :smVal="12"
                            inputTitle="Explanation"
                            :value="declarations.PriorPropertyForeclosureCompletedExplanation"
                            @input="(e) => setDeclarationsProp(e, 'PriorPropertyForeclosureCompletedExplanation')"
                        )
                TextRadio(
                    text="Have you declared bankruptcy within the past 7 years?"
                    :value="declarations.BankruptcyIndicator != undefined"
                    @toggleRadio="(e) => setDeclarationsProp(e, 'BankruptcyIndicator')"
                )
                v-col.itemContainer(sm="12" cols="12")
                  v-row
                    Chapters(
                        v-if="declarations.BankruptcyIndicator"
                        :isDisabled="!declarations.BankruptcyIndicator"
                        :chapter="declarations.BankruptcyChapterType"
                        @setChapter="(val) => setDeclarationsProp(val, 'BankruptcyChapterType')"
                    )
                    Input(
                            auto-grow
                            rows="1"
                            :smVal="3"
                            v-if="declarations.BankruptcyIndicator"
                            defaultComponent="v-textarea"
                            inputTitle="Explanation"
                            :value="declarations.BankruptcyExplanation"
                            @input="(e) => setDeclarationsProp(e, 'BankruptcyExplanation')"
                        )
           
</template>

<script>
import TextRadio from "./TextRadio";
import Chapters from "./Chapters";
import { mapActions, mapGetters } from "vuex";
import deleteEmptyProp from "@/mixins/deleteEmptyProp.js";

import SummaryControl from "@/components/controls/SummaryControl";

export default {
  mixins: [deleteEmptyProp],
  data(){
    return {
      dataBeforeEdit: null
    }
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setDeclarationsProp(val, prop) {
      let Declarations = { ...this.declarations, [prop]: val };
      
      // Undisclosed Comaker Of Note
      this.deletePropWithCondition(Declarations,!Declarations.UndisclosedComakerOfNoteIndicator, ['UndisclosedComakerOfNoteExplanation']);
      
      // Outstanding Judgments
      this.deletePropWithCondition(Declarations,!Declarations.OutstandingJudgmentsIndicator, ['OutstandingJudgmentsExplanation']);

      //Presently Delinquent
      this.deletePropWithCondition(Declarations,!Declarations.PresentlyDelinquentIndicator, ['PresentlyDelinquentExplanation']);

      // Party To Lawsuit
      this.deletePropWithCondition(Declarations,!Declarations.PartyToLawsuitIndicator, ['PartyToLawsuitExplanation']);

      //Prior Property Deed In Lieu Conveyed
      this.deletePropWithCondition(Declarations,!Declarations.PriorPropertyDeedInLieuConveyedIndicator, ['PriorPropertyDeedInLieuConveyedExplanation']);

      // Prior Property Short Sale Completed
      this.deletePropWithCondition(Declarations,!Declarations.PriorPropertyShortSaleCompletedIndicator, ['PriorPropertyShortSaleCompletedExplanation']);

      // Prior Property Foreclosure Completed
      this.deletePropWithCondition(Declarations,!Declarations.PriorPropertyForeclosureCompletedIndicator, ['PriorPropertyForeclosureCompletedExplanation']);

      //BankruptcyIndicator
      this.deletePropWithCondition(Declarations,!Declarations.BankruptcyIndicator, ['BankruptcyExplanation', 'BankruptcyChapterType']);
    
      // udpate
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    },
    
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.declarations));
    },
    onCancelClicked() {
      this.updateBorrower({ prop: "Declarations", value: this.dataBeforeEdit });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower"
    }),
    declarations() {
      return this.Borrower && this.Borrower.Declarations
        ? this.Borrower.Declarations
        : {};
    }
  },
  components: {
    TextRadio,
    Chapters,
    SummaryControl
  }
};
</script>

<style lang="scss" scoped>

.v-divider {
  margin-bottom: 15px;
}

.field-value {
  margin-left: auto;
  padding-top: 0px;
  margin-top: -30px;
  padding-left: 40px;
}
.summaryQuestion{
    flex: 7;
    padding-right: 10px;
  }
  
  .summaryValue{
    display: flex;
    width: 100%;
  }
  .yesNoAnswer{
    font-weight: 600;
  }
  .summaryAnswer{
    flex: 3;
    text-align: end;
    padding-left: 10px;
    padding-right: 20px;
  }
  .summary-content-container{
    >:not(:last-child){
      padding-bottom: 10px;
    }
    >:not(:first-child){
      padding-top: 10px;
    }
  }
  
  .summary-content-container{
    padding-left: 0px;
  }
</style>
