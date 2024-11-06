<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        To complete your application it is necessary for us to obtain a credit
        report
      </div>
    </div>
    <div class="inner-content-container">
      <div class="mb-4 mr-5 gray3-text">
        Please enter the Date of Birth and Social Security Number(s) of each
        individual applying for credit on this application.
      </div>
      <v-row class="form-container">
        <v-col sm="5" md="4" cols="12">
          <div class="font-weight-bold mb-3">
            {{ borrower.FirstName }} {{ borrower.LastName }}
          </div>
          <v-row class="form-container">
            <DateInput
              :smVal="12"
              inputTitle="Date of Birth"
              :isRequired="true"
              @dateUpdated="updateBorrowerDate"
              @dateCleared="clearBorrowerDate"
              :value="selectedMainDate"
              :maxDate="maxDate"
            ></DateInput>
            <Input
              :smVal="12"
              :inputTitle="borrowerTaxLabel"
              :value="maskedSSN"
              @input="handleSSNInput"
              @focus="onSSNFocus"
              @blur="onSSNBlur"
              :isRequired="true"
              name="ssn"
              maxlength="11"
            />
            <v-col cols="12" sm="12">
              <v-radio-group
                class="radioGroup mt-1"
                column="column"
                hide-details="hide-details"
                :value="borrower.TaxpayerIdentifierType"
                @change="val => setTaxpayerIdentifierType(val, false)"
              >
                <v-radio
                  label="Social Security Number"
                  :value="'SocialSecurityNumber'"
                ></v-radio>
                <v-radio
                  label="Individual Taxpayer Identification Number"
                  :value="'IndividualTaxpayerIdentificationNumber'"
                >
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="5" md="4" cols="12" v-if="coBorrower">
          <div class="font-weight-bold mb-3">
            {{ coBorrower.FirstName }} {{ coBorrower.LastName }}
          </div>
          <v-row class="form-container">
            <DateInput
              :smVal="12"
              inputTitle="Date of Birth"
              @dateUpdated="updateCoBorrowerDate"
              @dateCleared="clearCoBorrowerDate"
              :value="selectedCoDate"
              :maxDate="maxDate"
            ></DateInput>
            <Input
              :smVal="12"
              :inputTitle="coTaxLabel"
              :value="maskedCoSSN"
              @input="handleCoSSNInput"
              @focus="onCoSSNFocus"
              @blur="onCoSSNBlur"
              :isRequired="true"
              name="co-ssn"
              maxlength="11"
            />
            <v-col cols="12" sm="12">
              <v-radio-group
                class="radioGroup mt-1"
                column="column"
                hide-details="hide-details"
                :value="
                  coBorrower == null ? null : coBorrower.TaxpayerIdentifierType
                "
                @change="
                  val => {
                    setTaxpayerIdentifierType(val, true);
                  }
                "
              >
                <v-radio
                  label="Social Security Number"
                  :value="'SocialSecurityNumber'"
                ></v-radio>
                <v-radio
                  label="Individual Taxpayer Identification Number"
                  :value="'IndividualTaxpayerIdentificationNumber'"
                >
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="d-flex mt-5">
        <v-checkbox
          class="tcpa-checkbox mt-0"
          :value="policyAccepted"
          @change="
            e => {
              policyAccepted = e;
            }
          "
        >
        </v-checkbox>
        <div class="text-container gray3-text">
          <span
            >By checking this box, I agree that I have read, understood, and
            consent to the company's policy regarding the collection and
            verification of information used in the processing of my application
            for a mortgage loan. Click <a @click="toggleModal">here</a> to
            review the policy.</span
          >
        </div>
      </div>
    </div>
    <v-dialog v-model="isModalOpen" width="700" scrollable="scrollable">
      <TcpaPolicy @closeDialog="isModalOpen = false"></TcpaPolicy>
    </v-dialog>
    <div class="navigation-container">
      <NavigationButtons
        :NextButtonText="buttonText"
        :ConditionsMet="isNextDisabled"
        :HasDefaultNavigation="false"
        :NextClicked="orderOrRedirect"
        :NextBtnWidth="'auto'"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import DateInput from "@/components/form/DateInput";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import TcpaPolicy from "@/components/borrowers/TcpaPolicy";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  data() {
    return {
      isMainMenu: false,
      isCoMenu: false,
      isMainTogglers: true,
      isCoTogglers: true,
      maxDate: null,
      isModalOpen: false,
      policyAccepted: false,
      localSSN: "",
      coLocalSSN: "",
      isFocused: false,
      isCoFocused: false
    };
  },
  methods: {
    ...mapActions([
      "updateBorrower",
      "updateBorrowers",
      "saveLoanPatches",
      "toggleIsOnlay",
      "getCreditOrders"
    ]),
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    updateBorrowerDate(date) {
      if (this.selectedBorrower.Id === this.borrower.Id) {
        return this.updateBorrower({
          prop: "BorrowerBirthDate",
          value: date != null ? moment(date).format("YYYY-MM-DD") : null
        });
      }
      this.updateAllBorrowers(date, this.borrower.Id);
    },
    updateCoBorrowerDate(date) {
      if (this.selectedBorrower.Id === this.coBorrower.Id) {
        return this.updateBorrower({
          prop: "BorrowerBirthDate",
          value: date != null ? moment(date).format("YYYY-MM-DD") : null
        });
      }
      this.updateAllBorrowers(date, this.coBorrower.Id);
    },
    updateAllBorrowers(date, id) {
      const updatedBorrowers = this.borrowers.map(item =>
        item.Id !== id
          ? item
          : {
              ...item,
              BorrowerBirthDate:
                date != null ? moment(date).format("YYYY-MM-DD") : null
            }
      );
      this.updateBorrowers(updatedBorrowers);
    },
    setBorrowerTaxId(value, isCo) {
      const id = isCo ? this.coBorrower.Id : this.borrower.Id;
      if (this.selectedBorrower.Id === id) {
        return this.updateBorrower({
          prop: "TaxpayerIdentifierValue",
          value: value
        });
      }
      const updatedBorrowers = this.borrowers.map(item =>
        item.Id !== id ? item : { ...item, TaxpayerIdentifierValue: value }
      );
      this.updateBorrowers(updatedBorrowers);
    },
    setTaxpayerIdentifierType(value, isCo) {
      const borrowerId = !isCo ? this.borrower.Id : this.coBorrower.Id;
      if (borrowerId) {
        const updated = this.borrowers.map(item =>
          item.Id !== borrowerId
            ? item
            : { ...item, TaxpayerIdentifierType: value }
        );
        this.updateBorrowers(updated);
      } else {
        this.updateBorrower({ prop: "TaxpayerIdentifierType", value });
      }
    },
    async orderOrRedirect() {
      if (this.buttonText === "Order Credit Report") {
        this.setCreditType();
        await this.saveLoanPatches();
        this.toggleIsOnlay({ isOnlay: true, onlayComponent: "creditOrder" });
      } else {
        this.saveAndAdvance(true, "credit/score-and-accounts-review");
      }
    },
    setCreditType() {
      if (!this.selectedBorrower || !this.selectedBorrower.Id) return;
      const CreditType = this.coBorrower ? "Joint" : "Individual";
      const updatedBorrowers = this.borrowers.map(item => {
        if (
          item.Id === this.borrower.Id ||
          (this.coBorrower && item.Id === this.coBorrower.Id)
        ) {
          item.CreditType = CreditType;
        }
        return item;
      });
      this.updateBorrowers(updatedBorrowers);
    },
    setInitialTaxType() {
      const { CitizenshipResidencyType } = this.borrower;
      if (
        CitizenshipResidencyType &&
        CitizenshipResidencyType !== "NonPermanentResidentAlien"
      ) {
        this.setTaxpayerIdentifierType("SocialSecurityNumber", false);
        this.isMainTogglers = false;
      }
      if (this.coBorrower) {
        const { CitizenshipResidencyType } = this.coBorrower;
        if (
          CitizenshipResidencyType &&
          CitizenshipResidencyType !== "NonPermanentResidentAlien"
        ) {
          this.setTaxpayerIdentifierType("SocialSecurityNumber", true);
          this.isCoTogglers = false;
        }
      }
    },
    clearBorrowerDate() {
      this.updateBorrowerDate(null);
      this.isMainMenu = false;
    },
    clearCoBorrowerDate() {
      this.updateCoBorrowerDate(null);
      this.isCoMenu = false;
    },
    handleSSNInput(value) {
      const cleanValue = value.replace(/\D/g, "").slice(0, 9);
      this.localSSN = cleanValue;

      this.setBorrowerTaxId(cleanValue, false);
    },
    formatSSN(ssn) {
      if (ssn.length <= 3) {
        return ssn;
      } else if (ssn.length <= 5) {
        return ssn.slice(0, 3) + "-" + ssn.slice(3);
      } else {
        return ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-" + ssn.slice(5);
      }
    },
    maskSSN(ssn) {
      if (ssn.length <= 3) {
        return ssn;
      } else if (ssn.length <= 5) {
        return ssn.slice(0, 3) + "-" + ssn.slice(3);
      } else {
        return ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-****";
      }
    },
    onSSNFocus() {
      this.isFocused = true;
    },
    onSSNBlur() {
      this.isFocused = false;
    },
    handleCoSSNInput(value) {
      const cleanValue = value.replace(/\D/g, "").slice(0, 9);
      this.coLocalSSN = cleanValue;
      this.setBorrowerTaxId(cleanValue, true);
    },
    onCoSSNFocus() {
      this.isCoFocused = true;
    },
    onCoSSNBlur() {
      this.isCoFocused = false;
    }
  },
  computed: {
    ...mapGetters({
      borrowers: "getBorrowers",
      selectedBorrower: "getBorrower",
      orders: "getLoadedCreditOrders"
    }),
    isNextDisabled() {
      return (
        !this.policyAccepted ||
        this.borrower.BorrowerBirthDate == null ||
        isNaN(new Date(this.borrower.BorrowerBirthDate)) ||
        this.borrower.TaxpayerIdentifierValue == null ||
        /[^\d]/.test(this.borrower.TaxpayerIdentifierValue) ||
        this.borrower.TaxpayerIdentifierValue.length !== 9 ||
        (this.coBorrower != null &&
          (this.coBorrower.BorrowerBirthDate == null ||
            isNaN(new Date(this.coBorrower.BorrowerBirthDate)) ||
            this.coBorrower.TaxpayerIdentifierValue == null ||
            /[^\d]/.test(this.coBorrower.TaxpayerIdentifierValue) ||
            this.coBorrower.TaxpayerIdentifierValue.length !== 9))
      );
    },
    selectedMainDate() {
      return this.borrower && this.borrower.BorrowerBirthDate
        ? this.borrower.BorrowerBirthDate
        : this.maxDate;
    },
    selectedCoDate() {
      return this.coBorrower && this.coBorrower.BorrowerBirthDate
        ? this.coBorrower.BorrowerBirthDate
        : this.maxDate;
    },
    borrower() {
      if (this.selectedBorrower && !this.selectedBorrower.CoBorrower)
        return this.selectedBorrower;
      if (this.borrowers.length) {
        return this.borrowers.find(
          item =>
            item.LinkedBorrowerId === this.selectedBorrower.Id &&
            !item.CoBorrower
        );
      }
      return { TaxpayerIdentifierType: "SocialSecurityNumber" };
    },
    coBorrower() {
      if (this.selectedBorrower && this.selectedBorrower.CoBorrower)
        return this.selectedBorrower;
      if (this.borrowers.length) {
        return this.borrowers.find(
          item =>
            item.CoBorrower &&
            (this.selectedBorrower.Id === item.Id ||
              this.selectedBorrower.Id === item.LinkedBorrowerId)
        );
      }
      return null;
    },
    coDate() {
      return this.selectedCoDate
        ? moment(new Date(this.selectedCoDate)).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");
    },
    buttonText() {
      if (!this.borrower || !this.borrower.Id) return "Next";
      if (this.orders && this.orders.length) {
        const borrowerOrder = this.orders.find(
          item => item.BorrowerId === this.borrower.Id
        );
        return !borrowerOrder ? "Order Credit Report" : "Next";
      }
      if (this.borrower && !this.orders) {
        return "Order Credit Report";
      }
      return "Next";
    },
    borrowerTaxLabel() {
      return this.borrower.TaxpayerIdentifierType === "SocialSecurityNumber"
        ? "Social Security Number"
        : "Taxpayer Identification Number";
    },
    coTaxLabel() {
      return this.coBorrower &&
        this.coBorrower.TaxpayerIdentifierType === "SocialSecurityNumber"
        ? "Social Security Number"
        : "Taxpayer Identification Number";
    },
    maskedSSN() {
      const formattedSSN = this.formatSSN(this.localSSN);
      if (this.isFocused) {
        return formattedSSN;
      } else {
        return this.maskSSN(this.localSSN);
      }
    },
    maskedCoSSN() {
      const formattedSSN = this.formatSSN(this.coLocalSSN);
      if (this.isCoFocused) {
        return formattedSSN;
      } else {
        return this.maskSSN(this.coLocalSSN);
      }
    }
  },
  components: {
    DateInput,
    TcpaPolicy
  },
  created() {
    var date = new Date();
    this.maxDate = new Date(date.setFullYear(date.getFullYear() - 18))
      .toISOString()
      .slice(0, 10);
    this.getCreditOrders();
  },
  mounted() {
    if (!this.borrower.TaxpayerIdentifierType) {
      this.setTaxpayerIdentifierType("SocialSecurityNumber", false);
    }
    if (this.coBorrower && !this.coBorrower.TaxpayerIdentifierType) {
      this.setTaxpayerIdentifierType("SocialSecurityNumber", true);
    }
    this.setCreditType();
    this.setInitialTaxType();
  },
  watch: {
    "borrower.TaxpayerIdentifierValue": {
      immediate: true,
      handler(newValue) {
        this.localSSN = newValue || "";
      }
    },
    "coBorrower.TaxpayerIdentifierValue": {
      immediate: true,
      handler(newValue) {
        this.coLocalSSN = newValue || "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors";

.radioGroup {
  margin-left: -4px;
  :deep(label) {
    font-size: 15px;
    line-height: 22px;
    color: $gray2 !important;
  }
}
</style>
