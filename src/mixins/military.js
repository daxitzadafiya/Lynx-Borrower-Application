export default {
  data() {
    return {
      isServing: false,
      isRetired: false,
      isPeriod: false,
      isMenu: false,
      date: new Date().toISOString().substr(0, 10)
    };
  },
  methods: {
    updateExpirationDate(date) {
      const MilitaryServices = this.MilitaryServices.map(item => {
        if (item.MilitaryStatusType === "ActiveDuty") {
          item.MilitaryServiceExpectedCompletionDate = date;
        }
        return item;
      });
      this.updateMilitary(MilitaryServices);
    },
    cancelDate() {
      this.$refs.menu.save("");
      this.isMenu = false;
      const MilitaryServices = this.MilitaryServices.map(item => {
        if (item.MilitaryStatusType === "ActiveDuty") {
          item.MilitaryServiceExpectedCompletionDate = "";
        }
        return item;
      });
      this.updateMilitary(MilitaryServices);
    },
    toggleService(bool) {
      switch (bool) {
        case "isSpouse":
          this.updateBorrower({
            prop: "SpousalVABenefitsEligibilityIndicator",
            value: !this.isSpouse
          });
          break;
        default:
          this.handleMilitaryServiceType(bool);
      }
    },
    handleMilitaryServiceType(bool) {
      this[bool] = !this[bool];
      const values = [
        { title: "ActiveDuty", bool: "isServing" },
        { title: "Veteran", bool: "isRetired" },
        { title: "ReserveNationalGuardNeverActivated", bool: "isPeriod" }
      ];
      const selected = values.find(item => item.bool === bool);
      let MilitaryServices = [...this.MilitaryServices];
      if (this[bool]) {
        MilitaryServices.push({ MilitaryStatusType: selected.title });
      } else {
        MilitaryServices = MilitaryServices.filter(
          item => item.MilitaryStatusType !== selected.title
        );
      }
      this.updateMilitary(MilitaryServices);
    }
  },
  mounted() {
    this.isServing = !!this.MilitaryServices.find(
      item => item.MilitaryStatusType === "ActiveDuty"
    );
    this.isRetired = !!this.MilitaryServices.find(
      item => item.MilitaryStatusType === "Veteran"
    );
    this.isPeriod = !!this.MilitaryServices.find(
      item => item.MilitaryStatusType === "ReserveNationalGuardNeverActivated"
    );
  }
};
