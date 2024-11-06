<template lang="pug">
    .header
        .testingMenuWrapper
          .testingMenuInnerWrapper
            TestingNavMenu.testingNav(v-if="isTestingNav")
        .desktop
            Desktop(
                :items="loanItems" 
                :accountItems="accountItems"
                :address="address"
                @makeAction="makeAction")
        .mobile
            Mobile(
                :items="loanItems" 
                :accountItems="accountItems" 
                :address="address" 
                :name="user ? user.FirstName : name" 
                :counter="newMessages"
                @makeAction="makeAction")
</template>

<script>
import Desktop from "@/components/headers/Desktop.vue";
import Mobile from "@/components/headers/Mobile.vue";
import { mapGetters, mapActions } from "vuex";
import TestingNavMenu from "./TestingNavMenu";

export default {
  name: "Header",
  data() {
    return {
      items: [
        { label: "LOAN AMOUNT", data: "", isIcon: true, isCurrency: true },
        {
          label: "INTEREST RATE",
          data: "",
          isIcon: true,
          isPercent: true,
          multiple: 100
        },
        {
          label: "DEBT TO INCOME",
          data: "",
          isIcon: true,
          isPercent: true,
          multiple: 1
        },
        { label: "EST.CLOSING DATE", data: "", isIcon: false }
      ],
      name: "Kenneth",
      newMessages: 2,
      accountItems: [
        { title: "Profile", icon: "settings" },
        { title: "Change Password", icon: "security" },
        { title: "Logout", icon: "logout" }
      ]
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "logOut"]),
    async makeAction({ title }) {
      switch (title) {
        case "Profile":
          this.toggleIsOnlay({ onlayComponent: "profile", isOnlay: true });
          break;
        case "Change Password":
          this.toggleIsOnlay({
            onlayComponent: "changePassword",
            isOnlay: true
          });
          break;
        default:
          await this.logOut();
        //this.$router.push("/login");
      }
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      user: "getCurrentUser",
      isTestingNav: "getIsTestingNav"
    }),
    address() {
      let result = "";
      if (this.currentLoan) {
        const { Property, LoanPurposeType } = this.currentLoan;
        if (Property && Property.AddressLineText) {
          const { AddressLineText, CityName, StateCode, PostalCode } = Property;
          result = `<span class='header-label-text' style='font-size: 11px'>${
            LoanPurposeType ? LoanPurposeType.toUpperCase() : ""
          }</span><br> ${AddressLineText} <br> ${CityName || ""} ${StateCode ||
            ""}, ${PostalCode || ""}`;
        }
      }
      return result;
    },
    loanItems() {
      let result = JSON.parse(JSON.stringify(this.items));
      if (this.currentLoan) {
        result = result.map(item => {
          if (item.label === "LOAN AMOUNT") {
            item.data = this.currentLoan.LoanAmount || 0;
          }
          if (item.label === "INTEREST RATE") {
            item.data =
              this.currentLoan.LenderLoanInformation &&
              this.currentLoan.LenderLoanInformation.MortgageLoanInformation
                ? this.currentLoan.LenderLoanInformation.MortgageLoanInformation
                    .NoteRatePercent
                : "";
          }
          if (item.label === "DEBT TO INCOME") {
            item.data = this.currentLoan.DebtToIncomeRatio || 0;
          }
          if (item.label === "EST.CLOSING DATE") {
            item.data = this.currentLoan.EstimatedClosingDate;
          }
          return item;
        });
      }
      return result;
    }
  },
  components: {
    Desktop,
    Mobile,
    TestingNavMenu
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.mobile {
  display: none;
}

@media (max-width: 760px) {
  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
}

:deep(.header-label-text) {
  color: $header-label-text-color;
}

.testingNav {
  max-width: 280px;
  position: absolute;
  margin: 0 auto;
  transform: translateX(-50%);
  left: 50vw;
  top: 80px;
  width: 100vw;
  z-index: 100;
  @media only screen and (min-width: 1281px) {
    left: 0px;
    top: 175px;
    transform: translateX(5px);
  }
}
.testingMenuWrapper {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
  z-index: 10000;
  .testingMenuInnerWrapper {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 1450px;
    margin: 0 auto;
    .testingNav {
      pointer-events: all;
    }
  }
}
</style>
