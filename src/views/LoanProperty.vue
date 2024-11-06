<template lang="pug">
    .loan
        .main-header
          .header-title Loan & Property
        router-view(@saveAndRedirect="({route}) => saveAndAdvance(true, route)")
</template>

<script>
import loanPatch from "@/mixins/loanPatch.js";
import { mapGetters } from "vuex";

export default {
  mixins: [loanPatch],
  methods: {
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 2 });
    }
  },
  data(){
    return{
      headerIcon: require("../assets/images/sidebar/loan-property.svg")
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower",
    }),
    firstName() {
      return this.Borrower ? this.Borrower.FirstName : "";
    },
    lastName() {
      return this.Borrower ? this.Borrower.LastName : "";
    },
  },
};
</script>
