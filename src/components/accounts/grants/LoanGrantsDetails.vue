<template lang="pug">
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the details for each of the Grants or Down Payment Assistance you've indicated that you have received or will be receiving for this Loan ( DPA )</div>
    </div>
    <LoanGrantsData></LoanGrantsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import LoanGrantsData from "./NewLoanGrantsData";

export default {
  components: {
    LoanGrantsData,
  }
};
</script>
