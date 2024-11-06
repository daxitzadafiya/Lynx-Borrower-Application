<template>
  <NewSummaryControl
    header="Purchase Credits"
    :icon="icon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="credits == null || credits.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Purchase Credits.</div>
        </v-col>
      </v-row>
      <v-row
        class="summary-content-container"
        v-else
        v-for="(credit, index) in credits"
        :key="index"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">
            {{ index + 1 }}. A {{ getPurchaseCreditTypeText(credit) }} of cash
            or market value ${{
              getFormattedValue(credit.PurchaseCreditAmount)
            }}.
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <PurchaseCreditsDetailsData></PurchaseCreditsDetailsData>
    </template>
  </NewSummaryControl>
</template>

<script>
import PurchaseCreditsDetailsData from "../purchaseCredits/NewPurchaseCreditsDetailsData";
import NewSummaryControl from "@/components/controls/NewSummaryControl";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    NewSummaryControl,
    PurchaseCreditsDetailsData
  },
  mixins: [currencyFormat],
  data() {
    return {
      icon: require("@/assets/images/accounts/summary/seller-credits.svg"),
      dataBeforeEdit: []
    };
  },
  methods: {
    ...mapActions(["setPurchaseCredits", "saveLoanPatches"]),
    onCancelClicked() {
      const earnestCredits = this.PurchaseCredits.filter(
        item => item.PurchaseCreditType === "EarnestMoney"
      );
      this.setPurchaseCredits([...earnestCredits, ...this.dataBeforeEdit]);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.credits));
    },
    getPurchaseCreditTypeText(credit) {
      let value = credit.PurchaseCreditType
        ? credit.PurchaseCreditType.replace(/([a-z])([A-Z])/g, "$1 $2")
        : "";
      if (credit.PurchaseCreditTypeOtherDescription) {
        value += ` - ${credit.PurchaseCreditTypeOtherDescription.replace(
          /([a-z])([A-Z])/g,
          "$1 $2"
        )}`;
      }
      return value;
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";
</style>
