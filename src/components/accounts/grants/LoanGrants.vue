<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will you be utilizing a Grant or Down Payment Assistance Program (DPA)
        for this Loan?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/accounts/grant.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="utilizingGrant"
          @input="setUtilizingGrant"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="utilizingGrant === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters } from "vuex";
import scrollToTop from "@/mixins/scrollToTop.js";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  mixins: [scrollToTop],
  components: {
    AgreeToggle
  },
  data() {
    return {
      utilizingGrant: null
    };
  },
  methods: {
    ...mapActions(["setCurrentLoan"]),
    setUtilizingGrant(value) {
      this.utilizingGrant = value;
      this.setCurrentLoan({ ...this.currentLoan, ReceivingGrants: value });
    }
  },
  computed: {
    ...mapGetters({
      GiftsOrGrants: "getGiftsOrGrants",
      currentLoan: "getCurrentLoan"
    }),
    grants() {
      return this.GiftsOrGrants.filter(item => item.AssetType === "Grant");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/start.scss";

.accounts-main {
  @include main-generic;
  .main-container {
    height: 500px;
    @media (max-width: 768px) {
      height: 550px;
    }
    @media (max-width: 760px) {
      margin-top: 15px;
      max-height: 360px;
    }
  }
}

.slide {
  &__message {
    max-width: 680px;
  }
}
</style>
