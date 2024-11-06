<template>
  <NewSummaryControl
    header="Personal Information"
    :icon="icon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
    :submitDisabled="isSubmitDisabled"
  >
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">First name:</div>
          <div class="summaryValue">
            {{ currentBorrower.FirstName }}
          </div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="currentBorrower.SuffixName"
        >
          <div class="summaryTitle">Suffix name:</div>
          <div class="summaryValue">
            {{ currentBorrower.LastName }}
          </div>
        </v-col>
        <v-col sm="6" md="4" cols="12" class="summaryItem">
          <div class="summaryTitle">Last name:</div>
          <div class="summaryValue">
            {{ currentBorrower.LastName }}
          </div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="currentBorrower.BorrowerBirthDate"
        >
          <div class="summaryTitle">Date of Birth:</div>
          <div class="summaryValue">{{ formattedBorrowerBirthDate }}</div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="currentBorrower.MobilePhoneNumber"
        >
          <div class="summaryTitle">Cell Phone:</div>
          <div class="summaryValue">{{ formattedMobilePhone }}</div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="currentBorrower.HomePhoneNumber"
        >
          <div class="summaryTitle">Home Phone:</div>
          <div class="summaryValue">{{ formattedHomePhone }}</div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="currentBorrower.Email"
        >
          <div class="summaryTitle">Email:</div>
          <div class="summaryValue">{{ currentBorrower.Email }}</div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="currentBorrower.MaritalStatusType"
        >
          <div class="summaryTitle">Marital Status:</div>
          <div class="summaryValue">
            {{ currentBorrower.MaritalStatusType }}
          </div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="residencyStatusText"
        >
          <div class="summaryTitle">Residency Status:</div>
          <div class="summaryValue">{{ residencyStatusText }}</div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="
            currentBorrower.CitizenshipResidencyType ===
              'NonPermanentResidentAlien' && visaType
          "
        >
          <div class="summaryTitle">Visa Type:</div>
          <div class="summaryValue">{{ visaType }}</div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="
            currentBorrower.CitizenshipResidencyType ===
              'NonPermanentResidentAlien' && visaExpirationDate
          "
        >
          <div class="summaryTitle">Visa Expiration Date:</div>
          <div class="summaryValue">{{ visaExpirationDate }}</div>
        </v-col>
        <v-col
          sm="6"
          md="4"
          cols="12"
          class="summaryItem"
          v-if="currentBorrower.Dependents && currentBorrower.Dependents.Count"
        >
          <div class="summaryTitle">Dependents:</div>
          <div class="summaryValue">
            {{ currentBorrower.Dependents.Count }}
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <v-form fast-fail>
        <v-row class="form-container">
          <Input
            :mdVal="6"
            :lgVal="3"
            hide-details
            :isRequired="true"
            inputTitle="First Name"
            :value="currentBorrower.FirstName"
            @input="
              e => $emit('updateBorrower', { prop: 'FirstName', value: e })
            "
          />
          <Input
            :mdVal="6"
            :isRequired="true"
            :lgVal="3"
            inputTitle="Last Name"
            :value="currentBorrower.LastName"
            @input="
              e => $emit('updateBorrower', { prop: 'LastName', value: e })
            "
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            inputTitle="Middle Name"
            :value="currentBorrower.MiddleName"
            @input="
              e => $emit('updateBorrower', { prop: 'MiddleName', value: e })
            "
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            inputTitle="Suffix"
            :value="currentBorrower.SuffixName"
            @input="
              e => $emit('updateBorrower', { prop: 'SuffixName', value: e })
            "
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            inputTitle="Email"
            :isRequired="true"
            :value="currentBorrower.Email"
            @input="e => $emit('updateBorrower', { prop: 'Email', value: e })"
            :rules="[
              v => !!v || 'Email is required',
              v => emailRegex.test(v) || 'Email must be valid'
            ]"
          />
          <DateInput
            :mdVal="6"
            :lgVal="3"
            inputTitle="Date of Birth"
            :isRequired="true"
            @dateUpdated="updateBorrowerDate"
            @dateCleared="clearBirthDate"
            :value="currentBorrower.BorrowerBirthDate"
            :maxDate="maxDate"
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            inputTitle="Cell Phone"
            inputmode="tel"
            pattern="[0-9]*"
            :value="formattedMobilePhone"
            hint="Example (999)999-9999"
            @input="
              e =>
                $emit('updateBorrower', { prop: 'MobilePhoneNumber', value: e })
            "
            @keypress="e => validatePhone(e)"
            :isRequired="true"
            :rules="[
              v => !!v || 'Cell Phone is required',
              v => v.length !== 10 || 'A valid Cell Phone Number is required'
            ]"
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            inputTitle="Home Phone"
            inputmode="tel"
            pattern="[0-9]*"
            :value="formattedHomePhone"
            hint="Example (999)999-9999"
            @input="
              e =>
                $emit('updateBorrower', { prop: 'HomePhoneNumber', value: e })
            "
            @keypress="e => validatePhone(e)"
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            inputTitle="Work Phone"
            inputmode="tel"
            pattern="[0-9]*"
            :value="formattedWorkPhone"
            hint="Example (999)999-9999"
            @input="
              e =>
                $emit('updateBorrower', { prop: 'WorkPhoneNumber', value: e })
            "
            @keypress="e => validatePhone(e)"
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            :attach="true"
            defaultComponent="v-combobox"
            :menu-props="{ light: true }"
            :value="currentBorrower.MaritalStatusType"
            :items="maritalStatuses"
            @change="
              e =>
                $emit('updateBorrower', { prop: 'MaritalStatusType', value: e })
            "
            :isRequired="true"
            inputTitle="Marital Status"
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            defaultComponent="v-combobox"
            :attach="true"
            :menu-props="{ light: true }"
            :value="
              currentBorrower.CitizenshipResidencyType
                ? currentBorrower.CitizenshipResidencyType.replace(
                    /([a-z])([A-Z])/g,
                    '$1 $2'
                  )
                : ''
            "
            :items="residencyStatuses"
            @change="updateBorrowerResidencyType"
            inputTitle="Residency Status"
            :isRequired="true"
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            defaultComponent="v-combobox"
            :attach="true"
            :menu-props="{ light: true }"
            :value="currentBorrower.VisaType ? currentBorrower.VisaType : ''"
            :items="visaTypes"
            @change="
              e => $emit('updateBorrower', { prop: 'VisaType', value: e.value })
            "
            inputTitle="Visa Type"
            :isRequired="true"
            v-if="
              currentBorrower.CitizenshipResidencyType ===
                'NonPermanentResidentAlien'
            "
          />
          <DateInput
            :mdVal="6"
            :lgVal="3"
            inputTitle="Visa Expiration Date"
            :isRequired="true"
            @dateUpdated="updateVisaDate"
            @dateCleared="clearVisaDate"
            :value="currentBorrower.VisaExpirationDate"
            :maxDate="maxDate"
            v-if="
              currentBorrower.CitizenshipResidencyType ===
                'NonPermanentResidentAlien'
            "
          />
          <Input
            :mdVal="6"
            :lgVal="3"
            inputTitle="Dependents"
            inputmode="numeric"
            pattern="[0-9]*"
            :value="Dependents.Count || ''"
            @input="e => updateCount(e)"
            @keypress="e => isOnlyNum(e)"
            hint="Max - 9"
            maxLength="1"
          />
          <v-col class="itemContainer" v-if="agesCount">
            <div class="titleText">Dependents Ages</div>
            <v-row class="form-container">
              <Input
                v-for="(age, i) in agesCount"
                :smVal="2"
                cols="12"
                :key="i"
                :value="Dependents.Ages ? Dependents.Ages[i] : ''"
                inputmode="numeric"
                pattern="[0-9]*"
                @input="e => updateAges(e, i)"
                @keypress="e => isOnlyNum(e)"
                @keyup="e => tabToNext(e)"
                maxLength="2"
                :tabindex="i + 1"
                :autofocus="i === 0"
              />
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </NewSummaryControl>
</template>

