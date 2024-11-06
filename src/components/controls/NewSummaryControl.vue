<template>
  <div class="summaryCard">
    <div
      class="header d-flex align-center flex-wrap jusitfy-end"
      style="justify-content: end;"
    >
      <div class="flex-grow-1 pr-2 d-flex align-center">
        <div class="topIcon" v-if="icon">
          <inline-svg class="icon controlIcon" :src="icon"></inline-svg>
        </div>
        <div
          class="headerText font-weight-bold pl-2 pl-md-0"
          style="line-height: 35px;"
        >
          {{ (isEditMode ? "Change " : "") + header }}
        </div>
      </div>
      <div class="headerButtons ml-md-1 d-flex" v-if="!isReadOnly">
        <v-btn
          class="summaryCardSecondaryButton "
          v-if="!isEditMode"
          @click="edit"
          elevation="0"
        >
          <inline-svg class="icon editIcon" :src="editIcon"></inline-svg>
        </v-btn>
        <v-btn
          class="summaryCardSecondaryButton"
          v-if="isEditMode"
          elevation="0"
          @click="cancel"
        >
          <inline-svg class="icon" :src="closeIcon"></inline-svg>
        </v-btn>
        <v-btn
          class="summaryCardPrimaryButton ml-3"
          v-if="isEditMode"
          elevation="0"
          @click="save"
          :disabled="submitDisabled"
        >
          <inline-svg class="icon" :src="checkIcon"></inline-svg>
        </v-btn>
      </div>
    </div>
    <div class="summaryCardBody">
      <div
        class="d-flex flex-column"
        :style="!isEditMode ? 'display:none !important;' : ''"
      >
        <slot name="editContent"></slot>
      </div>
      <div
        class="d-flex w-100 summaryCardViewMode overflow-hidden"
        :style="isEditMode ? 'display:none !important;' : ''"
      >
        <div class="flex-grow-1 mt-auto mb-auto viewModeContent">
          <slot name="displayContent"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditMode: false,
      editIcon: require("@/assets/images/pencil.svg"),
      checkIcon: require("@/assets/images/check.svg"),
      closeIcon: require("@/assets/images/close.svg")
    };
  },
  props: {
    icon: {
      type: String
    },
    header: {
      type: String,
      required: true
    },
    submitDisabled: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    edit() {
      this.$emit("edit");
      this.isEditMode = true;
    },
    cancel() {
      this.$emit("cancel");
      this.isEditMode = false;
    },
    save() {
      this.$emit("save");
      this.isEditMode = false;
    }
  },
  computed: {},
  components: {}
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/variables.scss";

.summaryCard {
  margin-top: 30px;
  border-radius: $container-border-radius;

  .header {
    border-top-right-radius: $container-border-radius;
    border-top-left-radius: $container-border-radius;
    padding: 10px 15px;

    @media (max-width: $tablet-width) {
      padding: $content-padding-tablet-y $content-padding-tablet-x;
    }

    @media (max-width: $mobile-width) {
      padding: $content-padding-mobile-y $content-padding-mobile-x;
    }
  }

  .summaryCardBody {
    border: $container-border;
    border-top: 0px;
    border-bottom-right-radius: $container-border-radius;
    border-bottom-left-radius: $container-border-radius;
    background-color: white;
  }

  .summaryCardViewMode {
    padding: $content-padding-x;
    padding-top: 41px;
    padding-bottom: 12px;

    @media (max-width: $tablet-width) {
      padding: $content-padding-tablet-y $content-padding-tablet-x;
      padding-bottom: 12px;
    }

    @media (max-width: $mobile-width) {
      padding: $content-padding-mobile-y $content-padding-mobile-x;
      padding-bottom: 12px;
    }
  }
}

.headerButtons {
  button.summaryCardSecondaryButton {
    background: $summarycard-secondary-button-bg-color !important;
    color: $summarycard-secondary-button-text-color;
    text-transform: none !important;
    letter-spacing: 0px;
    width: 32px;
    height: 32px;
    min-width: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 !important;
  }

  button.summaryCardPrimaryButton {
    background: $summarycard-primary-button-bg-color !important;
    color: $summarycard-primary-button-text-color;
    text-transform: none !important;
    letter-spacing: 0px;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 !important;
    min-width: unset;
  }
}

.header {
  background: $summarycard-header-bg-color;
  padding: $content-padding-x;

  @media (max-width: $tablet-width) {
    padding: $content-padding-tablet-y $content-padding-tablet-x;
  }

  @media (max-width: $mobile-width) {
    padding: $content-padding-mobile-y $content-padding-mobile-x;
  }

  .headerText {
    color: $summarycard-title-text-color;
    font-size: 1.1rem;
  }
}

.topIcon {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  position: relative;
  margin-right: 32px !important;
  @media (max-width: $tablet-width) {
    margin-right: 13px !important;
    width: 18px;
    height: 18px;
  }
  &::before {
    content: "";
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 37px;
    background-color: #b7b4b2;
    @media (max-width: $tablet-width) {
      right: -10px;
      height: 35px;
    }
  }
  svg {
    width: 100%;
    height: 100%;
  }
}

:v-deep(.redColor) {
  color: red !important;
}

:v-deep(.labelColor) {
  color: $summarycard-title-text-color;
}

:v-deep(.v-input) {
  &:not(.v-input--is-focused) {
    fieldset {
      border-color: $summarycard-input-border-color;
    }
  }
}

:deep(.controlIcon) {
  path {
    fill: $icon-color;
  }
  circle {
    stroke: $icon-color;
  }
}

.viewModeContent {
  overflow-x: hidden;
}

.summaryItem {
  font-size: 14px;
  margin-bottom: 18px;
  padding-top: 0;
  padding-bottom: 0;
}

.summaryTitle {
  flex-shrink: 0;
}

.summaryValue {
  max-width: 100%;
  text-overflow: ellipsis;
  max-height: 20px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.editIcon) {
  path {
    fill: $icon-color;
  }
}

:deep(.summaryCardSecondaryButton .icon) {
  path {
    fill: $icon-color;
  }
  circle {
    stroke: $icon-color;
  }
}
</style>
