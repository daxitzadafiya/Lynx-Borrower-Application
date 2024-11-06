<template>
  <div class="content-container">
    <div class="content-header-container py-4">
      <div class="header-text">How will you occupy this property?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="activeType" @change="setOccupancy">
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in types" :key="index" :value="item.title">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!activeType"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import ToggleCard from "@/components/controls/ToggleCard";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      types: [
        {
          src: require("@/assets/images/loan-property/primary-residence.svg"),
          title: "Primary Residence"
        },
        {
          src: require("@/assets/images/loan-property/second-home.svg"),
          title: "Second/Vacation Home"
        },
        {
          src: require("@/assets/images/loan-property/investment-property.svg"),
          title: "Investment"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setProperty"]),
    setOccupancy(title) {
      const isFHA = title === "FHA Secondary Residence";
      let property = this.Property
        ? {
            ...this.Property,
            PropertyUsageType: title ? title.replace(/ /g, "") : ""
          }
        : { PropertyUsageType: title ? title.replace(/ /g, "") : "" };
      if (isFHA) {
        property.FHASecondaryResidenceIndicator = true;
      } else {
        delete property.FHASecondaryResidenceIndicator;
      }
      this.setProperty(property);
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty",
      LoanPurposeType: "getLoanPurposeType"
    }),
    activeType() {
      const type = this.Property ? this.Property.PropertyUsageType : "";
      if (type) {
        return type.substring(0, 3) === "FHA"
          ? `${type.substring(0, 3)} ${type
              .substring(3)
              .replace(/([a-z])([A-Z])/g, "$1 $2")}`
          : type.replace(/([a-z])([A-Z])/g, "$1 $2");
      }
      return "";
    }
  },
  components: {
    ToggleCard
  }
};
</script>