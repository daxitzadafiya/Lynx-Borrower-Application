<template>
  <div class="personal-info">
    <NewSummaryControl
      header="Military Service"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <div class="summaryItem">
          <div
            class="summaryValue"
            v-if="Borrower.SelfDeclaredMilitaryServiceIndicator"
          >
            Current or Prior Military Service.
          </div>
          <div class="summaryValue" v-else>
            No Current or Prior Military Service.
          </div>
        </div>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <div class="v-row form-container">
            <v-col class="sm=12 cols=12 itemContainer pb-0">
              <div class="titleText">
                Did you (or your deceased spouse) ever serve, or are you
                currently serving, in the United States Armed Forces?
              </div>
            </v-col>
            <v-col class="sm=4 md=4 cols=12 itemContainer">
              <v-radio-group
                class="mt-0 radioGroup row hide-details"
                :value="Borrower.SelfDeclaredMilitaryServiceIndicator"
                @change="
                  val =>
                    updateBorrower({
                      prop: 'SelfDeclaredMilitaryServiceIndicator',
                      value: val
                    })
                "
              >
                <v-radio label="YES" :value="true"></v-radio>
                <v-radio label="NO" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
          </div>
          <div
            class="v-row form-container ml-2"
            v-if="Borrower.SelfDeclaredMilitaryServiceIndicator"
          >
            <v-col class="itemContainer sm=12 cols=12 mb-0">
              <div class="titleText">Select all that apply:</div>
            </v-col>
            <v-col class="itemContainer cols=12 md=7">
              <v-checkbox
                class="defaultCheckbox mt-0 hide-details dense"
                :value="isServing"
                @change="() => toggleService('isServing')"
              >
                <template v-slot:label>
                  <div class="inputTitle">
                    Currently serving on active duty with project expitation
                    date of service/tour
                  </div>
                </template>
              </v-checkbox>
              <v-checkbox
                class="defaultCheckbox mt-0 hide-details dense"
                :value="isRetired"
                @change="() => toggleService('isRetired')"
              >
                <template v-slot:label>
                  <div class="inputTitle">
                    Currently retired, discharged, or seperated from service
                  </div>
                </template>
              </v-checkbox>
              <v-checkbox
                class="defaultCheckbox mt-0 hide-details dense"
                :value="isPeriod"
                @change="() => toggleService('isPeriod')"
              >
                <template v-slot:label>
                  <div class="inputTitle">
                    Only period of service was as a non-activated member of the
                    Reserve or National Guard
                  </div>
                </template>
              </v-checkbox>
              <v-checkbox
                class="defaultCheckbox mt-0 hide-details dense"
                :value="isSpouse"
                @change="() => toggleService('isSpouse')"
              >
                <template v-slot:label>
                  <div class="inputTitle">Surviving spouse</div>
                </template>
              </v-checkbox>
            </v-col>
          </div>
          <date-input
            input-title="Project expitation date"
            v-if="isPicker"
            :sm-val="6"
            :md-val="3"
            @date-updated="updateExpirationDate"
            @date-cleared="clearExpirationDate"
            :value="selectedDate"
          ></date-input>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<script>
import DateInput from "@/components/form/DateInput";
import { mapGetters, mapActions } from "vuex";
import military from "@/mixins/military.js";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  mixins: [military],
  data() {
    return {
      icon: require("@/assets/images/borrowers/military-service.svg"),
      dataBeforeEdit: null,
      isSpouse: false
    };
  },

  methods: {
    ...mapActions(["updateBorrower", "updateMilitary", "saveLoanPatches"]),
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = [
        {
          prop: "SelfDeclaredMilitaryServiceIndicator",
          value: this.Borrower.SelfDeclaredMilitaryServiceIndicator
        },
        {
          prop: "MilitaryServices",
          value: this.Borrower.MilitaryServices
            ? JSON.parse(JSON.stringify(this.Borrower.MilitaryServices))
            : null
        },
        {
          prop: "SpousalVABenefitsEligibilityIndicator",
          value: !this.Borrower.SpousalVABenefitsEligibilityIndicator
        }
      ];
    },
    onCancelClicked() {
      this.updateBorrower(this.dataBeforeEdit);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    clearExpirationDate() {
      this.updateExpirationDate(null);
      this.isMenu = false;
    }
  },
  computed: {
    ...mapGetters({
      MilitaryServices: "getMilitaryServices",
      Borrower: "getBorrower"
    }),
    selectedDate() {
      const activeType = this.MilitaryServices.find(
        item => item.MilitaryStatusType === "ActiveDuty"
      );
      return activeType && activeType.MilitaryServiceExpectedCompletionDate
        ? activeType.MilitaryServiceExpectedCompletionDate
        : null;
    },
    isPicker() {
      const activeType = this.MilitaryServices.find(
        item => item.MilitaryStatusType === "ActiveDuty"
      );
      return !!activeType;
    }
  },
  components: {
    DateInput,
    NewSummaryControl
  },
  mounted() {
    this.isSpouse =
      this.Borrower.SpousalVABenefitsEligibilityIndicator || false;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";

.summaryItem {
  height: 100%;
  padding-left: 27px;
}
</style>
