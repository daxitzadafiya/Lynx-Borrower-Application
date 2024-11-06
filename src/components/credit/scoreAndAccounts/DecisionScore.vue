<template lang="pug">
div(style="display:contents;")
    .content-header-container
        .header-text 
          span Decision Score -
          span.primary-text &nbsp;{{ scoreValue }}
    .inner-content-container.mt-2(v-if="borrowerScores.length")
        v-row.py-0
          .title.mx-auto Credit Scores for: {{`${borrower.FirstName} ${borrower.LastName}`}}
        v-row.py-2.justify-center(style="margin-bottom: -43px")
            v-col.pb-0.pt-1.d-flex.justify-center.flex-row-reverse.gauageContainer(cols="auto" style="position:relative")
              div.d-flex.align-center(v-for="(item, index) in borrowerScores" :key="index" v-if="index<=2" style="position:relative;" :class="$vuetify.breakpoint.sm?'px-3':$vuetify.breakpoint.mdAndUp?'px-5':''")
                Gauge(:levels="guageLevels" :value="item.Score" :width="evaluateSize(index===1)" :height="evaluateSize(index===1)")
                    template(v-slot:content)
                      .d-flex.flex-column.align-center(:style="{transform: index===1? 'scale(1)':'scale(0.7)'}")
                        .headline.mb-2 {{item.Score}}
                        .image(:style="{backgroundImage: 'url(' + item.image + ')'}")


                .overlay(v-if="index!=1")
              .line(v-if="coBorrowerScores.length")
        v-row.py-0.mt-10(v-if="coBorrowerScores.length")
          .title.mt-5.mx-auto Credit Scores for: {{`${coBorrower.FirstName} ${coBorrower.LastName}`}}
        v-row.py-2(v-if="coBorrowerScores.length" style="margin-bottom: -43px").justify-center
            v-col.pb-0.pt-1.d-flex.flex-row-reverse.justify-center.gauageContainer(cols="auto" style="position:relative")
              div.d-flex.align-center(v-for="(item, index) in coBorrowerScores" :key="index" v-if="index<=2" style="position:relative;" :class="$vuetify.breakpoint.sm?'px-3':$vuetify.breakpoint.mdAndUp?'px-5':''")
                Gauge(:levels="guageLevels" :value="item.Score" :width="evaluateSize(index===1)" :height="evaluateSize(index===1)")
                    template(v-slot:content)
                      .d-flex.flex-column.align-center(:style="{transform: index===1? 'scale(1)':'scale(0.7)'}")
                        .headline.mb-2 {{item.Score}}
                        .image(:style="{backgroundImage: 'url(' + item.image + ')'}")
                .overlay(v-if="index!=1")
              .line(v-if="borrowers.length > 2")
</template>

<script>
// .credit-data__report-link.pt-5.mt-5.text-center(v-if="creditOrderId" @click="getFullReportAndRedirect") See Full Report

