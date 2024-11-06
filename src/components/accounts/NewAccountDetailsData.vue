<template>
  <v-form class="fast-fail form-outer-container">
    <v-row class="form-container deleteAbleItem" v-if="Assets.length" v-for="(asset, index) in Assets" :key="index">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" @change="(type) => setAssetType(type, index)" :items="types" :item-text="types.text" :item-value="types.value" :value="getDisplayText(asset.AssetType)" inputTitle="Account Type"></Input>
      <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" inputTitle="Financial Institution" hide-no-data="hide-no-data" :items="institutions[index] == null ? (asset.FullName != null ? [{ Name: asset.FullName }] : []) : institutions[index]" :value="asset.FullName" :loading="institueSearchIndex === index" item-text="Name" item-value="Name" :filter="()=>true" @update:search-input="(name) => getFinancialInstitutionSearchResults(name, index, asset)" @input="(e) => setAssetInstitution(e, index)"></Input>
      <Input :mdVal="6" :lgVal="4" inputTitle="Last 4 of Acct#" prefix="*" v-mask="'XXXX'" :value="asset.AssetAccountIdentifier" @input="(e) => setAssetAccountNumber(e, index)"></Input>
      <Input :mdVal="6" :lgVal="4" attach="attach" :menu-props="{light: true}" :value="asset.OwnershipType ? asset.OwnershipType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''" @change="(type) => setAssetOwnershipType(type, index)" :items="ownershipTypes" defaultComponent="v-combobox" inputTitle="Ownership Type"></Input>
      <Input :mdVal="6" :lgVal="4" prefix="$" inputTitle="Cash or Market Value" :value="getFormattedValue(asset.AssetCashOrMarketValueAmount)" @input="(e) => setAssetAmount(+e.replace(/,/g, ''), index)" @keypress="(e) => isOnlyNum(e, true)"></Input>
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional=null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" :value="additional.AssetType" :item-text="types.text" :item-value="types.value" @change="(type) => setAdditionalType(type)" :items="types" inputTitle="Account Type"></Input>
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn class="addItemBtn" dense="dense" plain="plain" elevation="0" @click="addAccount">
          <v-icon small="small">mdi-plus</v-icon><span class="addBtnText">Add New Account</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12">Total: ${{ getFormattedValue(total) || 0 }}</v-col>
    </v-row>
  </v-form>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import { regularAssetsTypes } from "@/models/constants";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
import config from "@/configs";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      types: regularAssetsTypes,
      institutions: [],
      ownershipTypes: ["Individual", "Joint With Spouse", "Joint With Other"],
      additional: null,
      institutionSearchTimeout: null,
      institueSearchIndex: -1
    };
  },
  methods: {
    ...mapActions(["setAssets", "getFinancialInstitutions"]),
    remove(index) {
      this.institutions[index] = [];
      for (var i = index; i < this.Assets.length; i++) {
        this.institutions[index] = this.institutions[index + 1];
      }
      const assets = this.Assets.filter((item, i) => i !== index);
      this.setAssets({ assets, AssetTypeId: 0 });
    },
    addAccount() {
      this.additional = { AssetType: "" };
    },
    setAssetProp(prop, value, index) {
      const assets = this.Assets.map((item, i) => {
        item[prop] = index === i ? value : item[prop];
        return item;
      });
      this.setAssets({ assets, AssetTypeId: 0 });
    },
    setAssetType(type, index) {
      if (!type) return;
      this.setAssetProp("AssetType", type.value, index);
    },
    setAssetInstitution(name, index) {
      if (!name) return;
      this.setAssetProp("FullName", name.Name ? name.Name : name, index);
    },
    setAssetAccountNumber(value, index) {
      this.setAssetProp("AssetAccountIdentifier", value, index);
    },
    setAssetOwnershipType(type, index) {
      if (!type) return;
      this.setAssetProp("OwnershipType", type, index);
    },
    setAssetAmount(value, index) {
      this.setAssetProp("AssetCashOrMarketValueAmount", value, index);
    },
    setAdditionalType(type) {
      if (!type) return;
      const assets = [
        ...this.Assets,
        { AssetType: type.value, AssetTypeId: 0 }
      ];
      this.setAssets({ assets, AssetTypeId: 0 });
      this.additional = null;
    },
    getDisplayText(selection) {
      var found = this.types.find(type => type.value == selection);

      return found ? found.text : selection;
    },
    getFinancialInstitutionSearchResults(searchText, index, asset) {
      if (asset.FullName === searchText) return;
      if (this.institutionSearchTimeout != null) {
        clearTimeout(this.institutionSearchTimeout);
      }
      this.institutionSearchTimeout = setTimeout(async () => {
        try {
          if (
            searchText != null &&
            searchText.length >= config.autocompleteSearchTextMinimumLength
          ) {
            this.institueSearchIndex = index;
            this.$set(
              this.institutions,
              index,
              await this.getFinancialInstitutions(searchText)
            );
            this.institueSearchIndex = false;
          } else {
            this.$set(this.institutions, index, []);
          }
        } catch (e) {
          this.$set(this.institutions, index, []);
        }
      }, config.autocompleteSearchDelay);
    }
  },
  computed: {
    ...mapGetters({
      Assets: "getRegularAssets"
    }),
    total() {
      return this.Assets.length
        ? this.Assets.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.AssetCashOrMarketValueAmount)
                ? +cur.AssetCashOrMarketValueAmount
                : 0),
            0
          )
        : 0;
    }
  }
};
</script>