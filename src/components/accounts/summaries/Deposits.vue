<template>
  <NewSummaryControl
    header="Required Deposits"
    :icon="icon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="earnstMoneyCredits == null || earnstMoneyCredits.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Required Deposits.</div>
        </v-col>
      </v-row>
      <v-row
        class="summary-content-container"
        v-else
        v-for="(credit, index) in earnstMoneyCredits"
        :key="index"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">
            {{ index + 1 }}. An account name {{ credit.SourceAccount }}
            {{ credit.Status == "ToBeMade" ? "to be made" : ""
            }}{{ credit.Status == "Made" ? "made" : "" }} deposit of ${{
              getFormattedValue(credit.PurchaseCreditAmount)
            }}.
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <DepositDetailsData></DepositDetailsData>
    </template>
  </NewSummaryControl>
</template>

<script>
import DepositDetailsData from "../purchaseCredits/DepositDetailsData";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  mixins: [currencyFormat],
  components: {
    DepositDetailsData,
    NewSummaryControl
  },
  data() {
    return {
      icon: require("@/assets/images/accounts/summary/required-deposits.svg")
    };
  },
  methods: {
    ...mapActions(["setPurchaseCredits", "saveLoanPatches"]),
    onCancelClicked() {
      const filtered = this.PurchaseCredits.filter(
        ({ PurchaseCreditType }) => PurchaseCreditType !== "EarnestMoney"
      );
      this.setPurchaseCredits([...filtered, ...this.dataBeforeEdit]);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.earnstMoneyCredits));
    }
  },
  computed: {
    ...mapGetters({
      PurchaseCredits: "getPurchaseCredits"
    }),
    total() {
      return this.earnstMoneyCredits.length
        ? this.earnstMoneyCredits.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.PurchaseCreditAmount)
                ? +cur.PurchaseCreditAmount
                : 0),
            0
          )
        : 0;
    },
    earnstMoneyCredits() {
      return this.PurchaseCredits.length
        ? this.PurchaseCredits.filter(
            ({ PurchaseCreditType }) => PurchaseCreditType === "EarnestMoney"
          )
        : [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";
</style>
