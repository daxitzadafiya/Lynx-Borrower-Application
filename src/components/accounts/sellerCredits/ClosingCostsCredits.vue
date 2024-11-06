<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Are you receiving any credit towards closing costs from the Seller,
        Builder or Real Estate Agent?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/accounts/closing-costs.svg')"
      />
      <v-form class="text-block my-5">
        <AgreeToggle
          :value="receivingAnyCredit"
          @input="setReceivingAnyCredit"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="receivingAnyCredit === null"
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
      receivingAnyCredit: null
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan"]),
    setReceivingAnyCredit(value) {
      this.receivingAnyCredit = value;
      this.setCurrentLoan({
        ...this.currentLoan,
        ReceivingSellerCredits: value
      });
    }
  },
  computed: {
    ...mapGetters({
      credits: "getSellerCredits",
      currentLoan: "getCurrentLoan"
    })
  }
};
</script>
