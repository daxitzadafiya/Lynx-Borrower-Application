<template lang="pug">
.d-flex.justify-center.navButtonsContianer
  Button(
    value="Previous",
    :customClass="'previous-button'+(NextBtnWidth?'':' variableButtonWidth')",
    :style="previousPage?'opacity:0;pointer-events:none;':''"
    :isOutlined="true",
    @clicked="navigateToPreviousPage"
    v-if="!HideProgresssAndPrevious"
  )
  .d-flex.justify-center.flex-grow-1.progressContainer(v-if="!HideProgresssAndPrevious")
    .position-absolute.d-flex.justify-center.align-center.progressInnerContainer(ref="progressContainer")
      .activeProgressDotContainer
        .progressDot(
          v-for="(index) in computedActivePagesArray",
        )
      .inactiveProgressDotContainer
        .progressDot(
          v-for="(index, i) in computedInActivePagesArray",
          :style="'transform:scale('+(1-(computedPageDivideFactor-1)*0.03*(i+1))+')'"
        )
  Button(
    :value="NextButtonText",
    :customClass="'primary-button'+(NextBtnWidth?'':' variableButtonWidth')",
    :isDisabled="isNextDisabled",
    @clicked="onNextClicked"
    :width="NextBtnWidth"
  )
</template>

<script>
import { mapGetters } from "vuex";

import Button from "@/components/buttons/Button";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  props: {
    ConditionsMet: {
      type: Boolean,
      default: false
    },
    NextButtonText: {
      type: String,
      default: "Next"
    },
    SaveOnNextClick: {
      type: Boolean,
      default: true
    },
    HasDefaultNavigation: {
      type: Boolean,
      default: true
    },
    NextBtnWidth: {
      type: String,
      default: undefined
    },
    RequestedNextPath: {
      type: String
    },
    NextClicked: {
      type: Function
    },
    HideProgresssAndPrevious: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Button
  },
  data() {
    return {
      totalDotsWidthAvailable: null
    };
  },
  mounted() {
    this.setTotalDotWidthAvailable();
    window.addEventListener("resize", this.setTotalDotWidthAvailable);
  },
  unmounted() {
    window.removeEventListener("resize", this.setTotalDotWidthAvailable);
  },
  methods: {
    async onNextClicked(){
      
      if (this.NextClicked){
         this.NextClicked();
      }
      
      if (this.HasDefaultNavigation) {
        this.saveAndAdvance(this.SaveOnNextClick, this.RequestedNextPath);
      } else if (this.RequestedNextPath){
        this.$router.push("/" + this.RequestedNextPath);
      }

    },
    navigateToPreviousPage() {
      this.$router.back();
      this.$emit("previousClicked");
    },
    setTotalDotWidthAvailable() {
      if (this.$refs.progressContainer != null) {
        this.totalDotsWidthAvailable =
          this.$refs.progressContainer.getBoundingClientRect().width - 10; //10=margin
      }
    }
  },
  computed: {
    ...mapGetters({
      nextButtonConditionsOverriden: "getIsNextButtonConditionsOverriden",
      currentSectionAndPageData: "getCurrentSectionAndPageData",
      currentSection: "getCurrentSection",
      onLoadHistoryLength: "getOnLoadHistoryLength",
      appHistoryLength: "getAppHistoryLength"
    }),
    isNextDisabled() {
      let nbo = this.nextButtonConditionsOverriden;
      let cm = this.ConditionsMet;
      return nbo ? false : cm;
    },
    previousPage() {
      return this.appHistoryLength <= 1;
    },
    pages() {
      if (this.currentSection.Pages == null) {
        return [];
      }
      var computedPagesLength = this.currentSection.Pages.length - 1;
      if (
        this.currentSection.Pages[
          this.currentSection.Pages.length - 1
        ].Route.includes("summary")
      ) {
        computedPagesLength--;
      }
      if (
        this.currentSection.Pages[
          this.currentSection.Pages.length - 2
        ].Route.includes("review")
      ) {
        computedPagesLength--;
      }
      return Array.from({ length: computedPagesLength + 1 }, (_, i) => i);
    },
    computedPageDivideFactor() {
      if (this.totalDotsWidthAvailable < 19) {
        return Infinity;
      }
      const dotsSpace = this.totalDotsWidthAvailable / 19;
      let divisor = 1;
      if (dotsSpace == 0) {
        return;
      }
      while (this.pages.length / divisor > dotsSpace) {
        divisor++;
      }

      return divisor;
    },
    computedPagesArray() {
      if (this.computedPageDivideFactor == Infinity) {
        return [];
      }
      return Array.from(
        {
          length: Math.ceil(this.pages.length / this.computedPageDivideFactor)
        },
        (_, i) => i
      );
    },
    computedActivePagesArray() {
      return this.computedPagesArray.filter(
        index =>
          this.currentSectionAndPageData.PageIndex /
            this.computedPageDivideFactor >=
          index
      );
    },
    computedInActivePagesArray() {
      return this.computedPagesArray.filter(
        index =>
          this.currentSectionAndPageData.PageIndex /
            this.computedPageDivideFactor <
          index
      );
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/variables.scss";
.progressDot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #b8b4b3;
  margin: 0px 5px;
}

.inactiveProgressDotContainer,
.activeProgressDotContainer {
  display: contents;
}

.activeProgressDotContainer {
  .progressDot {
    background: $header-back-color;
  }
}
.navButtonsContianer {
  padding: $content-padding-x;
  @media (max-width: $tablet-width) {
    padding: $content-padding-tablet-y $content-padding-tablet-x;
  }
  @media (max-width: $mobile-width) {
    padding: $content-padding-mobile-y $content-padding-mobile-x;
  }
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.progressContainer {
  position: relative;
  margin: 0px 5px;
  .progressInnerContainer {
    width: calc(100% - 10px);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  }
}

:deep(.variableButtonWidth) {
  @media (max-width: $tablet-width) {
    width: 100px !important;
  }
  @media (max-width: $mobile-width) {
    width: 75px !important;
  }
}

:deep(.v-btn) {
  border-radius: 5px;
}
</style>
