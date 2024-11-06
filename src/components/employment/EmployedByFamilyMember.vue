<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        {{ mainTitleVerb }} you employed by a family member?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/employment/partytotransaction.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="SpecialBorrowerEmployerRelationshipIndicatorValue"
          @input="setRelationship"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  components: {
    AgreeToggle
  },
  data() {
    return {
      statusType: "Current",
      classificationType: "Primary",
      routePrepend: ""
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setRelationship(bool) {
      if (this.currentEmployment.EmploymentClassificationType === "Secondary") {
        return this.setAdditionalEmploymentRelationship(bool);
      } else if (
        this.currentEmployment.EmploymentClassificationType &&
        this.currentEmployment.EmploymentClassificationType !== "Secondary"
      ) {
        const Employment = this.Employment.map(item => {
          if (
            item.EmploymentClassificationType === this.classificationType &&
            item.EmploymentStatusType === this.statusType
          ) {
            item.EmployedByFamilyMember = bool;
            // item.SpecialBorrowerEmployerRelationshipIndicator =
            //   bool || item.EmployedByPartyToTransaction
            //     ? bool
            //     : item.SpecialBorrowerEmployerRelationshipIndicator;
            item.SpecialBorrowerEmployerRelationshipIndicator = bool;
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
              EmployedByFamilyMember: bool,
              SpecialBorrowerEmployerRelationshipIndicator: bool
            }
          ]
        });
      }
    },
    setAdditionalEmploymentRelationship(bool) {
      let additionals = [...this.additionalEmployments];
      additionals[this.employmentEditingIndex] = {
        ...this.currentEmployment,
        EmployedByFamilyMember: bool,
        SpecialBorrowerEmployerRelationshipIndicator:
          (bool |
            additionals[this.employmentEditingIndex]
              .EmployedByPartyToTransaction) ===
          1
      };
      const filtered = this.Employment.length
        ? this.Employment.filter(
            item => item.EmploymentClassificationType !== "Secondary"
          )
        : [];
      this.updateBorrower({
        prop: "Employment",
        value: [...filtered, ...additionals]
      });
    },
    handleRouteMeta() {
      const { status, classification } = this.$route.meta;
      this.statusType = status;
      this.classificationType = classification;
      if (status !== "Current" || classification !== "Primary") {
        this.routePrepend =
          status !== "Current" ? `${status.toLowerCase()}-` : "additional-";
      }
    }
  },
  computed: {
    ...mapGetters({
      Employment: "getBorrowerEmployment",
      additionalEmployments: "getAdditionalEmployments",
      employmentEditingIndex: "getAdditionalEmploymentIndex"
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
    mainTitleVerb() {
      return this.$route.meta.status === "Previous" ? "Were" : "Are";
    },
    SpecialBorrowerEmployerRelationshipIndicatorValue() {
      if (
        this.currentEmployment.SpecialBorrowerEmployerRelationshipIndicator ===
        null
      ) {
        return null;
      } else {
        return this.currentEmployment
          .SpecialBorrowerEmployerRelationshipIndicator;
      }
    }
  },
  beforeMount() {
    this.handleRouteMeta();
  }
};
</script>
