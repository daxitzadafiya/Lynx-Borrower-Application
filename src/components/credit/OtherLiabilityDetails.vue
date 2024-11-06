<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the Other Liability Details</div>
    </div>
    <OtherLiabilityDetailsData></OtherLiabilityDetailsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import OtherLiabilityDetailsData from "./OtherLiabilityDetailsData.vue";

export default {
  
  components: {
    OtherLiabilityDetailsData
  }
};
</script>

