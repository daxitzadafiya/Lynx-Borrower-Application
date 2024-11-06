<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">What type of property did you own?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :value="declarations.PriorPropertyUsageType"
        @change="setDeclarationsProp"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in types"
            :key="index"
            :smVal="6"
            :mdVal="4"
            :lgVal="3"
            :value="item.title.replace(/ /g, '')"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
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
      types: [
        {
          src: require("@/assets/images/loan-property/primary-residence.svg"),
          title: "Primary Residence"
        },
        {
          src: require("@/assets/images/loan-property/second-home.svg"),
          title: "Second Home"
        },
        {
          src: require("@/assets/images/loan-property/investment-property.svg"),
          title: "Investment"
        },
        {
          src: require("@/assets/images/loan-property/secondary-residence.svg"),
          title: "FHA Secondary Residence"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setDeclarationsProp(type) {
      const Declarations = {
        ...this.declarations,
        PriorPropertyUsageType: type.replace(/ /g, "")
      };
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  computed: {
    isNextDisabled() {
      return !this.declarations.PriorPropertyUsageType;
    }
  },
  components: {
    ToggleCard
  }
};
</script>
