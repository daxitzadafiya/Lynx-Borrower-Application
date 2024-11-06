<template>
  <div class="personal-info">
    <NewSummaryControl
      header="Current Residence"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <v-row class="summary-content-container">
          <v-col sm="6" lg="3" cols="12" class="summaryItem">
            <div class="summaryTitle">Residency Type:</div>
            <div class="summaryValue">
              {{ currentResidence.BorrowerResidencyType }}
            </div>
          </v-col>
          <v-col sm="6" lg="9" cols="12" class="summaryItem">
            <div class="summaryTitle">Address:</div>
            <div class="summaryValue">{{ addressText }}</div>
          </v-col>
          <v-col sm="6" lg="3" cols="12" class="summaryItem">
            <div class="summaryTitle">Duration:</div>
            <div class="summaryValue">{{ period.text }}</div>
          </v-col>
          <v-col sm="6" lg="9" cols="12" class="summaryItem">
            <div class="summaryTitle">Mailing Address:</div>
            <div class="summaryValue">{{ isMailing ? "Yes" : "No" }}</div>
          </v-col>
          <v-col sm="6" lg="3" cols="12" class="summaryItem">
            <div class="summaryTitle">Living Status:</div>
            <div class="summaryValue">
              {{ currentResidence.ResidencyBasisType }}
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <v-row class="form-container">
            <AddressEditor
              :addressObj="currentResidence"
              @addressUpdated="updateAddress"
              @addressPropUpdated="updateAddressProp"
              uniqueInputId="autocomplete-current"
              :isMailing="isMailing"
              :showMailingAddressSelector="true"
              @mailingUpdated="updateMailing"
              :mdVal="6"
              :lgVal="6"
            ></AddressEditor>
            <v-col sm="12" cols="12" class="itemContainer howLongText pb-0">
              <span>How long have you lived at this residence?</span>
            </v-col>
            <Input
              :mdVal="6"
              :lgVal="3"
              inputTitle="Years"
              pattern="[0-9]*"
              hide-details
              :value="period.years"
              @change="e => updatePeriod(e, 'years')"
              @keypress="e => isOnlyNum(e)"
            />
            <Input
              :mdVal="6"
              :lgVal="3"
              inputTitle="Months"
              pattern="[0-9]*"
              hide-details
              :value="period.months"
              @change="e => updatePeriod(e, 'months')"
              @keypress="e => isOnlyNum(e)"
            />
            <Input
              :mdVal="6"
              :lgVal="3"
              :attach="true"
              :value="currentResidence.ResidencyBasisType"
              :items="livingStatuses"
              item-text="text"
              hide-details
              item-value="value"
              defaultComponent="v-select"
              @change="e => setResidencyBasisType(e)"
              inputTitle="Living Status"
              :menu-props="{ bottom: true, offsetY: true }"
            />
            <Input
              v-if="currentResidence.ResidencyBasisType !== 'None'"
              :mdVal="6"
              :lgVal="3"
              inputTitle="Rent Amount, $"
              hide-details
              :value="getFormattedValue(currentResidence.MonthlyRentAmount)"
              @input="
                e =>
                  updateResidenceProp({
                    type,
                    value: +e.replace(/,/g, ''),
                    prop: 'MonthlyRentAmount'
                  })
              "
              @keypress="e => isOnlyNum(e, true)"
            />
          </v-row>
          <v-row
            class="form-container addItemBtnContainer"
            v-if="!isMailing && !isEmptyMailing"
          >
            <v-col cols="12" sm="12" class="itemContainer">
              <v-btn
                dense
                plain
                elevation="0"
                @click="$emit('toggleMailingAddress', { value: true })"
                class="addItemBtn negativeLeftMargin"
              >
                <v-icon small>mdi-plus</v-icon>
                <span class="addBtnText">Add Mailing Address</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            class="form-container addItemBtnContainer"
            v-if="
              showAddPriorResidenceButton &&
                currentResidence &&
                currentResidence.ResidencyDurationMonthsCount < 24
            "
          >
            <v-col cols="12" sm="12" class="itemContainer">
              <v-btn
                dense
                plain
                elevation="0"
                @click="$emit('renderPrioirResidence')"
                class="addItemBtn negativeLeftMargin"
              >
                <v-icon small>mdi-plus</v-icon>
                <span class="addBtnText">Add Prior Residence Button</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import residencyLength from "@/mixins/residencyLength.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import AddressEditor from "@/components/form/AddressEditor";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  mixins: [onlyNum, residencyLength, currencyFormat],
  props: {
    isEmptyMailing: {
      type: Boolean,
      default: false
    },
    showAddPriorResidenceButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      residenceTypes: ["Current"],
      countries: ["United States"],
      livingStatuses: [
        { text: "Rent", value: "Rent" },
        { text: "Own", value: "Own" },
        { text: "Live Rent Free", value: "None" }
      ],
      type: "Current",
      icon: require("@/assets/images/borrowers/current-residence.svg"),
      dataBeforeEdit: null
    };
  },
  methods: {
    ...mapActions([
      "updateResidenceProp",
      "updateResidence",
      "setInitialMailingResidence",
      "removeResidence",
      "saveLoanPatches"
    ]),
    handleAddressData(addressData) {
      this.updateResidence({ type: this.type, value: addressData });
    },
    updateMailing(bool) {
      this.removeResidence("Mailing");
      if (bool) {
        this.setInitialMailingResidence();
        this.$emit("toggleMailingAddress", { value: !bool });
      }
    },
    updateAddress(addressData) {
      this.updateResidence({
        type: this.type,
        value: addressData
      });
    },
    updateAddressProp({ prop, value }) {
      this.updateResidenceProp({
        type: this.type,
        value: value,
        prop: prop
      });
    },
    setResidencyBasisType(e) {
      this.updateResidenceProp({
        type: this.type,
        value: e,
        prop: "ResidencyBasisType"
      });
      this.updateResidenceProp({
        type: this.type,
        value: "",
        prop: "MonthlyRentAmount"
      });
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.currentResidence));
    },
    onCancelClicked() {
      this.updateResidence({ type: this.type, value: this.dataBeforeEdit });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    }
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence"
    }),
    currentResidence() {
      return this.getSpecificResidence("Current");
    },
    period() {
      let result = { years: 0, months: 0 };
      if (this.currentResidence.ResidencyDurationMonthsCount) {
        if (this.currentResidence.ResidencyDurationMonthsCount >= 12) {
          const years =
            Math.floor(
              +this.currentResidence.ResidencyDurationMonthsCount / 12
            ) || 0;
          const months =
            this.currentResidence.ResidencyDurationMonthsCount % 12 || "";
          result = { years, months };
        } else {
          result.months = this.currentResidence.ResidencyDurationMonthsCount;
        }
      }
      let resText = "";
      resText = result.years !== 0 ? result.years + " Years" : "";
      if (result.months !== 0) {
        resText += result.months !== 0 && resText !== "" ? " " : "";
        resText += result.months + " Months";
      }
      return {
        years: result.years,
        months: result.months,
        text: resText
      };
    },
    isMailing() {
      const mailingKeys = [
        "AddressLineText",
        "AddressUnitIdentifier",
        "CityName",
        "CountryCode",
        "PostalCode",
        "StateCode"
      ];
      const Mailing = this.getSpecificResidence("Mailing");
      if (!Mailing) return false;
      for (let key of mailingKeys) {
        if (
          key !== "BorrowerResidencyType" &&
          this.currentResidence[key] !== Mailing[key]
        ) {
          return false;
        }
      }
      return true;
    },
    addressText() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.currentResidence) {
        return keys.reduce((acc, cur) => {
          if (this.currentResidence[cur]) {
            acc += `${this.currentResidence[cur]}${
              cur === "PostalCode" ? " " : ", "
            }`;
          }
          return acc;
        }, "");
      }
      return this.formattedAddress;
    }
  },
  components: {
    AddressEditor,
    NewSummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
.howLongText {
  margin-bottom: -10px;
}
::v-deep(.add-button__inner) {
  margin-top: -3px;
}

::v-deep(.v-card__text) {
  margin-left: -12px;
  margin-right: -12px;
}
</style>
