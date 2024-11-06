<template lang="pug">
  SummaryControl(header="About this Property and Your Money for this Loan" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked")
    template(v-slot:displayContent)
        v-row.summary-content-container
          v-col(sm="12" cols="12").summaryItem
            .summaryValue
              .summaryQuestion Will you occupy the property as your primary residence?
              .summaryAnswer.yesNoAnswer {{ declarations.IntentToOccupyType }}
          template(v-if="declarations.IntentToOccupyType && declarations.IntentToOccupyType === 'Yes'")
            v-col(sm="12" cols="12").summaryItem
              .summaryValue
                .summaryQuestion Have you had any ownership interest in another property in the last three years?
                .summaryAnswer.yesNoAnswer {{  declarations.HomeownerPastThreeYearsType }}
            v-col(sm="12" cols="12" v-if="declarations.HomeownerPastThreeYearsType && declarations.HomeownerPastThreeYearsType !== 'No'").summaryItem
              .summaryValue
                .summaryQuestion What type of property did you own: Property Residence, FHA Secondary Residence, Second Home, or Investment Property?
                .summaryAnswer.d-flex.justify-end
                  .primary-text Property Type:
                  .pl-1 {{ propertyTypeText }}
            v-col(sm="12" cols="12" v-if="declarations.HomeownerPastThreeYearsType && declarations.HomeownerPastThreeYearsType !== 'No'").summaryItem
              .summaryValue
                .summaryQuestion How did you hold title to the property: by yourself, jointly with your spouse, or jointly with another person?
                .summaryAnswer.justify-end
                  .d-flex.flex-column.align-end
                    .d-flex
                      .primary-text Title to the property:
                      .pl-1 {{ propertyTitleText }}
                    .d-flex.mt-3
                      .primary-text Explanation:
                      .pl-1 {{ declarations.HomeownerPastThreeYearsExplanation }}
          v-col(sm="12" cols="12").summaryItem
            .summaryValue
              .summaryQuestion If this is a purchase Transaction: Do you have family relationship or business affiliation with the seller of the property?
              .summaryAnswer.justify-end
                .d-flex.flex-column.align-end
                  .d-flex
                    .yesNoAnswer  {{ (declarations.ULADSpecialBorrowerSellerRelationshipIndicator == undefined ? '': declarations.ULADSpecialBorrowerSellerRelationshipIndicator === true?'Yes': 'No') }}
                  .d-flex.mt-3(v-if="declarations.ULADSpecialBorrowerSellerRelationshipIndicator")
                    .primary-text Explanation:
                    .pl-1 {{ declarations.ULADSpecialBorrowerSellerRelationshipExplanation }}
          v-col(sm="12" cols="12").summaryItem
            .summaryValue
              .summaryQuestion Are you borrowing any money for this real estate transaction or obtaining any money from another party, such as the seller or realtor, that you have not disclosed on this loan application?
              .summaryAnswer.justify-end
                .d-flex.flex-column.align-end
                  .d-flex
                    .yesNoAnswer  {{ (declarations.UndisclosedBorrowedFundsIndicator == undefined ? '': declarations.UndisclosedBorrowedFundsIndicator === true?'Yes': 'No') }}
                  .d-flex.mt-3(v-if="declarations.UndisclosedBorrowedFundsAmount")
                    .primary-text Amount Borrowed:
                    .pl-1 {{ getFormattedValue(declarations.UndisclosedBorrowedFundsAmount) }}
                  .d-flex.mt-3(v-if="declarations.UndisclosedBorrowedFundsAmount")
                    .primary-text Explanation:
                    .pl-1 {{ declarations.UndisclosedBorrowedFundsExplanation }}
          v-col(sm="12" cols="12").summaryItem
            .summaryValue
              .summaryQuestion Have you or will you be applying for a mortgage loan on another property on or before closing this transaction that is not disclosed on this loan application?
              .summaryAnswer.justify-end
                .d-flex.flex-column.align-end
                  .d-flex
                    .yesNoAnswer  {{ (declarations.UndisclosedMortgageApplicationIndicator == undefined ? '': declarations.UndisclosedMortgageApplicationIndicator === true?'Yes': 'No') }}
                  .d-flex.mt-3(v-if="declarations.UndisclosedMortgageApplicationIndicator")
                    .primary-text Explanation:
                    .pl-1 {{ declarations.UndisclosedMortgageApplicationExplanation }}
          v-col(sm="12" cols="12").summaryItem
            .summaryValue
              .summaryQuestion Have you or will you be applying for any new credit on or before closing this loan that is not disclosed on this application?
              .summaryAnswer.justify-end
                .d-flex.flex-column.align-end
                  .d-flex
                    .yesNoAnswer  {{ (declarations.UndisclosedCreditApplicationIndicator == undefined ? '': declarations.UndisclosedCreditApplicationIndicator === true?'Yes': 'No') }}
                  .d-flex.mt-3(v-if="declarations.UndisclosedCreditApplicationIndicator")
                    .primary-text Explanation:
                    .pl-1 {{ declarations.UndisclosedCreditApplicationExplanation }}
          v-col(sm="12" cols="12").summaryItem
            .summaryValue
              .summaryQuestion Will this property be subject to a lien that could take priority over the first mortgage lien, such as clean energy lien paid through your property taxes (e.g. The Property Assessed Clean Energy Program)?
              .summaryAnswer.justify-end
                .d-flex.flex-column.align-end
                  .d-flex
                    .yesNoAnswer  {{ (declarations.PropertyProposedCleanEnergyLienIndicator == undefined ? '': declarations.PropertyProposedCleanEnergyLienIndicator === true?'Yes': 'No') }}
                  .d-flex.mt-3(v-if="declarations.PropertyProposedCleanEnergyLienIndicator")
                    .primary-text Explanation:
                    .pl-1 {{ declarations.PropertyProposedCleanEnergyLienExplanation }}
          v-col(sm="12" cols="12").summaryItem
            .summaryValue
              .summaryQuestion If you are occupying this property, will you set aside space within the property to operate your own business?
              .summaryAnswer.justify-end
                .d-flex.flex-column.align-end
                  .d-flex
                    .yesNoAnswer  {{ (declarations.PropertyMixedUsageIndicator == undefined ? '': declarations.PropertyMixedUsageIndicator === true?'Yes': 'No') }}
                  .d-flex.mt-3(v-if="declarations.PropertyMixedUsageIndicator")
                    .primary-text Explanation:
                    .pl-1 {{ declarations.PropertyMixedUsageExplanation }}
    template(v-slot:editContent)
      v-form(fast-fail)
        v-row.form-container
            TextRadio(
                text="Will you occupy the property as your primary residence?"
                :value="declarations.IntentToOccupyType"
                :yesNoValues="true"
                @toggleRadio="(e) => setDeclarationsProp(e ? 'Yes' : 'No', 'IntentToOccupyType')"
            )
          
            template(v-if="declarations.IntentToOccupyType && declarations.IntentToOccupyType === 'Yes'")
                TextRadio(
                    text="Have you had any ownership interest in another property in the last three years?"
                :yesNoValues="true"
                :value="declarations.HomeownerPastThreeYearsType"
                    @toggleRadio="(e) => setDeclarationsProp(e ? 'Yes' : 'No', 'HomeownerPastThreeYearsType')"
                )
                TextDropmenu(v-if="declarations.HomeownerPastThreeYearsType && declarations.HomeownerPastThreeYearsType !== 'No'"
                    text="What type of property did you own: Primary Residence, FHA Secondary Residence, Second Home, or Investment Property?"
                    label="Property Type"
                    :items="propertyTypes"
                    :value="declarations.PriorPropertyUsageType"
                    @setItem="(e) => setDeclarationsProp(e, 'PriorPropertyUsageType')"
                )
                TextDropmenu(v-if="declarations.HomeownerPastThreeYearsType && declarations.HomeownerPastThreeYearsType !== 'No'"
                    text="How did you hold title to the property: by yourself, jointly with your spouse, or jointly with another person?"
                    label="Title to the property"
                    :items="propertyTitles"
                    :value="declarations.PriorPropertyTitleType"
                    @setItem="(e) => setDeclarationsProp(e, 'PriorPropertyTitleType')"
                ).pb-7
                v-col.field-value(sm="4" cols="10" v-if="declarations.HomeownerPastThreeYearsType && declarations.HomeownerPastThreeYearsType !== 'No'").itemContainer
                    Input(
                      defaultComponent="v-textarea"
                      auto-grow
                      rows="1"
                        :smVal="12"
                        inputTitle="Explanation"
                      :value="declarations.HomeownerPastThreeYearsExplanation"
                      @input="(e) => setDeclarationsProp(e, 'HomeownerPastThreeYearsExplanation')"
                )

            TextRadio(
                text="If this is a purchase Transaction: Do you have a family relationship or business affiliation with the seller of the property?"
                :value="declarations.ULADSpecialBorrowerSellerRelationshipIndicator"
                @toggleRadio="(e) => setDeclarationsProp(e, 'ULADSpecialBorrowerSellerRelationshipIndicator')"
            )
            v-col.field-value(sm="4" cols="10" v-if="declarations.ULADSpecialBorrowerSellerRelationshipIndicator").itemContainer
                     Input(
                      defaultComponent="v-textarea"
                      auto-grow
                        rows="1"
                        :smVal="12"
                        inputTitle="Explanation"
                        :value="declarations.ULADSpecialBorrowerSellerRelationshipExplanation"
                        @input="(e) => setDeclarationsProp(e, 'ULADSpecialBorrowerSellerRelationshipExplanation')"
                    )

            TextRadio(
                text="Are you borrowing any money for this real estate transaction or obtaining any money from another party, such as the seller or realtor, that you have not disclosed on this loan application?"
                :value="declarations.UndisclosedBorrowedFundsIndicator"
                @toggleRadio="(e) => setDeclarationsProp(e, 'UndisclosedBorrowedFundsIndicator')"
            )
            v-col.itemContainer(sm="12" cols="12" v-if="declarations.UndisclosedBorrowedFundsIndicator")
              .radioText What is the Amount of money you are borrowing?
              .radioInputs
                Input(
                  defaultComponent="v-text-field"
                    :smVal="12"
                    inputTitle="Amount Borrowed"
                    :value="getFormattedValue(declarations.UndisclosedBorrowedFundsAmount)"
                    @input="(e) => setDeclarationsProp(+e.replace(/,/g, ''), 'UndisclosedBorrowedFundsAmount')"
                    @keypress="(e) => isOnlyNum(e, true)"
                    prefix="$"
                )
            v-col.field-value(sm="4" cols="10" v-if="declarations.UndisclosedBorrowedFundsIndicator").itemContainer
                      Input(
                        auto-grow
                      defaultComponent="v-textarea"
                      rows="1"
                        :smVal="12"
                        inputTitle="Explanation"
                        :value="declarations.UndisclosedBorrowedFundsExplanation"
                        @input="(e) => setDeclarationsProp(e, 'UndisclosedBorrowedFundsExplanation')"
                    )

            TextRadio(  
                text="Have you or will you be applying for a mortgage loan on another property on or before closing this transaction that is not disclosed on this loan application?"
                :value="declarations.UndisclosedMortgageApplicationIndicator"
                @toggleRadio="(e) => setDeclarationsProp(e, 'UndisclosedMortgageApplicationIndicator')"
            )

            v-col.field-value(sm="4" cols="10" v-if="declarations.UndisclosedMortgageApplicationIndicator").itemContainer
                     Input(
                        auto-grow
                        :smVal="12"
                        defaultComponent="v-textarea"
                      rows="1"
                        inputTitle="Explanation"
                        :value="declarations.UndisclosedMortgageApplicationExplanation"
                        @input="(e) => setDeclarationsProp(e, 'UndisclosedMortgageApplicationExplanation')"
                    )

            TextRadio(
                text="Have you or will you be applying for any new credit on or before closing this loan that is not disclosed on this application?"
                :value="declarations.UndisclosedCreditApplicationIndicator"
                @toggleRadio="(e) => setDeclarationsProp(e, 'UndisclosedCreditApplicationIndicator')"
            )
            v-col.field-value(sm="4" cols="10" v-if="declarations.UndisclosedCreditApplicationIndicator").itemContainer
                     Input(
                        auto-grow
                      defaultComponent="v-textarea"
                        :smVal="12"
                        rows="1"
                        inputTitle="Explanation"
                        :value="declarations.UndisclosedCreditApplicationExplanation"
                        @input="(e) => setDeclarationsProp(e, 'UndisclosedCreditApplicationExplanation')"
                    )

            TextRadio(
                text="Will this property be subject to a lien that could take priority over the first mortgage lien, such as clean energy lien paid through your property taxes ( e.g, The Property Assessed Clean Energy Program)?"
                :value="declarations.PropertyProposedCleanEnergyLienIndicator"
                @toggleRadio="(e) => setDeclarationsProp(e, 'PropertyProposedCleanEnergyLienIndicator')"
            )
            v-col.field-value(sm="4" cols="10" v-if="declarations.PropertyProposedCleanEnergyLienIndicator").itemContainer
                     Input(
                        auto-grow
                      defaultComponent="v-textarea"
                        :smVal="12"
                        rows="1"
                        inputTitle="Explanation"
                        :value="declarations.PropertyProposedCleanEnergyLienExplanation"
                        @input="(e) => setDeclarationsProp(e, 'PropertyProposedCleanEnergyLienExplanation')"
                    )

            TextRadio(
                text="If you are occupying this property, will you set aside space within the property to operate your own business?"
                :value="Property == null? null : Property.PropertyMixedUsageIndicator"
                @toggleRadio="(e) => setMixedUseProp(e, 'PropertyMixedUsageIndicator')"
            )
            v-col.field-value(sm="4" cols="10" v-if="Property && Property.PropertyMixedUsageIndicator").itemContainer
                     Input(
                        auto-grow
                        rows="1"
                        :smVal="12"
                      defaultComponent="v-textarea"
                      inputTitle="Explanation"
                        :value="declarations.PropertyMixedUsageExplanation"
                        @input="(e) => setMixedUseProp(e, 'PropertyMixedUsageExplanation')"
                    )
</template>

<script>
import TextRadio from "./TextRadio";
import TextDropmenu from "./TextDropmenu";
import { mapActions, mapGetters } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import SummaryControl from "@/components/controls/SummaryControl";
import deleteEmptyProp from "@/mixins/deleteEmptyProp.js";

export default {
  mixins: [onlyNum, currencyFormat, deleteEmptyProp],
  data() {
    return {
      propertyTypes: [
        { text: "Primary Residence", value: "PrimaryResidence" },
        { text: "Second Home", value: "SecondHome" },
        { text: "Investment", value: "Investment" },
        { text: "FHA Secondary Residence", value: "FHASecondaryResidence" }
      ],
      propertyTitles: [
        { text: "By yourself", value: "Sole" },
        { text: "Jointly With Spouse", value: "JointWithSpouse" },
        {
          text: "Jointly With Another Person",
          value: "JointWithOtherThanSpouse"
        }
      ],
      dataBeforeEdit: null
    };
  },
  methods: {
    ...mapActions(["updateBorrower", "setProperty", "saveLoanPatches"]),

    setDeclarationsProp(val, prop) {
      let Declarations = { ...this.declarations, [prop]: val };

      //TODO should it actually be Yes/No instead of true/false? 
      //Intent To Occupy
      this.deletePropWithCondition(Declarations, 
        Declarations.IntentToOccupyType === "No",
        [
          'IntentToOccupyExplanation',
          'HomeownerPastThreeYearsType',
          'PriorPropertyUsageType',
          'PriorPropertyTitleType',
          'HomeownerPastThreeYearsExplanation'
          ]);

      //ULADSpecialBorrowerSellerRelationship
      this.deletePropWithCondition(Declarations,!Declarations.ULADSpecialBorrowerSellerRelationshipIndicator, ['ULADSpecialBorrowerSellerRelationshipExplanation']);

      //Undisclosed Borrowed Funds
      this.deletePropWithCondition(Declarations,!Declarations.UndisclosedBorrowedFundsIndicator, ['UndisclosedBorrowedFundsAmount', 'UndisclosedBorrowedFundsExplanation']);

      //Homeowner Past Three Years
      this.deletePropWithCondition(Declarations, 
        Declarations.HomeownerPastThreeYearsType === "No", ['PriorPropertyUsageType', 'PriorPropertyTitleType', 'HomeownerPastThreeYearsExplanation']);
      
      //Undisclosed Mortgage Application
      this.deletePropWithCondition(Declarations,!Declarations.UndisclosedMortgageApplicationIndicator, ['UndisclosedMortgageApplicationExplanation',]);

      //Undisclosed Credit Application
      this.deletePropWithCondition(Declarations,!Declarations.UndisclosedCreditApplicationIndicator, ['UndisclosedCreditApplicationExplanation',]);

      //Property Proposed Clean Energy Lien
      this.deletePropWithCondition(Declarations,!Declarations.PropertyProposedCleanEnergyLienIndicator, ['PropertyProposedCleanEnergyLienExplanation',]);
    
    // udpate
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    },
    setMixedUseProp(val, prop) {
      const property = this.Property
        ? { ...this.Property, [prop]: val }
        : { [prop]: val };

      if(this.Property && !this.Property.PropertyMixedUsageIndicator) {
        delete this.Property.PropertyMixedUsageExplanation;
      }
      this.Property && this.deleteEmptyProp(this.Property, 'PropertyMixedUsageExplanation')
      this.setProperty(property);
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.declarations));
    },
    onCancelClicked() {
      this.setDeclarationsProp(this.dataBeforeEdit.IntentToOccupyType, 'IntentToOccupyType')
      this.setDeclarationsProp(this.dataBeforeEdit.HomeownerPastThreeYearsType, 'HomeownerPastThreeYearsType')
      this.setDeclarationsProp(this.dataBeforeEdit.PriorPropertyUsageType, 'PriorPropertyUsageType')
      this.setDeclarationsProp(this.dataBeforeEdit.PriorPropertyTitleType, 'PriorPropertyTitleType')
      this.setDeclarationsProp(this.dataBeforeEdit.HomeownerPastThreeYearsExplanation, 'HomeownerPastThreeYearsExplanation')
      this.setDeclarationsProp(this.dataBeforeEdit.ULADSpecialBorrowerSellerRelationshipIndicator, 'ULADSpecialBorrowerSellerRelationshipIndicator')
      this.setDeclarationsProp(this.dataBeforeEdit.ULADSpecialBorrowerSellerRelationshipExplanation, 'ULADSpecialBorrowerSellerRelationshipExplanation')
      this.setDeclarationsProp(this.dataBeforeEdit.UndisclosedBorrowedFundsIndicator, 'UndisclosedBorrowedFundsIndicator')
      this.setDeclarationsProp(this.dataBeforeEdit.UndisclosedBorrowedFundsAmount, 'UndisclosedBorrowedFundsAmount')
      this.setDeclarationsProp(this.dataBeforeEdit.UndisclosedBorrowedFundsExplanation, 'UndisclosedBorrowedFundsExplanation')
      this.setDeclarationsProp(this.dataBeforeEdit.UndisclosedMortgageApplicationIndicator, 'UndisclosedMortgageApplicationIndicator')
      this.setDeclarationsProp(this.dataBeforeEdit.UndisclosedMortgageApplicationExplanation, 'UndisclosedMortgageApplicationExplanation')
      this.setDeclarationsProp(this.dataBeforeEdit.UndisclosedCreditApplicationIndicator, 'UndisclosedCreditApplicationIndicator')
      this.setDeclarationsProp(this.dataBeforeEdit.UndisclosedCreditApplicationExplanation, 'UndisclosedCreditApplicationExplanation')
      this.setDeclarationsProp(this.dataBeforeEdit.PropertyProposedCleanEnergyLienIndicator, 'PropertyProposedCleanEnergyLienIndicator')
      this.setDeclarationsProp(this.dataBeforeEdit.PropertyProposedCleanEnergyLienExplanation, 'PropertyProposedCleanEnergyLienExplanation')
      this.setMixedUseProp(this.dataBeforeEdit.PropertyMixedUsageIndicator, 'PropertyMixedUsageIndicator')
      this.setMixedUseProp(this.dataBeforeEdit.PropertyMixedUsageExplanation, 'PropertyMixedUsageExplanation')
    },
    onSaveClicked() {
      this.saveLoanPatches();
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower",
      Property: "getProperty"
    }),
    declarations() {
      return this.Borrower && this.Borrower.Declarations
        ? this.Borrower.Declarations
        : {};
    },
    propertyTypeText(){
      let propertyType = this.propertyTypes.find(x=>x.value===this.declarations.PriorPropertyUsageType)
      if(propertyType == null){
        return null
      }
      return propertyType.text
    },
    propertyTitleText(){
      let propertyTitle = this.propertyTitles.find(x=>x.value===this.declarations.PriorPropertyTitleType)
      if(propertyTitle == null){
        return null
      }
      return propertyTitle.text
    }
  },
  components: {
    TextRadio,
    TextDropmenu,
    SummaryControl
  }
};
</script>

<style lang="scss" scoped>

.v-divider {
  margin-bottom: 15px;
}

.center-aligned {
  align-items: center;
}

.field-title {
  font-size: 16px;
}

.field-value {
  margin-left: auto;
  padding-top: 0px;
  margin-top: -40px;
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
