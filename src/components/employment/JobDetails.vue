<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the details for your {{status}} job</div>
    </div>
    <JobDetailsData></JobDetailsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>

</template>

<script>
import JobDetailsData from "./JobDetailsData";

export default {
  data() {
    return {
      routePrepend: "",
      status: "current",
      classification: ""
    };
  },
  components: {
    JobDetailsData
  },
  computed: {
    
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
    this.classification = classification;
  }
};
</script>