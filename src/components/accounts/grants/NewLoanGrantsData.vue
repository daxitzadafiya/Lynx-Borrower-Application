<template>
  <v-form class="fast-fail form-outer-container">
    <v-row class="form-container deleteAbleItem" v-for="(item, index) in grants" :key="index">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-select" :value="item.FundsSourceType" :items="sources" item-text="text" item-value="value" inputTitle="Source" :menu-props="{ bottom: true, offsetY: true }" @change="(value) => setAssetProp('FundsSourceType', value, index)" attach="attach"></Input>
      <Input inputTitle="Organization" :value="item.DonorName" @input="(e) => setAssetProp('DonorName', e, index)"></Input>
      <Input prefix="$" inputTitle="Amount of DPA or Grant" :value="getFormattedValue(item.AssetCashOrMarketValueAmount)" @input="(e) => setAssetProp('AssetCashOrMarketValueAmount', +e.replace(/,/g, ''), index)" @keypress="(e) => isOnlyNum(e, true)"></Input>
      <Input defaultComponent="v-textarea" outlined="outlined" v-if="item.FundsSourceType === 'Other'" dense="dense" auto-grow="auto-grow" rows="2" inputTitle="Other Description" :value="item.Explanation" @input="(e) => setAssetProp('Explanation', e, index)"></Input>
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional=null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-select" :value="additional.FundsSourceType" :items="sources" item-text="text" item-value="value" inputTitle="Source" :menu-props="{ bottom: true, offsetY: true }" @input="(value) => setAdditionalSource(value)" attach="attach"></Input>
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn class="addItemBtn" dense="dense" plain="plain" elevation="0" @click="addAsset">
          <v-icon small="small">mdi-plus</v-icon><span class="addBtnText">Add new Grant or Down Payment Assistance</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import { grantSources } from "@/models/constants.js"
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      additional: null,
      sources: grantSources
    };
  },
  methods: {
    ...mapActions(["setAssets"]),
    remove(index) {
      const updated = this.grants.filter((item, i) => i !== index);
      this.updateAssets(updated);
    },
    addAsset() {
      this.additional = {};
    },
    setAssetProp(prop, value, index) {
      const updated = this.grants.map((item, i) => {
        if (index === i) {
          item[prop] = value;
        }
        return item;
      });
      this.updateAssets(updated);
    },
    setDeposited(value, index) {
      this.setAssetProp("IncludedInAssetAccountIndicator", value, index);
    },
    setAssetSource(source, index) {
      if (!source) return;
      this.setAssetProp("FundsSourceType", source, index);
    },
    setAssetAmount(value, index) {
      this.setAssetProp("AssetCashOrMarketValueAmount", value, index);
    },
    setAdditionalSource(FundsSourceType) {
      if (!FundsSourceType) return;
      const assets = [
        ...this.GiftsOrGrants,
        { AssetType: "Grant", AssetTypeId: 2, FundsSourceType }
      ];
      this.setAssets({ assets, AssetTypeId: 2 });
      this.additional = null;
    },
    updateAssets(updated) {
      const gifts = this.GiftsOrGrants.filter(
        item => item.AssetType !== "Grant"
      );
      this.setAssets({ assets: [...updated, ...gifts], AssetTypeId: 2 });
    },
  },
  mounted() {
    this.addAsset();
  },
  computed: {
    ...mapGetters({
      GiftsOrGrants: "getGiftsOrGrants"
    }),
    grants() {
      return this.GiftsOrGrants.filter(item => item.AssetType === "Grant");
    }
  },
};
</script>