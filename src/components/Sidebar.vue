<template>
  <div class="sidebar" :class="{'sidebar_hosted': isHostedMode}">
    <v-navigation-drawer :class="{'isExpanded': isExpanded, navDrawer: true}" v-model="drawer" height="100%">
      <v-list class="listItems">
        <v-list-item v-for="(item, index) in list" :key="index" class="sidebar-list" style='padding: 0; z-index: 1'>
          <v-list-item-content class="item-content">
            <div class="item" style="padding-left: 1px">
              <span class="item__circle" :class="{
                  'item_active': index === currentActive && index === 0, 
                  'item_long-line': index === 0 || (index === currentActive && isSideInfo), 
                  'item_no-line': item.isLast || index === (list.length-1), 
                  'item_passed': currentActive > index}">
                  <div class="progress sidebar-icon-circle" :class="{'sidebar-item-circle_active' : currentActive == index, 'sidebar-item-circle_passed' : currentActive > index}">
                    <div class="tabletIcon" :class="{'sidebar-item-circle_active' : currentActive == index, 'sidebar-item-circle_passed' : currentActive > index}">
                      <inline-svg :src="item.icon" :class="{'sidebar-list-item_active' : currentActive == index, 'sidebar-list-item_passed' : currentActive > index}" />
                    </div>
                  </div>
              </span>
              <div class="item__text">
                <router-link :to="{name: item.routeName}" class="item__link" @click.native="setActiveItem(index)">
                  <v-list-item-title class="item__title" :class="{'active side-nav-selected-color' : (currentActive == index), 'sidebar-nav-passed-color': currentActive > index}">
                    <span>{{item.text}}</span>
                  </v-list-item-title>
                  <div class="item__additional" v-if="index === 0" @click.stop.prevent="()=>true">
                    <div class="item__name d-flex align-items-center" v-for="(bor, i) in borrowers"  :key="i" @click.stop.prevent="setBorrower(i)" :class="{'item_active-name': borrowerIndex === i}">
                      <span :class="borrowerIndex === i && 'item__active-bulletins'" class="item__bulletins mr-1 d-flex"></span>{{ bor.FirstName }} {{bor.LastName }}
                    </div>
                    <div class="item__button" @click="inviteBorrower">
                      Invite Borrower
                    </div>
                  </div>
                  <!-- <template v-if="index && currentActive === index">
                    <div class="item__additional">
                      <LoanSidebarInfo v-if="sideInfo === 'loan'" />
                      <CreditSidebarInfo v-if="sideInfo === 'credit'" />
                      <AccountsSidebarInfo v-if="sideInfo === 'accounts'" />
                      <EmploymentSidebarInfo v-if="sideInfo === 'employment'" />
                      <RealEstateSidebarInfo v-if="sideInfo === 'real-estate'" />
                    </div>
                  </template> -->
                </router-link>
              </div>
            </div>
          </v-list-item-content>

        </v-list-item>
      </v-list>
      <div class="sidebarExpandBtn">
        <v-btn icon small @click="toggleSidebarExpand">
          <v-icon class="sidebarIcon mdi mdi-page-layout-sidebar-left"></v-icon>
        </v-btn> 
      </div>
      <div class="sidebar__image"></div>
    </v-navigation-drawer>
  </div>
  
</template>

