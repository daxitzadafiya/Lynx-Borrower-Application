<template>
  <div class="mailing-info">
    <NewSummaryControl
      header="Mailing Address"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
      ref="summaryControl"
    >
      <template v-slot:displayContent>
        <v-row class="summary-content-container">
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle">Residency Type:</div>
            <div class="summaryValue">
              {{ mailingAddress.BorrowerResidencyType }}
            </div>
          </v-col>
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle">Address:</div>
            <div class="summaryValue">{{ addressText }}</div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <v-row class="form-container">
            <AddressEditor
              :mdVal="6"
              :lgVal="3"
              :addressObj="mailingAddress"
              @addressUpdated="updateAddress"
              @addressPropUpdated="updateAddressProp"
              uniqueInputId="mailing"
            ></AddressEditor>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<script>
import AddressEditor from "@/components/form/AddressEditor";
import { mapGetters, mapActions } from "vuex";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  data() {
    return {
      countries: ["United States"],
      residenceType: "Mailing",
      icon: require("@/assets/images/borrowers/current-residence-mobile.svg"),
      dataBeforeEdit: null
    };
  },
  methods: {
    ...mapActions([
      "updateResidenceProp",
      "updateResidence",
      "saveLoanPatches"
    ]),
    updateAddress(addressData) {
      this.updateResidence({
        type: this.residenceType,
        value: addressData
      });
    },
    updateAddressProp({ prop, value }) {
      this.updateResidenceProp({
        type: this.residenceType,
        value: value,
        prop: prop
      });
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = this.mailingAddress
        ? JSON.parse(JSON.stringify(this.mailingAddress))
        : null;
    },
    onCancelClicked() {
      this.updateResidence({ type: this.type, value: this.dataBeforeEdit });
      this.$emit("onStateChanged");
    },
    onSaveClicked() {
      this.saveLoanPatches();
      this.$emit("onStateChanged");
    },
    changeToEditMode() {
      this.$refs.summaryControl.edit();
    }
  },
  computed: {
    ...mapGetters({
      getSpecificResidence: "getSpecificResidence"
    }),
    mailingAddress() {
      return this.getSpecificResidence(this.residenceType);
    },
    addressText() {
      const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
      if (this.mailingAddress) {
        return keys.reduce((acc, cur) => {
          if (this.mailingAddress[cur]) {
            acc += `${this.mailingAddress[cur]}${
              cur === "PostalCode" ? " " : ", "
            }`;
          }
          return acc;
        }, "");
      }
      return this.formattedAddress;
    }
  },
  components: {
    AddressEditor,
    NewSummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
::v-deep(.v-card__text) {
  margin-left: -12px;
  margin-right: -12px;
}
</style>
