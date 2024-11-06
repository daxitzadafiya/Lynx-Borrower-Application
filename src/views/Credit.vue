<template>
  <div class="credit">
    <div class="main-header">
      <div class="header-title">
        Credit & Liabilities -
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
        <span class="font-weight-regular" v-if="coBorrower">
          & {{ coBorrower.FirstName }} {{ coBorrower.LastName }}
        </span>
      </div>
    </div>
    <router-view
      @saveAndRedirect="({ route }) => saveAndAdvance(true, route)"
    ></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  data() {
    return {
      isCard: true,
      hasImage: true,
      headerIcon: require("../assets/images/sidebar/credit-liabilities.svg"),
      headerTitle: "Order Credit Report"
    };
  },
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 3 });
    }
  },
  watch: {
    $route(to) {
      this.headerTitle = to.meta.title;
      this.isCard = !!to.meta.isCard;
      this.hasImage = !!to.meta.hasImage;
      if (to.meta.isUserInfo) {
        this.headerTitle += ` (${this.firstName} ${
          this.coBorrower ? " & " + this.coFirstName : ""
        }- $22,176)`;
      }
    }
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser",
      Borrowers: "getBorrowers",
      Borrower: "getBorrower"
    }),
    coBorrower() {
      return this.Borrowers.length && !this.Borrower.CoBorrower
        ? this.Borrowers.find(
            item =>
              item.CoBorrower && item.LinkedBorrowerId === this.Borrower.Id
          )
        : null;
    },
    firstName() {
      return this.Borrower ? this.Borrower.FirstName : "";
    },
    coFirstName() {
      return this.coBorrower ? this.coBorrower.FirstName : "";
    },
    lastName() {
      return this.Borrower ? this.Borrower.LastName : "";
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
    this.headerTitle = this.$route.meta.title;
    this.isCard = !!this.$route.meta.isCard;
    this.hasImage = !!this.$route.meta.hasImage;
    if (this.$route.meta.isUserInfo) {
      this.headerTitle += ` (${this.firstName} ${
        this.coBorrower ? " & " + this.coFirstName : ""
      }- $22,176)`;
    }
  }
};
</script>
