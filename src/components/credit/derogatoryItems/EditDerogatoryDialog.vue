<template lang="pug">
    v-card.popup(mx-auto light)
        v-card-title.popup__title.dialog-header-back.dialog-header-text
            span.popup__title-text Derogatory Item Review
            v-btn.popup__close-wrapper(icon @click="toggleIsOnlay({isOnlay: false})")
                v-icon.popup__close(color="white") mdi-close
        v-card-text.popup__main.text-black--text
            v-row.popup__row
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Source"
                        :value="derogatory.Source"
                        disabled
                        outlined
                        dense
                        )
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Docker Identifier"
                        :value="derogatory.DocketIdentifier"
                        disabled
                        outlined
                        dense
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Action"
                        :value="derogatory.RecordType"
                        disabled
                        outlined
                        dense
                        )
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Reported Date"
                        :value="getFormattedDate(derogatory.ReportedDate)"
                        disabled
                        outlined
                        dense
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Disposition"
                        :value="derogatory.DispositionType"
                        disabled
                        outlined
                        dense
                        )
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Disposition Date"
                        :value="getFormattedDate(derogatory.DispositionDate)"
                        disabled
                        outlined
                        dense
                        )
            v-row.popup__row
              v-col.popup__col(sm="5" cols="12")
                  v-text-field(
                      label="Ownership"
                      :value="derogatory.OwnershipType"
                      disabled
                      outlined
                      dense
                      )
              v-col.popup__col(sm="5" cols="12")
                  v-text-field(
                      label="Obligation Amount"
                      :value="'$'+getFormattedValue(derogatory.LegalObligationAmount)"
                      disabled
                      outlined
                      dense
                      )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="8") I Dispute this Item:
                v-col.popup__col(sm="3" cols="3")
                    v-simple-checkbox(
                        :value="derogatory.BorrowerDisputesItem" 
                        color='primary' 
                        ripple=false
                        @input="setBooleanProperty('BorrowerDisputesItem')"
                        outlined
                        dense
                        )
            v-row.popup__row(v-if="derogatory.BorrowerDisputesItem")
                v-col.popup__col(cols="12")
                    v-text-field(
                        label="Explanation"
                        :value="derogatory.BorrowerExplanation"
                        placeholder="Type here"
                        @input="(e) => updateDerogatoryItem(e, 'BorrowerExplanation')"
                        outlined
                        dense
                        )
        v-divider
        .popup__button
            .popup_desktop-button
                Button(value="OK" customClass="primary-button" @clicked="toggleIsOnlay({isOnlay: false})")
            .popup_mobile-button
                Button(value="OK" customClass="primary-button" width="200px" @clicked="toggleIsOnlay({isOnlay: false})")    
</template>

<script>
import Button from "@/components/buttons/Button";
import currencyFormat from "@/mixins/currencyFormat.js";
import onlyNum from "@/mixins/onlyNum.js";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "updateBorrower"]),
    updateDerogatoryItem(value, prop) {
      const DerogatoryItems = this.borrower.PublicRecords.map((item, i) =>
        i !== this.editingIndex ? item : { ...item, [prop]: value }
      );
      this.updateBorrower({ prop: "PublicRecords", value: DerogatoryItems });
    },
    setBooleanProperty(boolProp) {
      const DerogatoryItems = this.borrower.PublicRecords.map((item, i) =>
        i !== this.editingIndex
          ? item
          : { ...item, [boolProp]: !item[boolProp] }
      );
      this.updateBorrower({ prop: "PublicRecords", value: DerogatoryItems });
    },
    getFormattedDate(date) {
      return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
    },
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower",
      editingIndex: "getEditingDerogatoryItemIndex"
    }),
    derogatory() {
      return this.borrower && this.borrower.PublicRecords
        ? this.borrower.PublicRecords[this.editingIndex]
        : {};
    }
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/popup.scss";

.popup {
  width: 720px;
  &__row {
    justify-content: flex-start;
  }
}

@media (max-width: 760px) {
  .popup {
    &__col {
      padding-bottom: 0;
    }
  }
}
:deep(.v-input--is-disabled) {
  input {
    color: black;
  }
}
</style>
