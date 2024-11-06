<template>
  <v-col
    :cols="colsVal"
    :md="mdVal"
    :sm="smVal"
    :lg="lgVal"
    class="itemContainer"
  >
    <v-btn
      :disabled="bordered"
      plain
      :value="value"
      :class="{
        cardBtn: true,
        'v-item--active': isChecked,
        bordered: bordered
      }"
    >
      <div class="btnContent"><slot /></div>
      <v-icon class="checkCircle">check_circle</v-icon>
    </v-btn>
  </v-col>
</template>
<script>
export default {
  props: {
    mdVal: {
      type: [String, Number]
    },
    lgVal: {
      type: [String, Number]
    },
    smVal: {
      type: [String, Number],
      default: 4
    },
    colsVal: {
      type: Number,
      default: 12
    },
    value: {
      type: [String, Boolean]
    },
    isChecked: {
      type: Boolean
    },
    bordered: {
      type: Boolean
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
.itemContainer {
  .cardBtn {
    width: 100%;
    background-color: #f4f3f2;
    border-radius: 7px;
    height: 137px !important;
    position: relative;
    z-index: 1;

    :deep(.v-btn__content) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 1 !important;
      color: $icon-inactive-color;
      position: static;
      width: calc(100% - 40px);
      p {
        width: 100%;
        white-space: break-spaces;
      }
    }
    &:hover {
      :deep(.btnContent) {
        opacity: 0.7 !important;
      }
    }
    .checkCircle {
      position: absolute;
      right: -10px;
      top: -10px;
      border-radius: 50%;
      color: $icon-color !important;
      z-index: 2;
      background-color: white;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
    :deep(p) {
      margin-top: 12px;
      text-transform: none;
      letter-spacing: 0px;
    }
    :deep(svg *) {
      fill: $icon-inactive-color !important;
    }

    :deep(svg.stroked *) {
      stroke: $icon-inactive-color !important;
      fill: transparent !important;
    }

    :deep(svg.noStroke *) {
      stroke: transparent !important;
    }
    &.v-item--active {
      background-color: white;
      border: 2px solid $icon-color !important;
      &.v-btn {
        border-color: $icon-color !important;
      }
      :deep(.v-btn__content) {
        color: $icon-color;
      }
      :deep(svg *) {
        fill: $icon-color !important;
      }
      :deep(svg.stroked *) {
        stroke: $icon-color !important;
        fill: transparent !important;
      }
      .checkCircle {
        opacity: 1;
      }
    }
    &.bordered {
      border: 2px solid $icon-color !important;
      cursor: default;
    }
  }
}

:deep(svg) {
  max-height: 65px;
}
</style>
