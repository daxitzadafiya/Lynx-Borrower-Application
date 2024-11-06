<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Have you declared bankruptcy within the past 7 years?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :value="curIndicatorValue"
        @change="setDeclarationsProp"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(value, name) in options"
            :key="name"
            smVal=""
            :value="name"
          >
            <p>{{ value }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="declarations.BankruptcyIndicator == undefined"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ToggleCard from "@/components/controls/ToggleCard";

export default {
  props: {
    declarations: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      options: {
        No: "No",
        ChapterSeven: "Chapter 7",
        ChapterEleven: "Chapter 11",
        ChapterTwelve: "Chapter 12",
        ChapterThirteen: "Chapter 13"
      }
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setDeclarationsProp(val) {
      let Declarations = { ...this.declarations };
      if (val === "No") {
        Declarations.BankruptcyIndicator = false;
        delete Declarations.BankruptcyChapterType;
      } else {
        Declarations.BankruptcyChapterType = val;
        Declarations.BankruptcyIndicator = true;
      }
      this.updateBorrower({ prop: "Declarations", value: Declarations });
    }
  },
  components: {
    ToggleCard
  },
  computed: {
    curIndicatorValue() {
      if (this.declarations.BankruptcyIndicator === false) {
        return "No";
      }
      return this.declarations.BankruptcyChapterType;
    }
  }
};
</script>
