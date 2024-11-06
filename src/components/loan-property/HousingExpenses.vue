<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please list any expenses associated with the home. <br />
        Typical Expenses include Property Taxes, Homeowner Association Dues and
        Condo Fees.
      </div>
    </div>
    <div class="image-container">
      <div class="titleSecondaryText primary-text font-weight-bold mb-0">
        Please Itemize the Proposed Housing Expenses for {{ address }}
      </div>
      <div
        class="flex-grow-1 d-flex jusify-content-center align-center flex-column expensesContianer"
      >
        <v-row
          class="expenseItemRow justify-content-center px-1 mt-7"
          v-for="(expenseType, index) in defaultHousingExpenseTypes"
          :key="`${expenseType.value}-Default-${index}`"
          :class="{
            active: isExpenseActive(expenseType.value, expenseType.text)
          }"
        >
          <v-col
            :class="{
              'd-flex align-center expenseItemHeaderRow': true,
              rightBordered: $vuetify.breakpoint.smAndUp
            }"
            sm="5"
            cols="12"
          >
            <div class="flex-grow-1">{{ expenseType.text }}</div>
            <v-icon class="px-1 py-1 expenseQuestionButton" small="small"
              >mdi-help</v-icon
            >
          </v-col>
          <v-col
            class="d-flex align-center flex-wrap flex-sm-nowrap"
            sm=""
            cols="12"
          >
            <v-radio-group
              class="flex-shrink-0"
              row="row"
              :value="housingExpenseTerm(expenseType.value, expenseType.text)"
              @change="
                e =>
                  updateHousingExpense(
                    expenseType.value,
                    expenseType.text,
                    'HousingExpenseTerm',
                    e
                  )
              "
            >
              <v-radio label="Monthly" value="Monthly"></v-radio>
              <v-radio label="Yearly" value="Yearly"></v-radio>
            </v-radio-group>
            <v-text-field
              prefix="$"
              outlined="outlined"
              hide-details="hide-details"
              dense="dense"
              :value="housingExpenseValue(expenseType.value, expenseType.text)"
              @input="
                e =>
                  updateHousingExpense(
                    expenseType.value,
                    expenseType.text,
                    'HousingExpensePaymentAmount',
                    +e.replace(/,/g, '')
                  )
              "
              @keypress="e => isOnlyNum(e, true)"
              @click.stop
            ></v-text-field>
            <v-icon
              class="ml-2"
              @click.stop="
                deactivateExpense(
                  expenseType.value,
                  expenseType.text,
                  housingExpenseValue(expenseType.value, expenseType.text)
                )
              "
              v-if="isExpenseActive(expenseType.value, expenseType.text)"
            >
              close
            </v-icon>
          </v-col>
          <v-icon class="checkCircle">check_circle</v-icon>
        </v-row>
        <v-row
          class="expenseItemRow justify-content-center px-1 mt-7 active"
          v-for="(housingExpense, index) in nonDefaultHousingExpenses"
          :key="
            `${housingExpense.HousingExpenseType}-${housingExpense.HousingExpenseNote}-${index}`
          "
          @click="
            activateExpense(
              housingExpense.HousingExpenseType,
              housingExpense.HousingExpenseNote,
              housingExpense.HousingExpensePaymentAmount
            )
          "
        >
          <v-col
            :class="{
              'd-flex align-center expenseItemHeaderRow': true,
              rightBordered: $vuetify.breakpoint.smAndUp
            }"
            sm="5"
            cols="12"
          >
            <div class="d-flex flex-column flex-grow-1">
              <v-select
                :items="
                  getRemainingHousingExpenses(housingExpense.HousingExpenseNote)
                "
                @change="
                  e =>
                    addHousingExpense(
                      e,
                      housingExpense.HousingExpenseType,
                      housingExpense.HousingExpenseNote
                    )
                "
                :value="getExpenseNoteDisplayValue(housingExpense)"
                outlined="outlined"
                :menu-props="{ bottom: true, offsetY: true }"
                hide-details="hide-details"
                dense="dense"
              ></v-select>
              <v-text-field
                v-if="housingExpense.HousingExpenseNote.startsWith('Other')"
                :hide-details="true"
                outlined
                dense
                placeholder="Other Description"
                :value="housingExpense.HousingExpenseTypeOtherDescription"
                class="mt-2"
                @input="
                  e =>
                    updateHousingExpense(
                      housingExpense.HousingExpenseType,
                      housingExpense.HousingExpenseNote,
                      'HousingExpenseTypeOtherDescription',
                      e
                    )
                "
              />
            </div>
            <v-icon class="px-1 py-1 ml-2 expenseQuestionButton" small="small">
              mdi-help
            </v-icon>
          </v-col>
          <v-col
            class="d-flex align-center flex-wrap flex-sm-nowrap"
            sm=""
            cols="12"
          >
            <v-radio-group
              class="flex-shrink-0"
              row="row"
              :value="
                housingExpenseTerm(
                  housingExpense.HousingExpenseType,
                  housingExpense.HousingExpenseNote
                )
              "
              @change="
                e =>
                  updateHousingExpense(
                    housingExpense.HousingExpenseType,
                    housingExpense.HousingExpenseNote,
                    'HousingExpenseTerm',
                    e
                  )
              "
            >
              <v-radio label="Monthly" value="Monthly"></v-radio>
              <v-radio label="Yearly" value="Yearly"></v-radio>
            </v-radio-group>
            <v-text-field
              prefix="$"
              outlined="outlined"
              hide-details="hide-details"
              dense="dense"
              :value="
                housingExpenseValue(
                  housingExpense.HousingExpenseType,
                  housingExpense.HousingExpenseNote
                )
              "
              @input="
                e =>
                  updateHousingExpense(
                    housingExpense.HousingExpenseType,
                    housingExpense.HousingExpenseNote,
                    'HousingExpensePaymentAmount',
                    +e.replace(/,/g, ''),
                    housingExpense.id
                  )
              "
              @keypress="e => isOnlyNum(e, true)"
            ></v-text-field>
            <v-btn
              class="mr-1 px-1 py-1 flex-shrink-0"
              icon="icon"
              @click.stop="
                removeHousingExpense(
                  housingExpense.HousingExpenseType,
                  housingExpense.HousingExpenseNote
                )
              "
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
          <v-icon class="checkCircle">check_circle</v-icon>
        </v-row>
        <div
          class="expenseAddNewItem d-flex justify-content-center px-3 mt-7 py-3"
          @click="newItemVisible = true"
          v-if="!newItemVisible"
        >
          <v-icon class="mr-3 plusIcon">mdi-plus</v-icon>
          <div class="plusText font-weight-bold">
            Please add any additional Insurances(Wind, Flood, Earthquake) items,
            or HOA Dues / Condo Fess you are expecting to pay
          </div>
        </div>
        <v-row
          class="expenseItemRow justify-content-start px-1 mt-7"
          v-if="newItemVisible"
        >
          <v-col class="d-flex align-items-start" sm="5" cols="12">
            <v-select
              class="mr-2"
              :items="nonDefaultHousingExpenseTypes"
              @change="e => addHousingExpense(e)"
              :value="null"
              outlined="outlined"
              :menu-props="{ bottom: true, offsetY: true }"
              hide-details="hide-details"
              dense="dense"
            ></v-select>
            <v-btn
              class="mr-1 px-1 py-1 flex-shrink-0"
              icon="icon"
              @click="newItemVisible = false"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";
