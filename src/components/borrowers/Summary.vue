<template lang="pug">
.borrowers-data
    .review-header
        //v-icon.main-header__image.icon-color-main folder_open
        span.review-header__title.text-black--text {{ currentBorrower.FirstName ? `${currentBorrower.FirstName}'s` : '' }} Borrower Information Summary
        // .review-button
        //     span.review-button__title.process-green--text Add Borrower
        //     Add(@add="inviteBorrower")
    PersonalInfo(:currentBorrower="currentBorrower" @updateBorrower="({prop, value}) => $emit('updateBorrower', {prop, value})")
    MilitaryInfo(:currentBorrower="currentBorrower" @updateBorrower="({prop, value}) => $emit('updateBorrower', {prop, value})")
    CurrentResInfo(:isEmptyMailing="isMailing" @toggleMailingAddress="toggleIsMailing" @renderPrioirResidence="showPriorResidence" :showAddPriorResidenceButton="showAddPriorResidenceButton")
    MailingResInfo(v-if="isMailing" ref="mailingResidenceInfo" @onStateChanged="mailingResidenceChangeButtonClicked")
    PriorResInfo(v-if="priorResidenceDataAvailable || priorResidenceVisible" ref="priorResidenceInfo" @onCancelEdit="priorResidenceEditCancelled")
    .d-flex.w-100.justify-end.mt-5.pt-3
    NavigationButtons(
      NextButtonText="Go to next section" 
      NextBtnWidth="auto" 
      :HideProgresssAndPrevious="true")
</template>

<script>
import PersonalInfo from "@/components/borrowers/summaries/PersonalInfo";
import MilitaryInfo from "@/components/borrowers/summaries/MilitaryInfo";
import CurrentResInfo from "@/components/borrowers/summaries/CurrentResInfo";
import MailingResInfo from "@/components/borrowers/summaries/MailingResInfo";
import PriorResInfo from "@/components/borrowers/summaries/PriorResInfo";
import Button from "@/components/buttons/Button";
import Add from "@/components/buttons/Add";
import scrollToTop from "@/mixins/scrollToTop.js";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  data() {
    return {
      isMailing: false,
      priorResidenceVisible: false
    };
  },
  mixins: [scrollToTop, loanPatch],
  props: {
    currentBorrower: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    ...mapActions([
      "saveLoanPatches",
      "getInvitations",
      "toggleIsOnlay"
    ]),
    toggleIsMailing({ value }) {
      this.isMailing = value;
      if (this.isMailing) {
        this.$nextTick(() => {
          this.$refs.mailingResidenceInfo.changeToEditMode();
        });
      }
    },
    async inviteBorrower() {
      await this.getInvitations();
      this.toggleIsOnlay({ isOnlay: true, onlayComponent: "borrower" });
    },
    showPriorResidence() {
      this.priorResidenceVisible = true;
      this.$nextTick(() => {
        this.$refs.priorResidenceInfo.changeToEditMode();
      });
    },
    priorResidenceEditCancelled() {
      this.priorResidenceVisible = false;
    },
    mailingResidenceChangeButtonClicked() {
      if (!this.mailingResidenceDataAvailable) {
        this.isMailing = false;
      }
    }
  },
  computed: {
    ...mapGetters({
      Dependents: "getDependents",
      getSpecificResidence: "getSpecificResidence"
    }),
    selectedDate() {
      return moment(this.date).format("MMMM DD, YYYY");
    },
    isDisabled() {
      if (!this.Dependents.Count) return false;
      return (
        !this.Dependents.Ages ||
        this.Dependents.Ages.length !== this.Dependents.Count
      );
    },
    priorResidenceDataAvailable() {
      let priorResidence = this.getSpecificResidence("Prior");
      if (
        priorResidence.BorrowerResidencyType &&
        priorResidence.AddressLineText
      ) {
        return true;
      }
      return false;
    },
    mailingResidenceDataAvailable() {
      let priorResidence = this.getSpecificResidence("Mailing");
      if (
        priorResidence.BorrowerResidencyType &&
        priorResidence.AddressLineText
      ) {
        return true;
      }
      return false;
    },
    showAddPriorResidenceButton() {
      return !this.priorResidenceDataAvailable && !this.priorResidenceVisible;
    }
  },
  components: {
    Button,
    Add,
    PersonalInfo,
    MilitaryInfo,
    CurrentResInfo,
    MailingResInfo,
    PriorResInfo
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
</style>
