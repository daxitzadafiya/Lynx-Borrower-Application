<template lang="pug">
  div(style="display:contents;")
    v-col.itemContainer.itemDeleteCrossContainer(cols="12" sm="12")
      v-btn(dense icon @click="remove(index)")
        v-icon(small) mdi-close
    v-col.itemContainer(cols="12" sm="12").d-flex.propertyHeader
      h3.mr-5.pr-5 Property {{ `#${index+1}` }}
      v-checkbox.defaultCheckbox.pt-0.mt-0(hide-details dense:isChecked="property.OwnedPropertySubjectIndicator" @toggle="({value}) => updateRealEstateProp({value:value, prop: 'OwnedPropertySubjectIndicator'})" label="Subject Property")

    AddressEditor.mt-2(:addressObj="property" :lgVal="4" :mdVal="6" @addressUpdated="updateRealEstateAddress" @addressPropUpdated="updateRealEstateProp" :uniqueInputId="inputId")
    Input(
                      inputTitle="Property Value"
                      :value="getFormattedValue(property.PropertyEstimatedValueAmount)"
                      prefix="$"
                      :lgVal="4"
                      :mdVal="6"
                      @input="(e) => updateRealEstateProp({value:+e.replace(/,/g, ''), prop:'PropertyEstimatedValueAmount'})"
                      @keypress="(e) => isOnlyNum(e, true)"
                  )
    Input(
                      attach=true
                      defaultComponent="v-select"
                      :value="property.PropertyDispositionStatusType"
                      :items="statuses"
                      :lgVal="4"
                      :mdVal="6"
                      inputTitle="Property Status"
                      :menu-props="{bottom: true, offsetY: true }"
                      @change="(e) => updateRealEstateProp({value:e, prop:'PropertyDispositionStatusType'})"
                  )
    Input(
                      @click="editItem"
                      inputTitle="Housing Expenses"
                      :value="getFormattedValue(property.PropertyMaintenanceExpenseAmount) || ''"
                      prefix="$"
                      :lgVal="4"
                      :mdVal="6"
                      readonly
                      append-icon="mdi-pencil icon-color-main"
                  )
    
    Input(
      inputTitle="Monthly Rental Income"
                      :value="getFormattedValue(property.PropertyRentalIncomeGrossAmount)"
                      prefix="$"
                      :lgVal="3"
                      :mdVal="6"
                      @input="(e) => updateRealEstateProp({value:+e.replace(/,/g, ''), prop: 'PropertyRentalIncomeGrossAmount'})"
                      @keypress="(e) => isOnlyNum(e, true)"
                  )
    UsageTypesData(:index="index" :lgVal="3" :mdVal="6")
    Input(
                      attach
                      inputTitle="Ownership Type"
                      defaultComponent="v-select"
                      :items="ownershipTypes"
                      item-text="text"
                      item-value="value"
                      :lgVal="3"
                      :mdVal="6"
                      :value="property.OwnershipType"
                      :menu-props="{bottom: true, offsetY: true }"
                      @change="(e) => updateRealEstateProp({value:e, prop:'OwnershipType'})"
                  )
    v-dialog(
            v-model="isDialog"
            max-width="290"
        )
            v-card
                v-card-title.d-flex.justify-center.mb-4.text-black--text Are you sure? 
                v-card-text
                    v-row.justify-space-around
                        Button(
                            value="Yes"
                            customClass="button-yes"
                            width="120px"
                            @clicked="removeProperty")
                        Button(
                            value="No"
                            width="120px"
                            customClass="button-no"
                            isOutlined=true
                            @clicked="isDialog=false")
</template>

<script>
import CheckBox from "@/components/form/CheckBox";
import Button from "@/components/buttons/Button";
import UsageTypesData from "../NewUsageTypesData";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import  { propertyOwnershipTypes } from "@/models/constants.js"
import { mapActions, mapGetters } from "vuex";
import AddressEditor from "@/components/form/AddressEditor";

export default {
  mixins: [onlyNum, currencyFormat],
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      statuses: ["Retain", "Sold", "Pending Sale"],
      countries: ["United States"],
      inputId: "",
      isDialog: false,
      removeIndex: -1,
      ownershipTypes: propertyOwnershipTypes
    };
  },
  methods: {
    ...mapActions([
      "toggleIsOnlay",
      "setRealEstateEditingIndex",
      "setEditingPropertyDetails",
      "setRealEstate"
    ]),
    editItem() {
      const {
        AddressLineText,
        CityName,
        StateCode,
        PostalCode
      } = this.property;
      this.setEditingPropertyDetails({
        title: `Property #${this.index + 1}`,
        location: `${AddressLineText}, ${CityName}, ${StateCode}, ${PostalCode}`
      });
      this.setRealEstateEditingIndex(this.index);
      this.toggleIsOnlay({ onlayComponent: "expenses", isOnlay: true });
    },
    updateRealEstateAddress(value) {
      const updatedRealEstate = { ...this.property, ...value };
      let RealEstates = [...this.RealEstate];
      RealEstates[this.index] = updatedRealEstate;
      this.setRealEstate(RealEstates);
    },
    updateRealEstateProp({ value, prop }) {
      const updatedRealEstate = { ...this.property, [prop]: value };
      let RealEstates = [...this.RealEstate];
      RealEstates[this.index] = updatedRealEstate;
      this.setRealEstate(RealEstates);
    },
    removeProperty() {
      const RealEstates = this.RealEstate.filter((item, i) => i !== this.index);
      this.setRealEstate(RealEstates);
      this.isDialog = false;
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate"
    }),
    property() {
      return this.RealEstate[this.index] || {};
    },
    expensesTotal() {
      const keys = [
        "PropertyInsuranceExpenseAmount",
        "PropertyTaxesExpenseAmount",
        "PropertyMaintenanceExpenseAmount"
      ];
      return keys.reduce((acc, cur) => {
        if (cur in this.property)
          acc += !isNaN(this.property[cur]) ? +this.property[cur] : 0;
        return acc;
      }, 0);
    }
  },
  components: {
    CheckBox,
    Button,
    UsageTypesData,
    AddressEditor
  },
  beforeMount() {
    this.inputId = `autocomplete-${this.index}`;
  },
  mounted() {
    if (!this.property.OwnershipType) {
      this.updateRealEstateProp({ value: "Individual", prop: "OwnershipType" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.propertyHeader{
  z-index: 0;
}
</style>
