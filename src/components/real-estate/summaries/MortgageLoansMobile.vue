<template lang="pug">
    .mortgage-loans-mobile-table
        v-card-text.text-block.text-black--text(v-if="property.MortgageLoans && property.MortgageLoans.length")
            v-row.text-block__row.bordered-row(v-for="(loan, loanIndex) in property.MortgageLoans" :key="loanIndex")
                v-col.text-block__col.bottom-pad-xs(v-for="({ text, value, isCurrency }, index) in headers"
                    :key="index"
                    sm="3"
                    :cols="value === 'isPayoff' ? '10' : '6'"
                    :class="{'flexed-row-mobile': value === 'isPayoff'}"
                    )
                    template(v-if="value !== 'payoff'")
                        v-row.text-block__row.data-title {{ text }}
                        v-row.text-block__row.data-value(v-if="value !== 'LiabilityPayoffStatusIndicator'") 
                            span(v-if="isCurrency && loan[value] !== 'N/A'") $
                            span {{ isCurrency ? getFormattedValue(loan[value]) : loan[value] }}
                        v-row.text-block__row.data-value.mobile-padding-top-5(v-else)
                            CheckBox(:isChecked="loan.LiabilityPayoffStatusIndicator" @toggle="({ value }) => setPayOff(value, loan, loanIndex)")
                .edit.d-flex.flex-column.align-center
                    img(:src="require('@/assets/images/credit/edit-circle.png')" @click="editItem(loan, loanIndex)")
                    v-icon.remove-icon.mt-2(color="error" @click="setRemoveIndex(loanIndex)") mdi-close
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
        .text-block
            v-row.add-new
                Add(
                    customClass='small' 
                    @add="addMorgageLoan"
                    )
                span.add-new__title Add Mortgage Loan
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
    }
  },
  data() {
    return {
      headers: [
        { text: "Loan Type", value: "MortgageLoanType" },
        { text: "Creditor Name", value: "FullName" },
        { text: "Account Number", value: "LiabilityAccountIdentifier" },
        {
          text: "Monthly Payment",
          value: "LiabilityMonthlyPaymentAmount",
          isCurrency: true
        },
        {
          text: "Unpaid Balance",
          value: "LiabilityUnpaidBalanceAmount",
          isCurrency: true
        },
        {
          text: "Credit Limit",
          value: "LiabilityCreditLimit",
          isCurrency: true
        },
        {
          text: "Payoff prior to closing",
          value: "LiabilityPayoffStatusIndicator"
        }
      ],
      isDialog: false,
      removeIndex: -1
    };
  },
  methods: {
    ...mapActions([
      "toggleIsOnlay",
      "setEditingMortgageLoan",
      "setEditingPropertyDetails",
      "setRealEstateEditingIndex",
      "setMortgageLoan"
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
    setPayOff(value, loan, loanIndex) {
      this.setEditingItems(loan, loanIndex);
      this.setMortgageLoan({
        value,
        loanIndex,
        prop: "LiabilityPayoffStatusIndicator"
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
  components: {
    CheckBox,
    Add,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
@import "@/assets/styles/credit/liabilityMobileTable.scss";

.add-new {
  align-items: center;
  padding: 15px 0;
  &__title {
    font-size: 14px;
    font-weight: 500;
    margin-left: 10px;
  }
}

.edit {
  top: 40px;
}

@media (max-width: 768px) {
  .text-block {
    padding-left: 35px;
  }
}

@media (max-width: 760px) {
  .edit {
    top: 70px;
  }
  .flexed-row-mobile {
    display: flex;
    align-items: center;
  }
  .text-block {
    padding: 0 15px 0 25px;
  }
  .text-block {
    .mobile-padding-top-5 {
      padding-top: 5px;
    }
  }
}
</style>
