<template lang="pug">
    v-card.pb-1
        v-card-title Demographics Collection Method
        v-card-text
            v-row.ma-0.mb-2.pa-0.d-flex.flex-wrap
                v-col.pa-1(lg="10" cols="6")
                v-checkbox(
                    label="HMDA Ethnicity Collected Based On Visual Observation Or Surname Indicator"
                    :input-value="demographics.HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator"
                    @change="(value) => updateDemographics('HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator', value)"
                    class="ma-0 pa-0"
                    dense
                    hide-details
                    )
            v-row.ma-0.mb-2.pa-0.d-flex.flex-wrap
                v-col.pa-1(lg="10" cols="6")
                v-checkbox(
                    label="HMDA Gender Collected Based On Visual Observation Or Name Indicator"
                    :input-value="demographics.HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator"
                    @change="(value) => updateDemographics('HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator', value)"
                    class="ma-0 pa-0"
                    dense
                    hide-details
                    )
            v-row.ma-0.mb-2.pa-0.d-flex.flex-wrap
                v-col.pa-1(lg="10" cols="6")
                v-checkbox(
                    label="HMDA Race Collected Based On Visual Observation Or Surname Indicator"
                    :input-value="demographics.HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator"
                    @change="(value) => updateDemographics('HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator', value)"
                    class="ma-0 pa-0"
                    dense
                    hide-details
                    )
            v-row.ma-0.pa-0.d-flex.flex-wrap
                v-col.pa-1.d-flex(lg="2" cols="4")
                    span.font-weight-medium.align-self-center Application Taken Method Type
                v-col.pa-1(lg="10" cols="6")
                    v-select.mx-1.my-0(light dense
                        :items="takenTypes" 
                        item-text="text" 
                        item-value="value" 
                        placeholder="Application Taken Method Type" 
                        :value="demographics.ULADApplicationTakenMethodType"
                        @change="(value) => updateDemographics('ULADApplicationTakenMethodType', value)"
                        :menu-props="{light: true}"
                        style="max-width:300px; max-height:33px"
                        )                
        Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Button from "@/components/buttons/Button";

export default {
  data() {
    return {
      takenTypes: [
        {
          text: "Email",
          value: "Email"
        },
        {
          text: "Face To Face",
          value: "FaceToFace"
        },
        {
          text: "Fax",
          value: "Fax"
        },
        {
          text: "Internet",
          value: "Internet"
        },
        {
          text: "Mail",
          value: "Mail"
        },
        {
          text: "Telephone",
          value: "Telephone"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["updateBorrower", "saveLoanPatches"]),
    updateDemographics(prop, value) {
      const updated = { ...this.demographics, [prop]: value };
      this.updateBorrower({ prop: "Demographics", value: updated });
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower"
    }),
    demographics() {
      return this.Borrower && this.Borrower.Demographics
        ? this.Borrower.Demographics
        : {};
    }
  },
  components: {
    Button
  }
};
</script>
