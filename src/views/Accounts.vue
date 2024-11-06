<template lang="pug">
    .accounts
        .main-header
            .header-title Account & Assets - <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
        .header-secondary-title {{ headerTitle }}
        router-view(@saveAndRedirect="({route}) => saveAndAdvance(true, route)")
</template>

<script>
import { mapGetters } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  data() {
    return {
      headerTitle: "Accounts & Assets",
      isUserInfo: false,
      headerIcon: require("../assets/images/sidebar/accounts-assets.svg"),
    };
  },
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 4 });
    },
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser",
      borrower: "getBorrower"
    }),
    firstName() {
      return this.borrower && this.borrower.FirstName
        ? this.borrower.FirstName
        : "";
    },
    lastName() {
      return this.borrower && this.borrower.LastName
        ? this.borrower.LastName
        : "";
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
    this.headerTitle = this.$route.meta.title;
  },
  watch: {
    $route(to) {
      this.headerTitle = to.meta.title;
    }
  }
};
</script>
