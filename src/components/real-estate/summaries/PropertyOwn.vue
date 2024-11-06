<template>
  <NewSummaryControl
    header="Real Estate Owned"
    :icon="icon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="RealEstate == null || RealEstate.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Real Estate Owned.</div>
        </v-col>
      </v-row>
      <v-row
        class="summary-content-container"
        v-else
        v-for="(property, index) in RealEstate"
        :key="index"
      >
        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">{{ getFormattedAddress(property) }}</div>
        </v-col>
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">Property Value:</div>
          <div class="summaryValue">
            ${{ getFormattedValue(property.PropertyEstimatedValueAmount) }}
          </div>
        </v-col>
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">Property Status:</div>
          <div class="summaryValue">
            {{ property.PropertyDispositionStatusType }}
          </div>
        </v-col>
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">Housing Expenses:</div>
          <div class="summaryValue">
            ${{ getFormattedValue(property.PropertyMaintenanceExpenseAmount) }}
          </div>
        </v-col>
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">Monthly Rental Income:</div>
          <div class="summaryValue">
            ${{ getFormattedValue(property.PropertyRentalIncomeGrossAmount) }}
          </div>
        </v-col>
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">Current Usage:</div>
          <div class="summaryValue">
            {{ getCurrentUsageText(property.PropertyCurrentUsageType) }}
          </div>
        </v-col>
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">Ownership Type:</div>
          <div class="summaryValue">
            {{ getPropertyOwnershipTypeText(property.OwnershipType) }}
          </div>
        </v-col>
        <v-col sm="12" cols="12" class="summaryItem position-relative">
          <MortgageLoansDesktop
            :property="property"
            :index="index"
            @removeLoanDetail="removeLoanDetail"
            :editable="false"
            class="mortgageLoansTable"
          ></MortgageLoansDesktop>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <v-form class="fast-fail form-outer-container">
        <div v-if="RealEstate.length">
          <v-row
            class="form-container deleteAbleItem"
            v-for="(property, index) in RealEstate"
            :key="index"
          >
            <PropertyData :index="index"></PropertyData>
            <v-col cols="12" sm="12" class="position-relative">
              <MortgageLoansDesktop
                :property="property"
                :index="index"
                @removeLoanDetail="removeLoanDetail"
                class="mortgageLoansTable overflow-hidden"
              ></MortgageLoansDesktop>
            </v-col>
          </v-row>
        </div>
        <v-row class="form-container addItemBtnContainer">
          <v-col class="itemContainer" cols="12" sm="8">
            <v-btn
              dense
              plain
              elevation="0"
              @click="addProperty"
              class="addItemBtn"
            >
              <v-icon small>mdi-plus</v-icon>
              <span class="addBtnText">Add Property</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </NewSummaryControl>
</template>

<script>
import PropertyData from "./PropertyData";
import MortgageLoansDesktop from "./MortgageLoansDesktop";
import currencyFormat from "@/mixins/currencyFormat.js";
import NewSummaryControl from "@/components/controls/NewSummaryControl";
import {
  propertyCurrentUsageTypes,
  propertyOwnershipTypes
} from "@/models/constants.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [currencyFormat],
  data() {
    return {
      icon: require("@/assets/images/accounts/summary/real-estate-owned.svg")
    };
  },
  methods: {
    ...mapActions([
      "setRealEstateEditingIndex",
      "setEditingPropertyDetails",
      "setRealEstate"
    ]),
    addProperty() {
      this.setRealEstateEditingIndex(this.RealEstate.length);
      this.setRealEstate([...this.RealEstate, {}]);
      // this.$router.push("/accountsandassets/address");
    },
    removeLoanDetail({ updatedRealEstate, index }) {
      const realEstates = [...this.RealEstate];
      realEstates[index] = updatedRealEstate;
      this.setRealEstate(realEstates);
    },
    getFormattedAddress(addressObj) {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      return keys.reduce((acc, cur) => {
        if (addressObj[cur]) {
          acc += `${addressObj[cur]}${cur === "PostalCode" ? " " : ", "}`;
        }
        return acc;
      }, "");
    },
    getCurrentUsageText(val) {
      let usageType = propertyCurrentUsageTypes.find(x => x.value === val);
      if (usageType == null) {
        return null;
      }
      return usageType.text;
    },
    getPropertyOwnershipTypeText(val) {
      let ownershipType = propertyOwnershipTypes.find(x => x.value === val);
      if (ownershipType == null) {
        return null;
      }
      return ownershipType.text;
    },
    onCancelClicked() {
      this.setRealEstate(this.dataBeforeEdit);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.RealEstate));
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate"
    })
  },
  components: {
    PropertyData,
    MortgageLoansDesktop,
    NewSummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";

.mobile {
  display: none;
}

.add-new {
  @media (min-width: 1024px) {
    padding-left: 10px;
  }
  &__title {
    font-weight: 500;
  }
}

.mortgageLoansTable {
  z-index: 1;
  width: 100%;
  :deep(table) {
    min-width: 900px;
  }
}
</style>
