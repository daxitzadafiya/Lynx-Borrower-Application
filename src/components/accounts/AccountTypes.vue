<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select all of the Accounts you have</div>
    </div>
    <v-form fast-fail="fast-fail">
      <div class="inner-content-container">
        <div class="mb-4">If you have none of these, just click 'Next'.</div>
        <v-btn-toggle class="btnToggleGroup" :value="activeTypes" multiple="multiple" @change="setTypes">
          <v-row class="form-container">
            <ToggleCard v-for="(item, index) in types" :key="index" :value="item.value" :smVal="6" :lgVal="3">
              <inline-svg :src="item.src"></inline-svg>
              <p>{{ item.title }}</p>
            </ToggleCard>
          </v-row>
        </v-btn-toggle>
      </div>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :NextClicked="navigateToAccountDetails" :HasDefaultNavigation="false"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";
import loanPatch from "@/mixins/loanPatch.js";

export default {
mixins: [loanPatch],
data() {
  return {
    types: [
      {
        src: require("@/assets/images/accounts/checking.svg"),
        title: "Checking",
        value: "CheckingAccount"
      },
      {
        src: require("@/assets/images/accounts/saving.svg"),
        title: "Savings",
        value: "SavingsAccount"
      },
      {
        src: require("@/assets/images/accounts/retirement.svg"),
        title: "Retirement\r\n(401k/IRA/etc…)",
        value: "RetirementFund"
      },
      {
        src: require("@/assets/images/accounts/other-assets.svg"),
        title: "Other",
        value: "Other"
      }
    ]
  };
},
methods: {
  ...mapActions(["setAssets"]),
  setTypes(assetTypes) {
    let assets = [...this.Assets];
    let position = assetTypes.findIndex(x=>assets.findIndex(y=>y.AssetType===x)===-1);
    if (position !== -1) {
      assets.push({ AssetType: assetTypes[position], AssetTypeId: 0 });
    } else {
      position = assets.findIndex(x=>!assetTypes.includes(x.AssetType));
      assets.splice(position, 1);
    }
    this.setAssets({ assets, AssetTypeId: 0 });
  },
  async navigateToAccountDetails() {
    let assets = [...this.Assets];
    let otherAsset = assets.find(x => x.AssetType === "Other");
    if (otherAsset != null) {
      otherAsset.AssetType = null;
      this.setAssets({ assets, AssetTypeId: 0 });
    }
    this.saveAndAdvance()
  }
},
computed: {
  ...mapGetters({
    Assets: "getRegularAssets"
  }),
  activeTypes() {
    return this.Assets.length ? this.Assets.reduce((filtered, item) => {
      if(item.AssetType){
        filtered.push(item.AssetType)
      }
      return filtered
    }, []) : [];
  }
},
components: {
  ToggleCard
},
mounted() {
  // if(this.Assets.length > 0) {
  //     this.$router.push('/accountsandassets/account-details')
  // }
}
};
</script>
