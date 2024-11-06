<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the details for your {{status}} Position{{status === 'previous' ? '' : '/Title' }}</div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <v-row class="form-container">
        <PositionTitleData></PositionTitleData>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
    </div>
  </div>

</template>

<script>
import PositionTitleData from "./NewPositionTitleData";

export default {
  data() {
    return {
      routePrepend: "",
      status: "current"
    };
  },
  components: {
    PositionTitleData
  },
  computed: {
    nextRoute() {
      if (this.status === "previous") {
        return "employmentandincome/previous-compensation-details";
      }
      return `employmentandincome/${this.routePrepend}contact-details`;
    }
  },
  beforeMount() {
    const { status, classification } = this.$route.meta;
    if (status === "Previous") {
      this.status = "previous";
    }
    if (status !== "Current" || classification !== "Primary") {
      this.routePrepend =
        status !== "Current" ? `${status.toLowerCase()}-` : "additional-";
    }
  }
};
</script>
