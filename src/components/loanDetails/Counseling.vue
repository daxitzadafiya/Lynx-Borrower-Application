<template lang="pug">
    v-card(light)
        v-card-title Counseling
        v-card-text
            Parties(:parties="parties" :borrowers="borrowers")
            Events(:parties="parties" :borrowers="borrowers")
            Button(value="Save" customClass="primary-button" @clicked="saveLoanPatches")
</template>

<script>
import Parties from "./counselings/Parties";
import Events from "./counselings/Events";
import { mapGetters, mapActions } from "vuex";
import Button from "@/components/buttons/Button";

export default {
  methods: {
    ...mapActions(["saveLoanPatches"])
  },
  computed: {
    ...mapGetters({
      parties: "getCounselingParties",
      borrowers: "getBorrowers"
    })
  },
  components: {
    Parties,
    Events,
    Button
  }
};
</script>

<style lang="scss">
.no-background-active {
  &::after {
    background-color: transparent !important;
  }
}
</style>
