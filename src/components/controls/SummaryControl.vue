<template>
  <div class="summaryCard">
    <div
      class="header d-flex align-center flex-wrap jusitfy-end"
      style="justify-content:end;"
    >
      <div class="flex-grow-1 pr-2 d-flex">
        <div
          class="mobileIcon mr-2"
          v-if="
            $vuetify.breakpoint.xs &&
              !isEditMode &&
              (desktopIcon != null || mobileIcon != null)
          "
        >
          <inline-svg
            class="icon controlIcon"
            :src="mobileIcon ? mobileIcon : desktopIcon"
          ></inline-svg>
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
          <inline-svg class="icon" :src="editIcon"></inline-svg>
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
        <div
          class="desktopIconContainer d-flex justify-center align-center py-2 flex-shrink-0 mr-5"
          v-if="$vuetify.breakpoint.smAndUp && desktopIcon != null"
        >
          <div class="desktopIcon">
            <inline-svg
              class="icon controlIcon"
              :src="desktopIcon"
            ></inline-svg>
          </div>
        </div>
        <v-divider
          class="ml-2"
          vertical
          v-if="$vuetify.breakpoint.smAndUp && desktopIcon != null"
        ></v-divider>
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
    mobileIcon: {
      type: String
    },
    desktopIcon: {
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
    padding: 15px $content-padding-x;

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

    @media (max-width: $tablet-width) {
      padding: $content-padding-tablet-y $content-padding-tablet-x;
    }

    @media (max-width: $mobile-width) {
      padding: $content-padding-mobile-y $content-padding-mobile-x;
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

.desktopIcon {
  width: 60px;
  height: 60px;
  padding: 15px;
  border-radius: 50%;
  background: $summarycard-header-bg-color;
  justify-content: center;
  display: flex;
  align-items: center;
}

.mobileIcon {
  width: 30px;
  height: 30px;
  padding: 7px;
  border-radius: 50%;
  background: $summarycard-mobile-icon-bg-color;
  justify-content: center;
  display: flex;
  align-items: center;
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
    &[path] {
      fill: $icon-color;
    }
    &[circle],
    &[stroke] {
      stroke: $icon-color;
    }
  }
  circle {
    stroke: $icon-color;
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

.viewModeContent {
  overflow-x: hidden;
}
</style>
