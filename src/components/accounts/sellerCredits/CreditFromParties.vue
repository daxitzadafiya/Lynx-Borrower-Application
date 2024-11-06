<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the credit amounts or percentatges that you are receiving
        from any of these parties, towards your closing costs.
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container justify-center">
        <ToggleCard
          class="toggleCard"
          :mdVal="4"
          :lgVal="3"
          :smVal="6"
          v-for="({ src, title, value }, index) in types"
          :key="index"
          :isChecked="checkAmountOrPercentage(value)"
          :bordered="checkAmountOrPercentage(value)"
        >
          <div class="toggleCardContainer">
            <inline-svg
              class="itemImage noStroke"
              :class="
                activeTypes.indexOf(value) !== -1
                  ? 'tile-image tile-image-selected'
                  : 'tile-image'
              "
              :src="src"
            ></inline-svg>
            <div class="text-body-1 mt-3 font-weight-bold itemTitle">
              {{ title }}
              <v-icon
                class="remove-amount-button"
                @click="setAmount(0, value)"
                v-if="checkAmountOrPercentage(value)"
                >close
              </v-icon>
            </div>
            <p class="blackText d-block">Credit Amount</p>
            <v-row class="justify-center">
              <Input
                class="px-0"
                inputTitle=""
                placeholder=""
                prefix="$"
                smVal=""
                :value="getCreditAmount(value)"
                @input="e => setAmount(+e.replace(/,/g, ''), value)"
                @keypress="e => isOnlyNum(e, true)"
                @focus="e => removeZeroAmount('amount', value)"
                @blur="e => addZero()"
                label=""
              />
              <div
                class="px-1 d-flex justify-center align-center"
                style="margin-top: 10px;"
              >
                <span>Or</span>
              </div>
              <Input
                class="px-0"
                inputTitle=""
                placeholder=""
                prefix="%"
                smVal=""
                :value="getCreditPercent(value)"
                @input="e => setPercentage(+e.replace(/,/g, ''), value)"
                @keypress="e => isOnlyNum(e, true)"
                @focus="e => removeZeroAmount('percentage', value)"
                @blur="e => addZero()"
                label=""
              />
            </v-row>
          </div>
        </ToggleCard>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import ToggleCard from "@/components/controls/ToggleCard";
import scrollToTop from "@/mixins/scrollToTop.js";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [scrollToTop, onlyNum, currencyFormat],
  data() {
    return {
      types: [
        {
          src: require("@/assets/images/accounts/seller.svg"),
          title: "Seller",
          value: "Seller"
        },
        {
          src: require("@/assets/images/accounts/builder.svg"),
          title: "Builder",
          value: "Builder"
        },
        {
          src: require("@/assets/images/accounts/agent.svg"),
          title: "Real Estate Agent",
          value: "RealEstateAgent"
        }
      ],
      focusedType: "",
      focusedValue: ""
    };
  },
  methods: {
    ...mapActions(["setSellerCredits"]),
    getCreditAmount(value) {
      const creditIndex = this.activeTypes.indexOf(value);
      if (
        (creditIndex === -1 ||
          this.sellerCredits[creditIndex].SellerCreditAmount === 0) &&
        this.focusedValue === value &&
        this.focusedType === "amount"
      ) {
        return "";
      }
      if (creditIndex !== -1) {
        return (
          this.getFormattedValue(
            this.sellerCredits[creditIndex].SellerCreditAmount
          ) || 0
        );
      }
      return 0;
    },
    removeZeroAmount(type, value) {
      this.focusedType = type;
      this.focusedValue = value;
    },
    addZero() {
      this.focusedType = "";
      this.focusedValue = "";
    },
    getCreditPercent(value) {
      const creditIndex = this.activeTypes.indexOf(value);
      if (
        (creditIndex === -1 ||
          this.sellerCredits[creditIndex].SellerCreditPercentage === 0) &&
        this.focusedValue === value &&
        this.focusedType === "percentage"
      ) {
        return "";
      }
      if (creditIndex !== -1) {
        return this.sellerCredits[creditIndex].SellerCreditPercentage || 0;
      }
      return 0;
    },
    setAmount(amount, value) {
      let credits = [...this.sellerCredits];
      const position = this.activeTypes.indexOf(value);
      if (position === -1) {
        credits.push({ SellerCreditAmount: amount, SellerCreditType: value });
      } else {
        if (!amount) {
          credits.splice(position, 1);
        } else {
          credits[position].SellerCreditAmount = amount;
          if (amount != 0) {
            credits[position].SellerCreditPercentage = 0;
          }
        }
      }
      this.setSellerCredits(credits);
    },
    setPercentage(percentage, value) {
      let credits = [...this.sellerCredits];
      const position = this.activeTypes.indexOf(value);
      if (position === -1) {
        credits.push({
          SellerCreditPercentage: percentage,
          SellerCreditType: value
        });
      } else {
        if (!percentage) {
          if (credits[position].SellerCreditAmount === 0)
            credits.splice(position, 1);
        } else {
          credits[position].SellerCreditPercentage = percentage;
          if (percentage != 0) {
            credits[position].SellerCreditAmount = 0;
          }
        }
      }
      this.setSellerCredits(credits);
    },
    checkAmountOrPercentage(value) {
      const creditIndex = this.activeTypes.indexOf(value);
      if (creditIndex !== -1) {
        return (
          (this.getCreditAmount(value) !== 0 &&
            this.getCreditAmount(value) !== "") ||
          (this.getCreditPercent(value) !== 0 &&
            this.getCreditPercent(value) !== "")
        );
      }
      return false;
    }
  },
  computed: {
    ...mapGetters({
      sellerCredits: "getSellerCredits",
      LoanPurposeType: "getLoanPurposeType"
    }),
    activeTypes() {
      return this.sellerCredits.length
        ? this.sellerCredits.map(item => item.SellerCreditType)
        : [];
    }
  },
  components: {
    ToggleCard
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
.toggleCard {
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep(.cardBtn) {
    height: 100% !important;
    border: 2px solid transparent;
    background-color: #f9f9f9;
    pointer-events: none;
    transition: all ease-in-out 0.3s;
    &:hover {
      .btnContent {
        opacity: 1 !important;
      }
    }
  }

  .toggleCardContainer {
    padding: 20px 5px;
    pointer-events: all;
    color: $primary-text-color;
    .itemImage {
      height: 40px;
      fill: $primary-text-color;
    }
    .itemTitle {
      text-transform: none;
    }
  }
  ::v-deep legend {
    display: none;
  }
}

.blackText {
  color: black;
}

.itemTitle {
  position: relative;
}

.remove-amount-button {
  position: absolute;
  right: -10px;
  top: 0;
  cursor: pointer;
  &.v-icon {
    &:hover {
      color: $icon-color !important;
    }
  }
}
</style>
