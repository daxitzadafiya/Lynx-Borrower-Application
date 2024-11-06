<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">What is your Date of Birth?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <DateInput inputTitle="Date of Birth" @dateUpdated="updateBorrowerDate" @dateCleared="clearBirthDate" :value="currentBorrower==null?null: currentBorrower.BorrowerBirthDate" :maxDate="maxDate">
          <p class="mt-2 red--text" v-if="adultDateValidation">You must be at least 18 years of age to proceed with a loan application.</p>
        </DateInput>
      </v-row>
      <div class="navigation-container">
        <NavigationButtons :ConditionsMet="adultDateValidation"></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>

<script>
import DateInput from "@/components/form/DateInput";
import moment from "moment";

export default {
  props: {
    currentBorrower: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isMenu: false,
      maxDate: null,
    };
  },
  methods: {
    updateBorrowerDate(date) {
      this.$emit("updateBorrower", {
        prop: "BorrowerBirthDate",
        value: date != null ? moment(date).format("YYYY-MM-DD") : null,
      });
    },
    clearBirthDate() {
      this.updateBorrowerDate(null);
      this.isMenu = false;
    },
  },
  created() {
    var date = new Date();
    this.maxDate = new Date(date.setFullYear(date.getFullYear() - 18))
      .toISOString()
      .slice(0, 10);
  },
  computed: {
    adultDateValidation() {
      if (this.selectedDate == null) return false;
      const selected = new Date(this.selectedDate);
      return (
        new Date(
          selected.getFullYear() + 18,
          selected.getMonth(),
          selected.getDate() + 1
        ) > new Date()
      );
    },
  },
  components: {
    DateInput
  },
};
</script>