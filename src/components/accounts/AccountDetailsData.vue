<template lang="pug">
    v-card-text.text-block.text-black--text
        v-row.text-block__row.mb-7(
            v-if="Assets.length" 
            v-for="(asset, index) in Assets"
            :key="index"
            :class="index%2 !== 0? 'table-row-color':'table-odd-row-color'"
            )
          v-card(width="100%" elevation=3).multpleItemsContainer
            v-row
              v-col.text-block__col.lg-width-310.sm-pl-5(md="4" sm="6" cols="12")
                  v-combobox.account-type-field(
                      dense
                      outlined
                      attach=true
                      :menu-props="{light: true}"
                      @change="(type) => setAssetType(type, index)"
                      :items="types"
                      :item-text="types.text"
                      :item-value="types.value"
                      :value="getDisplayText(asset.AssetType)"
                      label="Account Type"
                      )
              v-col.text-block__col(style="width:min(100%, 530px)" cols="auto")
                  v-combobox(
                    dense
                    outlined
                    attach=true
                    :menu-props="{light: true}"
                    label="Financial Institution"
                    hide-no-data
                    :items="institutions[index] == null ? (asset.FullName != null ? [{ Name: asset.FullName }] : []) : institutions[index]"
                    :value="asset.FullName"
                    :loading="institueSearchIndex === index"
                    item-text="Name"
                    item-value="Name"
                    :filter="()=>true"
                    @update:search-input="(name) => getFinancialInstitutionSearchResults(name, index, asset)"
                    @input="(e) => setAssetInstitution(e, index)"
                  )
            v-row
              v-col.text-block__col.lg-width-150(sm="4" md="3" cols="12")
                  v-text-field(
                      dense
                      outlined
                      label="Last 4 of Acct#"
                      prefix="*"
                      v-mask="'XXXX'"
                      :value="asset.AssetAccountIdentifier"
                      @input="(e) => setAssetAccountNumber(e, index)"
                      )
              v-col.text-block__col.sm-pl-5(sm="4" cols="12")
                  v-combobox(
                      dense
                      outlined
                      attach=true
                      :menu-props="{light: true}"
                      :value="asset.OwnershipType ? asset.OwnershipType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''"
                      @change="(type) => setAssetOwnershipType(type, index)"
                      :items="ownershipTypes"
                      label="Ownership Type"
                      )
              v-col.text-block__col.lg-width-150(sm="4" md="3" cols="10")
                  v-text-field(
                      dense
                      outlined
                      prefix="$"
                      label="Cash or Market Value" 
                      :value="getFormattedValue(asset.AssetCashOrMarketValueAmount)"
                      @input="(e) => setAssetAmount(+e.replace(/,/g, ''), index)"
                      @keypress="(e) => isOnlyNum(e, true)"
                      )     
            .removeItem(@click="remove(index)")
                    v-icon close   
        v-card.multpleItemsContainer(v-if="additional")
          v-row.text-block__row.sm-margin-b-15
            v-col.text-block__col.relative-col(sm="4" cols="11")
                v-combobox(
                    dense
                    outlined
                    attach=true
                    :menu-props="{light: true}"
                    :value="additional.AssetType"
                    :item-text="types.text"
                    :item-value="types.value"
                    @change="(type) => setAdditionalType(type)"
                    :items="types"
                    label="Account Type"
                    )
          .removeItem(@click="additional=null")
            v-icon close
        v-row.mt-7.text-block__row.last-row
            v-col.text-block__col(sm="4" cols="12")
                v-row.add-new
                    Add(
                        customClass='small' 
                        @add="addAccount"
                        )
                    span.add-new__title Add New Account
            v-col.text-block__col.totals-col(sm="4" cols="12")
                v-row.totals
                    span.totals__title Total:
                    span.totals__value ${{ getFormattedValue(total) || 0 }}
</template>

<script>
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
import config from "@/configs";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      types: [
        {
          text: "Bond",
          value: "Bond"
        },
        {
          text: "Certificate Of Deposit/Time Deposit(CD)",
          value: "CertificateOfDepositTimeDeposit"
        },
        {
          text: "Checking Account",
          value: "CheckingAccount"
        },
        {
          text: "Individual Development Account",
          value: "IndividualDevelopmentAccount"
        },
        {
          text: "Life Insurance",
          value: "LifeInsurance"
        },
        {
          text: "Money Market Fund",
          value: "MoneyMarketFund"
        },
        {
          text: "Mutual Fund",
          value: "MutualFund"
        },
        {
          text: "Retirement Fund",
          value: "RetirementFund"
        },
        {
          text: "Savings Account",
          value: "SavingsAccount"
        },
        {
          text: "Stock",
          value: "Stock"
        },
        {
          text: "Stock Options",
          value: "StockOptions"
        },
        {
          text: "Trust Account",
          value: "TrustAccount"
        }
      ],
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
  },
  components: {
    Add,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.text-block {
  &__row {
    position: relative;
  }
}

.remove {
  position: absolute;
  bottom: 40px;
  right: -10px;
  &__icon {
    cursor: pointer;
  }
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

.relative-col {
  position: relative;
}

.additional-remove {
  right: -10px;
  top: 30px;
}

.account-type-field {
  font-size: 14px;
}

@media (min-width: 1368px) {
  .lg-width-310 {
    max-width: 310px;
  }
  .lg-width-150 {
    max-width: 220px;
  }
}

@media (max-width: 768px) {
  .remove {
    right: 10px;
    bottom: 60px;
  }
  .additional-remove {
    right: -10px;
  }
  .sm-pl-5 {
    padding-left: 5px;
  }
}

@media (max-width: 760px) {
  .text-block {
    margin-top: 0;
    margin-bottom: 0;
    &__col {
      padding: 0 5px;
    }
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
  .remove {
    bottom: 35px;
  }
  .additional-remove {
    top: 20px;
    right: -20px;
  }
}
</style>
