<template>
  <div class="content-container image-content-type">
    <div class="image-container" :class="{ 'fixed-height': !findingsMessages }">
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
        :src="require('@/assets/images/documents/start.svg')"
      />
      <pre
        v-html="findingsMessages"
        style="word-wrap:break-word; white-space:pre-wrap"
      ></pre>
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
import Button from "@/components/buttons/Button";
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      titleInformation: "getTitleInformation",
      user: "getCurrentUser",
      findingsMessages: "getFindingsMessages",
      underwriteMessage1: "getUnderwriteMessage1",
      underwriteMessage2: "getUnderwriteMessage2"
    }),
    proposedTitleInfo() {
      return (
        this.titleInformation.find(
          item => item.PropertyOwnerStatusType === "Proposed"
        ) || {}
      );
    }
  },
  methods: {
    ...mapActions(["logOut"])
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.image-container {
  height: 100%;
  max-width: 880px;

  @media (max-width: 768px) {
    max-width: 600px;
  }
}
</style>
