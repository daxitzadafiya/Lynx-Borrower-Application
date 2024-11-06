<template lang="pug">
.account
    span.account__text ACCOUNT
    v-icon.account__logo mdi-account-outline
    v-menu.account__menu(
        light
        absolute
        attach
        color="primary"
        transition="slide-y-transition"
        bottom
        offset-y
        v-model="isAccountMenu"
        )
        template(v-slot:activator="{ on }")
            v-btn(icon style='width: 15px; height: 15px; border-radius: 0' v-on="on" :class="{'account_reversed': isAccountMenu}")
                v-icon.account__open mdi-chevron-down
        v-list.account__list
            v-list-item.account__item(
                v-for="(item, i) in accountItems"
                :key="i"
                @click="$emit('makeAction', {title: item.title})"
                )
                i.account__item-icon.material-icons.icon-color-main {{item.icon}}
                v-list-item-title.account__item-title.text-black--text {{ item.title }}
</template>

<script>
export default {
  props: {
    accountItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isAccountMenu: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/desktop-header.scss";

.account {
  position: relative;
  &__menu {
    &:deep(.v-menu__content) {
      top: 35px !important;
      left: auto !important;
      right: -15px !important;
      width: 170px;
    }
  }
  &__list {
    padding: 0;
  }
  &__item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.17);
    &:last-child {
      border-bottom: none;
    }
  }
  &__item-icon {
    margin-right: 5px;
    font-size: 18px;
  }
  &__item-title {
    font-size: 14px;
  }
  &_reversed {
    &:deep(.v-btn__content) {
      transform: rotate(180deg);
    }
  }
}
</style>
