<template lang="pug">
  v-form.fast-fail.form-outer-container
    v-row.form-container.deleteAbleItem(
      v-if="sellerCredits.length" 
      v-for="(credit, index) in sellerCredits" 
      :key="index"
      )
      v-col.itemContainer.itemDeleteCrossContainer(cols="12" sm="12")
        v-btn(dense icon @click="remove(index)")
          v-icon(small) mdi-close
      Input(
                    inputTitle="Credit Type"
                    defaultComponent="v-select"
                    attach=true
                    :items="types"
                    item-text="text"
                    item-value="value"
                    :value="credit.SellerCreditType"
                    :menu-props="{ bottom: true, offsetY: true }"
                    @change="(value) => setCreditProp('SellerCreditType', value, index)"
                )
      Input(
                    prefix="$"
                    inputTitle="Credit Amount" 
                    :value="getFormattedValue(credit.SellerCreditAmount)"
                    @input="(e) => setCreditProp('SellerCreditAmount', +e.replace(/,/g, ''), index)"
                    @keypress="(e) => isOnlyNum(e, true)"
                    )
    v-row.form-container.deleteAbleItem(v-if="additional")
      v-col.itemContainer.itemDeleteCrossContainer(cols="12" sm="12")
        v-btn(dense icon @click="additional=null")
          v-icon(small) mdi-close
      Input(
                  defaultComponent="v-select"
                  inputTitle="Credit Type"
                  attach=true
                  :items="types"
                  item-text="text"
                  item-value="value"
                  :menu-props="{ bottom: true, offsetY: true }"
                  :value="additional.SellerCreditType"
                  @change="(value) => setAdditionalType(value)"
                  )
    v-row.form-container.addItemBtnContainer
      v-col.itemContainer(cols="12" sm="6")
        v-btn(dense plain elevation="0" @click="addItem").addItemBtn
          v-icon(small) mdi-plus
          span.addBtnText Add Seller Credit
      v-col.itemContainer(sm="6" cols="12").totalsColumn Total: ${{ getFormattedValue(total) || 0 }}

</template>

<script>
import Add from "@/components/buttons/Add";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { sellerCreditTypes } from "@/models/constants"
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      isMenu: false,
      additional: null,
      types: sellerCreditTypes
    };
  },
  methods: {
    ...mapActions(["setSellerCredits"]),
    remove(index) {
      const filtered = this.sellerCredits.filter((item, i) => i !== index);
      this.setSellerCredits(filtered);
    },
    addItem() {
      if (this.additional) return;
      this.additional = {};
    },
    setAdditionalType(type) {
      this.setSellerCredits([
        ...this.sellerCredits,
        { SellerCreditType: type }
      ]);
      this.additional = null;
    },
    setCreditProp(prop, value, index) {
      const credits = this.sellerCredits.map((item, i) =>
        index !== i ? item : { ...item, [prop]: value }
      );
      this.setSellerCredits(credits);
    }
  },
  computed: {
    ...mapGetters({
      sellerCredits: "getSellerCredits"
    }),
    total(){
      return this.sellerCredits.length
        ? this.sellerCredits.reduce((acc, cur) => {
            acc += !isNaN(cur.SellerCreditAmount)
              ? +cur.SellerCreditAmount
              : 0;
            return acc;
          }, 0)
        : 0;
    }
  },
  components: {
    Add
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
