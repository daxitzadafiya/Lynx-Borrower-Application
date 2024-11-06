<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will there be a Co-Borrower on this loan with you?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/borrowers/co_borrower.svg')"
      />
      <AgreeToggle
        class="my-5"
        :value="hasCoBorrower"
        @input="setHasCoBorrower"
      ></AgreeToggle>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="onNextClicked"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import AgreeToggle from "@/components/controls/AgreeToggle";
import scrollToTop from "@/mixins/scrollToTop.js";
import loanPatch from "@/mixins/loanPatch.js";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [scrollToTop, loanPatch],
  data() {
    return {
      hasCoBorrower: null
    };
  },
  created() {
    this.hasCoBorrower =
      this.borrowers.findIndex(x => x.CoBorrower === true) !== -1
        ? this.borrowers.findIndex(x => x.CoBorrower === true) !== -1
        : null;
  },
  methods: {
    ...mapActions(["updateBorrower", "toggleIsOnlay", "getInvitations"]),
    async openAddCoBorrowerPopup() {
      await this.getInvitations();
      this.toggleIsOnlay({ isOnlay: true, onlayComponent: "borrower" });
    },
    async onNextClicked() {
      if (this.hasCoBorrower) {
        this.openAddCoBorrowerPopup();
      } else {
        await this.saveAndAdvance(true);
      }
    },
    setHasCoBorrower(value) {
      this.hasCoBorrower = value;
    }
  },
  computed: {
    ...mapGetters({
      isOnlay: "getIsOnlay",
      onlayComponent: "getOnlayComponent",
      borrowers: "getBorrowers"
    })
  },
  components: {
    AgreeToggle
  },
  watch: {
    async isOnlay(val) {
      if (val === false && this.onlayComponent !== "borrower") {
        await this.saveAndAdvance(true);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/military.scss";
</style>
