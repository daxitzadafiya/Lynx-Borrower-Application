<template lang="pug">
    .borrowers(v-if="Borrower" :class="{'isBorrowersPage': isBorrowersPage}")
        .main-header(v-if="$route.name !== 'borrowers' && $route.name !== 'borrowers-summary'")
            //inline-svg.header-icon(:src="headerIcon")
            .header-title Borrowers - <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
        router-view(
            :currentBorrower="Borrower"
            :property="Property"
            @setProgressVisibility="setProgressVisibility"
            @updateBorrower="updateCurrentBorrower"
            )
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  methods: {
    ...mapActions(["updateBorrower"]),
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 1 });
    },
    updateCurrentBorrower({ prop, value }) {
      this.updateBorrower({ prop, value });
    },
  },
  data(){
    return{
      headerIcon: require("../assets/images/sidebar/borrowers.svg")
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower",
      Property: "getProperty",
    }),
    firstName() {
      return this.Borrower ? this.Borrower.FirstName : "";
    },
    lastName() {
      return this.Borrower ? this.Borrower.LastName : "";
    },
    isBorrowersPage(){
      return this.$route.name==="borrowers"
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
  },
};
</script>
<style scoped lang="scss">
.isBorrowersPage{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}
</style>