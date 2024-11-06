<template>
  <div style="display:contents;">
    <Input
      attach="attach"
      inputTitle="Current Usage"
      defaultComponent="v-select"
      :items="types"
      item-text="text"
      item-value="value"
      :lgVal="lgVal"
      :mdVal="mdVal"
      :value="currentRealEstate.PropertyCurrentUsageType"
      @change="e => setUsageType(e, 'PropertyCurrentUsageType')"
      :menu-props="{ bottom: true, offsetY: true }"
    />
    <Input
      attach="attach"
      v-if="currentRealEstate.PropertyDispositionStatusType === 'Retain'"
      defaultComponent="v-select"
      inputTitle="Intended Usage"
      :items="types"
      item-text="text"
      item-value="value"
      :lgVal="lgVal"
      :mdVal="mdVal"
      :value="currentRealEstate.PropertyIntendedUsageType"
      :menu-props="{ bottom: true, offsetY: true }"
      @change="e => setUsageType(e, 'PropertyIntendedUsageType')"
    />
    <slot></slot>
  </div>
</template>

<script>
import { propertyCurrentUsageTypes } from "@/models/constants.js";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    index: {
      type: Number,
      default: -1
    },
    lgVal: {
      type: Number
    },
    mdVal: {
      type: Number
    }
  },
  data() {
    return {
      types: propertyCurrentUsageTypes
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
