<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Are there any alternate names by which you are known?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input
          inputTitle="First Name"
          :value="currentBorrower.AlternateFirstName"
          @input="
            e =>
              $emit('updateBorrower', { prop: 'AlternateFirstName', value: e })
          "
        />
        <Input
          inputTitle="Last Name"
          :value="currentBorrower.AlternateLastName"
          @input="
            e =>
              $emit('updateBorrower', { prop: 'AlternateLastName', value: e })
          "
        />
        <Input
          inputTitle="Suffix"
          :value="currentBorrower.AlternateSuffixName"
          @input="
            e =>
              $emit('updateBorrower', { prop: 'AlternateSuffixName', value: e })
          "
        />
      </v-row>
      <div class="navigation-container">
        <NavigationButtons></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  props: {
    currentBorrower: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
