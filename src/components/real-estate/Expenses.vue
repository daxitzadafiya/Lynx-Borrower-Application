<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please select all the monthly expenses associated with
        {{ currentRealEstate.AddressLineText || "this property" }}
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :value="realEstateProps"
        multiple="multiple"
        @change="setRealEstateExpense"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in expenses"
            :key="index"
            :value="item.prop"
          >
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
import ToggleCard from "@/components/controls/ToggleCard";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      expenses: [
        {
          src: require("@/assets/images/real-estate/insurance.svg"),
          title: "Insurance",
          prop: "PropertyInsuranceExpenseAmount"
        },
        {
          src: require("@/assets/images/real-estate/taxes.svg"),
          title: "Taxes",
          prop: "PropertyTaxesExpenseAmount"
        },
        {
          src: require("@/assets/images/real-estate/association-dues.svg"),
          title: "Association Dues",
          prop: "PropertyAssociationDuesExpenseAmount"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setRealEstate", "setRealEstateOwnedExpenses"]),
    setRealEstateExpense(props) {
      let realEstateProps = Object.keys(this.currentRealEstate);
      let realEstate = { ...this.currentRealEstate };

      const newExpense = props.find(prop => !realEstateProps.includes(prop));
      if (newExpense) {
        realEstate[newExpense] = "0";
      } else {
        const removedExpense = realEstateProps.find(
          prop => !props.includes(prop)
        );
        if (removedExpense) {
          delete realEstate[removedExpense];
        }
      }

      let realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = realEstate;
      this.setRealEstate(realEstates);

      this.setRealEstateOwnedExpenses(this.isAnyExpense);
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
    isAnyExpense() {
      return (
        "PropertyInsuranceExpenseAmount" in this.currentRealEstate ||
        "PropertyTaxesExpenseAmount" in this.currentRealEstate ||
        "PropertyMaintenanceExpenseAmount" in this.currentRealEstate
      );
    },
    realEstateProps() {
      return Object.keys(this.currentRealEstate);
    }
  },
  components: {
    ToggleCard
  }
};
</script>
