<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Are you utilizing any other of these assets for this transaction?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <div class="inner-content-container">
        <div class="mb-4">If you have none of these, just click 'Next'.</div>
        <v-btn-toggle
          class="btnToggleGroup"
          :value="activeTypes"
          multiple="multiple"
          @change="setTypes"
        >
          <v-row class="form-container">
            <ToggleCard
              v-for="(item, index) in types"
              :key="index"
              :value="item.value"
              :smVal="6"
              :lgVal="3"
            >
              <inline-svg :src="item.src"></inline-svg>
              <p>{{ item.title }}</p>
            </ToggleCard>
          </v-row>
        </v-btn-toggle>
      </div>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  data() {
    return {
      types: [
        {
          src: require("@/assets/images/accounts/real-estate.svg"),
          title: "Proceeds From Sale Of Real Estate",
          value: "ProceedsFromSaleOfRealEstate"
        },
        {
          src: require("@/assets/images/accounts/car.svg"),
          title: "Proceeds From Sale Of Personal Property",
          value: "ProceedsFromSaleOfPersonalProperty"
        },
        {
          src: require("@/assets/images/accounts/secured-loan.svg"),
          title: "Proceeds From Secured Loan",
          value: "ProceedsFromSecuredLoan"
        },
        {
          src: require("@/assets/images/accounts/cash-on-hand.svg"),
          title: "Other",
          value: "Other"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setAssets"]),
    setTypes(assetTypes) {
      let assets = [...this.OtherAssets];
      let position = assetTypes.findIndex(
        x => assets.findIndex(y => y.AssetType === x) === -1
      );
      if (position !== -1) {
        assets.push({ AssetType: assetTypes[position], AssetTypeId: 1 });
      } else {
        position = assets.findIndex(x => !assetTypes.includes(x.AssetType));
        assets.splice(position, 1);
      }
      this.setAssets({ assets, AssetTypeId: 1 });
    }
  },
  computed: {
    ...mapGetters({
      OtherAssets: "getOtherAssets",
      LoanPurposeType: "getLoanPurposeType"
    }),
    activeTypes() {
      return this.OtherAssets.length
        ? this.OtherAssets.map(item => item.AssetType)
        : [];
    }
    //,
    // nextRoute() {
    //   if (this.activeTypes.length) {
    //     return "accountsandassets/other-asset-details";
    //   }
    //   return this.LoanPurposeType === "Purchase"
    //     ? "accountsandassets/required-deposit"
    //     : "accountsandassets/closing-costs";
    // }
  },
  components: {
    ToggleCard
  }
};
</script>
