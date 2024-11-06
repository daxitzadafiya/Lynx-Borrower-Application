<template lang="pug">
    v-card-text.text-block.text-black--text
        v-row.text-block__row.mb-7(v-for="key in filteredKeys" :key="key")
          v-card(width="100%").multpleItemsContainer
            v-col.text-block__col(sm="7" md="6" cols="12")
                v-text-field(
                    outlined
                    readonly
                    label="Housing Expense"
                    :value="getCorrectText(key)"
                )
            v-col.text-block__col(sm="4" md="3" cols="10")
                v-text-field(
                    outlined
                    prefix="$"
                    label="Monthly Amount" 
                    :value="getFormattedValue(currentRealEstate[key])"
                    @input="(e) => setAmount(+e.replace(/,/g, ''), key)"
                    @keypress="(e) => isOnlyNum(e, true)"
                    )
            .removeItem(@click="remove(key)")
                          v-icon close
        v-card.multpleItemsContainer(v-if="isAdditional")
          v-row.mt-3.pt-2.text-block__row
            v-col.text-block__col(sm="7" md="6" cols="12")
                v-select(
                    outlined
                    attach=true
                    :items="options"
                    item-text="text"
                    item-value="value"
                    label="Housing Expense"
                    @change="(e) => setNewExpenseTitle(e)"
                    :menu-props="{bottom: true, offsetY: true }"
                    )
            .removeItem(@click="isAdditional=null")
              v-icon close
        v-row.text-block__row.last-row.mt-7
            v-col.text-block__col(sm="4" cols="12" v-if="!isAllExpenses")
                v-row.add-new
                    Add(
                        customClass='small' 
                        @add="isAdditional=true"
                        )
                    span.add-new__title Add Expense
            v-col.text-block__col.totals-col(sm="4" cols="12")
                v-row.totals
                    span.totals__title Total:
                    span.totals__value ${{ getFormattedValue(total) }}
</template>

<script>
import Add from "@/components/buttons/Add";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      isAdditional: false,
      expenses: [
        {
          text: "Association Dues",
          value: "PropertyAssociationDuesExpenseAmount"
        },
        { text: "Insurance", value: "PropertyInsuranceExpenseAmount" },
        { text: "Taxes", value: "PropertyTaxesExpenseAmount" }
      ]
    };
  },
  methods: {
    ...mapActions(["setRealEstate"]),
    getCorrectText(key) {
      const expense = this.expenses.find(item => item.value === key);
      return expense.text;
    },
    setNewExpenseTitle(prop) {
      if (!this.RealEstate.length) {
        this.setRealEstate([{ [prop]: "" }]);
      } else {
        const realEstates = this.RealEstate.map((item, i) => {
          if (i === this.currentIndex) {
            item[prop] = "";
          }
          return item;
        });
        this.setRealEstate(realEstates);
      }
      this.isAdditional = false;
    },
    setExpenseTitle(newProp, oldProp) {
      let realEstate = {
        ...this.currentRealEstate,
        [newProp]: this.currentRealEstate[oldProp]
      };
      delete realEstate[oldProp];
      let realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = realEstate;
      this.setRealEstate(realEstates);
    },
    setAmount(value, prop) {
      const realEstates = this.RealEstate.map((item, i) => {
        if (i === this.currentIndex) {
          item[prop] = value;
          item.PropertyMaintenanceExpenseAmount = this.getAmountsSum(item);
        }
        return item;
      });
      this.setRealEstate(realEstates);
    },
    getAmountsSum(obj) {
      return Object.keys(obj).reduce((acc, cur) => {
        if (this.keys.indexOf(cur) !== -1 && !isNaN(obj[cur])) {
          acc += obj[cur] || 0;
        }
        return acc;
      }, 0);
    },
    remove(prop) {
      let realEstate = { ...this.currentRealEstate };
      delete realEstate[prop];
      realEstate.PropertyMaintenanceExpenseAmount = this.getAmountsSum(
        realEstate
      );
      let realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = realEstate;
      this.setRealEstate(realEstates);
    },
    addExpense() {
      if (this.name === "expenses") {
        this.setExpenses([
          ...this.currentExpenses,
          {
            HousingExpenseType: "Insurance",
            HousingExpenseTimingType: "Present",
            HousingExpensePaymentAmount: ""
          }
        ]);
      } else {
        this.setEditingExpenses([
          ...this.currentExpenses,
          {
            HousingExpenseType: "Insurance",
            HousingExpenseTimingType: "Present",
            HousingExpensePaymentAmount: ""
          }
        ]);
      }
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    },
    total() {
      return this.keys.reduce((acc, cur) => {
        if (cur in this.currentRealEstate)
          acc += !isNaN(this.currentRealEstate[cur])
            ? +this.currentRealEstate[cur]
            : 0;
        return acc;
      }, 0);
    },
    isAnyExpense() {
      return this.filteredKeys.length === 0;
    },
    isAllExpenses() {
      return this.filteredKeys.length === this.keys.length;
    },
    options() {
      return this.expenses.filter(
        item => !(item.value in this.currentRealEstate)
      );
    },
    filteredKeys() {
      let filteredKeys = [];
      for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i] in this.currentRealEstate) {
          filteredKeys.push(this.keys[i]);
        }
      }
      return filteredKeys;
    },
    keys() {
      return this.expenses.map(x => x.value);
    }
  },
  components: {
    Add
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.remove {
  padding-top: 30px;
  &__icon {
    cursor: pointer;
  }
}

.last-row {
  margin-bottom: 20px;
}

.add-new {
  &__title {
    font-weight: 500;
    margin-left: 10px;
  }
}

.totals {
  font-weight: 500;
  font-size: 18px;
  &__title {
    margin-right: 10px;
  }
}

@media (max-width: 760px) {
  .text-block {
    margin-top: 0;
    margin-bottom: 0;
  }
  .last-row {
    flex-direction: column-reverse;
  }
  .totals-col {
    margin-top: 10px;
  }
  .add-new {
    margin: 20px 0 10px;
  }
  .sm-margin-b-15 {
    margin-bottom: 15px;
  }
  .remove {
    padding-top: 15px;
    padding-left: 25px;
  }
}
</style>
