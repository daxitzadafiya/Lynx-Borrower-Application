<template lang="pug">
  <v-form class="fast-fail form-outer-container">
    <v-row class="form-container deleteAbleItem" v-if="credits.length" v-for="(credit, index) in credits" :key="index">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-select" inputTitle="Purchase Credit Type" attach="attach" :items="types" :value="getType(credit)" :menu-props="{ bottom: true, offsetY: true }" @change="(value) => setCreditType(value, index)"></Input>
      <Input prefix="$" inputTitle="Cash or Market Value" :value="getFormattedValue(credit.PurchaseCreditAmount)" @input="(e) => setAmount(+e.replace(/,/g, ''), index)" @keypress="(e) => isOnlyNum(e, true)">  </Input>
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional=null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-select" inputTitle="Purchase Credit Type" attach="attach" :items="types" :value="additional.PurchaseCreditType" :menu-props="{ bottom: true, offsetY: true }" @change="(value) => setCreditType(value)"></Input>
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn class="addItemBtn" dense="dense" plain="plain" elevation="0" @click="addItem">
          <v-icon small="small">mdi-plus</v-icon><span class="addBtnText">Add Purchase Credit</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12">Total: ${{ getFormattedValue(total) || 0 }}</v-col>
    </v-row>
  </v-form>
</template>

<script>
import { purchaseCreditTypes } from "@/models/constants"
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      isMenu: false,
      types: purchaseCreditTypes,
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
};
</script>