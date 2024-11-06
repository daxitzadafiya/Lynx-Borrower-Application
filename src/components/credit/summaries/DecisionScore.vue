<template lang="pug">
SummaryControl(:header="`Decision Score - ${scoreValue}`" :isReadOnly="true")
  template(v-slot:displayContent)
    v-row.py-0.mx-0
      .title.mt-1.mb-1.mx-auto Credit Scores for: {{`${borrower.FirstName} ${borrower.LastName}`}}
    v-row.py-2.mx-0.justify-center(v-if="borrowerScores.length" style="margin-bottom: -43px")
        v-col.pb-0.pt-1.d-flex.justify-center.flex-row-reverse.gauageContainer(cols="auto" style="position:relative")
          div.d-flex.align-center(v-for="(item, index) in borrowerScores" :key="index" v-if="index<=2" style="position:relative;" :class="$vuetify.breakpoint.sm?'px-3':$vuetify.breakpoint.mdAndUp?'px-5':''")
            Gauge(:levels="guageLevels" :value="item.Score" :width="evaluateSize(index===1)" :height="evaluateSize(index===1)")
                template(v-slot:content)
                  .d-flex.flex-column.align-center(:style="{transform: index===1? 'scale(1)':'scale(0.7)'}")
                    .headline.mb-2 {{item.Score}}
                    .image(:style="{backgroundImage: 'url(' + item.image + ')'}")


            .overlay(v-if="index!=1")
          .line(v-if="coBorrowerScores.length")
    v-row.mx-0.py-0.mt-9(v-if="coBorrowerScores.length" style="margin-bottom: -5px;")
      .title.mt-6.mx-auto Credit Scores for: {{`${coBorrower.FirstName} ${coBorrower.LastName}`}}
    v-row.mx-0.py-2.mt-0.coBorrower(v-if="coBorrowerScores.length" style="margin-bottom: -43px").justify-center
        v-col.pb-0.mt-0.d-flex.flex-row-reverse.justify-center.gauageContainer(cols="auto" style="position:relative")
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
import { mapGetters } from "vuex";
import Gauge from "@/components/controls/Gauge";
import SummaryControl from "@/components/controls/SummaryControl";

//.credit-data__report-link.pt-5.mt-5.text-center(v-if="creditOrderId" @click="getFullReportAndRedirect") See Full Report
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
    SummaryControl,
    Gauge
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

.main {
  &__title {
    margin-bottom: 0;
  }
}

.text-block {
  @media (min-width: 1024px) {
    padding-left: 45px;
  }
}

.name {
  font-weight: 500;
  font-size: 16px;
}

.l-p-15 {
  padding-left: 15px;
}

.scores {
  margin-top: 10px;
  span {
    padding: 0 5px;
    border-right: 1px solid;
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      border: none;
    }
  }
  &_opacity-07 {
    opacity: 0.7;
  }
}

.center-aligned {
  align-items: center;
}

.no-padding-right {
  padding-right: 0;
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


.text {
  font-size: 12px;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .no-padding-right {
    padding-right: 10px;
    padding-bottom: 15px;
  }
  .scores {
    span {
      display: block;
      border: none;
      padding: 0;
    }
  }
  .l-p-15 {
    padding-left: 10px;
  }
}

@media (max-width: 760px) {
  .name {
    margin-top: 20px;
  }
  .image {
    margin: 20px 0;
  }
}

@media (max-width: 600px) {
  .coBorrower {
    margin-bottom: -20px !important;
  }
  .gauageContainer {
    padding-bottom: 20px !important;
  }
}

:deep(.viewModeContent) {
  overflow: hidden;
}

.line {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: $primary-text-color;
  bottom: 0;
  position: absolute;
}


</style>
