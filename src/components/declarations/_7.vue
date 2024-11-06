<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Are you borrowing any money for this real estate transaction?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <div class="form-container">
        <h3 class="main__subtitle">
          Are you borrowing any money for this real estate transaction (e.g.,
          money for your closing costs or down payment) or obtaining any money
          from another party, such as the Seller or Real Estate Agent, that you
          have not disclosed on this loan application?
        </h3>
        <Input
          inputTitle="Amount Borrowed"
          :value="
            getFormattedValue(declarations.UndisclosedBorrowedFundsAmount)
          "
          @input="e => setDeclarationsProp(+e.replace(/,/g, ''))"
          @keypress="e => isOnlyNum(e, true)"
          prefix="$"
        />
      </div>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="checkAmountAndRedirect"
        :ConditionsMet="isNextDisabled"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapActions } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [onlyNum, currencyFormat, loanPatch],
  props: {
    declarations: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setDeclarationsProp(val) {
      let Declarations = {
        ...this.declarations,
        UndisclosedBorrowedFundsAmount: val
      };
      Declarations.UndisclosedBorrowedFundsIndicator = !!Declarations.UndisclosedBorrowedFundsAmount;
      if (!Declarations.UndisclosedBorrowedFundsIndicator) {
        delete Declarations.UndisclosedBorrowedFundsAmount;
      }
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    },
    checkAmountAndRedirect() {
      if (
        !this.declarations ||
        !this.declarations.UndisclosedBorrowedFundsAmount
      ) {
        let Declarations = {
          ...this.declarations,
          UndisclosedBorrowedFundsIndicator: false
        };
        delete Declarations.UndisclosedBorrowedFundsAmount;
        this.updateBorrower({ prop: "Declarations", value: Declarations });
      }
      this.saveAndAdvance(true);
    }
  },
  computed: {
    isNextDisabled() {
      return (
        !this.declarations || !this.declarations.UndisclosedBorrowedFundsAmount
      );
    }
  }
};
</script>
