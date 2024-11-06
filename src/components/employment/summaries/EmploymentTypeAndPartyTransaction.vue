<template lang="pug">
  div(style="display:contents;")
    v-col.itemContainer(sm="12" cols="12")
      v-radio-group.radioGroup(row hide-details :value="currentEmployment.SpecialBorrowerEmployerRelationshipIndicator" @change="(val)=>{setEmploymentProp('SpecialBorrowerEmployerRelationshipIndicator', val)}"
      label="I am employed by a family member, property seller, real estate agent, or other party to the transaction.")
        v-radio(label="No" :value="false")
        v-radio(label="Yes" :value="true")
    v-col.itemContainer(sm="6" cols="12")
      v-radio-group.radioGroup.mt-5.pt-4(row hide-details :value="currentEmployment.EmploymentBorrowerSelfEmployedIndicator" @change="(val)=>{setEmploymentProp('EmploymentBorrowerSelfEmployedIndicator', val)}"
      label="Business Owner or Self-Employed")
        v-radio(label="No" :value="false")
        v-radio(label="Yes" :value="true")
    Input(
                  defaultComponent="v-combobox"
                  :lgVal="6"
                    attach=true
                    hide-details
                    :value="percentage"
                    @change="setPercentage"
                    :items="percentages"
                    inputTitle="Ownership percentage"
                    )
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
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
      percentages: [
        "My Ownership Share is < 25%",
        "My Ownership Share is 25% or Greater"
      ],
      isPartyToTransaction: false,
      isSelfEmployed: true
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setEmploymentProp(prop, val) {
      if (this.currentEmployment.EmploymentClassificationType === "Secondary") {
        return this.setAdditionalEmploymentProp(prop, val);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const Employment = this.Employment.map(item => {
          if (
            item.EmploymentClassificationType === this.classification &&
            item.EmploymentStatusType === this.status
          ) {
            item[prop] = val;
          }
          if (prop === "EmploymentBorrowerSelfEmployedIndicator" && !val) {
            delete item.OwnershipInterestType;
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
              EmploymentStatusType: this.status,
              EmploymentClassificationType: this.classification,
              [prop]: val
            }
          ]
        });
      }
    },
    setPercentage(percentage) {
      if (!percentage) return;
      const interest =
        percentage === "My Ownership Share is 25% or Greater"
          ? "GreaterThanOrEqualTo25Percent"
          : "LessThan25Percent";
      this.setEmploymentProp("OwnershipInterestType", interest);
    },
    setAdditionalEmploymentProp(prop, val) {
      let additionals = [...this.additionalEmployments];
      let updated = { ...this.currentEmployment, [prop]: val };
      if (prop === "EmploymentBorrowerSelfEmployedIndicator" && !val) {
        delete additionals[this.employmentEditingIndex].OwnershipInterestType;
      }
      additionals[this.employmentEditingIndex] = updated;
      const filtered = this.Employment.length
        ? this.Employment.filter(
            item => item.EmploymentClassificationType !== "Secondary"
          )
        : [];
      this.updateBorrower({
        prop: "Employment",
        value: [...filtered, ...additionals]
      });
      this.$emit("saveAndRedirect", {
        route: `/employmentandincome/additional-position-title`
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
      if (this.classification === "Secondary") {
        return (
          this.additionalEmployments[this.employmentEditingIndex] || {
            EmploymentClassificationType: "Secondary"
          }
        );
      }
      if (this.Employment.length) {
        const employment = this.Employment.find(
          item =>
            item.EmploymentClassificationType === this.classification &&
            item.EmploymentStatusType === this.status
        );
        return employment || {};
      }
      return {};
    },
    employmentEditingIndex() {
      return this.index !== -1 ? this.index : this.employmentIndex;
    },
    percentage() {
      if (this.currentEmployment.OwnershipInterestType == undefined) return "";
      return this.currentEmployment.OwnershipInterestType ===
        "GreaterThanOrEqualTo25Percent"
        ? "My Ownership Share is 25% or Greater"
        : "My Ownership Share is < 25%";
    }
  },
};
</script>

<style lang="scss" scoped>
:deep(legend){
  flex: 1;
}
</style>
