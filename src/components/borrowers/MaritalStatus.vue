<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Borrower Marital Status</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :value="activeStatus"
        @change="setMaritalStatus"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="item in statuses"
            :key="item.title"
            :value="item.title"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="!activeStatus"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import ToggleCard from "@/components/controls/ToggleCard";
import { getStateIndicator } from "@/helpers/states.js";

export default {
  props: {
    currentBorrower: {
      type: Object,
      default: () => {
        return {};
      }
    },
    property: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      statuses: [
        {
          src: require("@/assets/images/borrowers/unmarried.svg"),
          title: "Unmarried"
        },
        {
          src: require("@/assets/images/borrowers/married.svg"),
          title: "Married"
        },
        {
          src: require("@/assets/images/borrowers/separated.svg"),
          title: "Separated"
        }
      ],
      activeStatus: ""
    };
  },
  methods: {
    setMaritalStatus(title) {
      this.$emit("updateBorrower", { prop: "MaritalStatusType", value: title });
      this.activeStatus = title;
    }
  },
  computed: {
  },
  components: {
    ToggleCard
  },
  mounted() {
    this.activeStatus = this.currentBorrower.MaritalStatusType || "";
  }
};
</script>
