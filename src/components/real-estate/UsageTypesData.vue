<template lang="pug">
    v-row.text-block__row
        v-col.text-block__col(sm="4" cols="12")
            v-select(
                attach
                label="Current Usage"
                :items="types"
                item-text="text"
                item-value="value"
                :value="currentRealEstate.PropertyCurrentUsageType"
                @change="(e) => setUsageType(e, 'PropertyCurrentUsageType')"
                :menu-props="{bottom: true, offsetY: true }"
            )
        v-col.text-block__col(sm="4" cols="12" v-if="currentRealEstate.PropertyDispositionStatusType === 'Retain'")
            v-select(
                attach
                label="Intended Usage"
                :items="types"
                item-text="text"
                item-value="value"
                :value="currentRealEstate.PropertyIntendedUsageType"
                :menu-props="{bottom: true, offsetY: true }"
                @change="(e) => setUsageType(e, 'PropertyIntendedUsageType')"
            )
        slot
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      types: [
        { text: "Investment", value: "Investment" },
        { text: "Primary Residence", value: "PrimaryResidence" },
        { text: "Second Home", value: "SecondHome" },
        { text: "Other ", value: "Other" }
      ]
    };
  },
  methods: {
    ...mapActions(["setRealEstate"]),
    setUsageType(value, prop) {
      const realEstate = { ...this.currentRealEstate, [prop]: value };
      let realEstates = [...this.RealEstate];
      realEstates[this.editingIndex] = JSON.parse(JSON.stringify(realEstate));
      this.setRealEstate(realEstates);
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentRealEstateIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.editingIndex] || {};
    },
    editingIndex() {
      return this.index >= 0 ? this.index : this.currentRealEstateIndex;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";
</style>
