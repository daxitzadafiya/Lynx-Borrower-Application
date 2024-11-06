<template lang="pug">
    .spinner
        template(v-if="isMagic")
            .magic
                .magic__item
                    FingerPrint
                .magic__item
                    Atom
                .magic__item
                    SwappingSquares
                .magic__item
                    SelfBuildingSquare
        template(v-else)
            v-progress-circular(
                :size="70"
                :width="7"
                color="primary"
                indeterminate
                )
</template>

<script>
import { mapGetters } from "vuex";
import FingerPrint from "./spinners/FingerPrint";
import Atom from "./spinners/Atom";
import SwappingSquares from "./spinners/SwappingSquares";
import SelfBuildingSquare from "./spinners/SelfBuildingSquare";

export default {
  computed: {
    ...mapGetters({
      isMagic: "getIsMagicSpinner"
    })
  },
  components: {
    FingerPrint,
    Atom,
    SwappingSquares,
    SelfBuildingSquare
  }
};
</script>

<style lang="scss" scoped>
.spinner {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
}

.magic {
  display: flex;
  align-items: center;
  &__item {
    margin: 0 20px;
    @media (max-width: 450px) {
      margin: 0 10px;
    }
  }
}
</style>
