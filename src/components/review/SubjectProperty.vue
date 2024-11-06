<template lang="pug">
    v-card.review-details(light flat)
        v-card-title.review-details__title.table-header-back
            span.review-details__title-text.table-header-text Subject Property
        v-card-text.text-block
            v-row.text-block__row
                v-col.text-block__col.no-pad-mobile(sm="7" cols="12")
                    v-text-field(
                        id="autocomplete"
                        @focus="geolocate"
                        placeholder=""
                        label="Property Address"
                        :value="address"
                    )
                v-col.text-block__col.no-pad-mobile(sm="5" cols="12")
                    v-text-field(
                        label="Purchase Price"
                        :value="getFormattedValue(purchasePrice) || 0"
                        prefix="$"
                        @input="(e) => setPurchasePrice(+e.replace(/,/g, ''))"
                        @keypress="(e) => isOnlyNum(e, true)"
                    )
            v-row.text-block__row(v-for="(item, index) in bindedCosts" :key="index" :class="{'table-row-colored': index%2 == 0, 'table-row-odd-colored': index%2 == 1, 'opacity-0 sm-no-display': item.isEmpty }")
                v-col.text-block__col(sm="8" cols="6") {{ item.title }}
                v-spacer
                v-col.text-block__col.right-aligned(sm="3" cols="6") 
                    span(v-if="!item.isEmpty") $
                    span {{ !item.isEmpty ? (getFormattedValue(item.value) || 0) : "" }}
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat";
import googleAutoComplete from "@/mixins/googleAutoComplete.js";
import countryHandling from "@/mixins/countryHandling.js";

export default {
  mixins: [onlyNum, currencyFormat, googleAutoComplete, countryHandling],
  data() {
    return {
      costs: [
        { title: "Down Payment", value: 0, prop: "downPaymentAmount" },
        { title: "Loan Amount", value: 0, prop: "loanAmount" },
        { title: "Closing Costs", value: 0, prop: "closingCosts" },
        { title: "Deposits", value: 0, prop: "deposits" },
        {
          title: "Cash From/To the Borrower at Closing",
          value: 0,
          prop: "cashAtClosing"
        },
        { title: "-", value: "", isEmpty: true }
      ]
    };
  },
  methods: {
    ...mapActions(["setProperty", "setPurchasePrice"]),
    handleAddressData(addressData) {
      let property = this.property
        ? { ...this.property, ...addressData }
        : addressData;
      if (property.CountryCode) {
        property.CountryCode = this.getCountryCode(property.CountryCode);
      }
      this.setProperty(property);
    }
  },
  computed: {
    ...mapGetters({
      property: "getProperty",
      loanAmount: "getLoanAmount",
      purchasePrice: "getPurchasePrice",
      downPaymentAmount: "getDownPaymentAmount",
      transactionDetails: "getTransactionDetails",
      purchaseCredits: "getPurchaseCredits"
    }),
    titleClass() {
      let result = "light-gray primary--text";
      if (this.$vuetify.breakpoint.name === "xs") {
        result = "primary white--text";
      }
      return result;
    },
    address() {
      let result = "";
      if (this.property) {
        const {
          AddressLineText,
          CityName,
          StateCode,
          PostalCode
        } = this.property;
        result = `${AddressLineText || ""} ${CityName || ""} ${StateCode ||
          ""} ${PostalCode || ""}`;
      }
      return result;
    },
    closingCosts() {
      const {
        TotalNonSubjectPropertyDebtsToBePaidOffAmount = 0,
        EstimatedClosingCostsAmount = 0
      } = this.transactionDetails;
      return (
        TotalNonSubjectPropertyDebtsToBePaidOffAmount +
        EstimatedClosingCostsAmount
      );
    },
    deposits() {
      const filtered = this.purchaseCredits.length
        ? this.purchaseCredits.filter(
            item => item.PurchaseCreditType === "EarnestMoney"
          )
        : [];
      return filtered.length
        ? filtered.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.PurchaseCreditAmount)
                ? +cur.PurchaseCreditAmount
                : 0),
            0
          )
        : 0;
    },
    cashAtClosing() {
      const {
        CashToBorrowerAtClosingAmount = 0,
        CashFromBorrowerAtClosingAmount = 0
      } = this.transactionDetails;
      return CashToBorrowerAtClosingAmount + CashFromBorrowerAtClosingAmount;
    },
    bindedCosts() {
      return this.costs.map(item => {
        item.value = !item.isEmpty ? this[item.prop] : "";
        return item;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/review-details.scss";

.opacity-0 {
  opacity: 0;
  @media (max-width: 760px) {
    display: none;
  }
}
</style>
