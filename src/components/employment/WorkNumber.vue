<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Since you indicated you are a W2 wage earner, we can attempt to
        automatically retrieve your employment and income details from the
        federal database.
      </div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        Would you like us to do this on your behalf?
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/employment/worknumber.svg')"
      />
      <v-form class="my-5">
        <AgreeToggle
          :value="loadDataOnYourBehalf"
          @input="setLoadDataOnYourBehalf"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        RequestedNextPath="employmentandincome/employedByFamilyMember"
        :ConditionsMet="loadDataOnYourBehalf === null"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import AgreeToggle from "@/components/controls/AgreeToggle";

export default {
  data() {
    return {
      loadDataOnYourBehalf: null
    };
  },
  methods: {
    setLoadDataOnYourBehalf(bool) {
      this.loadDataOnYourBehalf = bool;
    }
  },
  components: {
    AgreeToggle
  }
};
</script>