import { mapGetters } from "vuex";
import Gauge from "@/components/controls/Gauge";
export default {
  data() {
    return {
      agencies: {
        Experian: require("@/assets/images/credit/experian_logo.png"),
        Equifax: require("@/assets/images/credit/equifax_logo.png"),
        TransUnion: require("@/assets/images/credit/transunion.png")
      },
      guageLevels: [
        {
          color: "#F61828",
          start: 300,
          end: 579
        },
        {
          color: "#FAE045",
          start: 580,
          end: 669
        },
        {
          color: "#9DDF9C",
          start: 670,
          end: 739
        },
        {
          color: "#6BBE6A",
          start: 740,
          end: 799
        },
        {
          color: "#2F9C1D",
          start: 800,
          end: 850
        }
      ]
    };
  },
  methods: {
    evaluateSize(isMiddle) {
      let val = this.$vuetify.breakpoint.xs
        ? 130
        : this.$vuetify.breakpoint.sm
        ? 200
        : 220;
      return isMiddle ? val : val * 0.7;
    },
    async getFullReportAndRedirect() {
      try {
        const result = await lynxApi.getFullCreditReport(this.creditOrderId);
        const newBlob = new Blob([result], { type: "application/pdf" });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement("a");
        link.href = data;
        link.target = "_blank";
        // link.download="file.pdf";
        link.click();
        setTimeout(function() {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
        }, 100);
      } catch (err) {
        console.log(err);
      }
    }
  },
  computed: {
    ...mapGetters({
      reportDetails: "getCreditReportDetails",
      borrowers: "getBorrowers",
      selectedBorrower: "getBorrower",
      creditOrderId: "getCreditOrderId"
    }),
    borrower() {
      if (this.coBorrower && this.coBorrower.Id === this.selectedBorrower.Id) {
        return this.borrowers.find(
          item =>
            item.LinkedBorrowerId === this.selectedBorrower.Id &&
            !item.CoBorrower
        );
      }
      return this.selectedBorrower;
    },
    coBorrower() {
      if (this.borrowers.length) {
        return this.borrowers.find(
          item =>
            item.CoBorrower &&
            (this.selectedBorrower.Id === item.Id ||
              this.selectedBorrower.Id === item.LinkedBorrowerId)
        );
      }
      return null;
    },
    borrowerScores() {
      if (this.reportDetails) {
        const details = JSON.parse(
          JSON.stringify(this.reportDetails.ApplicantDetails)
        );
        const borrowerScores = details.find(
          item =>
            item.FirstName === this.borrower.FirstName &&
            item.LastName === this.borrower.LastName
        );
        return borrowerScores
          ? borrowerScores.CreditScores.sort((a, b) =>
              a.Score < b.Score ? 1 : -1
            ).map(item => {
              item.image = this.agencies[item.Source];
              return item;
            })
          : [];
      }
      return [];
    },
    coBorrowerScores() {
      if (this.reportDetails) {
        const details = JSON.parse(
          JSON.stringify(this.reportDetails.ApplicantDetails)
        );
        if (this.coBorrower) {
          const coScores = details.find(
            item =>
              item.FirstName === this.coBorrower.FirstName &&
              item.LastName === this.coBorrower.LastName
          );
          return coScores
            ? coScores.CreditScores.sort((a, b) =>
                a.Score < b.Score ? 1 : -1
              ).map(item => {
                item.image = this.agencies[item.Source];
                return item;
              })
            : [];
        }
      }
      return [];
    },
    scoreValue() {
      if (this.borrowerScores.length) {
        const midVal = this.borrowerScores.map(item => item.Score).sort()[1];
        if (this.coBorrowerScores.length) {
          const coMidVal = this.coBorrowerScores
            .map(item => item.Score)
            .sort()[1];
          return Math.min(midVal, coMidVal);
        }
        return midVal;
      }
      return 0;
    }
  },
  components: {
    Gauge
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
@import "@/assets/styles/colors.scss";

.text-block {
  &__row {
    align-items: center;
  }
}

.text-center {
  padding: 8px 0;
  max-height: 52px !important;
  box-sizing: border-box;
}

.table-header-row {
  th {
    font-weight: bold;
  }
}

.image-cell {
  padding: 10px 0 0 0;
  width: 120px;
}

.image {
  height: 25px;
  width: 80px;
  background-repeat: no-repeat;
  background-position-y: bottom;
  background-size: contain;
  margin: 0 auto;
}

.score {
  width: 259px;
  height: 171px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  @media (max-width: 760px) {
    height: 120px;
    width: 100%;
    margin-top: 15px;
  }
}

@media (max-width: 760px) {
  tbody tr:last-child {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
  .image-cell {
    width: 90px;
  }
  .image {
    width: 65px;
  }
}
.fullWidth {
  width: 100%;
}
.overlay {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 100%;
}
.line {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: $primary-text-color;
  bottom: 0;
  position: absolute;
}
.gauageContainer {
  @media only screen and (max-width: 675px) {
    flex-direction: column;
    align-items: center;
  }
}

.credit-data {
  @include main-data;
  .v-divider {
    margin-top: 25px;
  }
  &__report-link {
    font-size: 18px;
    font-weight: 500;
    text-decoration: underline;
    margin-bottom: 15px;
    margin-left: 35px;
    cursor: pointer;
  }
}
</style>
