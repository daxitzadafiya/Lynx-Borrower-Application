<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter your Email Address</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input
          :isRequired="true"
          inputTitle="Email Address"
          :value="currentBorrower.Email"
          @input="e => $emit('updateBorrower', { prop: 'Email', value: e })"
          :rules="[rules.email]"
        />
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isValidEmail"></NavigationButtons>
    </div>
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
  },
  data() {
    return {
      rules: {
        email: value => {
          const pattern = this.emailRegex;
          if (!value) return "Email Address is required.";
          return pattern.test(value) || "Invalid e-mail.";
        }
      },
      emailRegex: /[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
    };
  },
  computed: {
    isValidEmail() {
      return (
        this.currentBorrower.Email == null ||
        this.currentBorrower.Email.length == 0 || 
        !this.emailRegex.test(this.currentBorrower.Email)
      );
    }
  }
};
</script>
