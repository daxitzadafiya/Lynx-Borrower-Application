<template>
  <div class="declarations-data">
    <AboutProperty></AboutProperty>
    <AboutFinances></AboutFinances>
    <DemographicsInfo></DemographicsInfo>
    <div class="d-flex w-100 justify-end mt-5 pt-3">
      <Button value="Go to next section" width="auto" customClass="primary-button" @clicked="()=>saveAndAdvance(true)"></Button>
    </div>
  </div>
</template>

<script>
import AboutProperty from "./summaries/AboutProperty";
import AboutFinances from "./summaries/AboutFinances";
import DemographicsInfo from "./summaries/DemographicsInfo";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  components: {
    AboutProperty,
    AboutFinances,
    DemographicsInfo,
  }
};
</script>
