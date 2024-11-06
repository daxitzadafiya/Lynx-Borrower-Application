<template lang="pug">
  v-form.fast-fail.form-outer-container
    v-row.form-container.deleteAbleItem(
      v-if="Assets.length" 
      v-for="(detail, index) in allAssets" 
      :key="index"
      )
      v-col.itemContainer.itemDeleteCrossContainer(cols="12" sm="12")
        v-btn(dense icon @click="remove(index)")
          v-icon(small) mdi-close
      Input(
                      inputTitle="Asset Type"
                      attach=true
                      defaultComponent="v-select"
                      :items="assetsTypes"
                      item-text="text",
                      item-value="value"
                      :value="detail.AssetType"
                      :menu-props="{ bottom: true, offsetY: true }"
                      @change="(value) => setOtherAssetType(value, index)"
                  )
      Input(
                      v-if="detail.AssetType==='CashOnHand'"
                      label="Source" 
                      :value="detail.FundsSourceType"
                      @input="(value) => setAssetProp(value, 'FundsSourceType', index)"
                      )
      googlePlaceAutocomplete(
                      v-if="detail.AssetType==='ProceedsFromSaleOfRealEstate'"
                      :value="getFormattedAddress(detail)"
                      @setAddressData="(value) => setAddressData(value, index)"
                    )
      DateInput(inputTitle="Closing Date" v-if="detail.AssetType==='ProceedsFromSaleOfRealEstate'" @dateUpdated="(date) => setClosingDate(date, index)" @dateCleared="()=>clearClosingDate(index)" :value="detail.ClosingDate")

      Input(
                      v-if="detail.AssetType==='ProceedsFromSaleOfPersonalProperty'"
                      inputTitle="Personal Property"
                      attach=true
                      defaultComponent="v-select"
                      :items="personProperties"
                      item-text="text",
                      item-value="value"
                      :value="detail.FundsSourceType"
                      :menu-props="{ bottom: true, offsetY: true }"
                      @change="(value) => setAssetProp(value, 'FundsSourceType', index)"
                  )

              
      Input(
                    inputTitle="Collateral"
                      defaultComponent="v-select"
                      attach=true
                      v-if="detail.AssetType==='ProceedsFromSecuredLoan'"
                      :items="collaterals"
                      item-text="text",
                      item-value="value"
                      :value="detail.FundsSourceType"
                      :menu-props="{ bottom: true, offsetY: true }"
                      @change="(value) => setAssetProp(value, 'FundsSourceType', index)"
                  )
      Input(
                      v-if="detail.FundsSourceType==='Other'"
                      inputTitle="Other Description" 
                      :value="detail.FundsSourceTypeOtherDescription"
                      @input="(value) => setAssetProp(value, 'FundsSourceTypeOtherDescription', index)"
                      )
      DateInput(inputTitle="Date Received" v-if="detail.AssetType==='ProceedsFromSecuredLoan'" @dateUpdated="(date) => setDateReceived(date, index)" @dateCleared="()=>clearDateReceived(index)" :value="detail.DateReceived")
      Input(
                      prefix="$"
                      inputTitle="Value" 
                      :value="getFormattedValue(detail.AssetCashOrMarketValueAmount)"
                      @input="(e) => setAssetAmount(+e.replace(/,/g, ''), index)"
                      @keypress="(e) => isOnlyNum(e, true)"
                      :disabled="!detail.AssetType"
                      )    
      v-col(cols="12" sm="6" v-if="detail.AssetType === 'Other'").itemContainer
        v-radio-group.radioGroup(row hide-details :value="detail.AssetTypeOtherDescription" @change="(val)=>{setAssetLiquidProp(val, index)}")
          v-radio(label="Liquid" :value="'OtherLiquidAsset'")
          v-radio(label="Non-Liquid" :value="'OtherNonLiquidAsset'")
    v-row.form-container.addItemBtnContainer
          v-col.itemContainer(cols="12" sm="8")
            v-btn(dense plain elevation="0" @click="addItem").addItemBtn
              v-icon(small) mdi-plus
              span.addBtnText Add Asset or Credit
          v-col.itemContainer(sm="4" cols="12").totalsColumn Total: ${{ getFormattedValue(total) || 0 }}
</template>

<script>
import Add from "@/components/buttons/Add";
import DateInput from "@/components/form/DateInput";
import Radio from "@/components/form/Radio";
import googlePlaceAutocomplete from "@/components/maps/newGooglePlaceAutocomplete";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { otherAssetsTypes, personProperties, collaterals } from "@/models/constants";

