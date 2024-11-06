<template>
  <NewSummaryControl
    header="Grants or Down Payment Assistance for this Loan"
    :icon="grantsIcon"
    @edit="onGrantsEditClicked"
    @cancel="onGrantsCancelClicked"
    @save="onGrantsSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="grants == null || grants.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Grants.</div>
        </v-col>
      </v-row>
      <v-row
        class="summary-content-container"
        v-else
        v-for="(grant, index) in grants"
        :key="index"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">
            {{ index + 1 }}. An amount of DPA or Grant ${{
              getFormattedValue(grant.AssetCashOrMarketValueAmount)
            }}
            from {{ grant.DonorName }} to
            {{ getFundSourceText(grant.FundsSourceType) }}.
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <LoanGrantsData></LoanGrantsData>
    </template>
  </NewSummaryControl>
</template>

<script>
import LoanGrantsData from "../grants/NewLoanGrantsData";
import { grantSources } from "@/models/constants.js";
import { mapGetters, mapActions } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  components: {
    LoanGrantsData,
    NewSummaryControl
  },
  mixins: [currencyFormat],
  data() {
    return {
      grantsIcon: require("@/assets/images/accounts/summary/grants-or-downpayment.svg"),
      dataBeforeEdit: []
    };
  },
  methods: {
    ...mapActions(["saveLoanPatches", "setAssets"]),

    onGrantsCancelClicked() {
      const gifts = this.GiftsOrGrants.filter(
        item => item.AssetType !== "Grant"
      );
      this.setAssets({
        assets: [...this.dataBeforeEdit, ...gifts],
        AssetTypeId: 2
      });
    },
    onGrantsSaveClicked() {
      this.saveLoanPatches();
    },
    onGrantsEditClicked() {
      this.generateGrantsOnCancelData();
    },
    generateGrantsOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.grants));
    },
    getFundSourceText(val) {
      let fundSource = grantSources.find(x => x.value === val);
      if (fundSource == null) {
        return null;
      }
      return fundSource.text;
    }
  },
  computed: {
    ...mapGetters({
      GiftsOrGrants: "getGiftsOrGrants"
    }),
    grants() {
      return this.GiftsOrGrants.filter(item => item.AssetType === "Grant");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
</style>
