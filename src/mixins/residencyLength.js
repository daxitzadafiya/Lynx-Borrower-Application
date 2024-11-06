export default {
  methods: {
    updatePeriod(e, counter) {
      let ResidencyDurationMonthsCount = 0;
      if (e) {
        ResidencyDurationMonthsCount +=
          counter === "years"
            ? Math.round(+e * 12) + +this.period.months
            : Math.round(+this.period.years * 12) + +e;
      } else {
        ResidencyDurationMonthsCount =
          counter === "years"
            ? +this.period.months
            : Math.round(+this.period.years * 12);
      }
      this.updateResidenceProp({
        type: this.type,
        prop: "ResidencyDurationMonthsCount",
        value: ResidencyDurationMonthsCount
      });
    }
  }
};
