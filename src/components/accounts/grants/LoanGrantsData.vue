<template lang="pug">
    v-card-text.text-block.text-black--text
        .bordered-rows-wrapper
            v-row.text-block__row.mb-5.relative-row(v-for="(item, index) in grants" :key="index")
                v-card.multpleItemsContainer(width="100%" elevation=3)
                    v-col.text-block__col(sm="4" cols="12")
                        v-select(
                            outlined
                            dense
                            :value="item.FundsSourceType"
                            :items="sources"
                            item-text="text"
                            item-value="value"
                            label="Source"
                            :menu-props="{ bottom: true, offsetY: true }"
                            @change="(value) => setAssetProp('FundsSourceType', value, index)"
                            attach=true
                            )
                    v-col.text-block__col(sm="4" cols="12")
                        v-text-field(
                            outlined
                            dense
                            label="Organization" 
                            :value="item.DonorName"
                            @input="(e) => setAssetProp('DonorName', e, index)"
                            )
                    v-col.text-block__col(sm="4" cols="12")
                        v-text-field(
                            outlined
                            dense
                            prefix="$"
                            label="Amount of DPA or Grant" 
                            :value="getFormattedValue(item.AssetCashOrMarketValueAmount)"
                            @input="(e) => setAssetProp('AssetCashOrMarketValueAmount', +e.replace(/,/g, ''), index)"
                            @keypress="(e) => isOnlyNum(e, true)"
                            )
                    v-col.text-block__col(cols="12" v-if="item.FundsSourceType === 'Other'")
                        v-textarea(
                            outlined
                            dense
                            auto-grow
                            rows="2"
                            label="Other Description"
                            :value="item.Explanation"
                            @input="(e) => setAssetProp('Explanation', e, index)"
                        )
                    .removeItem(@click="remove(index)")
                          v-icon close
            v-card.multpleItemsContainer(v-if="additional")
                v-row.mt-3.pt-2.text-block__row
                    v-col.text-block__col(sm="4" cols="10")
                        v-select(
                            outlined
                            dense
                            :value="additional.FundsSourceType"
                            :items="sources"
                            item-text="text"
                            item-value="value"
                            label="Source"
                            :menu-props="{ bottom: true, offsetY: true }"
                            @input="(value) => setAdditionalSource(value)"
                            attach=true
                            )
                .removeItem(@click="additional=null")
                  v-icon close
        v-row.text-block__row.last-row.mt-7
            v-col.text-block__col(sm="6" cols="12")
                v-row.add-new
                    Add(
                        customClass='small' 
                        @add="addAsset"
                        )
                    span.add-new__title Add new Grant or Down Payment Assistance
</template>

<script>
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      additional: null,
      sources: [
        { text: "Community Non Profit", value: "CommunityNonProfit" },
        { text: "Federal Agency", value: "FederalAgency" },
        { text: "Local Agency", value: "LocalAgency" },
        { text: "Religious Non Profit", value: "ReligiousNonProfit" },
        { text: "State Agency", value: "StateAgency" },
        { text: "Other", value: "Other" }
      ]
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
  components: {
    Add,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.bordered-rows-wrapper {
  padding-left: 10px;
}

.relative-row {
  position: relative;
}

.remove {
  position: absolute;
  right: 10px;
  top: -25px;
  padding-top: 30px;
  &__icon {
    cursor: pointer;
  }
}

.last-row {
  border: none;
}

.add-new {
  align-items: center;
  &__title {
    font-weight: 500;
    margin-left: 10px;
  }
}

.totals {
  font-weight: 500;
  font-size: 18px;
  &__title {
    margin-right: 10px;
  }
}

.text-block {
  &__radio {
    &:first-child {
      margin-right: 20px;
    }
  }
  &__label {
    font-size: 12px;
    margin-bottom: 5px;
  }
}

@media (max-width: 768px) {
  .text-block {
    &__col {
      padding-left: 8px;
      .last-row & {
        padding-left: 0;
      }
    }
  }
  .bordered-rows-wrapper {
    padding-left: 0;
  }
}

@media (max-width: 760px) {
  .text-block {
    margin-top: 0;
    margin-bottom: 0;
    &__radios {
      margin-bottom: 20px;
    }
    &__col {
      padding: 10px;
      .last-row & {
        padding: 0;
      }
    }
  }
  .add-new {
    margin: 20px 0 10px;
  }
  .remove {
    top: -30px;
    right: 5px;
  }
}
</style>
