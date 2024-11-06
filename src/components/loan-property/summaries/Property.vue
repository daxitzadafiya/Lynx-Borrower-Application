<template>
  <div class="property">
    <NewSummaryControl
      header="Property Details"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
      :submitDisabled="isSubmitDisabled"
    >
      <template v-slot:displayContent>
        <v-row class="ml-1 my-0 pl-sm-2 ml-sm-2 align-center">
          <v-col sm="12" md="8" cols="12" class="pb-2 pt-0">
            <v-row class="pb-2 pt-4">
              <v-col sm="3" cols="12" class="py-0 primary-text">Address:</v-col>
              <v-col sm="9" cols="12" class="py-0">{{ address }}</v-col>
            </v-row>
            <v-row class="py-2">
              <v-col sm="3" cols="12" class="py-0 primary-text"
                >Description:</v-col
              >
              <v-col sm="9" cols="12" class="py-0">{{
                houseDescription
              }}</v-col>
            </v-row>
            <v-row
              class="py-2"
              v-if="
                Property &&
                  Property.PropertyDetail &&
                  Property.PropertyDetail.AssessedValue
              "
            >
              <v-col sm="3" cols="12" class="py-0 primary-text"
                >Assessed Value:</v-col
              >
              <v-col sm="9" cols="12" class="py-0">
                ${{ getFormattedValue(Property.PropertyDetail.AssessedValue) }}
              </v-col>
            </v-row>
            <v-row class="py-2" v-if="Property.PropertyUsageType">
              <v-col sm="3" cols="12" class="py-0 primary-text"
                >Occupancy Type:</v-col
              >
              <v-col sm="9" cols="12" class="py-0">{{ occupancyType }}</v-col>
            </v-row>
            <v-row class="py-2">
              <v-col sm="3" cols="12" class="py-0 primary-text"
                >Housing Expenses:</v-col
              >
              <v-col sm="9" cols="12" class="py-0">
                <div class="mb-2">
                  The proposed Monthly Housing Expenses are ${{
                    totalHousingExpenseValue
                  }}
                </div>
                <span
                  v-for="item in filteredExpenses"
                  :key="item.id"
                  class="py-1 d-block"
                >
                  ${{ item.value }} for {{ item.text }}
                </span>
              </v-col>
            </v-row>
            <v-row v-if="displayExpectedMonthlyRentalIncome" class="py-2">
              <v-col sm="3" cols="12" class="py-0 primary-text"
                >Rental Income:</v-col
              >
              <v-col sm="9" cols="12" class="py-0"
                >${{
                  getFormattedValue(RentalEstimatedGrossMonthlyRentAmount)
                }}</v-col
              >
            </v-row>
          </v-col>
          <v-col
            sm="8"
            md="4"
            cols="12"
            style="position:relative;"
            class="py-3"
          >
            <GmapMap
              style="min-height:200px;width:100%;"
              v-if="coord != null"
              :options="mapOptions"
              :center="{ lat: +coord.latitude, lng: +coord.longitude }"
              :zoom="mapZoomLevel"
            >
              <GmapMarker
                :position="{ lat: +coord.latitude, lng: +coord.longitude }"
              ></GmapMarker>
            </GmapMap>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form class="d-flex fast-fail flex-column flex-lg-row">
          <v-row class="form-container editSectionInputs pr-lg-4">
            <AddressEditor
              :addressObj="Property"
              ref="addressEditor"
              :mdVal="6"
              :lgVal="4"
              :isAddressRequired="true"
              mainAddressInputText="Street Address"
              @addressUpdated="updateAddress"
              @addressPropUpdated="updateAddressProp"
              uniqueInputId="autocomplete-property"
              :showCountry="false"
            ></AddressEditor>
            <Input
              :mdVal="6"
              :lgVal="4"
              :attach="true"
              defaultComponent="v-combobox"
              inputTitle="Property Type"
              :menu-props="{ light: true }"
              :value="
                Property && Property.PropertyType
                  ? Property.PropertyType.replace(/([a-z])([A-Z])/g, '$1 $2')
                  : ''
              "
              :items="types"
              @change="type => setPropertyType(type)"
              placeholder="Select property type"
            />
            <Input
              :mdVal="6"
              :lgVal="4"
              defaultComponent="v-select"
              inputTitle="Year Built"
              :attach="true"
              :items="years"
              :value="Property.YearBuilt"
              :menu-props="{ bottom: true, offsetY: true }"
              @change="value => (Property.YearBuilt = value)"
            />
            <Input
              :mdVal="6"
              :lgVal="4"
              inputTitle="Enter unit count"
              inputmode="numeric"
              pattern="[0-9]*"
              :value="Property ? Property.FinancedUnitCount : ''"
              @input="e => setFinancedUnitCount(+e)"
              @keypress="e => isOnlyNum(e)"
            />
            <Input
              :mdVal="6"
              :lgVal="4"
              :attach="true"
              :menu-props="{ light: true }"
              :value="
                Property && Property.PropertyUsageType
                  ? getSplittedOccupancy(Property.PropertyUsageType)
                  : ''
              "
              :items="occupancies"
              defaultComponent="v-combobox"
              inputTitle="Select occupancy type"
              @change="occupancy => setOccupancy(occupancy)"
            />
            <Input
              :mdVal="6"
              :lgVal="4"
              prefix="$"
              inputTitle="Property value"
              :value="getCorrectValue()"
              @input="e => setEstimatedValue(+e.replace(/,/g, ''))"
              @keypress="e => isOnlyNum(e, true)"
            />
            <template v-for="(expense, index) in getUniqueExpenses()">
              <Input
                :key="
                  `expense-${expense.HousingExpenseType}-${expense.HousingExpenseNote}-${index}`
                "
                :mdVal="6"
                :lgVal="4"
                :inputTitle="
                  getExpenseDisplayText(
                    expense.HousingExpenseType,
                    expense.HousingExpenseNote,
                    expense.HousingExpenseTerm
                  )
                "
                prefix="$"
                outlined
                dense
                hide-details
                :value="
                  expense.HousingExpensePaymentAmount !== null
                    ? getFormattedValue(expense.HousingExpensePaymentAmount)
                    : ''
                "
                @input="
                  e =>
                    updateHousingExpense(
                      expense.HousingExpenseType,
                      expense.HousingExpenseNote,
                      e === '' ? '' : +e.replace(/,/g, ''),
                      expense.HousingExpenseTerm
                    )
                "
                @keypress="e => isOnlyNum(e, true)"
              />
              <Input
                v-if="
                  expense.HousingExpenseType === 'Other' &&
                    expense.HousingExpensePaymentAmount > 0
                "
                :key="
                  `other-description-${expense.HousingExpenseType}-${expense.HousingExpenseNote}-${index}`
                "
                :mdVal="6"
                :lgVal="4"
                inputTitle="Other Description"
                :value="expense.HousingExpenseTypeOtherDescription || ''"
                @input="
                  e => updateOtherDescription(expense.HousingExpenseNote, e)
                "
              />
            </template>
            <Input
              v-if="displayExpectedMonthlyRentalIncome"
              :mdVal="6"
              :lgVal="4"
              hide-details
              prefix="$"
              placeholder="Rental income"
              :value="getFormattedValue(RentalEstimatedGrossMonthlyRentAmount)"
              @input="e => setPropertyValue(+e.replace(/,/g, ''))"
              @keypress="e => isOnlyNum(e, true)"
            />
          </v-row>
          <v-row
            class="form-container editSectionMap pl-lg-0 pt-0 pt-lg-5 mt-0 mt-lg-2"
          >
            <v-col class="itemContainer" sm="12" cols="12">
              <GmapMap
                style="height:100%"
                v-if="coord != null"
                :options="mapOptions"
                :center="{ lat: +coord.latitude, lng: +coord.longitude }"
                :zoom="mapZoomLevel"
              >
                <GmapMarker
                  :position="{ lat: +coord.latitude, lng: +coord.longitude }"
                ></GmapMarker>
              </GmapMap>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<script>
