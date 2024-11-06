<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">
        Have you received or plan to receive any Gifts for this Loan?
      </div>
      <div class="titleSecondaryText">
        A gift can come either in the form of equity in the property being
        purchased or from an asset account owned by a donor.
      </div>
      <inline-svg
        class="slide__image"
        :src="require('@/assets/images/accounts/loangiftsorgrants.svg')"
      />
      <v-form class="text-block my-6">
        <AgreeToggle
          :value="receiveGifts"
          @input="setReceiveGifts"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="receiveGifts === null"
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
      receiveGifts: null
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan"]),
    setReceiveGifts(value) {
      this.setCurrentLoan({ ...this.currentLoan, ReceivingGifts: value });
      this.receiveGifts = value;
    }
  },
  computed: {
    ...mapGetters({
      GiftsOrGrants: "getGiftsOrGrants",
      currentLoan: "getCurrentLoan"
    }),
    gifts() {
      return this.GiftsOrGrants.filter(
        item =>
          item.AssetType === "GiftOfCash" ||
          item.AssetType === "GiftOfPropertyEquity"
      );
    }
  }
};
</script>
