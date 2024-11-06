<template>
  <form class="loginForm">
    <h1 class="title text-center">Account Signup</h1>
    <h4 class="subtitle gray3-text text-center">Please enter your information</h4>
    <v-row class="mx-0 mt-0">
      <Input class="px-0" validate-on-blur="validate-on-blur" :smVal="12" style="font-size: 15px" inputTitle="First Name"
        :value="signupData.firstName" :isRequired="true"
        @input="(e) => signupData.firstName = e"></Input>
    </v-row>
    <v-row class="mx-0 mt-0">
      <Input class="px-0" validate-on-blur="validate-on-blur" :smVal="12" style="font-size: 15px" inputTitle="First Name"
        :value="signupData.lastName" :isRequired="true"
        @input="(e) => signupData.lastName = e"></Input>
    </v-row>
    <v-row class="mx-0 mt-0">
      <Input class="px-0" validate-on-blur="validate-on-blur" :smVal="12" style="font-size: 15px" inputTitle="Email"
        :rules="[rules.email]" :value="signupData.emailAddress" :isRequired="true"
        @input="(e) => signupData.emailAddress = e"></Input>
    </v-row>
    <v-row class="mx-0 mt-0">
      <Input class="px-0" validate-on-blur="validate-on-blur" :smVal="12" style="font-size: 15px" inputTitle="Username"
        :value="signupData.userName" :isRequired="true"
        @input="(e) => signupData.userName = e"></Input>
    </v-row>
    <v-row class="mx-0 mt-0">
      <Input class="px-0" validate-on-blur="validate-on-blur" :smVal="12" style="font-size: 15px" hint="Minimum length is 8 characters"
      inputTitle="Create password" :isRequired="true"
        :append-icon="isShow ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.password]" :value="signupData.password"
        :type="isShow ? 'text' : 'password'" @input="(e) => signupData.password = e"
        @click:append="isShow = !isShow"></Input>
    </v-row>
    <div class="submit-button mt-5">
      <Button type="submit" value="Sign Up" width="100%" :isDisabled="isDisabled" customClass="primary-button"
        @clicked="signUp"></Button>
    </div>
    <div class="form-link d-flex flex-column justify-center align-center mt-5">
      <div class="gray2-text">Have an account? <router-link class="link primary-text" to="/login">Log in</router-link></div>
    </div>
  </form>
</template>

<script>
import Button from "@/components/buttons/Button";
import { mapActions } from "vuex";
import config from "@/configs";

export default {
  data() {
    return {
      signupData: {
        firstName: "",
        lastName: "",
        emailAddress: "",
        userName: "",
        password: "",
        campaignId: "",
        campaignType: 0
      },
      isShow: false,
      rules: {
        email: value => {
          const pattern = this.emailRegex;
          return pattern.test(value) || "Invalid e-mail.";
        },
        password: value => value.length >= 8 || "Minimum length is 8 characters"
      },
      emailRegex: /[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
    };
  },
  methods: {
    ...mapActions(["signUpAccount"]),
    setDefaultsFormQuery() {
      const {
        applicationId,
        firstName,
        lastName,
        email,
        userName,
        campaignId,
        campaignType
      } = this.$route.query;

      this.signupData.applicationId = applicationId || config.applicationId;
      this.signupData.firstName = firstName || "";
      this.signupData.lastName = lastName || "";
      this.signupData.emailAddress = email || "";
      this.signupData.userName = userName || "";
      this.signupData.campaignId = campaignId || "";
      this.signupData.campaignType = campaignType || 0;
    },
    async signUp() {
      await this.signUpAccount(this.signupData);
    }
  },
  components: {
    Button
  },
  computed: {
    isDisabled() {
      return (
        !this.signupData.firstName ||
        !this.signupData.lastName ||
        !this.signupData.userName ||
        !this.signupData.emailAddress ||
        !this.emailRegex.test(this.signupData.emailAddress) ||
        this.signupData.password.length < 8
      );
    },
  },
  mounted() {
    this.setDefaultsFormQuery();
  }
};
</script>
