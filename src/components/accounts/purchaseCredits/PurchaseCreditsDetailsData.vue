<template lang="pug">
    v-card-text.text-block.text-black--text
        v-row.text-block__row.mb-7(v-for="(credit, index) in credits" :key="index")
          v-card.my-1(width="100%").multpleItemsContainer
            v-col.text-block__col.relative(sm="6" md="5" cols="12")
                v-select(
                    outlined
                    dense
                    label="Purchase Credit Type"
                    attach=true
                    :items="types"
                    :value="getType(credit)"
                    :menu-props="{ bottom: true, offsetY: true }"
                    @change="(value) => setCreditType(value, index)"
                )
            v-col.text-block__col(sm="3" md="3" cols="10")
                v-text-field(
                    outlined
                    dense
                    prefix="$"
                    label="Cash or Market Value" 
                    :value="getFormattedValue(credit.PurchaseCreditAmount)"
                    @input="(e) => setAmount(+e.replace(/,/g, ''), index)"
                    @keypress="(e) => isOnlyNum(e, true)"
                    )    
            .removeItem(@click="remove(index)")
              v-icon close
        v-card.multpleItemsContainer(v-if="additional")
          v-row.mt-3.pt-2.text-block__row
              v-col.text-block__col.relative(sm="6" md="5" cols="10")
                  v-select(
                      outlined
                      dense
                      label="Purchase Credit Type"
                      attach=true
                      :items="types"
                      :value="additional.PurchaseCreditType"
                      :menu-props="{ bottom: true, offsetY: true }"
                      @change="(value) => setCreditType(value)"
                  )
          .removeItem(@click="additional=null")
            v-icon close
        v-row.text-block__row.last-row.mt-7
            v-col.text-block__col(sm="4" cols="12")
                v-row.add-new
                    Add(
                        customClass='small' 
                        @add="addItem"
                        )
                    span.add-new__title Add Purchase Credit
            v-col.text-block__col.totals-col(sm="4" cols="12")
                v-row.totals
                    span.totals__title Total:
                    span.totals__value ${{ getFormattedValue(total) || 0 }}
</template>

<script>
import Add from "@/components/buttons/Add";
import Button from "@/components/buttons/Button";
import Radio from "@/components/form/Radio";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      isMenu: false,
      types: [
        "Employer Assisted Housing",
        "Lease Purchase Fund",
        "Relocation Funds",
        "Sweat Equity",
        "Trade Equity From Property Swap",
        "Borrower Paid Fees",
        "Lot Equity",
        "Other"
      ],
      additional: null
    };
  },
  methods: {
    ...mapActions(["setPurchaseCredits"]),
    remove(index) {
      const updated = this.credits.filter((item, i) => i !== index);
      this.updatePurchaseCredits(updated);
    },
    addItem() {
      if (this.additional) return;
      this.additional = {};
    },
    getType(credit) {
      let value = credit.PurchaseCreditType
        ? credit.PurchaseCreditType.replace(/([a-z])([A-Z])/g, "$1 $2")
        : "";
      if (credit.PurchaseCreditTypeOtherDescription) {
        value += ` - ${credit.PurchaseCreditTypeOtherDescription.replace(
          /([a-z])([A-Z])/g,
          "$1 $2"
        )}`;
      }
      return value;
    },
    setCreditType(value, index) {
      let nonEranestCredits = [...this.credits];
      if (this.additional) {
        let credit = {
          PurchaseCreditType:
            value.indexOf("Other") === -1 ? value.replace(/ /g, "") : "Other"
        };
        if (value.indexOf("Other") !== -1) {
          credit.PurchaseCreditTypeOtherDescription = value
            .split(" - ")[1]
            .replace(/ /g, "");
        }
        nonEranestCredits.push(credit);
      } else {
        nonEranestCredits[index].PurchaseCreditType =
          value.indexOf("Other") === -1 ? value.replace(/ /g, "") : "Other";
        if (value.indexOf("Other") !== -1) {
          nonEranestCredits[
            index
          ].PurchaseCreditTypeOtherDescription = value
            .split(" - ")[1]
            .replace(/ /g, "");
        } else {
          delete nonEranestCredits[index].PurchaseCreditTypeOtherDescription;
        }
      }
      this.updatePurchaseCredits(nonEranestCredits);
      this.additional = null;
    },
    setAmount(value, index) {
      const nonEranestCredits = this.credits.map((item, i) =>
        index !== i ? item : { ...item, PurchaseCreditAmount: value }
      );
      this.updatePurchaseCredits(nonEranestCredits);
    },
    updatePurchaseCredits(credits) {
      const earnestCredits = this.PurchaseCredits.filter(
        item => item.PurchaseCreditType === "EarnestMoney"
      );
      this.setPurchaseCredits([...earnestCredits, ...credits]);
    }
  },
  computed: {
    ...mapGetters({
      PurchaseCredits: "getPurchaseCredits"
    }),
    total() {
      return this.credits.length
        ? this.credits.reduce((acc, cur) => {
            acc += !isNaN(cur.PurchaseCreditAmount)
              ? +cur.PurchaseCreditAmount
              : 0;
            return acc;
          }, 0)
        : 0;
    },
    credits() {
      return this.PurchaseCredits.filter(
        item => item.PurchaseCreditType !== "EarnestMoney"
      );
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
