<template>
  <v-card class="popup" mx-auto="mx-auto" light="light">
    <v-card-title
      class="popup__title dialog-header-back dialog-header-text py-4"
      ><span class="popup__title-text">Expected Monthly Rental Income</span>
      <v-btn class="popup__close-wrapper" icon="icon" @click="closePopup()">
        <v-icon class="popup__close" color="white">mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="popup__main text-black--text px-0 py-0 overflow-hidden">
      <v-row class="form-container" cols="12">
        <Input
          prefix="$"
          :smVal="12"
          inputTitle="Expected Monthly Rental Income"
          :value="getFormattedValue(RentalEstimatedGrossMonthlyRentAmount)"
          @input="e => setPropertyValue(+e.replace(/,/g, ''))"
          @keypress="e => isOnlyNum(e, true)"
        />
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <div class="popup__button">
      <div class="popup_desktop-button">
        <Button
          value="Submit"
          customClass="primary-button"
          @clicked="toggleAndRedirect"
        ></Button>
      </div>
      <div class="popup_mobile-button">
        <Button
          value="Submit"
          customClass="primary-button"
          width="200px"
          @clicked="toggleAndRedirect"
        >
        </Button>
      </div>
    </div>
  </v-card>
</template>

<script>
import scrollToTop from "@/mixins/scrollToTop.js";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import loanPatch from "@/mixins/loanPatch.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [scrollToTop, onlyNum, currencyFormat, loanPatch],
  methods: {
    ...mapActions(["toggleIsOnlay", "setProperty"]),
    async toggleAndRedirect() {
      this.toggleIsOnlay({ isOnlay: false });
      this.saveAndAdvance(true);
    },
    setPropertyValue(e) {
      const property = this.Property || {};
      const RentalIncome = property.RentalIncome
        ? { ...property.RentalIncome, RentalEstimatedGrossMonthlyRentAmount: e }
        : { RentalEstimatedGrossMonthlyRentAmount: e };
      this.setProperty({ ...property, RentalIncome });
    },
    closePopup() {
      this.toggleIsOnlay({ isOnlay: false });
      this.setPropertyValue(null);
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty"
    }),
    RentalEstimatedGrossMonthlyRentAmount() {
      return this.Property && this.Property.RentalIncome
        ? this.Property.RentalIncome.RentalEstimatedGrossMonthlyRentAmount
        : "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/popup.scss";
.popup {
  border-radius: 7px !important;
}
</style>
