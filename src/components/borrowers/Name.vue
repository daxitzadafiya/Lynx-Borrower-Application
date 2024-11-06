<template>
  <div class="borrowers-data">
    <div class="content-container">
      <div class="content-header-container">
        <div class="header-text">
          Please enter your name as it is shown on your driver's license or
          other legal ID.
        </div>
      </div>
      <v-form fast-fail="fast-fail">
        <v-row class="form-container">
          <Input
            inputTitle="First Name"
            :value="currentBorrower.FirstName"
            @input="
              e => $emit('updateBorrower', { prop: 'FirstName', value: e })
            "
            :rules="[value => !!value || 'First Name is required.']"
          />
          <Input
            inputTitle="Last Name"
            :value="currentBorrower.LastName"
            @input="
              e => $emit('updateBorrower', { prop: 'LastName', value: e })
            "
            :rules="[value => !!value || 'Last Name is required.']"
          />
          <Input
            inputTitle="Middle Name"
            :value="currentBorrower.MiddleName"
            @input="
              e => $emit('updateBorrower', { prop: 'MiddleName', value: e })
            "
          />
          <Input
            inputTitle="Suffix"
            :value="currentBorrower.SuffixName"
            @input="
              e => $emit('updateBorrower', { prop: 'SuffixName', value: e })
            "
          />
        </v-row>
      </v-form>
      <div class="navigation-container">
        <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentBorrower: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isNextDisabled() {
      return (
        this.currentBorrower.FirstName == null ||
        this.currentBorrower.FirstName.length == 0 ||
        this.currentBorrower.LastName == null ||
        this.currentBorrower.LastName.length == 0
      );
    }
  }
};
</script>
