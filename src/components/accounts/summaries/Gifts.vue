<template>
  <NewSummaryControl
    header="Gifts You Have Been Given or Will Receive for this Loan"
    :icon="giftsIcon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="gifts == null || gifts.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Gifts.</div>
        </v-col>
      </v-row>
      <v-row
        class="summary-content-container"
        v-else
        v-for="(gift, index) in gifts"
        :key="index"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">
            {{ index + 1 }}. A {{ getGiftTypeText(gift.AssetType) }} from
            {{ getFormattedValue(gift.SellerCreditAmount) }} to
            {{ gift.DonorName }} and {{ gift.DonorEmail }}.
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <LoanGiftsData></LoanGiftsData>
    </template>
  </NewSummaryControl>
</template>

<script>
import LoanGiftsData from "../gifts/NewLoanGiftsData";
import { giftSources, giftTypes } from "@/models/constants.js";
import { mapGetters, mapActions } from "vuex";
import NewSummaryControl from "@/components/controls/NewSummaryControl";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  components: {
    LoanGiftsData,
    NewSummaryControl
  },
  mixins: [currencyFormat],
  data() {
    return {
      giftsIcon: require("@/assets/images/accounts/summary/gifts.svg"),
      dataBeforeEdit: []
    };
  },
  methods: {
    ...mapActions(["saveLoanPatches", "setAssets"]),
    onCancelClicked() {
      const grants = this.GiftsOrGrants.filter(
        item => item.AsseType === "Grant"
      );
      this.setAssets({
        assets: [...this.dataBeforeEdit, ...grants],
        AssetTypeId: 2
      });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.gifts));
    },

    getGiftTypeText(val) {
      let giftType = giftTypes.find(x => x.value == val);
      if (giftType == null) {
        return null;
      }
      return giftType.text;
    },
    getGiftSourceText(val) {
      let giftSource = this.cashGiftsSources.find(x => x.value == val);
      if (giftSource == null) {
        giftSource = this.propEquitySources.find(x => x.value == val);
      }
      if (giftSource == null) {
        return null;
      }
      return giftSource.text;
    }
  },
  computed: {
    ...mapGetters({
      GiftsOrGrants: "getGiftsOrGrants"
    }),
    gifts() {
      return this.GiftsOrGrants.filter(
        item =>
          item.AssetType === "GiftOfCash" ||
          item.AssetType === "GiftOfPropertyEquity"
      );
    },
    cashGiftsSources() {
      return [...giftSources, { text: "Other", value: "Other" }];
    },
    propEquitySources() {
      const result = [
        ...giftSources,
        { text: "Federal Agency", value: "FederalAgency" },
        { text: "Local Agency", value: "LocalAgency" },
        { text: "State Agency", value: "StateAgency" }
      ];
      return [
        ...result.sort((a, b) => a.text > b.text),
        { text: "Other", value: "Other" }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
</style>
