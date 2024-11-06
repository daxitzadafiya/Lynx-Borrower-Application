<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text primary-text">
        Do you have another job you would like to provide income details for?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/employment/previousemployment.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="haveAnotherJob"
          @input="setHaveAnotherJob"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :NextClicked="setIndexAndRedirect"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  mixins: [loanPatch],
  components: {
    AgreeToggle
  },
  data() {
    return {
      haveAnotherJob: null
    };
  },
  methods: {
    ...mapActions(["setAdditionalEmploymentIndex"]),
    setIndexAndRedirect() {
      if (this.haveAnotherJob) {
        this.setAdditionalEmploymentIndex(this.additionalEmployments.length);
        this.saveAndAdvance(
          "/employmentandincome/additional-employment-type"
        );
      } else {
        this.saveAndAdvance("/employmentandincome/other-income");
      }
    },
    setHaveAnotherJob(val) {
      this.haveAnotherJob = val;
    }
  },
  computed: {
    ...mapGetters({
      additionalEmployments: "getAdditionalEmployments"
    })
  }
};
</script>
