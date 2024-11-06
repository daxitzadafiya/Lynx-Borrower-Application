<template>
  <div class="d-contents">
    <v-data-table
      :class="{
        'content-table': true,
        emptyTable: assets.length === 0,
      }"
      :headers="headers"
      :items="assets"
      disable-sort="disable-sort"
      disable-pagination="disable-pagination"
      hide-default-footer="hide-default-footer"
      :mobile-breakpoint="0"
    >
      <template v-slot:item.AssetType="{ item }"
        ><span class="mw-220">{{
          getDisplayText(item.AssetType)
        }}</span>
        </template>
        <template v-slot:item.AssetCashOrMarketValueAmount="{ item }"
        ><span class="mw-220">{{
          getFormattedValue(item.AssetCashOrMarketValueAmount)
        }}</span>
        </template>
    </v-data-table>
  </div>
</template>
  
<script>
import { mapGetters } from "vuex";
import { regularAssetsTypes } from "@/models/constants";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  data() {
    return {
      headers: [
        {
          text: "Account Type",
          value: "AssetType",
          class: "primary--text",
        },
        {
          text: "Financial Institution",
          value: "FullName",
          class: "primary--text",
        },
        {
          text: "Last 4 of Acct#",
          value: "AssetAccountIdentifier",
          class: "primary--text",
        },
        {
          text: "Ownership Type",
          value: "OwnershipType",
          class: "primary--text",
        },
        {
          text: "Cash or Market Value",
          value: "AssetCashOrMarketValueAmount",
          class: "primary--text",
        },
      ],
    };
  },
  methods: {
    getDisplayText(selection) {
      var found = regularAssetsTypes.find((type) => type.value == selection);
      return found ? found.text : selection;
    },
  },
  mixins: [currencyFormat],
  computed: {
    ...mapGetters({
      Assets: "getRegularAssets",
      OtherAssets: "getOtherAssets",
    }),
    assets() {
      return this.Assets && this.Assets ? this.Assets : [];
    },
  },
  
};
</script>
  
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.infoText {
  color: $gray3;
}
</style>