<template>
  <v-card class="popup" mx-auto="mx-auto" light="light">
    <v-card-title class="popup__title dialog-header-back dialog-header-text"><span class="popup__title-text">Add Liability</span>
      <v-btn class="popup__close-wrapper" icon="icon" @click="toggleIsOnlay({isOnlay: false})">
        <v-icon class="popup__close" color="white">mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="popup__main text-black--text">
      <h3 class="infoText">Please select the reasons you are disputing this liability and provide any relevant explanations.</h3><br/>
      <v-form ref="form" lazy-validation="lazy-validation">
        <v-row class="form_container">
          <Input inputTitle="Company Name" outlined="outlined" dense="dense" v-model="liability.FullName" :rules="validation.required" required="required"></Input>
          <Input inputTitle="Ownership Type" defaultComponent="v-select" outlined="outlined" dense="dense" attach="attach" :items="liabilitiesOwnershipTypes" item-text="text" item-value="value" v-model="liability.OwnershipType" :rules="validation.required" required="required" :menu-props="{ bottom: true, offsetY: true }"></Input>
          <Input defaultComponent="v-select" inputTitle="Account Type" outlined="outlined" dense="dense" attach="attach" :items="liabilitiesAccountTypes" item-text="text" item-value="value" v-model="liability.LiabilityType" :rules="validation.required" required="required" :menu-props="{ bottom: true, offsetY: true }"></Input>
          <Input inputTitle="Account Number" outlined="outlined" dense="dense" v-model="liability.LiabilityAccountIdentifier" :rules="validation.required" required="required"></Input>
          <Input inputTitle="Monthly Payment" outlined="outlined" dense="dense" prefix="$" v-model="liability.LiabilityMonthlyPaymentAmount" @input="(e) => +e.replace(/,/g, '')" @keypress="(e) => isOnlyNum(e, true)"></Input>
          <Input prefix="$" inputTitle="Unpaid Balance" outlined="outlined" dense="dense" v-model="liability.LiabilityUnpaidBalanceAmount" @input="(e) => +e.replace(/,/g, '')" @keypress="(e) => isOnlyNum(e, true)" :rules="validation.required" required="required"></Input>
          <Input inputTitle="Remaining Term Months Count" outlined="outlined" dense="dense" v-model="liability.LiabilityRemainingTermMonthsCount" inputmode="numeric" pattern="[0-9]*" @keypress="(e) => isOnlyNum(e)"></Input>
          <v-col class="itemContainer mr-2" cols="12" sm="6">
            <v-checkbox class="defaultCheckbox" v-model="liability.LiabilityPayoffAtClosingStatusIndicator" color="primary" hide-details="hide-details" label="Payoff at Closing:"></v-checkbox>
          </v-col>
          <v-col class="itemContainer mr-2" cols="12" sm="6">
            <v-checkbox class="defaultCheckbox" v-model="liability.LiabilityPayoffStatusIndicator" color="primary" hide-details="hide-details" label="Payoff Prior to Closing:"></v-checkbox>
          </v-col>
          <v-col class="itemContainer mr-2" cols="12" sm="6">
            <v-checkbox class="defaultCheckbox" v-model="liability.LiabilityExclusionIndicator" color="primary" label="Omit:" hide-details="hide-details" :disabled="liability.LiabilityPayoffAtClosingStatusIndicator || liability.LiabilityPayoffStatusIndicator"></v-checkbox>
          </v-col>
          <v-col class="itemContainer mr-2" cols="12" sm="6">
            <v-checkbox class="defaultCheckbox" v-model="liability.LiabilityResubordinatedIndicator" :disabled="liability.LiabilityPayoffAtClosingStatusIndicator || liability.LiabilityPayoffStatusIndicator" color="primary" hide-details="hide-details" label="Resubordinated:"></v-checkbox>
          </v-col>
          <v-col class="itemContainer mr-2" cols="12" sm="6">
            <v-checkbox class="defaultCheckbox" v-model="liability.LiabilityDisputeIndicator" color="primary" hide-details="hide-details" label="Disputed:"></v-checkbox>
          </v-col>
          <template v-if="liability.LiabilityDisputeIndicator">
            <Input inputTitle="Dispute Reason" defaultComponent="v-select" attach="attach" :items="disputeReasons" item-text="text" item-value="value" v-model="liability.LiabilityDisputeReason" :menu-props="{ bottom: true, offsetY: true }"></Input>
            <Input inputTitle="Explanation" v-model="liability.LiabilityDisputeReasonExplanation" placeholder="Type here" :smVal="12"></Input>
          </template>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <div class="popup__button">
      <div class="popup_desktop-button">
        <Button value="OK" customClass="primary-button" @clicked="handleSubmit()"></Button>
      </div>
      <div class="popup_mobile-button">
        <Button value="OK" customClass="primary-button" width="200px" @clicked="handleSubmit()">  </Button>
      </div>
    </div>
  </v-card> 
</template>

<script>
import Button from "@/components/buttons/Button";
import onlyNum from "@/mixins/onlyNum.js";
import { mapActions, mapGetters } from "vuex";
import liability from "@/mixins/liability.js";

export default {
  mixins: [onlyNum, liability],
  data() {
    return {
      validation: {
        required: [v => !!v || "This field is required!"]
      },
      liability: {
        FullName: "",
        OwnershipType: "",
        LiabilityAccountIdentifier: "",
        LiabilityUnpaidBalanceAmount: "",
        LiabilityRemainingTermMonthsCount: "",
        LiabilityAccountType: "",
        LiabilityPayoffStatusIndicator: false,
        LiabilityExclusionIndicator: false,
        LiabilityResubordinatedIndicator: false,
        LiabilityDisputeIndicator: false,
        ManualEntry: true,
        LiabilityMonthlyPaymentAmount: null
      }
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "updateBorrower"]),
    handleSubmit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.liabilities.push(this.liability);
        this.updateBorrower({ prop: "Liabilities", value: this.liabilities });
        this.toggleIsOnlay({ isOnlay: false });
      }
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    liabilities() {
      return this.borrower && this.borrower.Liabilities
        ? this.borrower.Liabilities
        : [];
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
@import "@/assets/styles/colors.scss";

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

.infoText{
  color: gray3 !important
}

:deep(.v-input__slot){
  flex-direction: row-reverse;
}

.defaultCheckbox{
  margin-top: 0px !important;
  padding-top: 0px !important;
}
</style>
