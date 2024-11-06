<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter at least one telephone number where we may contact you
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input
          inputTitle="Cell Phone"
          :value="formattedMobilePhone"
          pattern="[0-9]*"
          inputmode="tel"
          hint="Example (999)999-9999"
          @input="
            e =>
              $emit('updateBorrower', { prop: 'MobilePhoneNumber', value: e })
          "
          @keypress="e => validatePhone(e)"
          :rules="[value => !!value || 'Cell Phone is required.']"
          :isRequired="true"
        />
        <Input
          inputTitle="Home Phone"
          :value="formattedHomePhone"
          pattern="[0-9]*"
          inputmode="tel"
          hint="Example (999)999-9999"
          @input="
            e => $emit('updateBorrower', { prop: 'HomePhoneNumber', value: e })
          "
          @keypress="e => validatePhone(e)"
        />
        <Input
          inputTitle="Work Phone"
          :value="formattedWorkPhone"
          inputmode="tel"
          pattern="[0-9]*"
          hint="Example (999)999-9999"
          @input="
            e => $emit('updateBorrower', { prop: 'WorkPhoneNumber', value: e })
          "
          @keypress="e => validatePhone(e)"
        />
        <div class="itemContainer d-flex gray3-text mt-3">
          <v-checkbox
            class="tcpa-checkbox"
            :input-value="currentBorrower.TcpaConsent"
            @change="
              e => $emit('updateBorrower', { prop: 'TcpaConsent', value: !!e })
            "
          >
          </v-checkbox>
          <div class="text-container">
            <span
              >I agree that I have read, understood and consent to the company's
              TCPA Communication Policy. <br class="reviewPolicyBreak" />Click
              <a @click="toggleModal">here</a> to review the policy.</span
            >
          </div>
        </div>
      </v-row>
      <v-dialog v-model="isModalOpen" width="700" scrollable="scrollable">
        <TcpaPolicy @closeDialog="isModalOpen = false"></TcpaPolicy>
      </v-dialog>
      <div class="navigation-container">
        <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import phoneFormat from "@/mixins/phoneFormat.js";
import TcpaPolicy from "./TcpaPolicy";

export default {
  mixins: [onlyNum, phoneFormat],
  props: {
    currentBorrower: {
      type: Object
    }
  },
  data() {
    return {
      mobilePhone: "",
      isModalOpen: false
    };
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    validatePhone(e) {
      if (e.target.value.length === 14) {
        e.preventDefault();
        return false;
      }
      return this.isOnlyNum(e);
    }
  },
  computed: {
    tcpaConsent() {
      return (
        this.currentBorrower.TcpaConsent &&
        this.currentBorrower.MobilePhoneNumber &&
        this.currentBorrower.MobilePhoneNumber.length > 0
      );
    },
    formattedMobilePhone() {
      if (this.currentBorrower.MobilePhoneNumber) {
        return this.getFormattedPhone(this.currentBorrower.MobilePhoneNumber);
      }
      return "";
    },
    formattedHomePhone() {
      if (this.currentBorrower.HomePhoneNumber) {
        return this.getFormattedPhone(this.currentBorrower.HomePhoneNumber);
      }
      return "";
    },
    formattedWorkPhone() {
      if (this.currentBorrower.WorkPhoneNumber) {
        return this.getFormattedPhone(this.currentBorrower.WorkPhoneNumber);
      }
      return "";
    },
    isNextDisabled() {
      return !this.isPhoneValid || !this.tcpaConsent;
    },
    isPhoneValid() {
      return (
        this.currentBorrower.MobilePhoneNumber &&
        this.currentBorrower.MobilePhoneNumber.length === 10
      );
    }
  },
  components: {
    TcpaPolicy
  },
  mounted() {
    this.mobilePhone = this.currentBorrower.MobilePhoneNumber || "";
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
@import "@/assets/styles/colors";
.text-container {
  display: flex;
  justify-content: flex-start;
  font-weight: 500;
  color: $gray3;
}

.tcpa-checkbox {
  margin: 0;
  padding: 0;
  margin-left: -3px;
}

.reviewPolicyBreak {
  @media (max-width: $tablet-width) {
    display: none;
  }
}
</style>
