<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Do you have any living expenses at
        {{ currentResidence ? currentResidence.AddressLineText : "" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :value="currentResidence.ResidencyBasisType"
        @change="
          value => {
            updateResidenceProp({ type, value, prop: 'ResidencyBasisType' });
          }
        "
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="({ src, title, value }, index) in statuses"
            :key="index"
            :value="value"
          >
            <inline-svg
              :src="src"
              :class="value === 'None' ? 'stroked' : ''"
            ></inline-svg>
            <p>{{ title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!this.currentResidence.ResidencyBasisType"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";
import loanPatch from "@/mixins/loanPatch";

export default {
  mixins: [loanPatch],
  data() {
    return {
      statuses: [
        {
          src: require("@/assets/images/borrowers/rent.svg"),
          title: "Rent",
          value: "Rent"
        },
        {
          src: require("@/assets/images/borrowers/own.svg"),
          title: "Own",
          value: "Own"
        },
        {
          src: require("@/assets/images/borrowers/rent-free.svg"),
          title: "Living Rent Free",
          value: "LivingRentFree"
        }
      ],
      type: "Current"
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp"]),
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence",
      borrowers: "getBorrowers"
    }),
    currentResidence() {
      return this.getSpecificResidence("Current");
    }
  },
  created() {
  },
  components: {
    ToggleCard
  }
};
</script>
