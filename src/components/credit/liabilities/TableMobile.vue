<template lang="pug">
    .liabilities-table
        v-card-title.main__card-title.mb-3
            .main__title.text-block.text-black--text If you have any mortgages, car payments, credit cards, or installment loans not listed, please add them using the Add New + button below. 
        v-card-text.text-block.text-black--text(style="max-height: unset;height: auto;overflow-y: hidden;")
            v-row.text-block__row.bordered-row(v-for="(liability, index) in liabilities" :key="index")
                v-col.text-block__col.bottom-pad-xs(v-for="({ text, value, isCurrency }, index) in headers"
                    :key="index"
                    sm="5"
                    cols="6"
                    :class="{last: value==='LiabilityPayoffStatusIndicator'}"
                    )
                    template(v-if="value !== 'LiabilityPayoffStatusIndicator'")
                        v-row.text-block__row.data-title.my-0 {{ text }}
                        v-row.text-block__row.data-value.my-0
                            span(v-if="isCurrency") $
                            span {{ isCurrency ? getFormattedValue(liability[value]) : liability[value] }}
                    template(v-if="value == 'LiabilityPayoffStatusIndicator'")
                        v-row.text-block__row
                            v-col.text-block__col(sm="7" cols="12") {{ text }}
                            v-col.text-block__col.check-col(sm="1" cols="3")
                                v-simple-checkbox(
                                    :value="liability[value]" 
                                    color='primary' 
                                    ripple=false
                                    @input="setPayoff(index)"
                                    )
                .edit.d-flex.flex-column.justify-center
                    v-icon(@click="editItem(index)").text-block__icon.icon-color-main mdi-pencil
                    v-icon.mt-2(medium color="error" @click="setRemoveIndex(index)" v-if="liability.ManualEntry") mdi-close
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
                                @clicked="removeLiability")
                            Button(
                                value="No"
                                width="120px"
                                customClass="button-no"
                                isOutlined=true
                                @clicked="isDialog=false")
        v-row.text-block__row.totals-row
            v-col.add-new.d-flex
                Add(
                    customClass='small flex-shrink-0' 
                    @add="addLiability"
                    )
                span.add-new__title.ml-2 Add New Liability
            v-col.text-block__col(sm="2" cols="4")
                v-row.text-block__row.totals-row_bold.totals-row_aligned-bottom Totals:
            v-col.text-block__col(sm="3" cols="4")
                v-row.text-block__row.data-title Unpaid Balance
                v-row.text-block__row.totals-row_bold.data-value ${{ getFormattedValue(totalUnpaid) }}
            v-col.text-block__col(sm="3" cols="4")
                v-row.text-block__row.data-title Monthly Payment
                v-row.text-block__row.totals-row_bold.data-value ${{ getFormattedValue(totalPayment) }}
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";

export default {
  mixins: [currencyFormat, debtToIncomeAndhousingRatios],
  data() {
    return {
      headers: [
        { text: "Account Type", value: "LiabilityType" },
        { text: "Company Name", value: "FullName" },
        { text: "Account Number", value: "LiabilityAccountIdentifier" },
        {
          text: "Unpaid Balance",
          value: "LiabilityUnpaidBalanceAmount",
          isCurrency: true
        },
        {
          text: "Payoff prior to closing",
          value: "LiabilityPayoffStatusIndicator",
          align: "center"
        },
        {
          text: "Monthly Payment",
          value: "LiabilityMonthlyPaymentAmount",
          isCurrency: true
        }
      ],
      isDialog: false,
      removeIndex: -1
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "setEditingLiability", "updateBorrower"]),
    editItem(index) {
      const liability = { ...this.liabilities[index] };
      this.setEditingLiability({ liability, index });
      this.toggleIsOnlay({ onlayComponent: "editLiability", isOnlay: true });
    },
    setPayoff(index) {
      const Liabilities = this.liabilities.map((item, i) =>
        i !== index
          ? item
          : {
              ...item,
              LiabilityPayoffStatusIndicator: !item.LiabilityPayoffStatusIndicator
            }
      );
      this.updateBorrower({ prop: "Liabilities", value: Liabilities });
    },
    addLiability(){
      this.toggleIsOnlay({ onlayComponent: "addLiability", isOnlay: true });
    },
    setRemoveIndex(index) {
      this.removeIndex = index;
      this.isDialog = true;
    },
    removeLiability() {
      const updated = this.liabilities.filter(
        (item, index) => index !== this.removeIndex
      );
      this.updateBorrower({ prop: "Liabilities", value: updated });
      this.isDialog = false;
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    liabilities() {
      return this.borrower && this.borrower.Liabilities
        ? this.borrower.Liabilities
        : [];
    },
    totalUnpaid() {
      if (this.liabilities.length) {
        return this.liabilities.reduce(
          (acc, cur) =>
            acc +
            (!isNaN(cur.LiabilityUnpaidBalanceAmount)
              ? +cur.LiabilityUnpaidBalanceAmount
              : 0),
          0
        );
      }
      return 0;
    },
    totalPayment() {
      if (this.liabilities.length) {
        return this.liabilities.reduce(
          (acc, cur) =>
            acc +
            (!isNaN(cur.LiabilityMonthlyPaymentAmount)
              ? +cur.LiabilityMonthlyPaymentAmount
              : 0),
          0
        );
      }
      return 0;
    }
  },
  watch: {
    isDialog: function(val) {
      if (!val) {
        this.removeIndex = -1;
      }
    },
    liabilities: {
      deep: true,
      handler() {
        this.setDebtToIncomeAndHousingRatios();
      }
    }
  },
  components: {
    Button,
    Add
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
@import "@/assets/styles/credit/liabilityMobileTable.scss";
</style>
