<template lang="pug">
    .account-details
        v-card-title.main__card-title
            h3.main__title.table-header-back-color.table-header-text-color Account Details
        v-card-text.text-block.text-black--text
            v-row.text-block__row
                v-col.text-block__col.lg-centered(sm="2" :cols="index === 0 || index === 3? 4 : 3" v-for="(detail, index) in details")
                    span.text {{ detail.text }}
                    .value 
                        span(v-if="detail.isCurrency") $
                        span {{ reportDetails ? (detail.isCurrency ? getFormattedValue(reportDetails[detail.prop]) : reportDetails[detail.prop]) : 0 }}
                        span(v-if="detail.isPercentage") %
                    
</template>

<script>
import { mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [currencyFormat],
  data() {
    return {
      details: [
        {
          text: "Debt/High Credit",
          prop: "DebtHighCredit",
          isPercentage: true
        },
        {
          text: "Revolving",
          prop: "RevolvingCreditUtilization",
          isPercentage: true
        },
        { text: "Accounts", prop: "TotalLiabilityCount" },
        { text: "Past Due", prop: "TotalLiabilityPastDue", isCurrency: true },
        { text: "Payments", prop: "TotalLiabilityPayment", isCurrency: true },
        { text: "Balance", prop: "TotalLiabilityBalance", isCurrency: true }
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

@media (max-width: 1024px) {
  .text-block {
    &__row {
      padding-right: 0;
      justify-content: space-between;
    }
    &__col {
      margin-bottom: 10px;
    }
  }
}
</style>
