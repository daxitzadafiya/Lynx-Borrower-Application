<template lang="pug">
    .liabilities-table
        v-card-title.main__card-title.mb-3
            .main__title.text-block.text-black--text If you have any mortgages, car payments, credit cards, or installment loans not listed, please add them using the Add New + button below. 
        v-card-text.text-block.text-black--text
            v-data-table#table(
                :headers="headers"
                :items="liabilities"
                disable-sort
                disable-pagination
                hide-default-footer
                class="elevation-1"
            )
                template(v-slot:item.FullName="{ item }")
                    span.mw-220 {{ item.FullName }}
                template(v-slot:item.LiabilityUnpaidBalanceAmount="{ item }")
                    span ${{ getFormattedValue(item.LiabilityUnpaidBalanceAmount) || 0 }}
                template(v-slot:item.LiabilityMonthlyPaymentAmount="{ item }")
                    span ${{ getFormattedValue(item.LiabilityMonthlyPaymentAmount) || 0 }}
                template(v-slot:item.LiabilityPayoffStatusIndicator="{ item }")
                    v-simple-checkbox(
                        :value="item.LiabilityPayoffStatusIndicator" 
                        color='primary' 
                        ripple=false
                        @input="setPayoff(item)"
                        )
                template(v-slot:item.edit="{ item }")
                    v-icon.mr-2(small @click="editItem(item)").icon-color-main mdi-pencil
                    v-icon.mr-2(small color="error" @click="setRemoveIndex(item)" v-if="item.ManualEntry") mdi-close
                template(v-slot:body.append)
                    tr.appended-row
                        td.appended-col.centered
                          v-row.add-new
                            Add(
                                customClass='small' 
                                @add="addLiability"
                                )
                            span.add-new__title.ml-2 Add New Liability
                        td
                        td.appended-col.centered Totals:
                        td.appended-col ${{ getFormattedValue(totalPayment) }}
                        td.appended-col ${{ getFormattedValue(totalUnpaid) }}
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
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Add from "@/components/buttons/Add";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import Button from "@/components/buttons/Button";

export default {
  mixins: [currencyFormat, debtToIncomeAndhousingRatios],
  data() {
    return {
      headers: [
        {
          text: "Account Type",
          value: "LiabilityType",
          class: "primary--text"
        },
        { text: "Company Name", value: "FullName", class: "primary--text" },
        {
          text: "Account Number",
          value: "LiabilityAccountIdentifier",
          class: "primary--text"
        },
        {
          text: "Monthly Payment",
          value: "LiabilityMonthlyPaymentAmount",
          class: "primary--text"
        },
        {
          text: "Unpaid Balance",
          value: "LiabilityUnpaidBalanceAmount",
          class: "primary--text"
        },
        // {
        //   text: "Payoff prior to closing",
        //   value: "LiabilityPayoffStatusIndicator",
        //   align: "center",
        //   class: "primary--text"
        // },
        { text: "Edit", value: "edit", class: "primary--text" }
      ],
      isDialog: false,
      removeIndex: -1
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "setEditingLiability", "updateBorrower"]),
    editItem(liability) {
      const index = this.liabilities.indexOf(liability);
      this.setEditingLiability({ liability, index });
      this.toggleIsOnlay({ onlayComponent: "editLiability", isOnlay: true });
    },
    setRemoveIndex(liability) {
      this.removeIndex = this.liabilities.indexOf(liability);
      this.isDialog = true;
    },
    removeLiability() {
      const updated = this.liabilities.filter(
        (item, index) => index !== this.removeIndex
      );
      this.updateBorrower({ prop: "Liabilities", value: updated });
      this.isDialog = false;
    },
    addLiability(){
      this.toggleIsOnlay({ onlayComponent: "addLiability", isOnlay: true });
    },
    setPayoff(liability) {
      const index = this.liabilities.indexOf(liability);
      const Liabilities = this.liabilities.map((item, i) =>
        i !== index
          ? item
          : {
              ...item,
              LiabilityPayoffStatusIndicator: !item.LiabilityPayoffStatusIndicator
            }
      );
      this.updateBorrower({ prop: "Liabilities", value: Liabilities });
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
    indexes() {
      return this.liabilities.length
        ? this.liabilities.map(item => item.FullName)
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
@import "@/assets/styles/colors.scss";

.liabilities-table {
  &__footer {
    border-top: thin solid rgba(0, 0, 0, 0.12);
    padding: 10px;
  }
}

.appended-row {
  font-weight: 600;
}

#table {
  margin-bottom: 40px;
  &:deep(th) {
    padding: 10px;
    font-weight: 500;
  }
  &:deep(td) {
    padding: 10px;
  }
  &:deep(.centered) {
    text-align: center !important;
  }
}

.mw-220 {
  display: inline-block;
  min-width: 152px;
}

.mr-2 {
  cursor: pointer;
}

.v-input__slot {
  margin-bottom: 0 !important;
}
:deep(th) {
  background-color: $table-header-back-color;
  span {
    color: $table-header-text-color !important;
  }
}
</style>
