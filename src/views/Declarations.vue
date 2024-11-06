<template>
  <div class="declarations">
    <div class="main-header">
      <inline-svg class="header-icon" :src="headerIcon"></inline-svg>
      <div class="header-title">Declarations - <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span></div>
    </div>
    <!--<div class="header-secondary-title" v-html="headerTitle"></div>-->
    <router-view :declarations="declarations" @saveAndRedirect="({route}) => saveAndAdvance(true, route)"></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  data() {
    return {
      headerTitle: "Declarations",
      headerIcon: require("../assets/images/sidebar/declarations.svg"),

    };
  },
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 7 });
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower"
    }),
    declarations() {
      return this.Borrower && this.Borrower.Declarations
        ? this.Borrower.Declarations
        : {};
    },
    firstName() {
      return this.Borrower.FirstName || "";
    },
    lastName() {
      return this.Borrower.LastName || "";
    }
  },
  watch: {
    $route(to) {
      this.headerTitle = `${this.firstName}'s ` + to.meta.title;
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
    this.headerTitle =
      `${this.firstName}'s ` + (this.$route.meta.title || this.headerTitle);
  }
};
</script>
