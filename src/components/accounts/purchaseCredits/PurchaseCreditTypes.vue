<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select the types of Purchase Credits you are receiving for this Loan </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="activeTypes" multiple="multiple" @change="setType">
        <v-row class="form-container">
          <ToggleCard v-for="({src, title, value}, index) in types" :key="index" :value="value" :lgVal="3">
            <inline-svg :src="src"></inline-svg>
            <p>{{ title }}</p>
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
      types: [
        {
          src: require("@/assets/images/accounts/lease-pf.svg"),
          title: "Lease Purchase Fund",
          value: "LeasePurchaseFund"
        },
        {
          src: require("@/assets/images/accounts/saving-equity.svg"),
          title: "Sweat Equity",
          value: "SweatEquity"
        },
        {
          src: require("@/assets/images/accounts/relocation.svg"),
          title: "Relocation Funds",
          value: "RelocationFunds"
        },
        {
          src: require("@/assets/images/accounts/other.svg"),
          title: "Other",
          value: "Other"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setPurchaseCredits"]),
    setType(types) {
      let updated = [...this.credits];
      let position = types.findIndex(x=>updated.findIndex(y=>y.PurchaseCreditType===x)===-1);
      if (position !== -1) {
        updated.push({ PurchaseCreditType: types[position] });
      } else {
        position = updated.findIndex(x=>!types.includes(x.PurchaseCreditType));
        updated.splice(position, 1);
      }
      this.updatePurchaseCredits(updated);
    },
    updatePurchaseCredits(credits) {
      const earnestCredits = this.PurchaseCredits.filter(
        item => item.PurchaseCreditType === "EarnestMoney"
      );
      this.setPurchaseCredits([...earnestCredits, ...credits]);
    }
  },
  computed: {
    ...mapGetters({
      PurchaseCredits: "getPurchaseCredits"
    }),
    credits() {
      return this.PurchaseCredits.filter(
        item => item.PurchaseCreditType !== "EarnestMoney"
      );
    },
    activeTypes() {
      return this.credits.length
        ? this.credits.map(item => item.PurchaseCreditType)
        : [];
    }
  },
  components: {
    ToggleCard
  }
};
</script>