<script>
import Button from "@/components/buttons/Button";
// import LoanSidebarInfo from "@/components/loan-property/LoanSidebarInfo";
// import CreditSidebarInfo from "@/components/credit/CreditSidebarInfo";
// import AccountsSidebarInfo from "@/components/accounts/AccountsSidebarInfo";
// import EmploymentSidebarInfo from "@/components/employment/EmploymentSidebarInfo";
// import RealEstateSidebarInfo from "@/components/real-estate/RealEstateSidebarInfo";
import { mapGetters, mapActions } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  props: {
    currentActive: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drawer: true,
      isSideInfo: false,
      sideInfo: "",
      hamBurgerIcon: require("../assets/images/sidebar/hamburger.svg"),
      crossIcon: require("../assets/images/sidebar/cross.svg"),
      isExpanded: false
    };
  },
  methods: {
    ...mapActions([
      "getInvitations",
      "toggleIsOnlay",
      "setCurrentBorrower",
      "toggleTestingNav"
    ]),
    setActiveItem(index) {
      this.$emit("setActiveSidebarItem", { index });
    },
    setBorrower(i) {
      this.setCurrentBorrower(i);
      let newPath = this.getNextNavigablePathForCurrentBorrowerInCurrentSection()
      if (newPath != null) {
        this.saveAndAdvance(false, newPath, true)
      }
    },
    async inviteBorrower() {
      await this.getInvitations();
      this.toggleIsOnlay({ isOnlay: true, onlayComponent: "borrower" });
    },
    toggleNavInHostedMode() {
      if (this.isHostedMode) {
        this.toggleTestingNav();
      }
    },
    windowClicked(e){
      if(!e.target.closest(".sidebar")){
        this.toggleSidebarExpand()
      }
    },
    toggleSidebarExpand(){
      if(!this.isExpanded){
        window.addEventListener("click", this.windowClicked)
      }
      else{
        window.removeEventListener("click", this.windowClicked)
      }
      this.isExpanded=!this.isExpanded
    },
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser",
      borrowers: "getBorrowers",
      borrowerIndex: "getBorrowerIndex",
      isHostedMode: "getIsHostedMode",
      currentLoan: "getCurrentLoan"
    }),
    name() {
      return this.user ? this.user.firstName : "";
    }
  },
  watch: {
    $route(to) {
      this.isSideInfo = !!to.meta.sideInfo;
      this.sideInfo = to.meta.sideInfo;
    }
  },
  components: {
    Button,
    // LoanSidebarInfo,
    // CreditSidebarInfo,
    // AccountsSidebarInfo,
    // EmploymentSidebarInfo,
    // RealEstateSidebarInfo
  },
  beforeMount() {
    const routePath = this.$route.path;
    const index = this.list.findIndex(
      item => routePath.indexOf(item.rootPath) !== -1
    );
    //Remove Review Item for loans not ready to process  
    if (this.currentLoan && this.currentLoan.StatusId < 4) {
      this.list.pop();
      this.list[this.list.length - 1].isLast = true;
    }
    this.$emit("setActiveSidebarItem", { index });
    const { sideInfo } = this.$route.meta;
    this.isSideInfo = sideInfo;
    this.sideInfo = sideInfo;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/sidebarV2.scss";
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/colors.scss";

.listItemIcon {
  width: auto;
  max-height: 20px;
  max-width: 20px;
  display: block;

  @media (max-width: $sidebar-tablet-breakpoint) {
    display: none;
  }
}

.tabletIcon {
  display: none;

  @media (max-width: $sidebar-tablet-breakpoint) {
    display: block;
  }
}

.desktopIcon {
  display: block;

  @media (max-width: $sidebar-tablet-breakpoint) {
    display: none;
  }
}

.navDrawer {
  min-width: 292px;
  max-width: 292px;

  @media (max-width: $sidebar-tablet-breakpoint) {
    width: fit-content !important;
  }
}

.navDrawer {
  @media (max-width: $sidebar-tablet-breakpoint) {
    min-width: 60px;
    max-width: 60px;
  }
  .listItems {
    flex-grow: 1;
    padding: 30px 0px 10px 14px;

    @media (max-width: $sidebar-tablet-breakpoint) {
      padding: 20px 5px 10px 5px;
    }
  }

  @media (max-width: $sidebar-tablet-breakpoint) {
    .crossBtn{
      opacity: 0;
      pointer-events: none;
    }
    .hamBurgerBtn{
      opacity: 1;
      pointer-events: all;
    }
  }

  &.isExpanded {
    max-width: unset;
    @media (max-width: $sidebar-tablet-breakpoint) {
      .hamBurgerBtn{
        opacity: 0;
        pointer-events: none;
      }
      .crossBtn{
        opacity: 1;
        pointer-events: all;
      }
    }
  }
}


.hamBurgerBtn, .crossBtn {
  margin: 17px;
  padding: 3px;

  svg {
    width: 22px;
  }
}

.sidebarExpandBtn{
  display: none;
  @media (max-width: $sidebar-tablet-breakpoint) {
    display: block;
  }
  padding: 5px 15px;
  z-index: 1000;
  .sidebarIcon  {
    color: $primary-text-color;
  }
}

.sidebar{
  z-index: 10;
  height: calc(100vh - 88px);
  position: sticky;
  top: 88px;
}

::v-deep .v-navigation-drawer__content{
  display: flex !important;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;

}
</style>
