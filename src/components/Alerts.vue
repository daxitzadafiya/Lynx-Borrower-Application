<template lang="pug">
    .alert
        v-alert(
            :type="type"
            transition="scale-transition"
            )
            template(v-slot:append)
                v-btn.alert__close-button(icon @click="setAlert({isAlert: false})")
                    v-icon(color="white") mdi-close
            | {{ message }}
            
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["setAlert"])
  },
  computed: {
    ...mapGetters({
      type: "getAlertType",
      message: "getAlertMessage"
    })
  },
  mounted() {
    this.isAlert = true;
  }
};
</script>

<style lang="scss" scoped>
.alert {
  z-index: 10000;
  position: fixed;
  top: 10px;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  margin-left: auto;
  margin-right: auto;
  max-width: 340px;
  &__close-button {
    max-height: 24px;
    max-width: 24px;
  }
}
</style>
