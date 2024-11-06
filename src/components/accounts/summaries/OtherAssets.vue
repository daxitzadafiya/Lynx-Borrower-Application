<template lang="pug">
    .assets-summary
        v-card-title.main__card-title
            h3.main__title.table-header-text.table-header-back Other Assets You Have
        OtherAssetDetailsData
</template>

<script>
import OtherAssetDetailsData from "../OtherAssetDetailsData";

export default {
  components: {
    OtherAssetDetailsData
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";
</style>
