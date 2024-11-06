<template lang="pug">
<div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the date of closing for {{ currentRealEstate.AddressLineText || 'this property' }}?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <DateInput inputTitle="Closing Date" @dateUpdated="setRealEstateDate" @dateCleared="clearRealEstateDate" :value="currentRealEstate.ClosingDate" :maxDate="maxDate"></DateInput>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
</div>
</template>


<script>
import DateInput from "@/components/form/DateInput";
import { mapGetters, mapActions } from "vuex";

export default {
    data() {
    return {
      maxDate: new Date().toISOString().slice(0, 10)
    };
  },
  methods: {
    ...mapActions(["setRealEstate"]),
    setRealEstateDate(date) {
      const realEstate = {
        ...this.currentRealEstate,
        ClosingDate: date
      };
      let realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = realEstate;
      this.setRealEstate(realEstates);
    },
    clearRealEstateDate(){
      const realEstate = {
        ...this.currentRealEstate,
        ClosingDate: null
      };
      let realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = realEstate;
      this.setRealEstate(realEstates);
    }
  },
  components: {
    DateInput
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    }
  }
};
</script>