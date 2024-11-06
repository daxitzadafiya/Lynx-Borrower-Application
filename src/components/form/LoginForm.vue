<template>
  <form class="loginForm text-center">
    <h1 class="title">Log in to your account</h1>
    <h4 class="subtitle gray3-text">Please enter your details</h4>
    <v-row class="mx-0 pt-5 mt-1">
      <Input
        class="px-0"
        validate-on-blur="validate-on-blur"
        :smVal="12"
        v-model="email"
        label="Email/Username *"
        :isRequired="true"
        autocomplete="on"
        ref="emailInput"
        persistent-placeholder="persistent-placeholder"
      />
    </v-row>
    <v-row class="mx-0">
      <Input
        class="px-0"
        validate-on-blur="validate-on-blur"
        :smVal="12"
        v-model="password"
        :type="isShow ? 'text' : 'password'"
        label="Password *"
        :isRequired="true"
        autocomplete="off"
        persistent-placeholder="persistent-placeholder"
      />
    </v-row>
    <v-row class="mx-0 options mb-3 justify-space-between">
      <div class="d-flex align-center">
        <CheckBox :isChecked="isRemember" @toggle="toggle"></CheckBox>
        <div class="primary-text pl-1">Remember me</div>
      </div>
      <div class="align-center justify-end desktopForgotPassword">
        <router-link class="link" to="/recover-password"
          >Forgot password?</router-link
        >
      </div>
    </v-row>
    <div class="submit-button">
      <Button
        butType="submit"
        :isDisabled="isDisabled"
        :value="buttonVal"
        width="100%"
        height="45px"
        customClass="primary-button text-capitalize-none"
        @clicked="login"
      ></Button>
    </div>
    <div class="form-link d-flex flex-column justify-center align-center mt-5">
      <router-link class="link mobileForgotPassword" to="/recover-password"
        >Forgot password?</router-link
      >
      <div class="gray2-text">
        Need an account?
        <router-link class="link primary-text" to="/sign-up"
          >Sign up</router-link
        >
      </div>
    </div>
  </form>
</template>

<script>
import CheckBox from "./CheckBox";
import Button from "@/components/buttons/Button";
import { mapActions, mapGetters } from "vuex";
import config from "@/configs";
import loanPatch from "@/mixins/loanPatch.js";

export default {
  mixins: [loanPatch],
  data() {
    return {
      email: "",
      password: "",
      isShow: false,
      isRemember: false,
      isDisabled: false
    };
  },
  methods: {
    ...mapActions(["authenticate", "getLoanById", "underwrite"]),
    toggle({ value }) {
      this.isRemember = value;
    },
    async login() {
      try {
        this.isDisabled = true;
        await this.authenticate({
          username: this.email,
          password: this.password,
          applicationId: config.applicationId
        });

        if (
          this.CurrentUser.keyIdentifier &&
          this.CurrentUser.keyIdentifier != 0
        ) {
          await this.getLoanById(this.CurrentUser.keyIdentifier);
        }

        if (
          this.CurrentLoan &&
          (this.CurrentLoan.StatusId == 9 || this.CurrentLoan.StatusId == 7)
        ) {
          this.$router.push("/review");
        } else if (this.CurrentLoan && this.CurrentLoan.StatusId > 7) {
          this.underwrite(true);
        } else if (this.$route.query && this.$route.query.redirect) {
          if (this.CurrentUser != 1) {
            if (this.CurrentLoan.StatusId <= 6) {
              if (
                this.$route.query.redirect.startsWith("review") ||
                this.$route.query.redirect.startsWith("documents")
              ) {
                return this.$router.push("/application-complete");
              }
            }
          }
          return this.$router.push(this.$route.query.redirect);
        } else {
          this.saveAndAdvance(false, "", true);
        }
      } catch (err) {
        this.isDisabled = false;
      }
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower",
      CurrentUser: "getCurrentUser",
      CurrentLoan: "getCurrentLoan"
    }),
    buttonVal() {
      return this.isDisabled ? "Please wait" : "Login";
    }
  },
  components: {
    CheckBox,
    Button
  },
  mounted() {
    document.getElementsByClassName("submit-button")[0].focus();
    let params = new URL(document.location.href).searchParams;
    if (params.has("email")) {
      this.email = params.get("email");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.options {
  @media (max-width: $mobile-width) {
    flex-direction: column;
  }
}
.desktopForgotPassword {
  display: flex;
  @media (max-width: $mobile-width) {
    display: none;
  }
}

.mobileForgotPassword {
  display: none;
  @media (max-width: $mobile-width) {
    display: block;
  }
}
</style>
