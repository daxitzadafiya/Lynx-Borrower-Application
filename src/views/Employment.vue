<template>
  <div class="employment">
    <div class="main-header">
      <inline-svg class="header-icon" :src="headerIcon"></inline-svg>
      <div class="header-title">Employment & Income - <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span></div>
      <!--<Button v-if="isCancelButton" value="Cancel" width="100px" isOutlined="isOutlined" @clicked="isDialog=true"></Button>-->
    </div>
    <div class="header-secondary-title" v-if="isUserInfo">
      <div>{{ firstName }} {{ lastName }} ${{ getFormattedValue(mainIncome) || 0 }}</div>
      <div v-if="coBorrower">{{ coBorrower.FirstName }} {{ coBorrower.LastName }} ${{ getFormattedValue(coIncome) || 0 }}</div>
      <div>Total: ${{ getFormattedValue(total) || 0 }}</div>
    </div>
    <v-dialog v-model="isDialog" max-width="390">
      <v-card>
        <v-card-title class="mb-4 text-black--text"> <span style="word-break: break-word; text-align:center;">Please, confirm you are going to remove employment information? </span></v-card-title>
        <v-card-text>
          <v-row class="justify-space-around">
            <Button value="Yes" customClass="button-yes" width="130px" @clicked="removeEmployment"></Button>
            <Button value="No" customClass="button-no" width="130px" isOutlined="isOutlined" @clicked="isDialog=false"></Button>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <router-view @saveAndRedirect="({route}) => saveAndAdvance(true, route)"></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";
import loanPatch from "@/mixins/loanPatch.js";
import Button from "@/components/buttons/Button";

export default {
  mixins: [currencyFormat, loanPatch],
  data() {
    return {
      headerTitle: "Employment & Income",
      isUserInfo: false,
      userInfo: "",
      isDialog: false,
      headerIcon: require("../assets/images/sidebar/employment-income.svg"),
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setProgressVisibility({ name }) {
      this.$emit("setProgressVisibility", { name, step: 5 });
    },
    removeEmployment() {
      const name = this.$route.name;
      let filtered = [];
      let route = "/employmentandincome";
      if (name.indexOf("previous") !== -1) {
        filtered = this.Employment.filter(
          item => item.EmploymentStatusType !== "Previous"
        );
        route = "/employmentandincome/previous-employment";
      } else if (name.indexOf("additional") !== -1) {
        const additionalsFiltered = this.additionalEmployments.filter(
          (item, i) => i !== this.employmentEditingIndex
        );
        filtered = this.Employment.filter(
          item => item.EmploymentClassificationType !== "Secondary"
        );
        filtered.push(...additionalsFiltered);
        route = "/employmentandincome/additional-employment";
      } else {
        filtered = this.Employment.filter(
          item => item.EmploymentClassificationType !== "Primary"
        );
      }
      this.updateBorrower({ prop: "Employment", value: filtered });
      this.isDialog = false;
      this.$router.push(route);
    },
    getIncomeSum(incomes) {
      return incomes.reduce(
        (a, c) =>
          (a += !isNaN(c.CurrentIncomeMonthlyTotalAmount)
            ? +c.CurrentIncomeMonthlyTotalAmount
            : 0),
        0
      );
    }
  },
  computed: {
    ...mapGetters({
      Borrowers: "getBorrowers",
      Borrower: "getBorrower",
      Employment: "getBorrowerEmployment",
      additionalEmployments: "getAdditionalEmployments",
      employmentEditingIndex: "getAdditionalEmploymentIndex"
    }),
    coBorrower() {
      return this.Borrowers.length && !this.Borrower.CoBorrower
        ? this.Borrowers.find(
            item =>
              item.CoBorrower && item.LinkedBorrowerId === this.Borrower.Id
          )
        : null;
    },
    firstName() {
      return this.Borrower.FirstName || "";
    },
    lastName() {
      return this.Borrower.LastName || "";
    },
    mainIncome() {
      if (this.Employment.length) {
        const currentEmloyments = this.Employment.filter(
          item => item.EmploymentStatusType === "Current"
        );
        return currentEmloyments.reduce((acc, cur) => {
          if (cur.Income && cur.Income.length) {
            acc += this.getIncomeSum(cur.Income);
          }
          if (this.Borrower.OtherIncome && this.Borrower.OtherIncome) {
            acc += this.getIncomeSum(this.Borrower.OtherIncome);
          }
          return acc;
        }, 0);
      }
      return 0;
    },
    coIncome() {
      if (!this.coBorrower) return 0;
      if (this.coBorrower.Employment && this.coBorrower.Employment.length) {
        return this.coBorrower.Employment.filter(
          item => item.EmploymentStatusType === "Current"
        ).reduce((acc, cur) => {
          if (cur.Income && cur.Income.length) {
            acc += this.getIncomeSum(cur.Income);
          }
          if (this.coBorrower.OtherIncome && this.coBorrower.OtherIncome) {
            acc += this.getIncomeSum(this.coBorrower.OtherIncome);
          }
          return acc;
        }, 0);
      }
      return 0;
    },
    total() {
      return this.mainIncome + this.coIncome;
    },
    isCancelButton() {
      const disabledRouteNames = [
        "employmentandincome",
        "employmentandincome-previous-employment",
        "employmentandincome-additional-employment",
        "employmentandincome-other-income",
        "employmentandincome-review",
        "employmentandincome-summary"
      ];
      return disabledRouteNames.indexOf(this.$route.name) === -1;
    }
  },
  watch: {
    $route(to) {
      this.headerTitle = to.meta.title;
      this.isUserInfo = to.meta.isUserInfo;
      if (this.isUserInfo) {
        this.userInfo = `(${this.firstName} ${
          this.lastName
        } - $${this.getFormattedValue(this.mainIncome)})`;
        this.headerTitle += ` <span class="block-mobile">${this.userInfo}</span>`;
      } else {
        this.headerTitle = `${this.firstName}'s ` + this.headerTitle;
      }
    },
    Borrower: {
      deep: true,
      handler() {
        if (this.isUserInfo) {
          this.userInfo = `(${this.firstName} ${
            this.lastName
          } - $${this.getFormattedValue(this.mainIncome)})`;
          this.headerTitle =
            this.headerTitle.split("(")[0] +
            `<span class="block-mobile">${this.userInfo}</span>`;
        }
      }
    }
  },
  mounted() {
    this.setProgressVisibility({ name: this.$route.name });
    this.headerTitle = this.$route.meta.title || this.headerTitle;
    if (this.$route.meta.isUserInfo) {
      this.isUserInfo = true;
      this.headerTitle += ` <span class="block-mobile">(${this.firstName} ${
        this.lastName
      } - $${this.getFormattedValue(this.mainIncome)})</span>`;
    } else {
      this.headerTitle = `${this.firstName}'s ` + this.headerTitle;
    }
  },
  components: {
    Button
  }
};
</script>
