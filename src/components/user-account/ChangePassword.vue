<template lang="pug">
    v-card.popup(mx-auto light)
        v-card-title.popup__title.dialog-header-back.dialog-header-text
            span.popup__title-text Password Change
            v-btn.popup__close-wrapper(icon @click="toggleIsOnlay({isOnlay: false})")
                v-icon.popup__close(color="white") mdi-close
        v-card-text.text-block.text-black--text
            v-row.text-block__row
                v-text-field(
                    autocomplete="off"
                    validate-on-blur
                    style="font-size: 15px"
                    hint="Minimum length is 8 characters"
                    label="New password *"
                    :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.password]"
                    :value="password"
                    :type="isShowPassword ? 'text' : 'password'"
                    @input="(e) => password = e"
                    @click:append="isShowPassword = !isShowPassword"
                    )
            v-row.text-block__row
                v-text-field(
                    autocomplete="off"
                    validate-on-blur
                    style="font-size: 15px"
                    hint="Minimum length is 8 characters"
                    label="New password copy*"
                    :append-icon="isShowPasswordCopy ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.password]"
                    :value="passwordCopy"
                    :type="isShowPasswordCopy ? 'text' : 'password'"
                    @input="(e) => passwordCopy = e"
                    @click:append="isShowPasswordCopy = !isShowPasswordCopy"
                    )
        v-divider
        .popup__buttons
            Button(value="Save" customClass="primary-button" @clicked="check")
            Button(value="Cancel" @clicked="toggleIsOnlay({isOnlay: false})" isOutlined=true)
</template>

<script>
import Button from "@/components/buttons/Button";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      rules: {
        password: value => value.length >= 8 || "Minimum length is 8 characters"
      },
      password: "",
      passwordCopy: "",
      isShowPassword: false,
      isShowPasswordCopy: false
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "setAlert"]),
    check() {
      if (this.password !== this.passwordCopy) {
        return this.setAlert({
          isAlert: true,
          alertType: "error",
          alertMessage: "Password and Password Copy should match!"
        });
      } else {
        this.toggleIsOnlay({ isOnlay: false });
      }
    }
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser"
    })
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/popup.scss";

.popup {
  max-width: 350px;
  &__buttons {
    &:deep(.button) {
      margin: 0 5px;
    }
  }
  &__title {
    padding-left: 15px;
  }
}

.text-block {
  padding: 10px 30px;
}
</style>
