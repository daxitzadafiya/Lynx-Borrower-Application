<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Is there a person who is not your legal spouse but who currently has
        real property rights similar to those of a legal spouse?
      </div>
    </div>
    <v-form>
      <v-row class="form-container" justify="center">
        <v-col sm="12">
          <AgreeToggle
            :value="unmarriedAddendum.DomesticRelationshipIndicator || null"
            @input="setRelationshipIndicator"
          ></AgreeToggle>
        </v-col>
        <br />
        <template v-if="unmarriedAddendum.DomesticRelationshipIndicator">
          <Input
            defaultComponent="v-select"
            attach="attach"
            :value="unmarriedAddendum.DomesticRelationshipType || ''"
            :isRequired="true"
            :items="types"
            item-text="text"
            item-value="value"
            @change="
              value => setAddendumProp('DomesticRelationshipType', value)
            "
            inputTitle="Type of Relationship"
            :menu-props="{ bottom: true, offsetY: true }"
          />
          <Input
            inputTitle="Other Explain"
            v-if="unmarriedAddendum.DomesticRelationshipType === 'Other'"
            :value="unmarriedAddendum.DomesticRelationshipTypeOtherDescription"
            @input="
              e =>
                setAddendumProp('DomesticRelationshipTypeOtherDescription', e)
            "
          />
          <Input
            defaultComponent="v-select"
            attach="attach"
            :value="unmarriedAddendum.DomesticRelationshipStateCode"
            :isRequired="true"
            :items="usStates"
            item-text="Name"
            item-value="PostalAbbreviation"
            @change="
              value => setAddendumProp('DomesticRelationshipStateCode', value)
            "
            inputTitle="State"
            :menu-props="{ bottom: true, offsetY: true }"
          />
        </template>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import scrollToTop from "@/mixins/scrollToTop.js";
import loanPatch from "@/mixins/loanPatch.js";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  mixins: [scrollToTop, loanPatch],
  components: {
    AgreeToggle
  },
  props: {
    currentBorrower: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      types: [
        { text: "Civil Union", value: "CivilUnion" },
        { text: "Domestic Partnership", value: "DomesticPartnership" },
        {
          text: "Registered Reciprocal Beneficiary Relationship",
          value: "RegisteredReciprocalBeneficiaryRelationship"
        },
        { text: "Other", value: "Other" }
      ]
    };
  },
  methods: {
    setRelationshipIndicator(bool) {
      let updated = {
        ...this.unmarriedAddendum,
        DomesticRelationshipIndicator: bool
      };
      this.$emit("updateBorrower", {
        prop: "UnmarriedAddendum",
        value: updated
      });
    },
    setAddendumProp(prop, value) {
      let updated = { ...this.unmarriedAddendum, [prop]: value };
      if (prop === "DomesticRelationshipType" && value !== "Other") {
        delete updated.DomesticRelationshipTypeOtherDescription;
      }
      this.$emit("updateBorrower", {
        prop: "UnmarriedAddendum",
        value: updated
      });
    }
  },
  computed: {
    ...mapGetters({
      usStates: "getAllUsStates"
    }),
    unmarriedAddendum() {
      return this.currentBorrower.UnmarriedAddendum || {};
    },
    isNextDisabled() {
      return (
        this.unmarriedAddendum.DomesticRelationshipIndicator &&
        (this.currentBorrower.UnmarriedAddendum.DomesticRelationshipType ==
          null ||
          this.currentBorrower.UnmarriedAddendum
            .DomesticRelationshipStateCode == null)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/data.scss";

@media (min-width: 1024px) {
  .borrowers__title {
    max-width: 80%;
  }
}

.text-block {
  &__radios {
    padding-left: 10px;

    @media (max-width: 768px) {
      padding-left: 0;
    }
  }
}
</style>
