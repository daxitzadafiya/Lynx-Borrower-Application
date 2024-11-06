<template lang="pug">
    v-card.popup(mx-auto light)
        v-card-title.popup__title.primary.white--text
            span.popup__title-text Present Housing Expenses
            v-btn.popup__close-wrapper(icon @click="toggleIsOnlay({isOnlay: false})")
                v-icon.popup__close(color="white") mdi-close
        .subtitle
            .subtitle_bold {{ editingPropertyDetails.title }}
            .subtitle_normal {{editingPropertyDetails.location}}
        ExpensesDetailsData(:expenses="expenses" name="editingExpenses")
        v-divider
        .popup__button
            .popup_desktop-button
                Button(value="OK" customClass="primary-button" @clicked="toggleIsOnlay({isOnlay: false})")
            .popup_mobile-button
                Button(value="OK" customClass="primary-button" width="200px" @clicked="toggleIsOnlay({isOnlay: false})")    
</template>

<script>
import ExpensesDetailsData from "./ExpensesDetailsData";
import Button from "@/components/buttons/Button";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      reasons: ["This is not my account"]
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay"])
  },
  computed: {
    ...mapGetters({
      expenses: "getEditingExpenses",
      editingPropertyDetails: "getEditingPropertyDetails"
    })
  },
  components: {
    ExpensesDetailsData,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/popup.scss";

.popup {
  width: 720px;
  &__row {
    justify-content: flex-start;
  }
}

.subtitle {
  padding: 20px 0 0 45px;
  &_bold {
    font-weight: 500;
  }
}

@media (max-width: 760px) {
  .popup {
    &__col {
      padding-bottom: 0;
    }
  }
  .subtitle {
    padding-left: 15px;
  }
}
</style>
