<template lang="pug">
    .negative-items
        v-card-title.main__card-title
            h3.main__title.table-header-back-color.table-header-text-color Negative Items
        v-card-text.text-block.text-black--text
            v-row.text-block__row
                v-col.text-block__col.lg-centered(sm="3" md="2" cols="5" v-for="(detail, index) in details")
                    span.text {{ detail.text }}
                    .value {{ reportDetails ? reportDetails[detail.prop] : 0 }}                    
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      details: [
        { text: "Charge Offs", prop: "LiabilityChargeOffCount" },
        { text: "Public Records", prop: "PublicRecordCount" },
        { text: "Bankruptcies", prop: "LiabilityBankruptcyCount" },
        { text: "Collections", prop: "LiabilityCollectionCount" }
      ]
    };
  },
  computed: {
    ...mapGetters({
      reportDetails: "getCreditReportDetails"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";

.text-block {
  &__row {
    padding-right: 100px;
  }
}

.text {
  font-size: 12px;
  text-decoration: underline;
}

.value {
  font-weight: 500;
}

@media (min-width: 768px) {
  .lg-centered {
    text-align: center;
  }
}

@media (max-width: 760px) {
  .text-block {
    &__row {
      padding-right: 0;
    }
    &__col {
      margin-bottom: 10px;
    }
  }
}
</style>
