<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please review the existing mortgage details for
        {{ currentRealEstate.AddressLineText || "this property" }} and make any necessary
        corrections
      </div>
    </div>
    <div class="inner-content-container">
      <v-data-table
        :class="{
          'content-table': true,
          emptyTable: loans.length === 0,
          doubleActions: true,
        }"
        :headers="headers"
        :items="loans"
        disable-sort="disable-sort"
        disable-pagination="disable-pagination"
        hide-default-footer="hide-default-footer"
        :mobile-breakpoint="0"
      >
        <template v-slot:item.LiabilityMonthlyPaymentAmount="{ item }"
          ><span
            >${{ getFormattedValue(item.LiabilityMonthlyPaymentAmount) || 0 }}</span
          ></template
        >
        <template v-slot:item.LiabilityUnpaidBalanceAmount="{ item }"
          ><span
            >${{ getFormattedValue(item.LiabilityUnpaidBalanceAmount) || 0 }}</span
          ></template
        >
        <template v-slot:item.LiabilityCreditLimit="{ item }"
          ><span>${{ getFormattedValue(item.LiabilityCreditLimit) || 0 }}</span></template
        >
        <template v-slot:item.LiabilityPayoffStatusIndicator="{ item, index }">
          <v-checkbox
            :input-value="item.LiabilityPayoffStatusIndicator"
            color="primary"
            dense
            hide-details
            @change="
              (value) =>
                setMortgageLoan({
                  value,
                  loanIndex: index,
                  prop: 'LiabilityPayoffStatusIndicator',
                })
            "
          ></v-checkbox>
        </template>
        <template
          v-slot:item.LiabilityPaymentIncludesTaxesInsuranceIndicator="{ item, index }"
        >
          <v-checkbox
            :input-value="item.LiabilityPaymentIncludesTaxesInsuranceIndicator"
            color="primary"
            dense
            hide-details
            @change="
              (value) =>
                setMortgageLoan({
                  value,
                  loanIndex: index,
                  prop: 'LiabilityPaymentIncludesTaxesInsuranceIndicator',
                })
            "
          ></v-checkbox>
        </template>
        <template v-slot:item.edit="{ item }">
          <div class="d-flex actionsContainer">
            <v-btn class="editIcon" icon="icon" small="small" @click="editItem(item)">
              <inline-svg :src="editIcon"></inline-svg>
            </v-btn>
            <v-btn
              class="deleteIcon"
              icon="icon"
              small="small"
              @click="setRemoveIndex(item)"
            >
              <inline-svg :src="deleteIcon"></inline-svg>
            </v-btn>
          </div>
        </template>
        <template v-slot:body.append>
          <tr class="appended-row">
            <td class="addItemBtnContainer">
              <v-btn
                class="addItemBtn"
                dense="dense"
                plain="plain"
                elevation="0"
                @click="addMortgageLoan"
              >
                <v-icon small="small">mdi-plus</v-icon
                ><span class="addBtnText">Add Mortgage Loan</span>
              </v-btn>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [currencyFormat],
  data() {
    return {
      headers: [
        { text: "Loan Type", value: "MortgageLoanType" },
        { text: "Creditor Name", value: "FullName" },
        { text: "Account Number", value: "LiabilityAccountIdentifier" },
        {
          text: "Monthly Payment",
          value: "LiabilityMonthlyPaymentAmount",
          isCurrency: true,
        },
        {
          text: "Unpaid Balance",
          value: "LiabilityUnpaidBalanceAmount",
          isCurrency: true,
        },
        {
          text: "Credit Limit",
          value: "LiabilityCreditLimit",
          isCurrency: true,
        },
        {
          text: "Payoff Prior to Closing",
          value: "LiabilityPayoffStatusIndicator",
          isCurrency: true,
          class: "largeWidth",
        },
        {
          text: "Payment Includes Taxes and Insurance",
          value: "LiabilityPaymentIncludesTaxesInsuranceIndicator",
          isCurrency: true,
          class: "largeWidth",
        },
        { text: "Action", value: "edit", class: "primary--text" },
      ],
      isDialog: false,
      removeIndex: -1,
      editIcon: require("@/assets/images/edit.svg"),
      deleteIcon: require("@/assets/images/delete.svg"),
    };
  },
  methods: {
    ...mapActions([
      "toggleIsOnlay",
      "setEditingMortgageLoan",
      "setEditingPropertyDetails",
      "setMortgageLoan",
      "setRealEstate",
    ]),
    editItem(loan, loanIndex) {
      if (!Object.entries(this.currentRealEstate).length) return;
      const { AddressLineText, CityName, StateCode, PostalCode } = this.currentRealEstate;
      this.setEditingPropertyDetails({
        title: `Property #${this.currentIndex + 1}`,
        location: `${AddressLineText}, ${CityName}, ${StateCode}, ${PostalCode}`,
      });
      this.setEditingMortgageLoan({ loan, loanIndex });
      this.toggleIsOnlay({ onlayComponent: "mortgage-loan", isOnlay: true });
    },
    addMortgageLoan() {
      this.editItem({}, this.loans.length);
    },
    setRemoveIndex(index) {
      this.removeIndex = index;
      this.isDialog = true;
    },
    removeDetail() {
      const filtered = this.loans.filter((item, index) => index !== this.removeIndex);
      const updatedRealEstate = {
        ...this.currentRealEstate,
        MortgageLoans: filtered,
      };
      const realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = updatedRealEstate;
      this.setRealEstate(realEstates);
      this.isDialog = false;
      this.removeIndex = -1;
    },
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex",
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    },
    loans() {
      return this.currentRealEstate.MortgageLoans || [];
    },
  },
};
</script>
<style lang="scss" scoped>
:deep(.largeWidth) {
  min-width: 150px;
}
</style>