import currencyFormat from "@/mixins/currencyFormat.js";
import onlyNum from "@/mixins/onlyNum.js";
import { mapGetters, mapActions } from "vuex";
import config from "@/configs";
import AddressEditor from "@/components/form/AddressEditor";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  mixins: [currencyFormat, onlyNum],
  data() {
    return {
      years: [],
      types: [
        "Single Family Detached",
        "Condominium",
        "Townhouse",
        "Co-operative",
        "Two-to-four unit property",
        "Multifamily",
        "Manufactured/Mobile"
      ],
      occupancies: [
        "Primary Residence",
        "Second Home",
        "Investment",
        "FHA Secondary Residence"
      ],
      coord: null,
      mapOptions: {
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        mapTypeId: "hybrid"
      },
      housingExpenseTypes: [
        { id: 1, text: "Property Taxes", value: "RealEstateTax" },
        { id: 2, text: "Hazzard Insurance", value: "HomeownersInsurance" },
        {
          id: 3,
          text: "HOA/Condo Fees",
          value: "HomeownersAssociationDuesAndCondominiumFees"
        },
        { id: 4, text: "Flood Insurance", value: "HomeownersInsurance" },
        { id: 5, text: "Wind Insurance", value: "HomeownersInsurance" },
        { id: 6, text: "Earthquake Insurance", value: "HomeownersInsurance" },
        {
          id: 7,
          text: "HOA Fees",
          value: "HomeownersAssociationDuesAndCondominiumFee"
        },
        {
          id: 8,
          text: "Condo Fees",
          value: "HomeownersAssociationDuesAndCondominiumFee"
        },
        {
          id: 9,
          text: "Master Association Fees",
          value: "HomeownersAssociationDuesAndCondominiumFee"
        },
        { id: 10, text: "Mortgage Insurance", value: "MIPremium" },
        { id: 11, text: "Other", value: "Other" }
      ],
      max: new Date().getFullYear().toString(),
      propertyDataBeforeEdit: null,
      propertyValueBeforeEdit: null,
      housingExpensesBeforeEdit: null,
      yearBuiltBeforeEdit: null,
      expectedRentalIncomeBeforeEdit: null,
      icon: require("@/assets/images/loan-property/summary/property-details.svg")
    };
  },
  methods: {
    ...mapActions([
      "setProperty",
      "setCurrentLoan",
      "setPropertyStructureBuiltYear",
      "saveLoanPatches",
      "updateMortgageLoanInfo"
    ]),
    updateAddress(addressData) {
      let property = this.Property
        ? { ...this.Property, ...addressData }
        : addressData;
      this.setProperty(property);
    },
    updateAddressProp({ prop, value }) {
      this.setProperty({
        ...this.Property,
        [prop]: value
      });
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.propertyDataBeforeEdit = [
        { prop: "AddressLineText", value: this.Property.AddressLineText },
        {
          prop: "AddressUnitIdentifier",
          value: this.Property.AddressUnitIdentifier
        },
        { prop: "CityName", value: this.Property.CityName },
        { prop: "StateCode", value: this.Property.StateCode },
        {
          prop: "PostalCode",
          value: this.Property.PostalCode
        },
        {
          prop: "PropertyType",
          value: this.Property.PropertyType
        },
        {
          prop: "YearBuilt",
          value: this.Property.YearBuilt
        },
        {
          prop: "FinancedUnitCount",
          value: this.Property.FinancedUnitCount
        },
        {
          prop: "PropertyUsageType",
          value: this.Property.PropertyUsageType
        }
      ];
      this.propertyValueBeforeEdit = this.getCorrectValue();
      this.housingExpensesBeforeEdit = JSON.parse(
        JSON.stringify(this.housingExpenses)
      );
      this.expectedRentalIncomeBeforeEdit = this.RentalEstimatedGrossMonthlyRentAmount;
    },
    onCancelClicked() {
      const property = this.Property || {};
      for (let i = 0; i < this.propertyDataBeforeEdit.length; i++) {
        property[
          this.propertyDataBeforeEdit[i].prop
        ] = this.propertyDataBeforeEdit[i].value;
      }
      this.setProperty({ ...property });
      this.setEstimatedValue(this.propertyValueBeforeEdit);

      this.updateMortgageLoanInfo({
        prop: "HousingExpenses",
        value: this.housingExpensesBeforeEdit
      });

      this.setPropertyValue(this.expectedRentalIncomeBeforeEdit);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    setPropertyType(type) {
      const property = this.Property
        ? { ...this.Property, PropertyType: type ? type.replace(/ /g, "") : "" }
        : { PropertyType: type ? type.replace(/ /g, "") : "" };
      this.setProperty(property);
    },
    setOccupancy(occupancy) {
      const isFHA = occupancy === "FHA Secondary Residence";
      let property = this.Property
        ? {
            ...this.Property,
            PropertyUsageType: occupancy ? occupancy.replace(/ /g, "") : ""
          }
        : { PropertyUsageType: occupancy ? occupancy.replace(/ /g, "") : "" };
      if (isFHA) {
        property.FHASecondaryResidenceIndicator = true;
      } else {
        delete property.FHASecondaryResidenceIndicator;
      }
      this.setProperty(property);
    },
    setEstimatedValue(e) {
      let prop = "EstimatedPurchasePrice";
      prop =
        this.LoanPurposeType === "Refinance"
          ? "PropertyEstimatedValueAmount"
          : prop;
      if (prop === "PropertyEstimatedValueAmount") {
        const property = this.Property
          ? { ...this.Property, [prop]: e }
          : { [prop]: e };
        this.setProperty(property);
      } else {
        this.setCurrentLoan({ ...this.currentLoan, [prop]: e });
      }
    },
    setFinancedUnitCount(val) {
      const property = this.Property
        ? { ...this.Property, FinancedUnitCount: val }
        : { FinancedUnitCount: val };
      this.setProperty(property);
    },
    getCorrectValue() {
      if (this.currentLoan) {
        return this.LoanPurposeType === "Refinance" && this.Property
          ? this.getFormattedValue(this.Property.PropertyEstimatedValueAmount)
          : this.getFormattedValue(this.currentLoan.EstimatedPurchasePrice);
      }
      return "";
    },
    getSplittedOccupancy(val) {
      return val.substring(0, 3) === "FHA"
        ? `${val.substring(0, 3)} ${val
            .substring(3)
            .replace(/([a-z])([A-Z])/g, "$1 $2")}`
        : val.replace(/([a-z])([A-Z])/g, "$1 $2");
    },
    housingExpenseValue(type, text) {
      const expenses = this.housingExpenses.filter(
        item => item && item.HousingExpenseType === type
      );

      let expense;
      if (
        type === "HomeownersInsurance" ||
        type === "HomeownersAssociationDuesAndCondominiumFee"
      ) {
        expense = expenses.find(e => e.HousingExpenseNote === text);
      } else {
        expense = expenses[0];
      }

      if (expense) {
        let value = parseFloat(expense.HousingExpensePaymentAmount);
        if (expense.HousingExpenseTerm === "Yearly") {
          value = value / 12;
        }
        return isNaN(value) ? 0 : value;
      }
      return 0;
    },
    updateHousingExpense(type, note, value, term = "Monthly") {
      let HousingExpenses = [...this.housingExpenses];

      const expenseIndex = HousingExpenses.findIndex(
        item =>
          item.HousingExpenseType === type && item.HousingExpenseNote === note
      );

      if (expenseIndex !== -1) {
        if (value === "") {
          HousingExpenses[expenseIndex].HousingExpensePaymentAmount = null;
        } else {
          HousingExpenses[expenseIndex].HousingExpensePaymentAmount = value;
        }
      } else if (value !== "") {
        HousingExpenses.push({
          HousingExpenseTimingType: "Proposed",
          HousingExpenseType: type,
          HousingExpenseNote: note,
          HousingExpensePaymentAmount: value,
          HousingExpenseTerm: term,
          HousingExpenseTypeOtherDescription: type === "Other" ? "" : undefined
        });
      }

      this.updateMortgageLoanInfo({
        prop: "HousingExpenses",
        value: HousingExpenses
      });
    },
    setMapOptions() {
      if (this.address != null && this.address !== "") {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {
            address: this.address
          },
          function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              this.coord = {
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng()
              };
              return;
            }
          }.bind(this)
        );
      } else {
        this.coord = null;
      }
    },
    setPropertyValue(e) {
      const property = this.Property || {};
      const RentalIncome = property.RentalIncome
        ? { ...property.RentalIncome, RentalEstimatedGrossMonthlyRentAmount: e }
        : { RentalEstimatedGrossMonthlyRentAmount: e };
      this.setProperty({ ...property, RentalIncome });
    },
    updateOtherDescription(text, description) {
      let HousingExpenses = [...this.housingExpenses];
      const index = HousingExpenses.findIndex(
        e => e.HousingExpenseType === "Other" && e.HousingExpenseNote === text
      );
      if (index !== -1) {
        HousingExpenses[index] = {
          ...HousingExpenses[index],
          HousingExpenseTypeOtherDescription: description
        };
        this.updateMortgageLoanInfo({
          prop: "HousingExpenses",
          value: HousingExpenses
        });
      }
    },
    getExpenseDisplayText(expenseType, expenseNote, expenseTerm) {
      let displayText;

      if (
        expenseType === "HomeownersInsurance" ||
        expenseType === "HomeownersAssociationDuesAndCondominiumFee" ||
        expenseType === "Other"
      ) {
        displayText = expenseNote;
      } else {
        const expenseTypeObj = this.housingExpenseTypes.find(
          t => t.value === expenseType
        );
        displayText = expenseTypeObj ? expenseTypeObj.text : expenseNote;
      }

      if (expenseTerm) {
        const termDisplay = expenseTerm === "Yearly" ? "Yearly" : "Monthly";
        return `${displayText} (${termDisplay})`;
      } else {
        return displayText;
      }
    },
    getUniqueExpenses() {
      const uniqueExpenses = [];
      const usedTypes = new Set();

      this.housingExpenses.forEach(expense => {
        uniqueExpenses.push(expense);
        usedTypes.add(expense.HousingExpenseType);
      });

      this.housingExpenseTypes.forEach(expenseType => {
        if (!usedTypes.has(expenseType.value)) {
          uniqueExpenses.push({
            HousingExpenseType: expenseType.value,
            HousingExpenseNote: expenseType.text,
            HousingExpensePaymentAmount: null,
            HousingExpenseTerm: "Monthly"
          });
        }
      });

      return uniqueExpenses;
    }
  },
  watch: {
    Property() {
      this.setMapOptions();
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      LoanPurposeType: "getLoanPurposeType",
      Property: "getProperty",
      housingExpenses: "getHousingExpenses"
    }),
    mapZoomLevel() {
      return config.mapZoomLevel;
    },
    address() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.Property) {
        return keys.reduce((acc, cur) => {
          if (this.Property[cur]) {
            acc += `${this.Property[cur]}${cur === "PostalCode" ? " " : ", "}`;
          }
          return acc;
        }, "");
      }
      return "";
    },
    isSubmitDisabled() {
      return (
        (this.$refs.addressEditor == null ||
          !this.$refs.addressEditor.isGoogleAddressFound) &&
        (this.Property.AddressLineText == null ||
          this.Property.AddressUnitIdentifier == null ||
          this.Property.CityName == null ||
          this.Property.StateCode == null)
      );
    },
    displayExpectedMonthlyRentalIncome() {
      if (
        this.LoanPurposeType === "Purchase" &&
        ((this.Property.PropertyUsageType === "PrimaryResidence" &&
          this.Property.PropertyType === "Two-to-fourUnitProperty") ||
          (this.Property.PropertyUsageType === "Investment" &&
            this.Property.PropertyType == null))
      ) {
        return true;
      }
      return false;
    },
    houseDescription() {
      if (this.Property == null) {
        return "";
      }
      let propertyType =
        this.Property.PropertyType != null ? this.Property.PropertyType : "";
      let unitCount =
        this.Property.FinancedUnitCount != null
          ? `, containing ${this.Property.FinancedUnitCount} unit(s)`
          : "";
      let yearBuilt =
        this.Property.YearBuilt != null
          ? `built in ${this.Property.YearBuilt}`
          : "";

      if (
        ["SingleFamilyDetached", "Multifamily", "Manufactured/Mobile"].includes(
          propertyType
        )
      ) {
        return `A home ${yearBuilt} ${unitCount}`;
      } else if (
        ["Condominium", "Co-operative", "Two-to-fourUnitProperty"].includes(
          propertyType
        )
      ) {
        return `A ${propertyType} ${yearBuilt} ${unitCount}`;
      } else {
        return `A property ${yearBuilt} ${unitCount}`;
      }
    },
    totalHousingExpenseValue() {
      const total = this.filteredExpenses.reduce((total, item) => {
        const value = parseFloat(item.value.replace(/,/g, ""));
        return total + (isNaN(value) ? 0 : value);
      }, 0);

      return this.getFormattedValue(total);
    },
    RentalEstimatedGrossMonthlyRentAmount() {
      return this.Property && this.Property.RentalIncome
        ? this.Property.RentalIncome.RentalEstimatedGrossMonthlyRentAmount
        : "";
    },
    occupancyType() {
      return this.Property.PropertyUsageType
        ? this.Property.PropertyUsageType.replace(/([a-z])([A-Z])/g, "$1 $2")
        : "";
    },
    filteredExpenses() {
      return this.housingExpenses
        .map(expense => {
          let value = expense.HousingExpensePaymentAmount;

          if (expense.HousingExpenseTerm === "Yearly" && value !== null) {
            value = value / 12;
          }

          const displayText = this.getExpenseDisplayText(
            expense.HousingExpenseType,
            expense.HousingExpenseNote
          );
          return {
            id:
              expense.id ||
              `${expense.HousingExpenseType}-${expense.HousingExpenseNote}`,
            text: displayText,
            value: value,
            type: expense.HousingExpenseType
          };
        })
        .filter(item => item.value !== null && item.value !== "")
        .map(item => ({
          ...item,
          value: this.getFormattedValueStatic(item.value)
        }));
    }
  },
  components: {
    AddressEditor,
    NewSummaryControl
  },
  mounted() {
    this.setFinancedUnitCount(1);
    this.setMapOptions();
  },
  created() {
    window.vueGoogleMapsInit();
    const currentYear = new Date().getFullYear() + 1;
    this.years = Array.from({ length: currentYear - 1799 }, (_, index) =>
      (currentYear - index).toString()
    );
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

::v-deep(.text-block__col) {
  padding-left: 0px;
}
.main {
  &__title {
    margin-bottom: 0;
  }
}

.label-12 {
  margin-bottom: 0;
  @media (max-width: 760px) {
    margin-bottom: 15px;
  }
}

.editSectionInputs {
  flex: 3;
}
.editSectionMap {
  flex: 1;
  min-height: 250px;
}

:deep(.titleText) {
  max-width: 100%;
  text-overflow: ellipsis;
  max-height: 20px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
