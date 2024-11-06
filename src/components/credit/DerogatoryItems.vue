<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please take a moment to review the derogatory items we have found on
        your credit report, which may include Collections, Bankruptices, and
        Foreclosures
      </div>
    </div>
    <div class="inner-content-container">
      <div class="body-2 pb-3 infoText" style="max-width:unset">
        <span
          >If you would like to provide us any additional information about a
          liability, please click the pencil </span
        ><span>
          <inline-svg :src="editIcon" class="tableInfoIcon"></inline-svg></span
        ><span>link.</span>
      </div>
      <Table></Table>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import Table from "@/components/credit/derogatoryItems/NewTable";

export default {
  components: {
    Table
  },
  data() {
    return {
      editIcon: require("@/assets/images/edit.svg")
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.infoText {
  color: $gray2;
}
</style>
