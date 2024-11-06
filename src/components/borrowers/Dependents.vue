<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        If you have any dependents, please list how many and their ages
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container dependentsContainer">
        <Input
          inputTitle="Please click next if you have no dependents"
          placeholder="Number of dependents"
          inputmode="numeric"
          :value="Dependents.Count || ''"
          pattern="[0-9]*"
          @input="e => updateCount(e)"
          @keypress="e => isOnlyNum(e)"
          hint="Max - 9"
          maxLength="1"
        />
      </v-row>
      <div v-if="agesCount">
        <div class="titleText">
          Please enter the age(s) of each dependent:
        </div>
        <v-row class="form-container agesCountContainer">
          <Input
            class="ageInput"
            v-for="(age, i) in agesCount"
            :key="i"
            :smVal="1"
            :colsVal="3"
            :value="Dependents.Ages ? Dependents.Ages[i] : ''"
            inputmode="numeric"
            pattern="[0-9]*"
            @input="e => updateAges(e, i)"
            @keypress="e => isOnlyNum(e)"
            @keyup="e => tabToNext(e)"
            maxLength="2"
            :tabindex="i + 1"
            :autofocus="i === 0"
          />
        </v-row>
      </div>
      <div class="navigation-container">
        <NavigationButtons
          :ConditionsMet="isNextButtonDisabled"
        ></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import dependents from "@/mixins/dependents.js";
import loanPatch from "@/mixins/loanPatch.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, dependents, loanPatch],
  data() {
    return {};
  },
  methods: {
    ...mapActions(["updateDependents"])
  },
  computed: {
    ...mapGetters({
      Dependents: "getDependents"
    }),
    isNextButtonDisabled() {
      if (!this.Dependents.Count) return false;
      return (
        !this.Dependents.Ages ||
        this.Dependents.Ages.length !== this.Dependents.Count
      );
    },
    agesCount() {
      return this.Dependents.Count || 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/data.scss";
@import "@/assets/styles/variables.scss";
.ageInput {
  :deep(.v-input__slot) {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
  :deep(input) {
    text-align: center;
  }
}
.agesCountContainer {
  padding-top: 0 !important;
}

.dependentsContainer {
  padding-bottom: 10px !important;
}

.titleText {
  padding: 15px 30px 5px;
  @media (max-width: $tablet-width) {
    padding: 15px 20px 5px;
  }
  @media (max-width: $mobile-width) {
    padding: 15px 10px 5px;
  }
}
</style>
