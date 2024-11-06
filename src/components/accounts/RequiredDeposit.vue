<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        In a Real Estate purchase transaction, it is customary to place an
        escrow/earnest money deposit to demonstrate your intent to close on the
        property. Please select the option most appropriate to your transaction.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/accounts/deposit-property.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :options="options"
          :value="appropTransaction"
          @input="setAppropTransaction"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="appropTransaction === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";
export default {
  components: {
    AgreeToggle
  },
  data() {
    return {
      appropTransaction: null,
      options: [
        { value: "noDepositRequired", label: "No Deposit Required" },
        { value: "depositToBeMade", label: "Deposit to-be Made" },
        { value: "depositMade", label: "Deposit Made" }
      ]
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan"]),
    setAppropTransaction(value) {
      this.appropTransaction = value;
      this.setCurrentLoan({ ...this.currentLoan, DepositRequirement: value });
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    })
  }
};
</script>
