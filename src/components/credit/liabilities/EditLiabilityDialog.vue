<template lang="pug">
    v-card.popup(mx-auto light)
        v-card-title.popup__title.dialog-header-back.dialog-header-text
            span.popup__title-text Credit Liability Review
            v-btn.popup__close-wrapper(icon @click="toggleIsOnlay({isOnlay: false})")
                v-icon.popup__close(color="white") mdi-close
        v-card-text.popup__main.text-black--text
            h3 Please select the reasons you are disputing this liability and provide any relevant explanations.
            br
            v-row.popup__row
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Company Name"
                        outlined  
                        dense
                        :value="liability.FullName"
                        @input="(e) => updateLiability(e, 'FullName')"
                        )
                v-col.popup__col(sm="5" cols="12")
                    v-select(
                          label="Ownership Type"
                          outlined  
                          dense
                          attach=true
                          :items="liabilitiesOwnershipTypes"
                          item-text="text"
                          item-value="value"
                          :value="liability.OwnershipType"
                          @input="(e) => updateLiability(e, 'OwnershipType')"
                          required
                          :menu-props="{ bottom: true, offsetY: true }"
                         )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="12")
                    v-select(
                          label="Account Type"
                          outlined  
                          dense
                          attach=true
                          :items="liabilitiesAccountTypes"
                          item-text="text"
                          item-value="value"
                          :value="liability.LiabilityType"
                          @input="(e) => updateLiability(e, 'LiabilityType')"
                          required
                          :menu-props="{ bottom: true, offsetY: true }"
                         )
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Account Number"
                        outlined  
                        dense
                        :value="liability.LiabilityAccountIdentifier"
                        @input="(e) => updateLiability(e, 'LiabilityAccountIdentifier')"
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Monthly Payment"
                        outlined  
                        dense
                        prefix="$"
                        :value="getFormattedValue(liability.LiabilityMonthlyPaymentAmount)"
                        @input="(e) => updateLiability(+e.replace(/,/g, ''), 'LiabilityMonthlyPaymentAmount')"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
                v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        prefix="$"
                        label="Unpaid Balance"
                        outlined  
                        dense
                        :value="getFormattedValue(liability.LiabilityUnpaidBalanceAmount)"
                        @input="(e) => updateLiability(+e.replace(/,/g, ''), 'LiabilityUnpaidBalanceAmount')"
                        @keypress="(e) => isOnlyNum(e, true)"
                        )
            v-row.popup__row
              v-col.popup__col(sm="5" cols="12")
                    v-text-field(
                        label="Remaining Term Months Count"
                        outlined  
                        dense
                        :value="liability.LiabilityRemainingTermMonthsCount"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        @input="(e) => updateLiability(e, 'LiabilityRemainingTermMonthsCount')"
                        @keypress="(e) => isOnlyNum(e)"
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="8") Payoff at Closing:
                v-col.popup__col(sm="3" cols="3")
                    v-simple-checkbox(
                        :value="liability.LiabilityPayoffAtClosingStatusIndicator" 
                        color='primary' 
                        ripple=false
                        @input="setBooleanProperty('LiabilityPayoffAtClosingStatusIndicator')"
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="8") Payoff Prior to Closing:
                v-col.popup__col(sm="3" cols="3")
                    v-simple-checkbox(
                        :value="liability.LiabilityPayoffStatusIndicator" 
                        color='primary' 
                        ripple=false
                        @input="setBooleanProperty('LiabilityPayoffStatusIndicator')"
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="8") Omit:
                v-col.popup__col(sm="3" cols="3")
                    v-simple-checkbox(
                        :value="liability.LiabilityExclusionIndicator" 
                        color='primary' 
                        ripple=false
                        :disabled="liability.LiabilityPayoffAtClosingStatusIndicator || liability.LiabilityPayoffStatusIndicator"
                        @input="setBooleanProperty('LiabilityExclusionIndicator')"
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="8") Resubordinated:
                v-col.popup__col(sm="3" cols="3")
                    v-simple-checkbox(
                        :value="liability.LiabilityResubordinatedIndicator" 
                        color='primary' 
                        ripple=false
                        :disabled="liability.LiabilityPayoffAtClosingStatusIndicator || liability.LiabilityPayoffStatusIndicator"
                        @input="setBooleanProperty('LiabilityResubordinatedIndicator')"
                        )
            v-row.popup__row
                v-col.popup__col(sm="5" cols="8") Disputed:
                v-col.popup__col(sm="3" cols="3")
                    v-simple-checkbox(
                        :value="liability.LiabilityDisputeIndicator" 
                        color='primary' 
                        ripple=false
                        @input="setBooleanProperty('LiabilityDisputeIndicator')"
                        )
            template(v-if="liability.LiabilityDisputeIndicator")
                v-row.popup__row
                    v-col.popup__col(sm="6" cols="12")
                          v-select(
                              label="Dispute Reason"
                              attach=true
                              :items="disputeReasons"
                              item-text="text",
                              item-value="value"
                              :menu-props="{ bottom: true, offsetY: true }"
                              :value="liability.LiabilityDisputeReason ? liability.LiabilityDisputeReason.replace(/([a-z])([A-Z])/g, '$1 $2') : ''"
                              @input="(e) => updateLiability(e.replace(/ /g, ''), 'LiabilityDisputeReason')"
                              )
                v-row.popup__row
                    v-col.popup__col(cols="12")
                        v-text-field(
                            label="Explanation"
                            :value="liability.LiabilityDisputeReasonExplanation"
                            placeholder="Type here"
                            @input="(e) => updateLiability(e, 'LiabilityDisputeReasonExplanation')"
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
import liability from "@/mixins/liability.js";

export default {
  mixins: [onlyNum, currencyFormat, liability],
  data() {
    return {
      reasons: [
        "Not My Acccount",
        "Fraud",
        "Incorrect Balance",
        "Account Closed",
        "Co-Signer Only",
        "Incorrect Payment",
        "Other"
      ]
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "updateBorrower"]),
    updateLiability(value, prop) {
      const Liabilities = this.borrower.Liabilities.map((item, i) =>
        i !== this.editingIndex ? item : { ...item, [prop]: value }
      );
      this.updateBorrower({ prop: "Liabilities", value: Liabilities });
    },
    setBooleanProperty(boolProp) {
      const Liabilities = this.borrower.Liabilities.map((item, i) =>
        i !== this.editingIndex
          ? item
          : { ...item, [boolProp]: !item[boolProp] }
      );
      this.updateBorrower({ prop: "Liabilities", value: Liabilities });
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower",
      editingIndex: "getEditingLiabilityIndex"
    }),
    liability() {
      return this.borrower && this.borrower.Liabilities
        ? this.borrower.Liabilities[this.editingIndex]
        : {};
    }
  },
  components: {
    Button
  },
  watch: {
    "liability.LiabilityPayoffStatusIndicator": function(e) {
      if (this.liability.LiabilityPayoffAtClosingStatusIndicator && e) {
        this.liability.LiabilityPayoffAtClosingStatusIndicator = false;
      }
    },
    "liability.LiabilityPayoffAtClosingStatusIndicator": function(e) {
      if (this.liability.LiabilityPayoffStatusIndicator && e) {
        this.liability.LiabilityPayoffStatusIndicator = false;
      }
    }
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
  &__col {
    padding-bottom: 0;
  }
}

@media (max-width: 760px) {
  .popup {
    &__col {
      padding-bottom: 0;
    }
  }
}
</style>
