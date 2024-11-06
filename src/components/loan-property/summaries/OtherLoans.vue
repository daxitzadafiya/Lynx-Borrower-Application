<template>
  <div class="other-loans">
    <SummaryControl
      header="Additional Mortgage Loans"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <v-row
          class="summary-content-container align-center"
          style="height:100%"
        >
          <v-col sm="12" md="12" cols="12" class="pb-2 pt-0">
            <div
              class="subtitle-1"
              v-for="(mortgage, index) in mortgages"
              :key="index"
            >
              <span class="primary-text">{{ index + 1 }}. </span>
              <span>{{ getMortgageDescription(mortgage) }}</span>
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form class="fast-fail form-outer-container">
          <v-row
            class="form-container deleteAbleItem"
            v-for="(mortgage, index) in mortgages"
            :key="index"
          >
            <v-col
              class="itemContainer itemDeleteCrossContainer"
              cols="12"
              sm="12"
            >
              <v-btn dense icon @click="remove(index)">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </v-col>
            <Input
              hide-details
              :attach="true"
              defaultComponent="v-select"
              inputTitle="Lien type"
              :value="mortgage.LienPriorityType"
              :items="types"
              @change="
                e =>
                  setMortgageProp(
                    getLeinTypeValue(e),
                    index,
                    'LienPriorityType'
                  )
              "
            />
            <Input
              hide-details
              inputTitle="Creditor Name"
              :value="mortgage.FullName"
              @input="e => setMortgageProp(e, index, 'FullName')"
            />
            <Input
              prefix="$"
              hide-details
              inputTitle="Monthly Payment"
              placeholder="Enter monthly payment"
              :value="
                getFormattedValue(
                  mortgage.InitialPrincipalAndInterestPaymentAmount
                )
              "
              @input="
                e =>
                  setMortgageProp(
                    +e.replace(/,/g, ''),
                    index,
                    'InitialPrincipalAndInterestPaymentAmount'
                  )
              "
              @keypress="e => isOnlyNum(e, true)"
            />
            <Input
              prefix="$"
              hide-details
              inputTitle="Loan Amount to be Drawn"
              :value="getFormattedValue(mortgage.NoteAmount)"
              @input="
                e => setMortgageProp(+e.replace(/,/g, ''), index, 'NoteAmount')
              "
              @keypress="e => isOnlyNum(e, true)"
            />
            <Input
              prefix="$"
              inputTitle="Credit Limit"
              hide-details
              v-if="mortgage.LienPriorityType === 'SecondLien'"
              placeholder="Enter credit limit"
              :value="getFormattedValue(mortgage.HELOCMaximumBalanceAmount)"
              @input="
                e =>
                  setMortgageProp(
                    +e.replace(/,/g, ''),
                    index,
                    'HELOCMaximumBalanceAmount'
                  )
              "
              @keypress="e => isOnlyNum(e, true)"
            />
          </v-row>
          <v-row class="form-container deleteAbleItem" v-if="additional">
            <v-col
              class="itemContainer itemDeleteCrossContainer"
              cols="12"
              sm="12"
            >
              <v-btn dense icon @click="additional = null">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </v-col>
            <Input
              defaultComponent="v-combobox"
              :attach="true"
              inputTitle="Lien type"
              :value="additional.LienPriorityType"
              :items="types"
              @change="e => setAdditionalType(e)"
            />
          </v-row>
          <v-row class="form-container addItemBtnContainer">
            <v-col class="itemContainer" cols="12" sm="12">
              <v-btn
                dense
                plain
                elevation="0"
                @click="addMortgageLoan"
                class="addItemBtn"
              >
                <v-icon small>mdi-plus</v-icon>
                <span class="addBtnText">Add mortgage loan</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-dialog v-model="isDialog" max-width="290">
          <v-card>
            <v-card-title class="d-flex justify-center mb-4 text-black--text"
              >Are you sure?</v-card-title
            >
            <v-card-text>
              <v-row class="justify-space-around">
                <Button
                  customClass="button-yes"
                  value="Yes"
                  width="120px"
                  @clicked="confirmRemove()"
                ></Button>
                <Button
                  value="No"
                  customClass="button-no"
                  width="120px"
                  :isOutlined="true"
                  @clicked="isDialog = false"
                ></Button>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
    </SummaryControl>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapActions } from "vuex";
