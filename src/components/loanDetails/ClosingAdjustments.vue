<template lang="pug">
    v-card.pb-1
        v-card-title Closing Adjustments
        v-card-text           
            v-row.ma-0.pa-0.my-2(v-for="(adjustment, index) in closingAdjustments" :key="index")
                v-select.mx-1.my-0(dense
                    :items="types" 
                    item-text="text" 
                    item-value="value" 
                    placeholder="Closing Adjustment Type" 
                    :value="adjustment.ClosingAdjustmentItemType"
                    @change="(value) => setAdjustmentProp('ClosingAdjustmentItemType', value, index)"
                    :menu-props="{light: true}"
                    style="max-width:300px; max-height:33px"
                    )
                v-text-field.mx-1.my-0(
                    dense
                    :value="getFormattedValue(adjustment.ClosingAdjustmentItemAmount) || ''"
                    @input="(e) => setAdjustmentProp('ClosingAdjustmentItemAmount', +e.replace(/,/g, ''), index)"
                    placeholder="Closing Adjustment Amount"
                    hide-details
                    prefix="$"
                    @keypress="(e) => isOnlyNum(e, true)"
                    style="max-width:300px; max-height:33px"
                    )
            v-row.ma-0.pa-0.my-2(v-if="additional")
                v-select.mx-1.my-0(dense
                    :items="types" 
                    item-text="text" 
                    item-value="value" 
                    placeholder="Closing Adjustment Type" 
                    :value="additional.ClosingAdjustmentItemType"
                    @change="(value) => setAdditionalType(value)"
                    :menu-props="{light: true}"
                    style="max-width:300px; max-height:33px"
                    )
                v-text-field.mx-1.my-0(v-if="additional.ClosingAdjustmentItemType"
                    dense
                    :value="getFormattedValue(additional.ClosingAdjustmentItemAmount) || ''"
                    @input="(e) => setAdditionalAmount(+e.replace(/,/g, ''))"
                    @change="setAdjustment"
                    placeholder="Closing Adjustment Amount"
                    hide-details
                    prefix="$"
                    @keypress="(e) => isOnlyNum(e, true)"
                    style="max-width:300px; max-height:33px"
                    )
            v-row.ma-0.pa-0.my-7
                Add(
                    customClass='small'
                    @add="addAdjustment"
                )
                span.ml-2.process-green--text Add New Adjustment
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Button from "@/components/buttons/Button";
import Add from "@/components/buttons/Add";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      types: [
        {
          text: "Lender Credit",
          value: "LenderCredit"
        }
      ],
      additional: null
    };
  },
  methods: {
    ...mapActions(["updateTransactionDetails", "saveLoanPatches"]),
    addAdjustment() {
      if (!this.isAvailableTypes) return;
      this.additional = {
        ClosingAdjustmentItemType: "",
        ClosingAdjustmentItemAmount: ""
      };
    },
    setAdjustmentProp(prop, value, index) {
      if (prop === "ClosingAdjustmentItemType" && !value) return;

      let adjustments = this.closingAdjustments.map((item, i) =>
        i !== index ? item : { ...item, [prop]: value }
      );
      if (prop === "ClosingAdjustmentItemAmount" && !value) {
        adjustments = adjustments.filter((item, i) => i !== index);
      }
      this.updateTransactionDetails({
        prop: "ClosingAdjustments",
        value: adjustments
      });
    },
    setAdditionalType(value) {
      if (!value) return;
      this.additional.ClosingAdjustmentItemType = value;
    },
    setAdditionalAmount(value) {
      this.additional.ClosingAdjustmentItemAmount = value;
    },
    setAdjustment() {
      if (this.additional.ClosingAdjustmentItemAmount) {
        const adjustments = [...this.closingAdjustments, this.additional];
        this.updateTransactionDetails({
          prop: "ClosingAdjustments",
          value: adjustments
        });
      }
      this.additional = null;
    }
  },
  computed: {
    ...mapGetters({
      closingAdjustments: "getClosingAdjustments"
    }),
    isAvailableTypes() {
      const typesVals = this.types.map(item => item.value);
      const allAdjustmentTypes = this.closingAdjustments.map(
        item => item.ClosingAdjustmentItemType
      );
      return typesVals.length !== allAdjustmentTypes.length;
    }
  },
  components: {
    Button,
    Add
  }
};
</script>
