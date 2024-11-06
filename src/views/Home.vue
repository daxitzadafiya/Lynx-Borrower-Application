<template lang="pug">
  //.home.text-black--text(:class="{'main-back': !isHostedMode, 'hosted-back': isHostedMode, 'greetingsPage': isBorrowersPage}")
  .home.text-black--text(:class="{'main-back': !isHostedMode, 'hosted-back': isHostedMode}")
        Header(v-if="!isHostedMode")
        Sidebar(
            v-if="showNavigation"
            :currentActive="currentActive" 
            :list="enabledSections"
            @setActiveSidebarItem="setActiveSidebarItem")
        .home__container(:class="{'home_hosted': isHostedMode}")
            //.home__progress(v-if='isProgress && showNavigation')
            //    Progress(
            //        :step="step"
            //        :list="enabledSections"
            //        :currentActive="currentActive"
            //        :gotoPreviousStep = "gotoPreviousStep"
            //    )
            .home__main
                router-view(@setProgressVisibility="setProgressVisibility")
            //Footer(v-if="!isHostedMode && !isBorrowersPage")
            Footer(v-if="!isHostedMode")
                
        .home__onlay(v-if="isOnlay")
            Onlay
</template>

<script>
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Progress from "@/components/Progress";
import Onlay from "@/components/Onlay";
import { mapGetters, mapActions } from "vuex";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  name: "Home",
  mixins: [loanPatch],
  data() {
    return {
      isProgress: true,
      hideNavigation: true,
      step: 1,
      currentActive: 0,
      list: [
        { text: "Borrowers", routeName: "borrowers", rootPath: "borrowers", icon: require("../assets/images/sidebar/borrowers.svg") },
        {
          text: "Loan & Property",
          routeName: "loanandproperty",
          rootPath: "loanandproperty",
          icon: require("../assets/images/sidebar/loan-property.svg")
        },
        {
          text: "Credit & Liabilities",
          routeName: "credit",
          rootPath: "credit",
          icon: require("../assets/images/sidebar/credit-liabilities.svg")
        },
        {
          text: "Accounts & Assets",
          routeName: "accountsandassets",
          rootPath: "accountsandassets",
          icon: require("../assets/images/sidebar/accounts-assets.svg")
        },
        {
          text: "Employment & Income",
          routeName: "employmentandincome",
          rootPath: "employmentandincome",
          icon: require("../assets/images/sidebar/employment-income.svg")
        },
        {
          text: "Declarations",
          routeName: "declarations",
          rootPath: "declarations",
          isLast: false,
          icon: require("../assets/images/sidebar/declarations.svg")
        },
        {
          text: "Documents",
          routeName: "documents",
          rootPath: "documents",
          isLast: false,
          icon: require("../assets/images/sidebar/documents.svg")
        },
        // {
        //   text: "Demographics",
        //   routeName: "demographics",
        //   rootPath: "demographics"
        // },
        // {text: 'Details of Transaction', routeName: 'detailsoftransaction', rootPath: 'detailsoftransaction'},   /// Temporarily removed
        {
          text: "Review",
          routeName: "review",
          rootPath: "review",
          isLast: true,
          icon: require("../assets/images/sidebar/review.svg")
        },
      ],
    };
  },
  methods: {
    ...mapActions(["sidebarRedirectToUnfinished", "setAppHistoryLength"]),
    // eslint-disable-next-line no-unused-vars
    setProgressVisibility({ name, step }) {
      if (name === "underwriting" || name === "approved") {
        return (this.currentActive = this.enabledSections.length);
      }
      this.step =
        name && name !== "borrowers"
          ? this.enabledSections.findIndex((item) => item.routeName === name) + 1
          : 1;
      this.isProgress = name !== "borrowers";
      const routePath = this.$route.path;
      this.currentActive = this.enabledSections.findIndex(
        (item) => routePath.split("/")[1] === item.rootPath
      );
    },
    showMobileDrawer() {
      this.drawerSwitch.isMobileDrawer = true;
    },
    setActiveSidebarItem({ index }) {
      this.currentActive = index;
      if (index !== -1) {
        this.sidebarRedirectToUnfinished(this.enabledSections[index].routeName);
      }
    },
    async gotoPreviousStep() {
      if (this.step != 1) {
        await this.$router.push("/" + this.list[this.step - 2].rootPath);
      }
    },
  },
  mounted() {
    if (this.user.userTypeId != 1) {
      if (this.currentLoan == null || this.currentLoan.StatusId <= 6) {
        this.list = this.list.filter(
          (x) => x.routeName != "documents" && x.routeName != "review"
        );
      }
    }
    window.addEventListener("popstate", () => {
      this.setAppHistoryLength(this.appHistoryLength - 2);
    });
  },
  computed: {
    ...mapGetters({
      isOnlay: "getIsOnlay",
      isHostedMode: "getIsHostedMode",
      brandingSections: "brandingSections",
      user: "getCurrentUser",
      currentLoan: "getCurrentLoan",
      showNavigation: "getShowNavigation",
      appHistoryLength: "getAppHistoryLength",
    }),
    enabledSections() {
      if (this.isHostedMode) {
        const enabledSections = this.brandingSections.filter((item) => item.Enable);
        const sectionNames = enabledSections.map((item) => item.Name.toLowerCase());
        return this.list.filter((item) => sectionNames.indexOf(item.routeName) !== -1);
      }
      return this.list;
    },
    isBorrowersPage(){
      return this.$route.name==="borrowers"
    }
  },
  components: {
    Header,
    Sidebar,
    Footer,
    Progress,
    Onlay,
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/colors.scss";
@import "../assets/styles/variables.scss";

.home {
  min-height: 100%;
  max-width: 1441px;
  width: 100vw;
  margin: 0 auto;
  display: flex;
  height: fit-content;
  &__container {
    flex-grow: 1;
    min-height: 100%;
    padding: 0 $page-padding;
    @media (max-width: $tablet-width) {
      padding: 0 $tablet-page-padding;
    }
    @media (max-width: $mobile-width) {
      padding: 0 $mobile-page-padding;
    }
    overflow: hidden;
    box-sizing: border-box;
    margin-top: 88px;
    position: sticky;
    top: 88px;
    display: flex;
    flex-direction: column;
  }
  &__main {
    flex-grow: 1;
  }
  &__progress {
    pointer-events: none;
    display: none;
    position: fixed;
    z-index: 10;
    left: 0;
    width: 100%;
    background-color: $header-back-color;
  }
  &__footer {
    height: 84px;
    border-top: 1px solid $grey-light;
  }
  &__onlay {
    min-height: 100vh;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(#000, 0.5);
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
  }
  &:deep(.v-overlay--absolute) {
    top: 88px;
    @media (max-width: 760px) {
      top: 76px;
    }
  }
  &_hosted {
    margin-top: 0;
    height: 100%;
  }

  &.greetingsPage{
    width: 100%;
    max-width: unset;
    .home__container{
      margin-top: auto;
      margin-bottom: auto;
    }
  }
}

.hosted-back {
  background: #f6f9fc;
  margin: 0;
}

@media (max-width: 1024px) {
  .home {
    &__progress {
      display: block;
    }
    &__footer {
      margin: 0 15px;
    }
  }
}

@media (max-width: 760px) {
  .home {
    &__container {
      margin-top: 76px;
    }
    &__footer {
      height: 53px;
      margin: 0;
    }
    &__progress {
      height: 76px;
      z-index: 49;
      padding: 0 60px;
      background-color: unset;
      top: 0;
      transition: 0.1s ease;
      :deep(.progress) {
        // width: calc(100% - 120px);
        justify-content: center;
        margin-top: 3px;
      }
    }
    &_toolbar-full-height {
      background-color: $header-back-color;
      margin: unset;
      top: unset;
      padding: 0px;
      :deep(.progress) {
        width: unset;
        margin-top: unset;
      }
    }
    &_hosted {
      margin-top: 0;
      height: 100%;
    }
  }
}

@media (max-width: 600px) {
  .home {
    &__onlay {
      align-items: flex-start;
    }
  }
}
</style>
