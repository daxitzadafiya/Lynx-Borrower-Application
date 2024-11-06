<template>
  <NewSummaryControl
    header="Assets - Bank Accounts, Retirement, and Other Accounts You Have"
    :icon="icon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <template
        v-if="
          (Assets == null || Assets.length === 0) &&
            (OtherAssets == null || OtherAssets.length === 0)
        "
      >
        <v-row class="summary-content-container">
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">No Assets.</div>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row
          class="summary-content-container"
          v-for="(Asset, index) in Assets"
          :key="index"
        >
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle">Account Type:</div>
            <div class="summaryValue">
              {{ getDisplayText(Asset.AssetType) }}
            </div>
          </v-col>
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle">Financial Institution:</div>
            <div class="summaryValue">{{ Asset.FullName }}</div>
          </v-col>
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle">Last 4 of Acct#:</div>
            <div class="summaryValue">{{ Asset.AssetAccountIdentifier }}</div>
          </v-col>
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle">Ownership Type:</div>
            <div class="summaryValue">{{ Asset.OwnershipType }}</div>
          </v-col>
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle">Cash or Market Value:</div>
            <div class="summaryValue">
              {{ getFormattedValue(Asset.AssetCashOrMarketValueAmount) }}
            </div>
          </v-col>
        </v-row>
        <v-row
          class="summary-content-container"
          v-if="OtherAssets != null && OtherAssets.length !== 0"
        >
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="font-weight-bold summaryValue">
              Other Assets You Have
            </div>
          </v-col>
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">
              <span v-for="(otherAsset, index) in OtherAssets" :key="index"
                >{{ getOtherAssetsDisplayText(otherAsset.AssetType) }},</span
              >
              <span>value - ${{ getFormattedValue(otherAssetsTotal) }}</span>
            </div>
          </v-col>
        </v-row>
      </template>
    </template>
    <template v-slot:editContent>
      <AccountDetailsData></AccountDetailsData>
      <v-row class="form-container deleteAbleItem otherAssetsRow">
        <v-col class="itemContainer">
          <div class="font-weight-bold">Other Assets You Have</div>
        </v-col>
      </v-row>
      <NewOtherAssetDetailsData></NewOtherAssetDetailsData>
    </template>
  </NewSummaryControl>
</template>


<script>
import AccountDetailsData from "../NewAccountDetailsData";
import NewOtherAssetDetailsData from "../NewOtherAssetDetailsData";
import { regularAssetsTypes, otherAssetsTypes } from "@/models/constants";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  components: {
    AccountDetailsData,
    NewOtherAssetDetailsData,
    NewSummaryControl
  },
  data() {
    return {
      icon: require("@/assets/images/accounts/summary/assets.svg"),
      dataBeforeEdit: [],
      otherAssetsDataBeforeEdit: []
    };
  },
  computed: {
    ...mapGetters({
      Assets: "getRegularAssets",
      OtherAssets: "getOtherAssets"
    }),
    otherAssetsTotal() {
      return this.OtherAssets.length
        ? this.OtherAssets.reduce((acc, cur) => {
            acc += !isNaN(cur.AssetCashOrMarketValueAmount)
              ? +cur.AssetCashOrMarketValueAmount
              : 0;
            return acc;
          }, 0)
        : 0;
    }
  },
  methods: {
    ...mapActions(["saveLoanPatches", "setAssets"]),
    getDisplayText(selection) {
      var found = regularAssetsTypes.find(type => type.value == selection);
      return found ? found.text : selection;
    },
    getOtherAssetsDisplayText(selection) {
      var found = otherAssetsTypes.find(type => type.value == selection);
      return found ? found.text : selection;
    },
    onCancelClicked() {
      this.setAssets({ assets: this.dataBeforeEdit, AssetTypeId: 0 });
      this.setAssets({
        assets: this.otherAssetsDataBeforeEdit,
        AssetTypeId: 1
      });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = [];
      this.otherAssetsDataBeforeEdit = [];
      this.Assets.forEach(asset => {
        if (asset.AssetTypeId === 0) {
          this.dataBeforeEdit.push(JSON.parse(JSON.stringify(asset)));
        }
      });
      this.OtherAssets.forEach(asset => {
        if (asset.AssetTypeId === 1) {
          this.otherAssetsDataBeforeEdit.push(
            JSON.parse(JSON.stringify(asset))
          );
        }
      });
    }
  },
  mixins: [currencyFormat]
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.otherAssetsRow {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  &::before {
    display: none;
  }
}
</style>
