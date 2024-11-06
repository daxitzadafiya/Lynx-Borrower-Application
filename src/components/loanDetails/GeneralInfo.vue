<template lang="pug">
    v-card.pb-1
        v-card-title General Loan Info
        v-card-text
            v-row.ma-0.pa-0.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Loan Amount
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense
                        :value="getFormattedValue(loan.LoanAmount) || ''"
                        @input="(e) => setLoanPop('LoanAmount' ,+e.replace(/,/g, ''))"
                        placeholder="Loan Amount"
                        hide-details
                        min="0"
                        prefix="$"
                        @keypress="(e) => isOnlyNum(e, true)"
                        style="max-width:300px; max-height:33px"
                        )
            v-row.ma-0.pa-0.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Application Received Date
                v-col.pa-1(lg="10" cols="6")
                    v-menu(
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        v-model="isAppRecievedDateMenu"
                        )
                        template(v-slot:activator="{ on }")
                            v-text-field(
                                label="Application Received Date"
                                :value="formattedDate(loan.ApplicationReceivedDate)"
                                prepend-icon="date_range"
                                readonly
                                v-on="on"
                                style="max-width:300px !important"
                                hide-details
                                )
                        v-date-picker(
                            :value="loan.ApplicationReceivedDate"
                            @input="(date) => setDate(date, 'ApplicationReceivedDate')"
                            )
            v-row.ma-0.pa-0.flex-wrap            
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Estimated Closing Date
                v-col.pa-1(lg="10" cols="6")
                    v-menu(
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        v-model="isClosingDateMenu"
                        )
                        template(v-slot:activator="{ on }")
                            v-text-field(
                                label="Estimated Closing Date"
                                :value="formattedDate(loan.EstimatedClosingDate)"
                                prepend-icon="date_range"
                                readonly
                                v-on="on"
                                style="max-width:300px !important"
                                hide-details
                                )
                        v-date-picker(
                            :value="loan.EstimatedClosingDate"
                            @input="(date) => setDate(date, 'EstimatedClosingDate')"
                            )              
            v-row.ma-0.pa-0.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Owner of existing Mortgage
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(dense
                        clearable
                        :items="holderTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Owner of existing Mortgage" 
                        :value="loan.CurrentFirstMortgageHolderType"
                        @change="(value) => setLoanPop('CurrentFirstMortgageHolderType', value)"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )
            v-row.ma-0.pa-0.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Number of Financed Properties
                v-col.pa-1(lg="10" cols="6")
                    v-text-field.mx-1.my-0(
                        dense
                        :value="loan.TotalMortgagedPropertiesCount"
                        @input="(e) => setLoanPop('TotalMortgagedPropertiesCount', +e)"
                        placeholder="Number of Financed Properties"
                        hide-details
                        type="number"
                        min="0"
                        style="max-width:300px; max-height:33px"
                        )
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Button from "@/components/buttons/Button";
import moment from "moment";
import currencyFormat from "@/mixins/currencyFormat.js";
import onlyNum from "@/mixins/onlyNum.js";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      isAppRecievedDateMenu: false,
      isClosingDateMenu: false,
      takenTypes: [
        {
          text: "Email",
          value: "Email"
        },
        {
          text: "Face To Face",
          value: "FaceToFace"
        },
        {
          text: "Fax",
          value: "Fax"
        },
        {
          text: "Internet",
          value: "Internet"
        },
        {
          text: "Mail",
          value: "Mail"
        },
        {
          text: "Telephone",
          value: "Telephone"
        }
      ],
      holderTypes: [
        {
          text: "FNMA",
          value: "FNMA"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan", "updateBorrower", "saveLoanPatches"]),
    formattedDate(date) {
      return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
    },
    setDate(date, prop) {
      this.setCurrentLoan({
        ...this.loan,
        [prop]: moment(date).format("YYYY-MM-DD")
      });
      this.isAppRecievedDateMenu = false;
      this.isClosingDateMenu = false;
    },
    setLoanPop(prop, value) {
      this.setCurrentLoan({ ...this.loan, [prop]: value });
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower",
      loan: "getCurrentLoan"
    })
  },
  components: {
    Button
  }
};
</script>
