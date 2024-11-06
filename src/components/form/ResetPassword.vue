<template>
  <form class="loginForm">

        <h2 class="title text-center">Reset Password</h2>
        <v-row class="mx-0 mt-0">
          <Input :smVal="12" class="px-0" validate-on-blur style="font-size: 15px" v-model="resetData.username" inputTitle="Email/Username" :isRequired="true" autocomplete="on"></Input>
        </v-row>
        <v-row class="mx-0 mt-0">
          <Input :smVal="12" class="px-0" validate-on-blur style="font-size: 15px" :append-icon="isShowPass ? 'mdi-eye' : 'mdi-eye-off'" :isRequired="true" v-model="resetData.password" :type="isShowPass ? 'text' : 'password'" inputTitle="Password" autocomplete="off" @click:append="isShowPass = !isShowPass" :rules="[rules.password]"></Input>
        </v-row>
        <v-row class="pb-5 mx-0" :style="{ height: '4px', position: 'relative' }" v-if="resetData.password.length">
          <v-progress-linear :value="progress" :color="color" height="4" absolute="absolute"></v-progress-linear>
        </v-row>
        <v-row class="mx-0 mt-0">
          <Input :smVal="12" class="px-0" validate-on-blur style="font-size: 15px" :append-icon="isShowPassCopy ? 'mdi-eye' : 'mdi-eye-off'" :isRequired="true" v-model="passwordCopy" :type="isShowPassCopy ? 'text' : 'password'" inputTitle="Re-Enter Password" placeholder="Re-Enter Password" autocomplete="off" @click:append="isShowPassCopy = !isShowPassCopy" :rules="[rules.passwordCopy]"></Input>
        </v-row>
        <div class="submit-button mt-5 pb-3">
          <Button butType="submit" :isDisabled="isDisabled || resetData.password.length > 8" value="Reset Password" width="100%" height="45px" @clicked="reset" customClass="primary-button"></Button>
        </div>
        </form>
</template>

<script>
import CheckBox from "./CheckBox";
import Button from "@/components/buttons/Button";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      rules: {
        password: value =>
          value.length >= 8 || "Minimum length is 8 characters",
        passwordCopy: value =>
          (value.length && value === this.resetData.password) ||
          "Passwords do not match"
      },
      resetData: {
        username: "",
        password: "",
        resetToken: "",
        applicationId: 2
      },
      isShowPass: false,
      passwordCopy: "",
      isShowPassCopy: false
    };
  },
  methods: {
    ...mapActions(["resetPass"]),
    toggle({ value }) {
      this.isRemember = value;
    },
    async reset() {
      await this.resetPass({ ...this.resetData });
    }
  },
  computed: {
    isDisabled() {
      return (
        !this.resetData.username ||
        !this.resetData.password ||
        !this.passwordCopy ||
        this.resetData.password !== this.passwordCopy
      );
    },
    progress() {
      const capitalRegex = /(?=.*[A-Z])/;
      const nonAlphaNumRegex = /(?=.*[-+_!@#$%^&*.,?])/;
      if (this.resetData.password.length) {
        const isCapital = capitalRegex.test(this.resetData.password);
        const isNonAlpha = nonAlphaNumRegex.test(this.resetData.password);
        if (!isCapital && !isNonAlpha) {
          return 30;
        } else if ((isCapital && !isNonAlpha) || (isNonAlpha && !isCapital)) {
          return 50;
        } else {
          return 100;
        }
      }
      return 0;
    },
    color() {
      return ["error", "warning", "success"][Math.floor(this.progress / 40)];
    }
  },
  components: {
    CheckBox,
    Button
  },
  mounted() {
    if (this.$route.query) {
      const { resetToken, userName } = this.$route.query;
      this.resetData = {
        username: userName || "",
        resetToken,
        password: "",
        applicationId: 2
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";

.login-form {
  @include form-generic;
  @media (max-width: 480px) {
    form {
      width: 360px;
    }
  }
  @media (max-width: 380px) {
    form {
      width: 330px;
    }
  }
  &:deep(.v-progress-linear--absolute) {
    top: -22px;
  }
}

.options {
  width: 100%;
  position: relative;
  &__item {
    width: 50%;
  }
  &__label {
    margin-left: 5px;
    font-size: 14px;
  }
  &_font-12 {
    font-size: 12px;
  }
  &__icon {
    cursor: pointer;
  }
}
</style>
