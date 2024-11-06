<template lang="pug">
.models-forms
    v-app-bar-nav-icon(v-if="!isMenu" @click="isMenu=!isMenu")
    v-btn(icon v-else @click="isMenu=false")
        v-icon mdi-close
    v-menu.models-forms__menu(
        light
        absolute
        attach
        color="primary"
        transition="slide-y-transition"
        bottom
        offset-y
        v-model="isMenu"
        )
        v-list.models-forms__list
            v-list-item.models-forms__item(
                v-for="(item, i) in items"
                @click="makeAction(item.title)"
                :key="i"
                )
                v-list-item-title.models-forms__item-title.text-black--text {{ item.title }}
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isMenu: false,
      items: [{ title: "Models" }, { title: "Lender" }, { title: "Details" }]
    };
  },
  methods: {
    ...mapActions(["setBroadcast"]),
    makeAction(title) {
      if (!this.currentLoan) return;
      switch (title) {
        case "Models":
          this.openTechLoanInfo();
          break;
        case "Lender":
          if (this.$route.name !== "lenderloaninfo") {
            this.$router.push("/lenderloaninfo");
          }
          break;
        default:
          if (this.$route.name !== "loandetails") {
            this.$router.push("/loandetails");
          }
      }
    },
    openTechLoanInfo() {
      if (this.currentLoan && this.currentLoan.Id) {
        const routeData = this.$router.resolve(
          `/loan-tech-info/${this.currentLoan.Id}`
        );
        const channelId = 111;
        this.setBroadcast(channelId);
        window.open(
          routeData.href,
          "_blank",
          `toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, copyhistory=no, left=0, top=0, width=1300px, height=${screen.availHeight -
            70}`
        );
      }
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/desktop-header.scss";

.models-forms {
  position: relative;
  &__menu {
    &:deep(.v-menu__content) {
      top: 50px !important;
      left: auto !important;
      right: -5px !important;
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
  &__item-title {
    font-size: 14px;
  }
}
</style>
