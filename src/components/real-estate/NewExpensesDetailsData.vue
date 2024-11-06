<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="filteredKeys.length">
      <v-row
        class="form-container deleteAbleItem"
        v-for="key in filteredKeys"
        :key="key"
      >
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense="dense" icon="icon" @click="remove(key)">
            <v-icon small="small">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <Input
          readonly="readonly"
          inputTitle="Housing Expense"
          :value="getCorrectText(key)"
        />
        <Input
          prefix="$"
          inputTitle="Monthly Amount"
          :value="getFormattedValue(currentRealEstate[key])"
          @input="e => setAmount(+e.replace(/,/g, ''), key)"
          @keypress="e => isOnlyNum(e, true)"
        />
      </v-row>
    </div>
    <v-row class="form-container deleteAbleItem" v-if="isAdditional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="isAdditional = false">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input
        defaultComponent="v-select"
        attach="attach"
        :items="options"
        item-text="text"
        item-value="value"
        inputTitle="Housing Expense"
        @change="e => setNewExpenseTitle(e)"
        :menu-props="{ bottom: true, offsetY: true }"
      />
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="isAdditional = true"
          v-if="!isAllExpenses"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add Expense</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
  </v-form>
</template>

<script>
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
  }
};
</script>