<script>
import DateInput from "@/components/form/DateInput";
import onlyNum from "@/mixins/onlyNum.js";
import getFormattedPhone from "@/mixins/phoneFormat.js";
import dependents from "@/mixins/dependents.js";
import { mapGetters, mapActions } from "vuex";
import NewSummaryControl from "@/components/controls/NewSummaryControl";
import moment from "moment";

export default {
  mixins: [onlyNum, dependents, getFormattedPhone],
  props: {
    currentBorrower: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isMenu: false,
      maxDate: null,
      maritalStatuses: ["Married", "Unmarried", "Separated"],
      residencyStatuses: [
        "Non Permanent Resident Alien",
        "Permanent Resident Alien",
        "U S Citizen"
      ],
      residencyStatus: "",
      icon: require("@/assets/images/borrowers/person.svg"),
      emailRegex: /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/,
      visaTypes: [
        {
          text: "E-1",
          value: "E-1"
        },
        {
          text: "E-2",
          value: "E-2"
        },
        {
          text: "E-3",
          value: "E-3"
        },
        {
          text: "G-1",
          value: "G-1"
        },
        {
          text: "G-2",
          value: "G-2"
        },
        {
          text: "G-3",
          value: "G-3"
        },
        {
          text: "G-4",
          value: "G-4"
        },
        {
          text: "G-5",
          value: "G-5"
        },
        {
          text: "H-1",
          value: "H-1"
        },
        {
          text: "H-1B",
          value: "H-1B"
        },
        {
          text: "L1",
          value: "L1"
        },
        {
          text: "TC",
          value: "TC"
        },
        {
          text: "TN-1",
          value: "TN-1"
        },
        {
          text: "Other",
          value: "Other"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["updateDependents", "saveLoanPatches", "updateBorrower"]),
    validatePhone(e) {
      if (e.target.value.length === 14) {
        e.preventDefault();
        return false;
      }
      return this.isOnlyNum(e);
    },
    updateBorrowerDate(date) {
      this.$emit("updateBorrower", {
        prop: "BorrowerBirthDate",
        value: date != null ? moment(date).format("YYYY-MM-DD") : null
      });
    },
    clearBirthDate() {
      this.updateBorrowerDate(null);
      this.isMenu = false;
    },
    updateVisaDate(date) {
      this.$emit("updateBorrower", {
        prop: "VisaExpirationDate",
        value: date != null ? moment(date).format("YYYY-MM-DD") : null
      });
    },
    clearVisaDate() {
      this.updateVisaDate(null);
      this.isMenu = false;
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = [
        { prop: "FirstName", value: this.currentBorrower.FirstName },
        { prop: "LastName", value: this.currentBorrower.LastName },
        { prop: "MiddleName", value: this.currentBorrower.MiddleName },
        { prop: "SuffixName", value: this.currentBorrower.SuffixName },
        {
          prop: "MobilePhoneNumber",
          value: this.currentBorrower.MobilePhoneNumber
        },
        {
          prop: "HomePhoneNumber",
          value: this.currentBorrower.HomePhoneNumber
        },
        {
          prop: "WorkPhoneNumber",
          value: this.currentBorrower.WorkPhoneNumber
        },
        {
          prop: "MaritalStatusType",
          value: this.currentBorrower.MaritalStatusType
        },
        {
          prop: "CitizenshipResidencyType",
          value: this.currentBorrower.CitizenshipResidencyType
        },
        {
          prop: "Dependents",
          value: this.currentBorrower.Dependents
            ? JSON.parse(JSON.stringify(this.currentBorrower.Dependents))
            : null
        }
      ];
    },
    onCancelClicked() {
      this.updateBorrower(this.dataBeforeEdit);
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    updateBorrowerResidencyType(e) {
      if (e === "U S Citizen" || e === "Permanent Resident Alien") {
        this.$emit("updateBorrower", {
          prop: "VisaType",
          value: ""
        });
        this.$emit("updateBorrower", {
          prop: "VisaExpirationDate",
          value: ""
        });
      }
      this.$emit("updateBorrower", {
        prop: "CitizenshipResidencyType",
        value: e ? e.replace(/ /g, "") : ""
      });
    }
  },
  computed: {
    ...mapGetters({
      Dependents: "getDependents"
    }),
    isDisabled() {
      if (!this.Dependents.Count) return false;
      return (
        !this.Dependents.Ages ||
        this.Dependents.Ages.length !== this.Dependents.Count
      );
    },
    validFirstName() {
      return this.currentBorrower.FirstName.length != 0;
    },
    validLastName() {
      return this.currentBorrower.LastName.length != 0;
    },
    validCellPhone() {
      return this.currentBorrower.MobilePhoneNumber.toString().length == 10;
    },
    validEmail() {
      return this.emailRegex.test(this.currentBorrower.Email);
    },
    isSubmitDisabled() {
      return (
        !this.validFirstName ||
        !this.validLastName ||
        !this.validCellPhone ||
        !this.validEmail ||
        this.adultDateValidation
      );
    },
    agesCount() {
      return this.Dependents.Count || 0;
    },
    formattedMobilePhone() {
      if (this.currentBorrower.MobilePhoneNumber) {
        return this.getFormattedPhone(this.currentBorrower.MobilePhoneNumber);
      }
      return "";
    },
    formattedHomePhone() {
      if (this.currentBorrower.HomePhoneNumber) {
        return this.getFormattedPhone(this.currentBorrower.HomePhoneNumber);
      }
      return "";
    },
    formattedWorkPhone() {
      if (this.currentBorrower.WorkPhoneNumber) {
        return this.getFormattedPhone(this.currentBorrower.WorkPhoneNumber);
      }
      return "";
    },
    formattedBorrowerBirthDate() {
      if (this.currentBorrower.BorrowerBirthDate) {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric"
        };

        return new Date(
          this.currentBorrower.BorrowerBirthDate
        ).toLocaleDateString("en-US", options);
      }
      return "";
    },
    residencyStatusText() {
      if (this.currentBorrower.CitizenshipResidencyType) {
        for (var i = 0; i < this.residencyStatuses.length; i++) {
          if (
            this.currentBorrower.CitizenshipResidencyType ===
            this.residencyStatuses[i].replace(/ /g, "")
          ) {
            return this.residencyStatuses[i];
          }
        }
      }
      return null;
    },
    selectedDate() {
      return this.currentBorrower && this.currentBorrower.BorrowerBirthDate
        ? moment(this.currentBorrower.BorrowerBirthDate).format("MMMM DD, YYYY")
        : "";
    },
    date() {
      return this.selectedDate
        ? moment(new Date(this.selectedDate)).format("YYYY-MM-DD")
        : this.maxDate;
    },
    adultDateValidation() {
      if (this.selectedDate == null) return false;
      const selected = new Date(this.selectedDate);
      return (
        new Date(
          selected.getFullYear() + 18,
          selected.getMonth(),
          selected.getDate() + 1
        ) > new Date()
      );
    },
    visaType() {
      if (this.currentBorrower.VisaType) {
        return this.currentBorrower.VisaType;
      }
      return "";
    },
    visaExpirationDate() {
      return this.currentBorrower.VisaExpirationDate
        ? moment(this.currentBorrower.VisaExpirationDate).format(
            "MMMM DD, YYYY"
          )
        : "";
    }
  },
  components: {
    NewSummaryControl,
    DateInput
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";

.ages-col {
  padding-top: 0;
  @media (max-width: 450px) {
    padding-right: 5px;
  }
  .v-text-field {
    padding-top: 0;
  }
}
.calendar {
  margin-left: 0px;
}
</style>
