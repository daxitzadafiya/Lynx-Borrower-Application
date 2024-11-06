<template>
  <NewSummaryControl
    header="Seller Credits"
    :icon="icon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="sellerCredits == null || sellerCredits.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Seller Credits.</div>
        </v-col>
      </v-row>
      <v-row
        class="summary-content-container"
        v-else
        v-for="(credit, index) in sellerCredits"
        :key="index"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">
            {{ index + 1 }}. A
            {{ getSellerCreditTypeText(credit.SellerCreditType) }} with ${{
              getFormattedValue(credit.SellerCreditAmount)
            }}
            as credit amount.
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <SummaryData></SummaryData>
    </template>
  </NewSummaryControl>
</template>

<script>
import SummaryData from "../sellerCredits/SummaryData";
import NewSummaryControl from "@/components/controls/NewSummaryControl";
import { sellerCreditTypes } from "@/models/constants";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    SummaryData,
    NewSummaryControl
  },
  mixins: [currencyFormat],
  data() {
    return {
      icon: require("@/assets/images/accounts/summary/seller-credits.svg"),
      dataBeforeEdit: []
    };
  },
  methods: {
    ...mapActions(["setSellerCredits", "saveLoanPatches"]),
    getSellerCreditTypeText(val) {
      let sellerCreditTypeIndex = sellerCreditTypes.findIndex(
        x => x.value === val
      );
      if (sellerCreditTypeIndex === -1) return null;
      return sellerCreditTypes[sellerCreditTypeIndex].text;
    },
    onCancelClicked() {
      this.setSellerCredits(this.dataBeforeEdit);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.sellerCredits));
    }
  },
  computed: {
    ...mapGetters({
      sellerCredits: "getSellerCredits"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";
</style>
