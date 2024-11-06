<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        <pre
          v-html="underwriteMessage1"
          style="word-wrap:break-word; white-space:pre-wrap"
        ></pre>
      </div>
      <br />
      <div class="titleSecondaryText primary-text font-weight-bold">
        <pre
          v-html="underwriteMessage2"
          style="word-wrap:break-word; white-space:pre-wrap"
        ></pre>
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/credit/credit_order.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons
        NextButtonText="Log Out"
        :HideProgresssAndPrevious="true"
        :HasDefaultNavigation="false"
        :NextClicked="logOut"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      underwriteMessage1: "getUnderwriteMessage1",
      underwriteMessage2: "getUnderwriteMessage2"
    })
  },
  methods: {
    ...mapActions(["logOut"])
  }
};
</script>
