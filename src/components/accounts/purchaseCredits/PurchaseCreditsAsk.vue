<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will you be receiving any Purchase Credits for this Loan, such as a
        Lease Purchase Fund or Sweat Equity?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/accounts/closing-costs.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="receivingPurchaseCredits"
          @input="setReceivingPurchaseCredits"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="receivingPurchaseCredits === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  components: {
    AgreeToggle
  },
  data() {
    return {
      receivingPurchaseCredits: null
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan"]),
    setReceivingPurchaseCredits(value) {
      this.receivingPurchaseCredits = value;
      this.setCurrentLoan({ ...this.currentLoan, ReceivingPurchaseCredits: value });
    }
  },
  computed: {
    ...mapGetters({
      PurchaseCredits: "getPurchaseCredits",
      currentLoan: "getCurrentLoan"
    }),
    credits() {
      return this.PurchaseCredits.filter(
        item => item.PurchaseCreditType !== "EarnestMoney"
      );
    }
  }
};
</script>
