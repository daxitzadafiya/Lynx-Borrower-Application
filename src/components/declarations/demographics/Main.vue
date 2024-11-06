<template>
  <div class="content-container">
    <div class="inner-content-container">
      <div class="demographics-main__text text-black--text">
        <p>
          The purpose of collecting this information is to help ensure that all
          applicants are treated fairly and that the housing needs of
          communities and neighborhoods are being fulfilled. For residential
          mortgage lending, federal law requires that we ask applicants for
          their demographic information (ethnicity, sex, and race) in order to
          monitor our compliance with equal credit opportunity, fair housing,
          and home mortgage disclosure laws. You are not required to provide
          this information, but are encouraged to do so.
        </p>
        <p>
          The law provides that we may not discriminate on the basis of this
          information, or on whether you choose to provide it. However, if you
          choose not to provide the information and you have made this
          application in person, federal regulations require us to note your
          ethnicity, sex, and race on the basis of visual observation or
          surname. The law also provides that we may not discriminate on the
          basis of age or marital status information you provide in this
          application. Instructions: You may select one or more “Hispanic or
          Latino” origins and one or more designations for “Race.”
        </p>
        <p>
          If you do not wish to provide some or all of this information, select
          the applicable check box.
        </p>
        <v-row class="checkbox">
          <v-col class="checkbox__col" sm="2" md="1">
            <v-simple-checkbox
              light="light"
              v-model="isProvide"
              color="primary"
            ></v-simple-checkbox>
          </v-col>
          <v-col class="checkbox__col"
            >I do not wish to provide this information</v-col
          >
        </v-row>
      </div>
      <Information :isDisabled="isProvide" v-if="!isProvide"></Information>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="updateAndSave"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import Information from "./Information";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  data() {
    return {
      isProvide: true
    };
  },
  methods: {
    async updateAndSave() {
      this.saveAndAdvance(true);
    }
  },
  components: {
    Information
  }
};
</script>
