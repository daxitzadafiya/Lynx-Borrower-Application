<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter your previously Gross Monthly Income</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <PrevCompensationData></PrevCompensationData>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import PrevCompensationData from "./NewPrevCompensationData";

export default {
  components: {
    PrevCompensationData,
  }
};
</script>
