<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select the types of Gifts you've received or plan to receive for this Loan?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="activeTypes" multiple="multiple" @change="setType">
        <v-row class="form-container">
          <ToggleCard v-for="({src, title, value}, index) in types" :key="index" :value="value">
            <inline-svg :src="src"></inline-svg>
            <p>{{ title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
            
</template>

<script>
import ToggleCard from "@/components/controls/ToggleCard";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      types: [
        {
          src: require("@/assets/images/accounts/cash-gift.svg"),
          title: "Gift from Donor Account",
          value: "GiftOfCash"
        },
        {
          src: require("@/assets/images/accounts/gift-property-equity.svg"),
          title: "Gift of Property Equity",
          value: "GiftOfPropertyEquity"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setAssets"]),
    setType(types) {
      let updated = [...this.gifts];
      let position = types.findIndex(x=>updated.findIndex(y=>y.AssetType===x)===-1);
      if (position !== -1) {
        updated.push({ AssetType: types[position], AssetTypeId: 2 });
      } else {
        position = assets.findIndex(x=>!types.includes(x.AssetType));
        updated.splice(position, 1);
      }
      this.updateAssets(updated);
    },
    updateAssets(updated) {
      const grants = this.giftsOrGrants.filter(
        item => item.AsseType === "Grant"
      );
      this.setAssets({ assets: [...updated, ...grants], AssetTypeId: 2 });
    }
  },
  computed: {
    ...mapGetters({
      giftsOrGrants: "getGiftsOrGrants"
    }),
    gifts() {
      return this.giftsOrGrants.filter(
        item =>
          item.AssetType === "GiftOfCash" ||
          item.AssetType === "GiftOfPropertyEquity"
      );
    },
    activeTypes() {
      return this.gifts.length ? this.gifts.map(item => item.AssetType) : [];
    }
  },
  components: {
    ToggleCard
  }
};
</script>