import onlyNum from "@/mixins/onlyNum.js";

export default {
  mixins: [currencyFormat, onlyNum],
  data() {
    return {
      newItemVisible: false,
      nonDefaultHousingExpenseTypes: [
        { text: "Flood Insurance", expenseType: "HomeownersInsurance" },
        { text: "Wind Insurance", expenseType: "HomeownersInsurance" },
        { text: "Earthquake Insurance", expenseType: "HomeownersInsurance" },
        {
          text: "HOA Fees",
          expenseType: "HomeownersAssociationDuesAndCondominiumFee"
        },
        {
          text: "Condo Fees",
          expenseType: "HomeownersAssociationDuesAndCondominiumFee"
        },
        {
          text: "Master Association Fees",
          expenseType: "HomeownersAssociationDuesAndCondominiumFee"
        },
        { text: "Mortgage Insurance", expenseType: "MIPremium" },
        { text: "Other", expenseType: "Other" }
      ],
      activeRows: {}
    };
  },
  methods: {
    ...mapActions(["setProperty", "setExpenses", "updateMortgageLoanInfo"]),
    housingExpenseValue(type, note) {
      const expense = this.housingExpenses.find(
        e => e.HousingExpenseType === type && e.HousingExpenseNote === note
      );
      if (expense && expense.HousingExpensePaymentAmount) {
        return this.getFormattedValue(expense.HousingExpensePaymentAmount);
      }

      const activeRowKey = Object.keys(this.activeRows).find(key =>
        key.startsWith(`${type}-${note}-`)
      );
      if (activeRowKey && this.activeRows[activeRowKey].value) {
        return this.getFormattedValue(this.activeRows[activeRowKey].value);
      }

      return "";
    },
    housingExpenseTerm(type, note) {
      const expense = this.housingExpenses.find(
        e => e.HousingExpenseType === type && e.HousingExpenseNote === note
      );
      if (expense && expense.HousingExpenseTerm) {
        return expense.HousingExpenseTerm;
      }

      const activeRowKey = Object.keys(this.activeRows).find(key =>
        key.startsWith(`${type}-${note}`)
      );
      if (activeRowKey && this.activeRows[activeRowKey].term) {
        return this.activeRows[activeRowKey].term;
      }

      return null;
    },
    updateHousingExpense(type, note, prop, value) {
      let HousingExpenses = [...this.housingExpenses];

      let expenseIndex = HousingExpenses.findIndex(
        item =>
          item.HousingExpenseType === type && item.HousingExpenseNote === note
      );

      if (expenseIndex === -1) {
        expenseIndex = HousingExpenses.length;
        HousingExpenses.push({
          HousingExpenseTimingType: "Proposed",
          HousingExpenseType: type,
          HousingExpenseNote: note,
          HousingExpenseTerm: null,
          HousingExpensePaymentAmount: null
        });
      }

      HousingExpenses[expenseIndex][prop] = value;

      this.updateMortgageLoanInfo({
        prop: "HousingExpenses",
        value: HousingExpenses
      });

      const activeRowKey = `${type}-${note}`;
      if (!this.activeRows[activeRowKey]) {
        this.$set(this.activeRows, activeRowKey, {
          active: true,
          term: HousingExpenses[expenseIndex].HousingExpenseTerm,
          value: HousingExpenses[expenseIndex].HousingExpensePaymentAmount
        });
      } else {
        if (prop === "HousingExpenseTerm") {
          this.activeRows[activeRowKey].term = value;
        } else if (prop === "HousingExpensePaymentAmount") {
          this.activeRows[activeRowKey].value = value;
        }
      }
    },
    updateActiveRows(HousingExpenses) {
      this.activeRows = {};
      let counter = {};

      HousingExpenses.forEach(expense => {
        const key = `${expense.HousingExpenseType}-${expense.HousingExpenseNote}-${expense.HousingExpensePaymentAmount}`;

        if (!counter[key]) {
          counter[key] = 0;
        }

        const expenseKey = `${key}-${counter[key]}`;
        counter[key]++;

        const isActive =
          expense.HousingExpensePaymentAmount !== 0 &&
          expense.HousingExpensePaymentAmount !== null &&
          expense.HousingExpensePaymentAmount !== "" &&
          parseFloat(expense.HousingExpensePaymentAmount) > 0;

        this.$set(this.activeRows, expenseKey, {
          active: isActive,
          term: expense.HousingExpenseTerm,
          value: expense.HousingExpensePaymentAmount
        });
      });
    },
    removeHousingExpense(type, note) {
      let HousingExpenses = [...this.housingExpenses];

      const expenseIndex = HousingExpenses.findIndex(
        expense =>
          expense.HousingExpenseType === type &&
          expense.HousingExpenseNote === note
      );

      if (expenseIndex !== -1) {
        HousingExpenses.splice(expenseIndex, 1);

        const baseNote = note.split(" (")[0];
        const sameTypeExpenses = HousingExpenses.filter(
          expense =>
            expense.HousingExpenseType === type &&
            expense.HousingExpenseNote.startsWith(baseNote)
        );

        sameTypeExpenses.forEach((expense, index) => {
          if (index === 0) {
            expense.HousingExpenseNote = baseNote;
          } else {
            expense.HousingExpenseNote = `${baseNote} (${index + 1})`;
          }
        });

        this.updateMortgageLoanInfo({
          prop: "HousingExpenses",
          value: HousingExpenses
        });

        this.updateActiveRows(HousingExpenses);
      }
    },
    getRemainingHousingExpenses(noteText) {
      const alwaysInclude = [
        "Mortgage Insurance",
        "Other",
        "Flood Insurance",
        "Wind Insurance",
        "Earthquake Insurance"
      ];

      const baseExpenseTypes = this.nonDefaultHousingExpenseTypes.map(
        x => x.text
      );

      const result = this.nonDefaultHousingExpenseTypes.filter(
        x =>
          alwaysInclude.includes(x.text) ||
          noteText === x.text ||
          noteText.startsWith(x.text + " (") ||
          !this.housingExpenses.some(
            y =>
              y.HousingExpenseNote &&
              y.HousingExpenseNote.split(" (")[0] === x.text
          )
      );

      if (noteText && !baseExpenseTypes.includes(noteText)) {
        const baseNote = noteText.split(" (")[0];
        const matchingType = this.nonDefaultHousingExpenseTypes.find(
          x => x.text === baseNote
        );
        if (matchingType) {
          result.push({ ...matchingType, text: noteText });
        }
      }

      return result;
    },
    getExpenseNoteDisplayValue(housingExpense) {
      const baseNotes = this.nonDefaultHousingExpenseTypes.map(x => x.text);
      if (baseNotes.includes(housingExpense.HousingExpenseNote)) {
        return housingExpense.HousingExpenseNote;
      }

      const baseNote = housingExpense.HousingExpenseNote.split(" (")[0];
      const matchingType = this.nonDefaultHousingExpenseTypes.find(
        x => x.text === baseNote
      );

      return matchingType ? housingExpense.HousingExpenseNote : null;
    },
    addHousingExpense(newType, oldType, oldNote) {
      let HousingExpenses = [...this.housingExpenses];

      const existingExpenses = HousingExpenses.filter(expense =>
        expense.HousingExpenseNote.startsWith(newType)
      );

      let newNote = newType;
      if (existingExpenses.length > 0) {
        newNote = `${newType} (${existingExpenses.length + 1})`;
      }

      const newExpenseType = this.getExpenseTypeFromNote(newType);

      if (oldType && oldNote) {
        const existingExpenseIndex = HousingExpenses.findIndex(
          expense =>
            expense.HousingExpenseType === oldType &&
            expense.HousingExpenseNote === oldNote
        );

        if (existingExpenseIndex !== -1) {
          const expense = HousingExpenses[existingExpenseIndex];
          const oldAmount = expense.HousingExpensePaymentAmount;
          const oldTerm = expense.HousingExpenseTerm;

          expense.HousingExpenseNote = newNote;
          expense.HousingExpenseType = newExpenseType;

          const oldActiveRowKey = `${oldType}-${oldNote}`;
          const newActiveRowKey = `${newExpenseType}-${newNote}`;

          if (this.activeRows[oldActiveRowKey]) {
            this.$set(this.activeRows, newActiveRowKey, {
              ...this.activeRows[oldActiveRowKey],
              value: oldAmount,
              term: oldTerm
            });
            this.$delete(this.activeRows, oldActiveRowKey);
          }
        }
      } else {
        const newExpense = {
          HousingExpenseTimingType: "Proposed",
          HousingExpenseType: newExpenseType,
          HousingExpenseNote: newNote,
          HousingExpenseTerm: null,
          HousingExpensePaymentAmount: 0
        };
        HousingExpenses.push(newExpense);

        const newActiveRowKey = `${newExpenseType}-${newNote}`;
        this.$set(this.activeRows, newActiveRowKey, {
          active: true,
          term: null,
          value: 0
        });
      }

      this.updateMortgageLoanInfo({
        prop: "HousingExpenses",
        value: HousingExpenses
      });

      this.newItemVisible = false;
    },
    getExpenseTypeFromNote(note) {
      const expenseNote = this.nonDefaultHousingExpenseTypes.find(
        e => e.text === note
      );
      return expenseNote ? expenseNote.expenseType : null;
    },
    activateExpense(type, note, amount = 0) {
      let expense = this.housingExpenses.find(
        item =>
          item.HousingExpenseType === type &&
          item.HousingExpenseNote === note &&
          (amount === null || item.HousingExpensePaymentAmount === amount)
      );

      if (!expense) {
        this.updateHousingExpense(type, note, "HousingExpensePaymentAmount", 0);
        this.updateHousingExpense(type, note, "HousingExpenseTerm", null);
      } else {
        const key = `${type}-${note}-${expense.HousingExpensePaymentAmount}`;
        const expenseKey = `${key}-0`;

        this.$set(this.activeRows, expenseKey, {
          active: true,
          term: expense.HousingExpenseTerm,
          value: expense.HousingExpensePaymentAmount
        });
      }
    },
    deactivateExpense(type, note, amount = 0) {
      let expenseKey = `${type}-${note}-${amount}`;
      if (this.isDefaultExpense(type, note)) {
        expenseKey = `${type}-${note}`;
      }

      let HousingExpenses = [...this.housingExpenses];

      const expenseIndex = HousingExpenses.findIndex(
        item =>
          item.HousingExpenseType === type && item.HousingExpenseNote === note
      );

      if (expenseIndex !== -1) {
        HousingExpenses.splice(expenseIndex, 1);

        this.updateMortgageLoanInfo({
          prop: "HousingExpenses",
          value: HousingExpenses
        });

      }

      if (this.activeRows[expenseKey]) {
        if (this.isDefaultExpense(type, note)) {
          this.$set(this.activeRows, expenseKey, {
            active: false,
            term: null,
            value: 0
          });
        } else {
          this.$delete(this.activeRows, expenseKey);
        }
      }
    },
    isDefaultExpense(type, note) {
      return this.defaultHousingExpenseTypes.some(
        defaultType => defaultType.value === type && defaultType.text === note
      );
    },
    initializeActiveRows() {
      this.activeRows = {};
      let counter = {};

      this.housingExpenses.forEach(expense => {
        let key = `${expense.HousingExpenseType}-${expense.HousingExpenseNote}-${expense.HousingExpensePaymentAmount}`;
        if (
          this.isDefaultExpense(
            expense.HousingExpenseType,
            expense.HousingExpenseNote
          )
        ) {
          key = `${expense.HousingExpenseType}-${expense.HousingExpenseNote}`;
        }

        if (!counter[key]) {
          counter[key] = 0;
        }

        let expenseKey = `${key}-${counter[key]}`;

        if (
          this.isDefaultExpense(
            expense.HousingExpenseType,
            expense.HousingExpenseNote
          )
        ) {
          expenseKey = key;
        }
        counter[key]++;

        const isActive =
          expense.HousingExpensePaymentAmount !== 0 &&
          expense.HousingExpensePaymentAmount !== null &&
          expense.HousingExpensePaymentAmount !== "" &&
          parseFloat(expense.HousingExpensePaymentAmount) > 0;

        this.$set(this.activeRows, expenseKey, {
          active: isActive,
          term: expense.HousingExpenseTerm,
          value: expense.HousingExpensePaymentAmount
        });
      });
    },
    isExpenseActive(type, note, amount = null) {
      const isActive = Object.entries(this.activeRows).some(([key, value]) => {
        const [expenseType, expenseNote] = key.split("-");
        const typeMatch = expenseType === type;
        const noteMatch = expenseNote.includes(note);
        const amountMatch = amount === null || value.value === amount;
        return typeMatch && noteMatch && amountMatch && value.active;
      });
      return isActive;
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty",
      housingExpenses: "getHousingExpenses"
    }),
    address() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.Property) {
        return keys.reduce((acc, cur) => {
          if (this.Property[cur]) {
            acc += `${this.Property[cur]}${cur === "PostalCode" ? " " : ", "}`;
          }
          return acc;
        }, "");
      }
      return "";
    },
    defaultHousingExpenseTypes() {
      let housingExpenseTypes = [
        { text: "Property Taxes", value: "RealEstateTax" },
        { text: "Hazzard Insurance", value: "HomeownersInsurance" },
        {
          text: "HOA/Condo Fees",
          value: "HomeownersAssociationDuesAndCondominiumFees"
        }
      ];

      if (this.Property && this.Property.PropertyType) {
        let PropertyFormatted = this.Property.PropertyType.replace(
          /([a-z])([A-Z])/g,
          "$1 $2"
        );
        if (
          PropertyFormatted === "Condominium" ||
          PropertyFormatted === "Townhouse" ||
          PropertyFormatted === "Co-operative"
        ) {
          housingExpenseTypes.push({
            text: "Contents Insurance",
            value: "ContentsInsurance"
          });
        }
      }

      return housingExpenseTypes.map(expenseType => {
        const matchingExpense = this.housingExpenses.find(
          expense => expense.HousingExpenseType === expenseType.value
        );
        return {
          ...expenseType,
          id: matchingExpense ? matchingExpense.id : undefined
        };
      });
    },
    nonDefaultHousingExpenses() {
      const defaultTypes = this.defaultHousingExpenseTypes.map(
        type => `${type.value}-${type.text}`
      );
      return this.housingExpenses.filter(
        expense =>
          !defaultTypes.includes(
            `${expense.HousingExpenseType}-${expense.HousingExpenseNote}`
          )
      );
    },
    isNextDisabled() {
      const activeExpenses = this.housingExpenses.filter(expense =>
        this.isExpenseActive(
          expense.HousingExpenseType,
          expense.HousingExpenseNote
        )
      );

      const hasActiveDefaultExpense = this.defaultHousingExpenseTypes.some(
        expenseType => {
          const hasActive = activeExpenses.some(
            expense =>
              expense.HousingExpenseType === expenseType.value &&
              expense.HousingExpenseNote === expenseType.text
          );
          return hasActive;
        }
      );

      if (!hasActiveDefaultExpense) {
        return true;
      }

      const allActiveExpensesValid = activeExpenses.every(expense => {
        const hasValidAmount =
          expense.HousingExpensePaymentAmount !== undefined &&
          expense.HousingExpensePaymentAmount !== null &&
          expense.HousingExpensePaymentAmount !== "" &&
          parseFloat(expense.HousingExpensePaymentAmount) > 0;

        const hasValidTerm =
          expense.HousingExpenseTerm === "Monthly" ||
          expense.HousingExpenseTerm === "Yearly";

        return hasValidAmount && hasValidTerm;
      });

      return !allActiveExpensesValid;
    }
  },
  created() {
    this.initializeActiveRows();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/variables.scss";

.expensesContianer {
  width: 100%;
  max-width: 800px;
}
.expenseItemRow {
  background-color: $gray1;
  position: relative;
  border: 2px solid transparent;
  width: 100%;
  cursor: pointer;
  border-radius: 7px;
  transition: opacity 0.2s ease-in-out, border-color 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
  &.active {
    border-color: $icon-color;
    background-color: #fff;
    .checkCircle {
      opacity: 1;
      pointer-events: all;
    }
  }
  .checkCircle {
    position: absolute;
    right: -10px;
    top: -10px;
    border-radius: 50%;
    color: $icon-color !important;
    z-index: 2;
    background-color: white;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-in-out;
  }
}
.expenseAddNewItem {
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  flex-flow: unset;
  user-select: none;
  flex-direction: row !important;
  &:hover,
  &:focus {
    background: rgba($color: #ddd, $alpha: 0.2);
  }

  &:active {
    background: rgba($color: #ddd, $alpha: 0.5);
  }
}
.expenseQuestionButton {
  border: 2px solid #bdbdbd;
  border-radius: 50%;
  color: #bdbdbd;
}

.titleText {
  max-width: 1000px !important;
}

.plusIcon {
  background-color: $add-new-text-color;
  color: white;
  border-radius: 50%;
  font-size: 20px;
  padding: 6px;
  margin-top: 5px;
  margin-bottom: auto;
  height: fit-content;
}

.plusText {
  color: $add-new-text-color;
}

.titleText {
  font-weight: 500;
  font-size: 26px;
  line-height: 39px;
  margin: 20px 0px;
  max-width: 800px;
  text-align: center;
  @media (max-width: $mobile-width) {
    font-size: 16px;
    line-height: 28px;
  }
}

.expenseItemHeaderRow {
  border-bottom: 1px solid $gray4;
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 12px;
  margin-right: 12px;
  max-width: calc(100% - 24px);
  &.rightBordered {
    border-right: 1px solid $gray4;
    border-bottom: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
    margin-top: 12px;
    margin-bottom: 12px;

    padding-left: 12px;
    padding-right: 12px;
    margin-left: 0px;
    margin-right: 0px;
  }
}

.v-input {
  :deep(.primary--text) {
    color: $icon-color !important;
    caret-color: $icon-color !important;
  }
}
</style>