import SummaryControl from "@/components/controls/NewSummaryControl";

export default {
  mixins: [onlyNum, currencyFormat],
  props: {
    Property: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      types: [
        { text: "Traditional Second Mortgage", value: "FirstLien" },
        { text: "Home Equity Line of Credit", value: "SecondLien" },
        { text: "Other", value: "Other" }
      ],
      removeIndex: -1,
      isAdditional: false,
      isDialog: false,
      additional: null,
      icon: require("@/assets/images/loan-property/summary/additional-mortgage-details.svg"),
      mortgageDataBeforeEdit: null
    };
  },
  methods: {
    ...mapActions(["setProperty", "saveLoanPatches"]),
    addMortgageLoan() {
      if (this.additional) return;
      this.additional = {};
    },
    setAdditionalType(type) {
      const newMortgages = [
        ...this.mortgages,
        { LienPriorityType: type.value }
      ];
      this.updateProperty(newMortgages);
      this.additional = null;
    },
    setMortgageProp(e, index, prop) {
      const newMortgages = this.mortgages.map((item, i) => {
        if (index === i) {
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
    remove(index) {
      this.removeIndex = index;
      this.isDialog = !this.isDialog;
    },
    confirmRemove() {
      const updatedMortgages = this.mortgages.filter(
        (item, i) => i !== this.removeIndex
      );
      this.updateProperty(updatedMortgages);
      this.isDialog = false;
      this.removeIndex = -1;
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.mortgageDataBeforeEdit = JSON.parse(JSON.stringify(this.mortgages));
    },
    onCancelClicked() {
      this.updateProperty(this.mortgageDataBeforeEdit);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    getLeinTypeText(value) {
      let leinType = this.types.find(x => x.value === value);
      if (leinType != null) {
        return leinType.text;
      } else {
        return "";
      }
    },
    getLeinTypeValue(text) {
      let leinType = this.types.find(x => x.text === text);
      if (leinType != null) {
        return leinType.value;
      } else {
        return "";
      }
    },
    getMortgageDescription(mortgage) {
      const {
        FullName,
        NoteAmount,
        InitialPrincipalAndInterestPaymentAmount,
        LienPriorityType
      } = mortgage;
      const loanAmount = this.getFormattedValue(NoteAmount);
      const monthlyPayment = this.getFormattedValue(
        InitialPrincipalAndInterestPaymentAmount
      );

      const lienType =
        LienPriorityType === "Other"
          ? "An Additional Mortgage"
          : `A ${this.getLeinTypeText(LienPriorityType)}`;

      return `${lienType} from ${FullName}, with a loan amount of $${loanAmount}, and monthly payment of $${monthlyPayment}`;
    }
  },
  computed: {
    mortgages() {
      return this.Property && this.Property.OtherNewMortgageLoans
        ? this.Property.OtherNewMortgageLoans
        : [];
    }
  },
  components: {
    Button,
    SummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

.text-block {
  &__row {
    position: relative;
  }
}

.last-row {
  margin-bottom: 20px;
}

.relative-col {
  position: relative;
}

.additional-remove {
  top: 20px;
}

.remove {
  position: absolute;
  right: 0;
  &__icon {
    cursor: pointer;
  }
}

.add-new {
  &__title {
    font-weight: 500;
    margin-left: 10px;
  }
}

::v-deep(.add-button__inner) {
  margin-top: -3px;
}

@media (max-width: 480px) {
  .remove {
    top: -10px;
  }
  .additional-remove {
    top: 10px;
    right: -20px;
  }
}
.singleItemContainer {
  background: $list-item-bg;
  padding: 5px 10px 0px 15px;
  position: relative;
  border-radius: 5px;
}
</style>