import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      menuOpenIndex: -1,
      menuOpenedDate: null,
      assetsTypes: otherAssetsTypes,
      personProperties: personProperties,
      collaterals: collaterals,
      additional: null
    };
  },
  methods: {
    ...mapActions(["setAssets"]),
    setClosingDate(date, index) {
      this.setAssetProp(
        date == null ? null : moment(date).format("YYYY-MM-DD"),
        "ClosingDate",
        index
      );
    },
    clearClosingDate(index){
      this.setClosingDate(null, index);
      this.menuOpenIndex=-1;
    },
    clearDateReceived(index){
      this.setDateReceived(null, index);
      this.menuOpenIndex=-1;
    },
    setAddressData(address, index) {
      this.setAssetProp(address.AddressLineText, "AddressLineText", index);
      this.setAssetProp(address.CityName, "CityName", index);
      this.setAssetProp(address.StateCode, "StateCode", index);
      this.setAssetProp(address.CountryCode, "CountryCode", index);
      this.setAssetProp(address.PostalCode, "PostalCode", index);
    },
    setDateReceived(date, index) {
      this.setAssetProp(
        date == null ? null : moment(date).format("YYYY-MM-DD"),
        "DateReceived",
        index
      );
    },
    getFormattedAddress(asset) {
      var formattedAddress = "";
      if (asset.AddressLineText != null) {
        formattedAddress += asset.AddressLineText + ", ";
      }
      if (asset.CityName != null) {
        formattedAddress += asset.CityName + ", ";
      }
      if (asset.StateCode != null) {
        formattedAddress += asset.StateCode + ", ";
      }
      if (asset.PostalCode != null) {
        formattedAddress += asset.PostalCode + ", ";
      }
      if (asset.CountryCode != null) {
        formattedAddress += asset.CountryCode + ", ";
      }
      return formattedAddress.slice(0, formattedAddress.length - 2);
    },
    remove(index) {
      if (this.additional && index === this.allAssets.length - 1) {
        return (this.additional = null);
      }
      const assets = this.Assets.filter((item, i) => i !== index);
      this.setAssets({ assets, AssetTypeId: 1 });
    },
    selectedDate(date) {
      return date ? moment(date).format("MMMM DD, YYYY") : "";
    },
    pickerDate(date) {
      return date ? moment(date).format("YYYY-MM-DD") : "";
    },
    addItem() {
      if (this.additional) return;
      this.additional = {};
    },
    setOtherAssetType(value, index) {
      let assets = [...this.Assets];
      if (this.additional && index === this.allAssets.length - 1) {
        let asset = { AssetType: value, AssetTypeId: 1 };
        if (value === "Other") {
          asset.AssetTypeOtherDescription = "OtherLiquidAsset";
        }
        assets.push(asset);
      } else {
        assets[index].AssetType = value;
        if (value !== "ProceedsFromSaleOfPersonalProperty") {
          if (assets[index].FundsSourceType != null) {
            delete assets[index].FundsSourceType;
          }
        }
        if (value === "Other") {
          assets[index].AssetTypeOtherDescription = "OtherLiquidAsset";
        } else {
          delete assets[index].AssetTypeOtherDescription;
        }
      }
      this.setAssets({ assets, AssetTypeId: 1 });
      this.additional = null;
    },
    setAssetLiquidProp(value, index) {
      const assets = this.Assets.map((item, i) =>
        i !== index ? item : { ...item, AssetTypeOtherDescription: value }
      );
      this.setAssets({ assets, AssetTypeId: 1 });
    },
    setAssetAmount(value, index) {
      const assets = this.Assets.map((item, i) =>
        index !== i ? item : { ...item, AssetCashOrMarketValueAmount: value }
      );
      this.setAssets({ assets, AssetTypeId: 1 });
    },
    setPersonalPropertyType(value, index) {
      const assets = this.Assets.map((item, i) =>
        index !== i ? item : { ...item, FundsSourceType: value }
      );
      this.setAssets({ assets, AssetTypeId: 1 });
    },
    setAssetProp(value, prop, index) {
      const assets = this.Assets.map((item, i) => {
        if (i === index) {
          item[prop] = value;
        }
        return item;
      });
      this.setAssets({ assets, AssetTypeId: 1 });
    }
  },
  computed: {
    ...mapGetters({
      Assets: "getOtherAssets"
    }),
    total() {
      return this.allAssets.length
        ? this.allAssets.reduce((acc, cur) => {
            acc += !isNaN(cur.AssetCashOrMarketValueAmount)
              ? +cur.AssetCashOrMarketValueAmount
              : 0;
            return acc;
          }, 0)
        : 0;
    },
    allAssets() {
      let result = [...this.Assets];
      if (this.additional) {
        result.push(this.additional);
      }
      return result;
    }
  },
  watch: {
    menuOpenIndex(val) {
      if (val !== -1) {
        if (this.allAssets[val].AssetType === "ProceedsFromSaleOfRealEstate") {
          this.menuOpenedDate = this.allAssets[val].ClosingDate;
        } else if (
          this.allAssets[val].AssetType === "ProceedsFromSecuredLoan"
        ) {
          this.menuOpenedDate = this.allAssets[val].DateReceived;
        }
      } else {
        this.menuOpenedDate = null;
      }
    }
  },
  components: {
    Add,
    DateInput,
    Radio,
    googlePlaceAutocomplete
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.remove {
  padding-top: 30px;
  &__icon {
    cursor: pointer;
  }
}

.relative {
  position: relative;
}

.last-row {
  margin-bottom: 20px;
}

.add-new {
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
  &__radios {
    justify-content: space-around;
  }
  @media (max-width: 768px) {
    &__radios {
      justify-content: flex-start;
    }
    &__radio {
      &:first-child {
        margin-right: 20px;
      }
    }
  }
  @media (max-width: 760px) {
    &__radios {
      margin: 10px 0 25px;
      justify-content: space-between;
    }
  }
}

@media (max-width: 760px) {
  .text-block {
    margin-top: 0;
    margin-bottom: 0;
  }
  .last-row {
    flex-direction: column-reverse;
  }
  .totals-col {
    margin-top: 10px;
  }
  .add-new {
    margin: 20px 0 10px;
  }
  .sm-margin-b-15 {
    margin-bottom: 15px;
  }
  .remove {
    padding-top: 15px;
    padding-left: 25px;
  }
}
</style>
