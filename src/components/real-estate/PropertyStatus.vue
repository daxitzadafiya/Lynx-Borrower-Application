<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">At the time this transaction closes what will be the status of {{ currentRealEstate.AddressLineText || 'this property' }}?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :value="formatted" @change="setStatus">
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in statuses" :key="index" :value="item.title">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import ToggleCard from "@/components/controls/ToggleCard";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      statuses: [
        {
          src: require("@/assets/images/real-estate/retained.svg"),
          title: "Retain"
        },
        {
          src: require("@/assets/images/real-estate/sold.svg"),
          title: "Sold"
        },
        {
          src: require("@/assets/images/real-estate/pending-sale.svg"),
          title: "Pending Sale"
        }
      ],
      activeStatus: ""
    };
  },
  methods: {
    ...mapActions(["setRealEstate"]),
    setStatus(status) {
      const realEstate = {
        ...this.currentRealEstate,
        PropertyDispositionStatusType: status.replace(/ /g, "")
      };
      let realEstates = [...this.RealEstate];
      realEstates[this.currentIndex] = realEstate;
      this.setRealEstate(realEstates);
    }
  },
  computed: {
    ...mapGetters({
      RealEstate: "getRealEstate",
      currentIndex: "getRealEstateEditingIndex"
    }),
    currentRealEstate() {
      return this.RealEstate[this.currentIndex] || {};
    },
    formatted() {
      return this.currentRealEstate.PropertyDispositionStatusType
        ? this.currentRealEstate.PropertyDispositionStatusType.replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
          )
        : "";
    }
  },
  components: {
    ToggleCard
  }
};
</script>