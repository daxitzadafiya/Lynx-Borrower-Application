<template>
  <div class="personal-info">
    <NewSummaryControl
      header="Prior Residence"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
      ref="summaryControl"
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
              uniqueInputId="autocomplete-prior"
              :showMailingAddressSelector="false"
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
              :value="period.years"
              hide-details
              @change="e => updatePeriod(e, 'years')"
              @keypress="e => isOnlyNum(e)"
            />
            <Input
              :mdVal="6"
              :lgVal="3"
              inputTitle="Months"
              :value="period.months"
              hide-details
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
              item-value="value"
              hide-details
              defaultComponent="v-select"
              @change="e => setResidencyBasisType(e)"
              inputTitle="Living Status"
              :menu-props="{ bottom: true, offsetY: true }"
            />
            <Input
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
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import countryHandling from "@/mixins/countryHandling.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import AddressEditor from "@/components/form/AddressEditor";
import NewSummaryControl from "@/components/controls/NewSummaryControl";
import residencyLength from "@/mixins/residencyLength.js";

export default {
  mixins: [onlyNum, currencyFormat, countryHandling, residencyLength],
  data() {
    return {
      countries: ["United States"],
      livingStatuses: [
        { text: "Rent", value: "Rent" },
        { text: "Own", value: "Own" },
        { text: "Live Rent Free", value: "None" }
      ],
      type: "Prior",
      icon: require("@/assets/images/borrowers/prior-residence.svg"),
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
      this.dataBeforeEdit = this.currentResidence
        ? JSON.parse(JSON.stringify(this.currentResidence))
        : undefined;
    },
    onCancelClicked() {
      this.$emit("onCancelEdit");
      this.updateResidence({ type: this.type, value: this.dataBeforeEdit });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    changeToEditMode() {
      this.$refs.summaryControl.edit();
    }
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence"
    }),
    currentResidence() {
      return this.getSpecificResidence("Prior");
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
::v-deep(.v-card__text) {
  margin-left: -12px;
  margin-right: -12px;
}
</style>
