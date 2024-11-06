<template lang="pug">
  .content-container
    .content-header-container
      .header-text Did you have any living expenses at {{ currentResidence ? currentResidence.AddressLineText : '' }}?
    v-form(fast-fail)
      v-btn-toggle.btnToggleGroup(:value="currentResidence.ResidencyBasisType" @change="(value)=>updateResidenceProp({type, value, prop: 'ResidencyBasisType'})")
        v-row.form-container
          ToggleCard( v-for="({src, title, value}, index) in statuses" :key="index" :value="value")
            inline-svg(:src="src" :class="value==='None'?'stroked':''")
            p {{ title }}
    .navigation-container
              NavigationButtons()
</template>

<script>
import scrollToTop from "@/mixins/scrollToTop.js";
import { mapGetters, mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  mixins: [scrollToTop],
  data() {
    return {
      statuses: [
        {
          src: require("@/assets/images/borrowers/rent.svg"),
          title: "Rented",
          value: "Rent",
        },
        {
          src: require("@/assets/images/borrowers/own.svg"),
          title: "Owned",
          value: "Own",
        },
        {
          src: require("@/assets/images/borrowers/rent-free.svg"),
          title: "Lived Rent Free",
          value: "None",
        },
      ],
      type: "Prior",
    };
  },
  methods: {
    ...mapActions(["updateResidenceProp"]),
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence",
      borrowers: "getBorrowers",
    }),
    currentResidence() {
      return this.getSpecificResidence("Prior");
    }
  },
  components: {
    ToggleCard,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/residency.scss";
@import "@/assets/styles/general.scss";

@media (max-width: 760px) {
  .text-block {
    margin-top: 0;
    &__col {
      padding-top: 20px;
    }
  }
}
</style>
