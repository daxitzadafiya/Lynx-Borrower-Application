<template lang="pug">
    .liabilities-table
        v-card-text.text-block.text-black--text
            v-row.text-block__row.bordered-row(v-for="(derogatory, index) in derogatories" :key="index")
              v-col.text-block__col.bottom-pad-xs(v-for="{ text, value, isCurrency, isDate } in headers"
                cols="6"
                :key="value"
                )
                v-row.text-block__row.data-title {{ text }}
                v-row.text-block__row.data-value 
                    span(v-if="isCurrency") ${{getFormattedValue(derogatory[value])}}
                    span(v-else-if="isDate") {{ getFormattedDate(derogatory[value]) }}
                    span(v-else-if="value === 'DispositionType'") {{ derogatory.DispositionType?derogatory.DispositionType:derogatory.DispositionTypeDescriptionOther }}
                    span(v-else) {{derogatory[value]}}
                .edit.d-flex.flex-column.justify-center
                    v-icon(@click="editItem(index)").text-block__icon.icon-color-main mdi-pencil
            v-dialog(
                v-model="isDialog"
                max-width="290"
            )
                v-card
                    v-card-title.d-flex.justify-center.mb-4.text-black--text Are you sure? 
                    v-card-text
                        v-row.justify-space-around
                            Button(
                                value="Yes"
                                customClass="button-yes"
                                width="120px"
                                @clicked="removeDerogatory")
                            Button(
                                value="No"
                                width="120px"
                                customClass="button-no"
                                isOutlined=true
                                @clicked="isDialog=false")
            v-row.text-block__row.totals-row.mt-3
              v-col.text-block__col(sm="2" cols="4")
                  v-row.text-block__row.totals-row_bold.totals-row_aligned-bottom Totals:
              v-col.text-block__col(sm="3" cols="4")
                  v-row.text-block__row.data-title Obligation Amount
                  v-row.text-block__row.totals-row_bold.data-value ${{ getFormattedValue(totalObligationAmount) }}
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";
import Button from "@/components/buttons/Button";
import moment from "moment";

export default {
  mixins: [currencyFormat, debtToIncomeAndhousingRatios],
  data() {
    return {
      headers: [
        {
          text: "Action",
          value: "RecordType",
        },
        {
          text: "Reported Date",
          value: "ReportedDate",
          isDate: true
        },
        {
          text: "Disposition",
          value: "DispositionType",
        },
        {
          text: "Disposition Date",
          value: "DispositionDate",
          isDate: true
        },
        {
          text: "Ownership",
          value: "OwnershipType",
        },
        {
          text: "Obligation Amount",
          value: "LegalObligationAmount",
          isCurrency: true
        }
      ],
      isDialog: false,
      removeIndex: -1
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "updateBorrower", "setEditingDerogatoryItem"]),
    editItem(index) {
      const derogatory = { ...this.derogatories[index] };
      this.setEditingDerogatoryItem({ derogatory, index });
      this.toggleIsOnlay({ onlayComponent: "editDerogatoryItem", isOnlay: true });
    },
    setRemoveIndex(index) {
      this.removeIndex = index;
      this.isDialog = true;
    },
    removeDerogatory() {
      const updated = this.derogatories.filter(
        (item, index) => index !== this.removeIndex
      );
      this.updateBorrower({ prop: "PublicRecords", value: updated });
      this.isDialog = false;
    },
    getFormattedDate(date) {
      return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
    },
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    derogatories() {
      return this.borrower && this.borrower.PublicRecords
        ? this.borrower.PublicRecords
        : [];
    },
    totalObligationAmount() {
      if (this.derogatories.length) {
        return this.derogatories.reduce(
          (acc, cur) =>
            acc +
            (!isNaN(cur.LegalObligationAmount)
              ? +cur.LegalObligationAmount
              : 0),
          0
        );
      }
      return 0;
    }
  },
  watch: {
    isDialog: function(val) {
      if (!val) {
        this.removeIndex = -1;
      }
    },
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
@import "@/assets/styles/credit/liabilityMobileTable.scss";
</style>
