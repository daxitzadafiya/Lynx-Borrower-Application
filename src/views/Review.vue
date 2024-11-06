<template>
  <div class="review">
    <div class="main-header">
      <inline-svg class="header-icon stroked" :src="headerIcon"></inline-svg>
      <div class="header-title">
        Review -
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

export default {
  data() {
    return {
      headerTitle: "Review",
      headerIcon: require("../assets/images/sidebar/review.svg"),
    };
  },
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 11 });
    },
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
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
};
</script>
