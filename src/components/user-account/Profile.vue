<template lang="pug">
    v-card.popup(mx-auto light)
        v-card-title.popup__title.dialog-header-back.dialog-header-text
            span.popup__title-text Profile {{versionText}}
            v-btn.popup__close-wrapper(icon @click="toggleIsOnlay({isOnlay: false})")
                v-icon.popup__close(color="white") mdi-close
        v-card-text.text-block.text-black--text.overflow-x-hidden
            v-row.text-block__row.my-0.px-4
                v-col.text-block__col(sm="6" cols="12")
                    v-text-field(
                        label="First Name" 
                        :value="user.firstName"
                        )
                v-col.text-block__col.popup_padding-0-col(sm="6" cols="12")
                    v-text-field(
                        label="Last Name" 
                        :value="user.lastName"
                        )
                v-col.text-block__col.popup_padding-0-col(sm="6" cols="12")
                    v-text-field(
                        label="Email" 
                        :value="user.emailAddress"
                        :rules="[rules.email]"
                        )
                v-col.text-block__col.popup_padding-0-col(sm="6" cols="12")
                    v-text-field(
                        label="Cell Phone" 
                        :value="getFormattedPhone(user.phoneNumber)"
                        @keypress="(e) => validatePhone(e)"
                        )
        v-divider
        .popup__buttons
            Button(value="Save" customClass="primary-button" @clicked="toggleIsOnlay({isOnlay: false})")
            Button(value="Cancel" customClass="button-no" @clicked="toggleIsOnlay({isOnlay: false})" isOutlined=true)
</template>

<script>
import Button from "@/components/buttons/Button";
import phoneFormat from "@/mixins/phoneFormat.js";
import onlyNum from "@/mixins/onlyNum.js";
import { mapActions, mapGetters } from "vuex";
import config from "@/configs";

export default {
  mixins: [onlyNum, phoneFormat],
  data() {
    return {
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
    ...mapActions(["toggleIsOnlay"])
  },
  computed: {
    ...mapGetters({
      user: "getCurrentUser"
    }),
    versionText(){
      return "(v" + config.versionNumber + ")";
    }
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/popup.scss";

.popup {
  &__buttons {
    &:deep(.button) {
      margin: 0 5px;
    }
  }
}

.text-block {
  padding: 10px 30px;
  @media (max-width: 760px) {
    padding: 10px;
  }
}
</style>
