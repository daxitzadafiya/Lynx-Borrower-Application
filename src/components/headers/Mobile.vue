<template lang="pug">
v-app-bar#appbar(color='primary' :style="[isInfoOpen ? isAccountOpen ? accountOpenedStyle : openedStyle : '']"
    dark 
    app
    :height="barHeight"
    dense
    flat
    )
    v-container(style='padding: 0; height: 100%')
        .top-block(style="height: 76px; display: flex; align-items: center;")
            v-app-bar-nav-icon(v-if="!isInfoOpen" @click="isInfoOpen=true" :ripple="false" tile)
            v-btn(icon v-else @click="isInfoOpen=false" :ripple="false" tile style="z-index:1;")
                v-icon mdi-close
            img.mobile-logo(:src="require('@/assets/images/header-logo-mobile.png')"  @click="toggleTestingNav")
        .info-blocks(v-if="isInfoOpen")
            .mid-block.pb-3
                v-row.mid-block__address(style="align-items: center;")
                    .d-flex
                        v-icon.item__address-icon.header-label-text(class='progress' aria-hidden='false') home
                        span.item__address(v-html="address")
                v-row.mid-block__item.px-5
                    v-col(cols="6" v-for="(item, index) in items" :key="index").px-3
                        div(v-if="item.data")
                          span.item__label.header-label-text.body-2.font-weight-medium {{ item.label }}
                          v-icon.item__icon.header-label-text(v-if='item.isIcon' class='progress' aria-hidden='false') help
                          p.item__data.body-2.font-weight-medium
                              span(v-if="item.isCurrency") $
                              span {{ item.isCurrency ? getFormattedValue(+item.data) : item.data }}
                              span(v-if="item.isPercent") %
            .bottomButtonsContainer(:class="{'active': isAccountOpen}").d-flex
              v-btn(plain x-large @click="isAccountOpen=!isAccountOpen").rounded-0.text-none.bottom-block.py-5.px-5.w-100.accountSettingsBtn
                      v-icon.ml-3.flex-shrink-0.account__logo mdi-account-outline
                      .flex-grow-1.text-start Account Settings
                      v-icon.rightIcon mdi-chevron-up
              .settingsButtonsContainer
                v-btn(plain x-large).rounded-0.text-none.bottom-block.py-5.px-5(style="align-items: center;" v-for="(item, index) in accountItems" :key="index" @click="$emit('makeAction', {title: item.title})")
                  v-icon(dense).mx-3 {{item.icon}}
                  .flex-grow-1.text-start {{ item.title }}
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [currencyFormat],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    accountItems: {
      type: Array,
      default: () => []
    },
    address: {
      type: String,
      default: ""
    },
    counter: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isInfoOpen: false,
      isAccountOpen: false,
      openedStyle: {
        height: "330px",
        "z-index": 1000
      },
      accountOpenedStyle: {
        height: "100%"
      }
    };
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser"
    }),
    name() {
      return this.user ? this.user.firstName : "";
    },
    barHeight() {
      return !this.isInfoOpen ? "76px" : "100";
    }
  },
  mounted() {
    let el = document.querySelector("#appbar .v-toolbar__content");
    el.style.padding = 0;
  },
  methods: {
    ...mapActions(["toggleTestingNav"]),
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/headers.scss";
@import "@/assets/styles/mobile-header.scss";

#appbar {
  background-color: $header-back-color !important;
  .v-btn {
    &::before {
      background-color: transparent;
    }
  }
}
.rightIcon{
  transform: rotate(90deg);
}

::v-deep .v-btn__content{
  display: flex;
}

</style>
