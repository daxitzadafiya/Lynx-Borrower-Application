<template>
  <div style="display:contents;">
    <Input inputTitle="Employer or Business Name" :value="currentEmployment.FullName" @input="(val) =&gt; setEmploymentProp('FullName', val)"></Input>
    <Input inputTitle="Employer Phone" inputmode="tel" :lgVal="4" pattern="[0-9]*" :value="currentEmployment.PhoneNumber ? this.getFormattedPhone(currentEmployment.PhoneNumber) : ''" @input="(e) =&gt; setEmploymentProp('PhoneNumber', e)" @keypress="(e) =&gt; validatePhone(e)"></Input>
    <Input inputTitle="Ext" :lgVal="2" :value="currentEmployment.Ext || ''" type="number"></Input>
    <Input :id="inputId" @focus="geolocate" placeholder="" inputTitle="Employer Address" :value="currentEmployment.AddressLineText" @change="(val) =&gt; setEmploymentProp('AddressLineText', val)"></Input>
    <Input inputTitle="Unit #" :value="currentEmployment.AddressUnitIdentifier" @input="(val) =&gt; setEmploymentProp('AddressUnitIdentifier', val)"></Input>
    <Input inputTitle="Zip Code" :value="currentEmployment.PostalCode" @input="(val) =&gt; setEmploymentProp('PostalCode', val ? val.replace(/-/g,'') : '')" v-mask="'#####-####'"></Input>
    <Input inputTitle="City" :value="currentEmployment.CityName" @input="(val) =&gt; setEmploymentProp('CityName', val)"></Input>
    <Input inputTitle="State" :value="currentEmployment.StateCode" @input="(val) =&gt; setEmploymentProp('StateCode', val)"></Input>
    <Input attach="attach" defaultComponent="v-combobox" :menu-props="{light: true}" :value="currentEmployment.CountryCode" :items="countries" inputTitle="Country" @change="(val) =&gt; setEmploymentProp('CountryCode', val)"></Input>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import phoneFormat from "@/mixins/phoneFormat";
import onlyNum from "@/mixins/onlyNum.js";
import googleAutoComplete from "@/mixins/googleAutoComplete.js";

export default {
  mixins: [phoneFormat, onlyNum, googleAutoComplete],
  props: {
    status: {
      type: String,
      default: ""
    },
    classification: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      countries: ["United States"],
      statusType: "Current",
      classificationType: "Primary"
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    validatePhone(e) {
      if (e.target.value.length === 14) {
        e.preventDefault();
        return false;
      }
      return this.isOnlyNum(e);
    },
    handleAddressData(addressData) {
      const Employments = [...this.Employment];
      const updatedEmployment = { ...this.currentEmployment, ...addressData };
      if (this.classificationType !== "Secondary") {
        const primaryIndex = Employments.findIndex(
          item =>
            item &&
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
        );
        if (primaryIndex !== -1) {
          Employments[primaryIndex] = updatedEmployment;
        } else {
          Employments.push(updatedEmployment);
        }
        this.updateBorrower({ prop: "Employment", value: Employments });
      } else {
        this.setAdditionalEmploymentProp(null, updatedEmployment);
      }
    },
    setEmploymentProp(prop, val) {
      if (prop.indexOf("Phone") !== -1) {
         val = val.replace(/[()]|-| /g, "");
      }
      if (this.currentEmployment.EmploymentClassificationType === "Secondary") {
        return this.setAdditionalEmploymentProp(prop, val);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const Employment = this.Employment.map(item => {
          if (
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
          ) {
            item[prop] = val;
          }
          return item;
        });
        this.updateBorrower({ prop: "Employment", value: Employment });
      } else {
        this.updateBorrower({
          prop: "Employment",
          value: [
            ...this.Employment,
            {
              EmploymentStatusType: this.statusType,
              EmploymentClassificationType: this.classificationType,
              [prop]: val
            }
          ]
        });
      }
    },
    setAdditionalEmploymentProp(prop, val) {
      if (prop.indexOf("Phone") !== -1) {
        val = val.replace(/[()]|-| /g, "");
      }
      let additionals = [...this.additionalEmployments];
      if (!prop) {
        additionals[this.employmentEditingIndex] = { ...val };
      } else {
        additionals[this.employmentEditingIndex] = {
          ...this.currentEmployment,
          [prop]: val
        };
      }
      const filtered = this.Employment.length
        ? this.Employment.filter(
            item => item.EmploymentClassificationType !== "Secondary"
          )
        : [];
      this.updateBorrower({
        prop: "Employment",
        value: [...filtered, ...additionals]
      });
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment",
      additionalEmployments: "getAdditionalEmployments",
      employmentIndex: "getAdditionalEmploymentIndex"
    }),
    currentEmployment() {
      if (this.classificationType === "Secondary") {
        return (
          this.additionalEmployments[this.employmentEditingIndex] || {
            EmploymentClassificationType: "Secondary"
          }
        );
      }
      if (this.Employment.length) {
        const employment = this.Employment.find(
          item =>
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
        );
        return employment || {};
      }
      return {};
    },
    employmentEditingIndex() {
      return this.index !== -1 ? this.index : this.employmentIndex;
    }
  },
  beforeMount() {
    const { status, classification } = this.$route.meta;
    this.statusType = this.status || status;
    this.classificationType = this.classification || classification;
    this.inputId = this.statusType.toLowerCase();
  }
};
</script>