<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the details for this additional mortgage
      </div>
    </div>
    <v-form fast-fail="fast-fail" v-if="!isMortgageDeleted">
      <v-row class="form-container deleteAbleItem">
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn icon="icon" @click="isDialog = true" dense="dense">
            <v-icon small="small" dense="dense">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <Input
          attach="attach"
          :value="mortgages[editIndex].LienPriorityType"
          @change="e => setMortgageProp(e, 'LienPriorityType')"
          :items="types"
          inputTitle="Lien Type"
          :menu-props="{ bottom: true, offsetY: true }"
          defaultComponent="v-select"
        />
        <Input
          inputTitle="Creditor Name"
          :value="mortgages[editIndex].FullName"
          @input="e => setMortgageProp(e, 'FullName')"
        />
        <Input
          prefix="$"
          inputTitle="Monthly Payment"
          :value="
            getFormattedValue(
              mortgages[editIndex].InitialPrincipalAndInterestPaymentAmount
            )
          "
          @input="
            e =>
              setMortgageProp(
                +e.replace(/,/g, ''),
                'InitialPrincipalAndInterestPaymentAmount'
              )
          "
          @keypress="e => isOnlyNum(e, true)"
        />
        <Input
          outlined="outlined"
          prefix="$"
          inputTitle="Loan Amount to be Drawn"
          :value="getFormattedValue(mortgages[editIndex].NoteAmount)"
          @input="e => setMortgageProp(+e.replace(/,/g, ''), 'NoteAmount')"
          @keypress="e => isOnlyNum(e, true)"
        />
        <Input
          v-if="mortgages[editIndex].LienPriorityType === 'SecondLien'"
          prefix="$"
          inputTitle="Credit Limit"
          :value="
            getFormattedValue(mortgages[editIndex].HELOCMaximumBalanceAmount)
          "
          @input="
            e =>
              setMortgageProp(+e.replace(/,/g, ''), 'HELOCMaximumBalanceAmount')
          "
          @keypress="e => isOnlyNum(e, true)"
        />
        <v-col class="itemContainer" cols="12" sm="6">
          <div class="titleText">Any additional mortgages?</div>
          <AgreeToggle
            :value="isAdditional"
            @input="setIsAdditional"
            class="my-4"
          ></AgreeToggle>
        </v-col>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
    <v-dialog v-model="isDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex dialog-header-back dialog-header-text"
          >Are you sure?
        </v-card-title>
        <v-card-text class="py-5 px-5"
          >Are you sure you want to delete this item?</v-card-text
        >
        <v-divider></v-divider>
        <v-card-actions>
          <v-row class="justify-space-around mx-0 my-0 py-3 px-5">
            <Button
              value="Yes"
              width="120px"
              customClass="button-yes"
              @clicked="remove"
            ></Button>
            <Button
              value="No"
              width="120px"
              :isOutlined="true"
              customClass="button-no"
              @clicked="isDialog = false"
            ></Button>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle.vue";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      editIndex: 0,
      removeIndex: 0,
      isAdditional: null,
      isDialog: false,
      types: [
        { text: "Traditional Second Mortgage", value: "FirstLien" },
        { text: "Home Equity Line of Credit", value: "SecondLien" },
        { text: "Other", value: "Other" }
      ],
      isMortgageDeleted: false
    };
  },
  methods: {
    ...mapActions(["setProperty"]),
    setMortgageProp(e, prop) {
      const newMortgages = this.mortgages.map((item, index) => {
        if (index === this.editIndex) {
          item = { ...item, [prop]: e };
        }
        return item;
      });
      this.updateProperty(newMortgages);
    },
    updateProperty(mortgages) {
      const property = { ...this.Property };
      if (mortgages.length) {
        property.OtherNewMortgageLoans = mortgages;
      } else {
        delete property.OtherNewMortgageLoans;
      }
      this.setProperty(property);
    },
    remove() {
      const updatedMortgages = this.mortgages.filter(
        (item, i) => i !== this.removeIndex
      );
      this.updateProperty(updatedMortgages);
      this.isDialog = false;
      this.isMortgageDeleted = true;
    },
    setIsAdditional(bool) {
      this.isAdditional = bool;
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty"
    }),
    mortgages() {
      return this.Property && this.Property.OtherNewMortgageLoans
        ? this.Property.OtherNewMortgageLoans
        : [
            {
              FullName: "",
              LienPriorityType: "",
              InitialPrincipalAndInterestPaymentAmount: "",
              HELOCBalanceAmount: "",
              HELOCMaximumBalanceAmount: ""
            }
          ];
    },
    isNextDisabled() {
      if (this.isMortgageDeleted) {
        return false;
      }
      return (
        !this.mortgages[this.editIndex].FullName ||
        !this.mortgages[this.editIndex].LienPriorityType ||
        !this.mortgages[this.editIndex]
          .InitialPrincipalAndInterestPaymentAmount ||
        !this.mortgages[this.editIndex].NoteAmount ||
        (this.mortgages[this.editIndex].LienPriorityType === "SecondLien" &&
          !this.mortgages[this.editIndex].HELOCMaximumBalanceAmount)
      );
    }
  },
  components: {
    AgreeToggle
  }
};
</script>
<style lang="scss" scoped>
:deep(.v-item-group) {
  background-color: transparent !important;
  justify-content: flex-start;
}
</style>
