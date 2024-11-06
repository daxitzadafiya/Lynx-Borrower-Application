<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please provide the contact information for your {{status}} employer</div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <v-row class="form-container">
        <ContactDetailsData></ContactDetailsData>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
    </div>
  </div>
            
</template>

<script>
import ContactDetailsData from "./NewContactDetailsData";
import scrollToTop from "@/mixins/scrollToTop.js";

export default {
  mixins: [scrollToTop],
  data() {
    return {
      routePrepend: "",
      status: "current"
    };
  },
  components: {
    ContactDetailsData,
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
  },
  computed:{
    nextRoute(){
      return `employmentandincome/${this.routePrepend}compensation-types`
    }
  }
};
</script>
