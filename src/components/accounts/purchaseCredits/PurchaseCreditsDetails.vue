<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the Amount of each Purchase Credit you are receiving for this Loan</div>
    </div>
    <PurchaseCreditsDetailsData></PurchaseCreditsDetailsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import PurchaseCreditsDetailsData from "./NewPurchaseCreditsDetailsData";

export default {
  components: {
    PurchaseCreditsDetailsData,
  }
};
</script>
