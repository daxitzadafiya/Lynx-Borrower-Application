<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select any of these other liabilities that you may have, otherwise just click next.</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="otherExpenseTypes" multiple="multiple" @change="addLiabilityType">
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in otherLiabilityTypes" :smVal="3" :key="index" :value="item.title.replace(/ /g, '')">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
            
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  components: {
    ToggleCard
  },
  data() {
    return {
      otherLiabilityTypes: [
        {
          title: "Alimony",
          src: require("@/assets/images/credit/gavel.svg")
        },
        {
          title: "Child Support",
          src: require("@/assets/images/credit/child.svg")
        },
        {
          title: "Other",
          src: require("@/assets/images/credit/money_stack.svg")
        },
        {
          title: "Separation Maintenance",
          src: require("@/assets/images/credit/separation_maintenance.svg")
        }
      ],
      activeLiabilityType: null
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    addLiabilityType(titles) {
      let newOtherLiabilitiesAndExpenses = [...this.otherLiabilities];
      if (
        titles.length>this.otherExpenseTypes.length
      ) {
        let title = titles.filter(x => !this.otherExpenseTypes.includes(x))
        newOtherLiabilitiesAndExpenses.push({ ExpenseType: title[0] });
      } else {
        while (
          newOtherLiabilitiesAndExpenses.findIndex(
            x => !titles.includes(x.ExpenseType)
          ) !== -1
        ) {
          newOtherLiabilitiesAndExpenses.splice(
            newOtherLiabilitiesAndExpenses.findIndex(
              x => !titles.includes(x.ExpenseType)
            ),
            1
          );
        }
      }
      this.updateBorrower({
        prop: "OtherLiabilitiesAndExpenses",
        value: newOtherLiabilitiesAndExpenses
      });
    },
    checkIfLiabilityIsSaved(title) {
      if (this.borrower && this.borrower.OtherLiabilitiesAndExpenses) {
        return (
          this.borrower.OtherLiabilitiesAndExpenses.findIndex(
            x => x.ExpenseType === title.replace(/ /g, "")
          ) !== -1
        );
      }
      return false;
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    otherLiabilities() {
      return this.borrower && this.borrower.OtherLiabilitiesAndExpenses
        ? this.borrower.OtherLiabilitiesAndExpenses
        : [];
    },
    otherExpenseTypes(){
      return this.otherLiabilities.map(x=>x.ExpenseType.replace(/ /g, ""))
    }
    //,
    // nextRoute() {
    //   if (
    //     this.otherLiabilities.findIndex(
    //       x =>
    //         x.ExpenseType === "Alimony" ||
    //         x.ExpenseType === "ChildSupport" ||
    //         x.ExpenseType === "JobRelatedExpenses"
    //     ) !== -1
    //   ) {
    //     return "/credit/other-liabilities-details"
    //   } else {
    //     return "/credit/review"
    //   }
    // },
  }
};
</script>
