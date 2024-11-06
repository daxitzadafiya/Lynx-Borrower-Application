<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        How did you hold title on this property?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :value="declarations.PriorPropertyTitleType"
        @change="setDeclarationsProp"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in options"
            :key="index"
            :smVal="4"
            :value="item.value"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :RequestedNextPath="computedNextRoute"
        :ConditionsMet="isNextDisabled"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  props: {
    declarations: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      options: [
        {
          src: require("@/assets/images/borrowers/unmarried.svg"),
          title: "By Yourself",
          value: "Sole"
        },
        {
          src: require("@/assets/images/declarations/with-spouse.svg"),
          title: "Jointly With Spouse",
          value: "JointWithSpouse"
        },
        {
          src: require("@/assets/images/declarations/with-another.svg"),
          title: "Jointly With Another Person",
          value: "JointWithOtherThanSpouse"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setDeclarationsProp(type) {
      const Declarations = {
        ...this.declarations,
        PriorPropertyTitleType: type.replace(/ /g, "")
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  components: {
    ToggleCard
  },
  computed: {
    ...mapGetters({
      LoanPurposeType: "getLoanPurposeType"
    }),
    computedNextRoute() {
      return this.LoanPurposeType === "Refinance"
        ? "/declarations/_6"
        : "/declarations/_5";
    },
    isNextDisabled() {
      return !this.declarations.PriorPropertyTitleType;
    }
  }
};
</script>
