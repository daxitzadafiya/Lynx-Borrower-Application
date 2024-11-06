<template>
  <div class="fill-height lenderloan" v-if="currentLoan">
    <v-row>
      <v-col class="d-flex justify-start flex-wrap">
        <div class="d-flex flex-column" id="B-01">
          <p class="font-italic body-2 mb-0">
            To be completed by the
            <span class="font-weight-medium">Lender</span>
          </p>

          <p class="body-2 align-self-end">
            Lender Loan No./Universal Loan Identifier
          </p>
        </div>
        <!-- <loan-tooltip id="B-01"></loan-tooltip> -->

        <v-select
          light
          dense
          class="mt-0 pt-0 mx-3 align-self-end"
          :items="loanIdentifierTypes"
          item-text="text"
          item-value="value"
          placeholder="Loan Type"
          :value="model.LoanIdentifierType"
          :menu-props="{ light: true }"
          @change="
            value =>
              setCurrentLoan({ ...currentLoan, LoanIdentifierType: value })
          "
        >
        </v-select>
        <v-text-field
          light
          class="mt-0 pt-0 mx-3 align-self-end"
          dense
          placeholder="Loan Identifier"
          :value="model.LoanIdentifier"
          id="B-03"
          @input="
            value => setCurrentLoan({ ...currentLoan, LoanIdentifier: value })
          "
        >
        </v-text-field>
        <!-- <loan-tooltip id="B-03"></loan-tooltip> -->

        <p class="body-2 align-self-end" id="B-02">Agency Case No.</p>
        <v-text-field
          light
          placeholder="Agency Case No."
          class="mt-0 pt-0 mx-3 align-self-end"
          dense
          :value="model.AgencyCaseIdentifier"
          @input="
            value =>
              setCurrentLoan({ ...currentLoan, AgencyCaseIdentifier: value })
          "
          >>
        </v-text-field>
        <!-- <loan-tooltip id="B-02"></loan-tooltip> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col class="loan-border-top-3">
        <p class="display-1 font-weight-black">
          Uniform Residental Loan Application - Lender Loan Application
        </p>
        <p>This section is completed by your Lender.</p>
      </v-col>
    </v-row>
    <property-and-loan-info :model="currentLoan" />
    <title-info :model="currentLoan" />
    <mortgage-loan-info :model="currentLoan" />
    <qualifying-the-borrower :model="currentLoan" />
    <Button value="Save" @clicked="saveLoanPatches" />
  </div>
</template>

<script>
import PropertyAndLoanInfo from "@/components/lenderLoanInfo/PropertyAndLoanInfo.vue";
import TitleInfo from "@/components/lenderLoanInfo/TitleInfo.vue";
import MortgageLoanInfo from "@/components/lenderLoanInfo/MortgageLoanInfo.vue";
import QualifyingTheBorrower from "@/components/lenderLoanInfo/QualifyingTheBorrower.vue";
import Button from "@/components/buttons/Button";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      loanIdentifierTypes: [
        {
          text: "Agency Case",
          value: "AgencyCase"
        },
        {
          text: "Lender Loan",
          value: "LenderLoan"
        },
        {
          text: "Universal Loan",
          value: "UniversalLoan"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["saveLoanPatches", "setCurrentLoan"])
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    }),
    model() {
      return this.currentLoan || {};
    }
  },
  components: {
    PropertyAndLoanInfo,
    TitleInfo,
    MortgageLoanInfo,
    QualifyingTheBorrower,
    Button
  },
  mounted() {
    if (!this.currentLoan) this.$router.push("/borrowers");
  }
};
</script>

<style lang="scss">
.lenderloan {
  padding: 0 20px;
  p,
  span,
  .v-input,
  .v-label {
    font-size: 13px !important;
  }

  .loan-form-chapter {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    padding-top: 2px;
    padding-bottom: 1px;
  }

  .loan-grey-bg {
    background-color: #eee !important;
  }

  .loan-white-bg {
    background-color: white !important;
  }

  .loan-border-top-3 {
    border-top: 3px solid black !important;
  }
  .loan-border-top {
    border-top: thin solid black !important;
  }

  .loan-border-left {
    border-left: thin solid black !important;
  }

  .loan-border-right {
    border-right: thin solid black !important;
  }

  .loan-border-bottom {
    border-bottom: thin solid black !important;
  }

  .loan-border-x {
    border-left: thin solid black !important;
    border-right: thin solid black !important;
  }

  .loan-border-y {
    border-top: thin solid black !important;
    border-bottom: thin solid black !important;
  }

  .loan-border-a {
    border: thin solid black !important;
  }
  .button {
    margin: 20px 0 10px;
  }
  @media (max-width: 1024px) {
    margin-top: 55px;
  }
}
</style>
