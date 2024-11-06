<template>
  <div class="svgWrapper">
    <svg :width="width" :height="height" :viewbox="`0 0 ${width} ${height}`">
      <path
        v-for="(level, index) in levels"
        :key="index"
        :d="getPath(index)"
        :stroke="level.color"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
      ></path>
      <circle
        v-if="value !== null"
        :cx="valueCirclePositionX"
        :cy="valueCirclePositionY"
        :r="valueCircleRadius"
        :stroke="valueCircleStroke"
        :stroke-width="valueCircleThickness"
        fill="white"
      />
    </svg>
    <div class="contentWrapper mt-5">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    strokeWidth: {
      type: Number,
      default: 10
    },
    levels: {
      type: Array,
      required: true
    },
    totalAngle: {
      type: Number,
      default: 270
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    levelAngleGap: {
      type: Number,
      default: 8
    },
    value: {
      type: Number,
      default: null
    },
    valueCircleRadius: {
      type: Number,
      default: 10
    },
    valueCircleThickness: {
      type: Number,
      default: 4
    }
  },
  methods: {
    getPath(index) {
      let curLevelStartAndEndAngles = this.getLevelStartAndEndAngles(index);
      return `M ${this.convertAngleToPosition(
        curLevelStartAndEndAngles.startAngle
      )} A ${this.computedXRadius} ${this.computedYRadius} 0 ${
        curLevelStartAndEndAngles.endAngle -
          curLevelStartAndEndAngles.startAngle >
        90
          ? "1"
          : "0"
      } 1 ${this.convertAngleToPosition(curLevelStartAndEndAngles.endAngle)}`;
    },
    getLevelStartAndEndAngles(index) {
      let calculatedStartAngle =
        this.getStartAngle -
        (this.getSingleSectionAngle + this.levelAngleGap) * index;
      return {
        startAngle: calculatedStartAngle,
        endAngle: calculatedStartAngle - this.getSingleSectionAngle
      };
    },
    convertAngleToPosition(angle) {
      return `${this.getTotalPadding +
        this.computedXRadius +
        this.computedXRadius * this.getCos(angle)} ${this.getTotalPadding +
        this.computedYRadius -
        this.computedYRadius * this.getSin(angle)}`;
    },
    getSin(angleInDegree) {
      return Math.sin((angleInDegree * Math.PI) / 180);
    },
    getCos(angleInDegree) {
      return Math.cos((angleInDegree * Math.PI) / 180);
    },
  },
  computed: {
    getStartAngle() {
      return 270 - (360 - this.totalAngle) / 2;
    },
    getSingleSectionAngle() {
      return (
        (this.totalAngle - this.levelAngleGap * (this.levels.length - 1)) /
        this.levels.length
      );
    },
    computedXRadius() {
      return this.width / 2 - this.getTotalPadding;
    },
    computedYRadius() {
      return this.height / 2 - this.getTotalPadding;
    },
    valueSectionIndex() {
      return this.levels.findIndex(
        x => x.start <= this.value && x.end >= this.value
      );
    },
    valueCirclePositionX() {
      return (
        this.getTotalPadding +
        this.computedXRadius +
        this.computedXRadius * this.getCos(this.getAngleFromValue)
      );
    },
    valueCirclePositionY() {
      return (
        this.getTotalPadding +
        this.computedYRadius -
        this.computedYRadius * this.getSin(this.getAngleFromValue)
      );
    },
    valueCircleStroke() {
      return this.levels[this.valueSectionIndex].color;
    },
    getTotalPadding() {
      if (
        this.strokeWidth == null &&
        this.valueCircleRadius == null &&
        this.valueCircleThickness == null
      ) {
        return 0;
      }
      let valueCircleThicknessAndRadius =
        (this.valueCircleRadius == null ? 0 : this.valueCircleRadius) +
        (this.valueCircleThickness == null ? 0 : this.valueCircleThickness);
      if (this.strokeWidth < valueCircleThicknessAndRadius) {
        return valueCircleThicknessAndRadius;
      } else {
        return this.strokeWidth;
      }
    },
    getAngleFromValue() {
      return (
        this.getStartAngle -
        (this.getSingleSectionAngle + this.levelAngleGap) *
          this.valueSectionIndex -
        ((this.value - this.levels[this.valueSectionIndex].start) /
          (this.levels[this.valueSectionIndex].end -
            this.levels[this.valueSectionIndex].start)) *
          this.getSingleSectionAngle
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.svgWrapper {
  position: relative;
  width: fit-content;
}
.contentWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  flex-direction: column;
}
</style>
