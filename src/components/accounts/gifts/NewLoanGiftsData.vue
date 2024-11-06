<template lang="pug">
  v-form.fast-fail.form-outer-container
    v-row.form-container.deleteAbleItem(
      v-for="(item, index) in gifts" :key="index"
      )
      v-col.itemContainer.itemDeleteCrossContainer(cols="12" sm="12")
        v-btn(dense icon @click="remove(index)")
          v-icon(small) mdi-close
      Input(
                      defaultComponent="v-select"
                            :value="item.AssetType"
                            :items="types"
                            item-text="text"
                            item-value="value"
                            inputTitle="Gift Type"
                            :menu-props="{ bottom: true, offsetY: true }"
                            @change="(value) => setAssetProp('AssetType', value, index)"
                            attach=true
                            )
      Input(
                            defaultComponent="v-select"
                            :value="item.FundsSourceType"
                            :items="item.AssetType === 'GiftOfCash' ? cashGiftsSources : propEquitySources"
                            item-text="text"
                            item-value="value"
                            inputTitle="Source"
                            :menu-props="{ bottom: true, offsetY: true }"
                            @change="(value) => setAssetProp('FundsSourceType', value, index)"
                            attach=true
                            )
      Input(
        inputTitle="Donor Name/Organization" 
                            :value="item.DonorName"
                            @input="(e) => setAssetProp('DonorName', e, index)"
                            )
      Input(
        inputTitle="Donor Email" 
                            :value="item.DonorEmail"
                            @input="(e) => setAssetProp('DonorEmail', e, index)"
                            )
      Input(
                            prefix="$"
                            inputTitle="Amount of Gift" 
                            :value="getFormattedValue(item.AssetCashOrMarketValueAmount)"
                            @input="(e) => setAssetProp('AssetCashOrMarketValueAmount', +e.replace(/,/g, ''), index)"
                            @keypress="(e) => isOnlyNum(e, true)"
                            )
      v-col(cols="12" sm="6" v-if="item.AssetType === 'GiftOfCash'").itemContainer
        .titleText.mb-3 Deposited
        v-radio-group.radioGroup(row hide-details :value="item.IncludedInAssetAccountIndicator" @change="(val)=>{setAssetProp('IncludedInAssetAccountIndicator', val, index)}").justify-center.mt-0.pt-0
          v-radio(label="NO" :value="false")
          v-radio(label="YES" :value="true")

    v-row.form-container.deleteAbleItem(v-if="additional")
          v-col.itemContainer.itemDeleteCrossContainer(cols="12" sm="12")
            v-btn(dense icon @click="additional=null")
              v-icon(small) mdi-close
          Input(
                      defaultComponent="v-select"
                      :value="additional.AssetType"
                      :items="types"
                      item-text="text"
                      item-value="value"
                      inputTitle="Gift Type"
                      :menu-props="{ bottom: true, offsetY: true }"
                      @input="(value) => setAdditionalType(value)"
                      attach=true
                      )
    v-row.form-container.addItemBtnContainer
      v-col.itemContainer(cols="12" sm="8")
        v-btn(dense plain elevation="0" @click="addAsset").addItemBtn
          v-icon(small) mdi-plus
          span.addBtnText Add new Gift

</template>

<script>
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import Radio from "@/components/form/Radio";
import onlyNum from "@/mixins/onlyNum.js";
import { giftSources, giftTypes } from "@/models/constants.js"
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      additional: null,
      types: giftTypes,
      sources: giftSources
    };
  },
  methods: {
    ...mapActions(["setAssets"]),
    remove(index) {
      const updated = this.gifts.filter((item, i) => i !== index);
      this.updateAssets(updated);
    },
    addAsset() {
      this.additional = { AssetType: "" };
    },
    setAssetProp(prop, value, index) {
      const updated = this.gifts.map((item, i) => {
        if (index === i) {
          item[prop] = value;
        }
        return item;
      });
      this.updateAssets(updated);
    },
    setAssetType(type, index) {
      this.setAssetProp("AssetType", type, index);
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
    setAdditionalType(type) {
      if (!type) return;
      const assets = [
        ...this.GiftsOrGrants,
        { AssetType: type, AssetTypeId: 2 }
      ];
      this.setAssets({ assets, AssetTypeId: 2 });
      this.additional = null;
    },
    updateAssets(updated) {
      const grants = this.GiftsOrGrants.filter(
        item => item.AsseType === "Grant"
      );
      this.setAssets({ assets: [...updated, ...grants], AssetTypeId: 2 });
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
      return [...this.sources, { text: "Other", value: "Other" }];
    },
    propEquitySources() {
      const result = [
        ...this.sources,
        { text: "Federal Agency", value: "FederalAgency" },
        { text: "Local Agency", value: "LocalAgency" },
        { text: "State Agency", value: "StateAgency" }
      ];
      return [
        ...result.sort((a, b) => a.text > b.text),
        { text: "Other", value: "Other" }
      ];
    }
  },
  components: {
    Add,
    Button,
    Radio
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
