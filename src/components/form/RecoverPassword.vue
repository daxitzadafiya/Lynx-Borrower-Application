<template>
    <form class="loginForm">
        <h1 class="title text-center">Recover Password</h1>
        <template v-if="isForm">
          <v-row class="mx-0 mt-5">
            <Input class="px-0" validate-on-blur="validate-on-blur" :smVal="12" style="font-size: 15px" inputTitle="Email" :isRequired="true" :rules="[rules.email]" v-model="recoverData.emailAddress"></Input>
          </v-row>
          <v-row class="mx-0 mt-0">
            <Input class="px-0" validate-on-blur="validate-on-blur" :smVal="12" style="font-size: 15px" inputTitle="Cell Phone" :isRequired="true" pattern="[0-9]*" inputmode="tel" :value="getFormattedPhone(recoverData.cellPhoneNumber)" @input="(e) => recoverData.cellPhoneNumber = e ? e.replace(/[()]|-| /g,'') : ''" @keypress="(e) => validatePhone(e)"></Input>
          </v-row>
          <div class="submit-button mt-5 pb-3">
            <Button butType="submit" form="recover-pass-form" value="Recover Password" customClass="primary-button" width="100%" height="45px" @clicked="submitto" :isDisabled="isDisabled"></Button>
          </div>
        </template>
        <template v-else max-width="460px">
          <v-card-text class="text-center px-0">Your request to recover your password was successfully processed. Please check your email to continue the recovery process.</v-card-text>
        </template>
    </form>
</template>

<script>
import Button from "@/components/buttons/Button";
import onlyNum from "@/mixins/onlyNum.js";
import phoneFormat from "@/mixins/phoneFormat.js";
import { mapActions } from "vuex";

export default {
  mixins: [onlyNum, phoneFormat],
  data() {
    return {
      isForm: true,
      recoverData: {
        emailAddress: "",
        cellPhoneNumber: "",
        applicationId: 2
      },
      rules: {
        email: value => {
          const pattern = this.emailRegex;
          return pattern.test(value) || "Invalid e-mail.";
        }
      },
      emailRegex: /[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
    };
  },
  methods: {
    ...mapActions(["recoverPass"]),
    validatePhone(e) {
      if (e.target.value.length === 14 && e.keyCode !== 13) {
        e.preventDefault();
        return false;
      }
      return this.isOnlyNum(e);
    },
    async submitto() {
      try {
        await this.recoverPass({ ...this.recoverData });
        this.isForm = false;
      } catch (err) {}
    }
  },
  computed: {
    isDisabled() {
      return (
        !this.recoverData.emailAddress ||
        !this.emailRegex.test(this.recoverData.emailAddress) ||
        !this.recoverData.cellPhoneNumber
      );
    }
  },
  components: {
    Button
  }
};
</script>