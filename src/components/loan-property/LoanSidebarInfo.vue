<template lang="pug">
    .sidebar-info.text-black--text
        .sidebar-info__row
            span.sidebar-info_weight-500.left-nav-primary-text Purchase Price: ${{ getFormattedValue(PurchasePrice) }}
        .sidebar-info__row.left-nav-primary-text {{ address }}
</template>

<script>
import { mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [currencyFormat],
  computed: {
    ...mapGetters({
      Property: "getProperty",
      PurchasePrice: "getPurchasePrice"
    }),
    address() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.Property) {
        return keys.reduce((acc, cur) => {
          if (this.Property[cur]) {
            acc += `${this.Property[cur]}${cur === "PostalCode" ? " " : ", "}`;
          }
          return acc;
        }, "");
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/sidebarAdditional.scss";

.sidebar-info {
  &__icon {
    width: 15px;
    margin-right: 5px;
  }
  &__row {
    &:last-child {
      max-width: 70%;
    }
  }
}
</style>
