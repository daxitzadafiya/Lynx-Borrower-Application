<template>
  <div class="documents">
    <div class="main-header">
      <inline-svg class="header-icon" :src="headerIcon"></inline-svg>
      <div class="header-title">
        Documents -
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
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
      headerTitle: "Documents",
      headerIcon: require("../assets/images/sidebar/documents.svg"),
    };
  },
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 10 });
    },
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser",
      Borrowers: "getBorrowers",
      Borrower: "getBorrower",
    }),
    coBorrower() {
      return this.Borrowers.length && !this.Borrower.CoBorrower
        ? this.Borrowers.find(
            (item) => item.CoBorrower && item.LinkedBorrowerId === this.Borrower.Id
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
    },
  },
  watch: {
    $route(to) {
      this.headerTitle = `${this.firstName}'s ` + to.meta.title;
    },
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
    this.headerTitle =
      `${this.firstName}'s ` + (this.$route.meta.title || this.headerTitle);
  },
};
</script>
