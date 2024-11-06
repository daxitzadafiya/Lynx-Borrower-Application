<template lang="pug">
  .d-contents
    h3.tableTitle(v-if="property.MortgageLoans!=null && property.MortgageLoans.length!=0") Mortgage Loans on this property
    v-data-table.content-table.my-2.mx-0(
      :headers="computedHeaders"
      :items="property.MortgageLoans"
      disable-sort
      disable-pagination
      hide-default-footer
      :mobile-breakpoint="0"
      v-if="property.MortgageLoans!=null && property.MortgageLoans.length!=0"
      :class="editable?'doubleActions':''"
    )
      template(v-slot:item.LiabilityUnpaidBalanceAmount="{ item }")
          span(v-if="item.LiabilityUnpaidBalanceAmount && item.LiabilityUnpaidBalanceAmount !== 'N/A'") $
          span {{ getFormattedValue(item.LiabilityUnpaidBalanceAmount) }}
      template(v-slot:item.LiabilityMonthlyPaymentAmount="{ item }")
          span(v-if="item.LiabilityMonthlyPaymentAmount && item.LiabilityMonthlyPaymentAmount !== 'N/A'") $
          span {{ getFormattedValue(item.LiabilityMonthlyPaymentAmount) }}
      template(v-slot:item.LiabilityCreditLimit="{ item }")
          span(v-if="item.LiabilityCreditLimit && item.LiabilityCreditLimit !== 'N/A'") $
          span {{ getFormattedValue(item.LiabilityCreditLimit) }}
      template(v-slot:item.LiabilityPayoffStatusIndicator="{ item, index }")
          v-simple-checkbox(
              color='primary' 
              ripple=false
              :value="item.LiabilityPayoffStatusIndicator" 
              @input="({ value }) => setPayoff(value, loan, loanIndex)"
              )
      template(v-slot:item.edit="{ item, index }")
        .d-flex.actionsContainer
          v-btn(icon small @click="editItem(item, index)").editIcon
            inline-svg(:src="editIcon")
          v-btn(icon small @click="setRemoveIndex(index)").deleteIcon
            inline-svg(:src="deleteIcon")
    v-dialog(
          v-model="isDialog"
          max-width="290"
      )
          v-card
              v-card-title.d-flex.justify-center.mb-4.text-black--text Are you sure? 
              v-card-text
                  v-row.justify-space-around
                      Button(
                          value="Yes"
                          customClass="button-yes"
                          width="120px"
                          @clicked="removeDetail")
                      Button(
                          value="No"
                          width="120px"
                          customClass="button-no"
                          isOutlined=true
                          @clicked="isDialog=false")
    v-btn(dense plain elevation="0" @click="addMorgageLoan" v-if="editable").addItemBtn.pl-0
      v-icon(small) mdi-plus
      span.addBtnText Add Mortgage Loan
</template>

<script>
import CheckBox from "@/components/form/CheckBox";
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapActions } from "vuex";

export default {
  mixins: [currencyFormat],
  props: {
    property: {
      type: Object,
      default: () => {
        return {};
      }
    },
    index: {
      type: Number
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Loan Type",
          value: "MortgageLoanType",
        },
        { text: "Creditor Name", value: "FullName" },
        {
          text: "Account Number",
          value: "LiabilityAccountIdentifier",
        },
        {
          text: "Monthly Payment",
          value: "LiabilityMonthlyPaymentAmount",
        },
        {
          text: "Unpaid Balance",
          value: "LiabilityUnpaidBalanceAmount",
        },
        {
          text: "Credit Limit",
          value: "LiabilityCreditLimit",
        },
        {
          text: "Payoff prior to closing",
          value: "LiabilityPayoffStatusIndicator",
        },
        { text: "Action", value: "edit" }
      ],
      isDialog: false,
      removeIndex: -1,
      editIcon:require("@/assets/images/edit.svg"),
      deleteIcon:require("@/assets/images/delete.svg")
    };
  },
  methods: {
    ...mapActions([
      "toggleIsOnlay",
      "setEditingMortgageLoan",
      "setEditingPropertyDetails",
      "setRealEstateEditingIndex",
      "setMortgageLoan",
      "setRealEstate"
    ]),
    editItem(loan, loanIndex) {
      const {
        AddressLineText,
        CityName,
        StateCode,
        PostalCode
      } = this.property;
      this.setEditingPropertyDetails({
        title: `Property #${this.index + 1}`,
        location: `${AddressLineText}, ${CityName}, ${StateCode}, ${PostalCode}`
      });
      this.setEditingItems(loan, loanIndex);
      this.toggleIsOnlay({ onlayComponent: "mortgage-loan", isOnlay: true });
    },
    setEditingItems(loan, loanIndex) {
      this.setRealEstateEditingIndex(this.index);
      this.setEditingMortgageLoan({ loan, loanIndex });
    },
    setPayoff(value, loan, loanIndex) {
      this.setEditingItems(loan, loanIndex);
      this.setMortgageLoan({
        value,
        loanIndex,
        prop: "LiabilityPayoffStatusIndicator"
      });
    },
    setTaxesAndInsurance(value, loan, loanIndex) {
      this.setEditingItems(loan, loanIndex);
      this.setMortgageLoan({
        value,
        loanIndex,
        prop: "LiabilityPaymentIncludesTaxesInsuranceIndicator"
      });
    },
    addMorgageLoan() {
      this.editItem(
        {},
        this.property.MortgageLoans ? this.property.MortgageLoans.length : 0
      );
    },
    setRemoveIndex(index) {
      this.removeIndex = index;
      this.isDialog = true;
    },
    removeDetail() {
      const filtered = this.property.MortgageLoans.filter(
        (item, index) => index !== this.removeIndex
      );
      const updatedRealEstate = { ...this.property, MortgageLoans: filtered };
      this.$emit("removeLoanDetail", { updatedRealEstate, index: this.index });
      this.isDialog = false;
      this.removeIndex = -1;
    }
  },
  computed:{
    computedHeaders(){
      return this.editable?this.headers: this.headers.filter(x=>x.value!="edit")
    }
  },
  components: {
    CheckBox,
    Add,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

.real-estate-summary {
  padding-left: 20px;
}

.loan-header {
  &__title {
    font-size: 12px;
  }
}

.wide {
  padding-left: 0;
  min-width: 140px;
}

.loan-data {
  &__value {
    font-size: 14px;
  }
  &_centered {
    text-align: center;
  }
}

.add-new {
  @media (min-width: 1024px) {
    padding-left: 10px;
  }
  align-items: center;
  &__title {
    font-size: 14px;
    font-weight: 500;
    margin-left: 10px;
  }
}

.tableTitle{
  z-index: 10;
  position: relative;
  font-weight: 500;
}
</style>
