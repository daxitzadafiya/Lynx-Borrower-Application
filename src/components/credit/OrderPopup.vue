<template lang="pug">
    v-card.popup(mx-auto light max-width="350px")
        v-card-title.popup__title.dialog-header-back.dialog-header-text
            span.popup__title-text Order confirmation
        v-card-text.popup__main.text-black--text
            .centered Please confirm that you are ready to order your credit report.
        v-divider
        .popup__buttons
            Button(value="YES" customClass="button-yes" @clicked="closeAndSendOrder" isOutlined=true)    
            Button(value="NO" customClass="button-no" @clicked="toggleIsOnlay({isOnlay: false})" isOutlined=true)    
</template>

<script>
import Button from "@/components/buttons/Button";
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["toggleIsOnlay", "sendOrderRequest", "setMagicSpinner"]),
    async closeAndSendOrder() {
      this.toggleIsOnlay({ isOnlay: false });
      await this.sendOrderRequest();
    }
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/popup.scss";

.centered {
  text-align: center;
  font-size: 20px;
}

.popup {
  &__buttons {
    &:deep(.button) {
      margin: 0 5px;
    }
  }
}
</style>
