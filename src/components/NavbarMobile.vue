<template lang="pug">
    #mobile-drawer
        v-list-item(v-for="(item, index) in items" :key="index")
            v-list-item-content.item-content
                .item(:class="{'last-item': index === items.length-1}")
                    span.item__circle.mobile_menu(
                        :class=`{
                            "menu_item_active": index === currentActive, 
                            "item_no-line": item.isLast || index === (items.length-1), 
                            "item_passed": currentActive > index}`
                        )
                        v-icon(v-if='index > currentActive' class='progress mobile-menu-text' aria-hidden='false') trip_origin
                        v-icon(v-if='index == currentActive' class='progress-highlight-active' aria-hidden='false') trip_origin
                        v-icon(v-if='index < currentActive' class='progress-highlight' aria-hidden='false') check_circle
                    .item__text
                        router-link.item__link(:to="{name: item.routeName}")
                            v-list-item-title.item__title.mobile-menu-text(
                                @click="$emit('setActiveSidebarItem', { index })"
                                :class="{'active-link progress-highlight': currentActive === index}"
                                ) {{ item.text }}
                            .item__additional(v-if="index === 0" @click.stop.prevent="() => true")
                              .item__name.mobile-menu-text(v-for="(bor, i) in borrowers" 
                                  @click.stop.prevent="setBorrower(i)"
                                  :class="{'item_active-name font-weight-bold': borrowerIndex === i}") {{ bor.FirstName }} {{bor.LastName }}
                              .item__button.mobile-menu-text.text-decoration-underline(@click="inviteBorrower") Invite Borrower
                            template(v-if="index && currentActive === index")
                              .item__additional
                                LoanSidebarInfo(v-if="sideInfo === 'loan'")
                                CreditSidebarInfo(v-if="sideInfo === 'credit'")
                                AccountsSidebarInfo(:user="user" v-if="sideInfo === 'accounts'")
                                EmploymentSidebarInfo(:user="user" v-if="sideInfo === 'employment'")
                                RealEstateSidebarInfo(:user="user" v-if="sideInfo === 'real-estate'")
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LoanSidebarInfo from "@/components/loan-property/LoanSidebarInfo";
import CreditSidebarInfo from "@/components/credit/CreditSidebarInfo";
import AccountsSidebarInfo from "@/components/accounts/AccountsSidebarInfo";
import EmploymentSidebarInfo from "@/components/employment/EmploymentSidebarInfo";
import RealEstateSidebarInfo from "@/components/real-estate/RealEstateSidebarInfo";
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    currentActive: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser",
      borrowers: "getBorrowers",
      borrowerIndex: "getBorrowerIndex"
    })
  },
  data() {
    return {
      isSideInfo: false,
      sideInfo: ""
    };
  },
  methods: {
    ...mapActions(["setCurrentBorrower", "toggleIsOnlay", "getInvitations"]),
    setBorrower(i) {
      this.setCurrentBorrower(i);
      this.$parent.isToolbar = false;
    },
    async inviteBorrower() {
      await this.getInvitations();
      this.toggleIsOnlay({ isOnlay: true, onlayComponent: "borrower" });
    }
  },
  watch: {
    $route(to) {
      this.isSideInfo = !!to.meta.sideInfo;
      this.sideInfo = to.meta.sideInfo;
    }
  },
  components: {
    LoanSidebarInfo,
    CreditSidebarInfo,
    AccountsSidebarInfo,
    EmploymentSidebarInfo,
    RealEstateSidebarInfo
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

@media (max-width: 760px) {
  #mobile-drawer {
    height: 100%;
    background-size: 150px;
  }
}

.item-content {
  overflow: visible !important;
  @media screen and (max-width: 760px) {
    padding: 18px 0px;
  }
}

.item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  &__circle {
    width: 13px;
    height: 13px;
    margin-right: 18px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 16px;
      left: 8px;
      width: 2px;
      height: 17px;
      background-color: $menu-gray;
      @media screen and (max-width: 760px) {
        top: 19px;
        height: 45px;
      }
    }
  }
  &__title {
    cursor: pointer;
    color: $menu-gray;
    font-size: 16px;
    @media screen and (max-width: 760px) {
      font-size: 20px;
      transform: none;
    }
    &:hover {
      color: $text-black;
    }
  }
  &__name {
    font-size: 14px;
    color: $text-black;
    margin: 10px 0;
    &:hover {
      color: $menu-gray;
    }
  }
  .active-link {
    font-weight: 500;
  }
  &__button {
    margin-top: 10px;
  }
  &__link {
    text-decoration: none;
  }
  &_active {
    &::after {
      background-color: $process-green;
      top: 14px;
      width: 3px;
    }
  }
  &_no-line {
    &::after {
      width: 0;
      height: 0;
    }
  }
  &_passed {
    color: $process-green;
    &::after {
      background-color: $process-green;
      height: 24px;
    }
  }
}

.last-item {
  margin-bottom: 20px;
}

@media (max-width: 400px) {
  #mobile-drawer {
    &:deep(.v-list-item) {
      min-height: 25px;
    }
  }
}
.item__name{
  font-size: 18px;
  padding: 5px 0px;
}
#mobile-drawer{
  max-height: 100vh;
  overflow-y: auto;
}
</style>
