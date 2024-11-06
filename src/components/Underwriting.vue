<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText" v-html="underwriteMessage"></div>
      <inline-svg
        class="titleImage my-8"
        :src="require('@/assets/images/credit/credit_order.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons
        NextButtonText="Submit Application"
        :HideProgresssAndPrevious="true"
        :HasDefaultNavigation="false"
        :NextClicked="underwrite"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      message: `<br>
                Please click the button below to submit your loan for approval.`,
    };
  },
  methods: {
    ...mapActions(["setUnderwriteMessage1", "setFindingsMessages", "underwrite"]),
  },
  computed: {
    ...mapGetters({
      underwriteMessage: "getUnderwriteMessage1",
    }),
  },
  components: {
    Button,
  },
  created() {
    this.setUnderwriteMessage1(this.message);
    this.setFindingsMessages("");
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.approved-main {
  @include main-generic;
  .main-container {
    max-width: 880px;
    @media (max-width: 768px) {
      max-width: 600px;
    }
    @media (max-width: 450px) {
      max-height: 430px;
    }
  }
}
</style>
