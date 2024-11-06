<template lang="pug">
    .progress.d-flex.flex-column(v-click-out="closeToolbar" :class="{'with-back': isToolbar}")
        .progress__minified
            .progress__info
                .progress__item
                    .progress__button
                        v-icon.mobile-menu-text(:style="currentActive<=1?'opacity:0.3;':''" @click="gotoPreviousStep()") navigate_before
                    .progress__text.mobile-menu-text Step {{ currentActive }}
                        span.progress_grey /{{list.length}}
                .progress__item
                  v-icon.mobile-menu-text(@click="toggleToolbar" :style="isToolbar?'transform:rotate(180deg);':''") expand_more
            .progress__linear
                v-progress-linear(
                    :active="active"
                    :background-opacity="opacity"
                    :buffer-value="100"
                    height="6px"
                    rounded
                    :value="100/list.length*currentActive"
                    :color="'#fff'"
                    background-color="white")
        transition(name="fade")
            .progress__toolbar(v-if='isToolbar')
                NavbarMobile(
                    :currentActive="currentActive" 
                    :items="list"
                    @setActiveSidebarItem="setActiveSidebarItem"
                )
</template>

<script>
import NavbarMobile from "@/components/NavbarMobile";

export default {
  props: {
    step: {
      type: Number,
      default: 1
    },
    list: {
      type: Array,
      default: () => []
    },
    currentActive: {
      type: Number,
      default: 0
    },
    gotoPreviousStep:{
      type: Function
    }
  },
  data() {
    return {
      active: true,
      opacity: 0.3,
      isToolbar: false
    };
  },
  methods: {
    toggleToolbar() {
      this.isToolbar = !this.isToolbar;
    },
    closeToolbar() {
      this.isToolbar = false;
    },
    setActiveSidebarItem({ index }) {
      this.closeToolbar();
      this.$emit("setActiveSidebarItem", { index });
    }
  },
  watch: {
    // isToolbar: val => {
    //   if (val) {
    //     document
    //       .querySelector(".home__progress")
    //       .classList.add("home_toolbar-full-height");
    //   } else {
    //     document
    //       .querySelector(".home__progress")
    //       .classList.remove("home_toolbar-full-height");
    //   }
    // }
  },
  components: {
    NavbarMobile
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.progress {
  pointer-events: all;
  height: 100%;
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 15px;
  }
  &__item {
    display: flex;
    align-items: center;
    color: $process-green;
    font-size: 17px;
    font-weight: bold;
  }
  &__button {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $process-green;
    margin-right: 15px;
  }
  &__icon {
    height: 10px;
    transform: rotate(180deg);
    cursor: pointer;
  }
  &__open {
    width: 20px;
    height: 20px;
    justify-self: flex-end;
  }
  &__linear {
    padding: 0 15px;
    margin-bottom: 10px;
  }
  &__toolbar {
    flex-grow: 1;
  }
  &_grey {
    color: $blue-grey;
  }
}

.fade-enter-active {
  transition: opacity 0.3s;
}

.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
