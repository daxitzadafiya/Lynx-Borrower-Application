<template>
  <SummaryControl header="Demographic Information (ethnicity, sex, and race)" @edit="onEditClicked"
    @cancel="onCancelClicked" @save="onSaveClicked">
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue infoText">The purpose of collecting this information is to help ensure that all
            applicants are treated fairly and that the housing needs of communities and neighborhoods are being fulfilled.
            For residential mortgage lending, federal law requires that we ask applicants for their demographic
            information (ethnicity, sex, and race) in order to monitor our compliance with equal credit opportunity, fair
            housing, and home mortgage disclosure laws. You are not required to provide this information, but are
            encouraged to do so.
            <br />
            <br />
            The law provides that we may not discriminate on the basis of this information or on whether you choose to
            provide it. However, if you choose not to provide the information and you have made this application in
            person, federal regulations require us to note your ethnicity, sex, and race on the basis of visual
            observation or surname. The law also provides that we may not discriminate on the basis of age or marital
            status information you provide in this application. Instructions: You may select one or more "Hispanic or
            Latino" origins and one or more designations for "Race."
            <br />
            <br />
          </div>
        </v-col>
        <v-col sm="6" cols="12" class="summaryItem">
          <div class="summaryTitle">Ethnicity:</div>
          <div class="summaryValue">{{ getEthnicity() }}</div>
        </v-col>
        <v-col sm="6" cols="12" class="summaryItem">
          <div class="summaryTitle">Sex:</div>
          <div class="summaryValue">{{ demographics.ULADHMDAGenderType || 'I do not wish to provide this information' }}</div>
        </v-col>
        <template v-for="(race, index) in races">
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Race:</div>
            <div class="summaryValue">race.HMDARaceType ? race.HMDARaceType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''</div>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem" v-if="raceOptions[race.HMDARaceType]">
            <div class="summaryTitle">Race Origin:</div>
            <div class="summaryValue">race.ULADHMDARaceDesignationType ? race.ULADHMDARaceDesignationType.replace(/([a-z])([A-Z])/g, '$1 $2'): ''</div>
          </v-col>
      </template>
      </v-row>
    </template>
    <template v-slot:editContent>
      <form fast-fail class="form-outer-container">
        <v-row class="form-container">
          <v-col sm="12" cols="12" class="itemContainer">
            <div class="summaryValue infoText">The purpose of collecting this information is to help ensure that all
              applicants are treated fairly and that the housing needs of communities and neighborhoods are being fulfilled.
              For residential mortgage lending, federal law requires that we ask applicants for their demographic
              information (ethnicity, sex, and race) in order to monitor our compliance with equal credit opportunity, fair
              housing, and home mortgage disclosure laws. You are not required to provide this information, but are
              encouraged to do so.
              <br />
              <br />
              The law provides that we may not discriminate on the basis of this information or on whether you choose to
              provide it. However, if you choose not to provide the information and you have made this application in
              person, federal regulations require us to note your ethnicity, sex, and race on the basis of visual
              observation or surname. The law also provides that we may not discriminate on the basis of age or marital
              status information you provide in this application. Instructions: You may select one or more "Hispanic or
              Latino" origins and one or more designations for "Race."
              <br />
              <br />
              If you do not wish to provide some or all of this information. select the applicable check box.
            </div>
          </v-col>
          <v-col sm="12" cols="12" class="itemContainer">
            <v-checkbox
              v-model="isProvide"
              class="defaultCheckbox mt-0"
            label="I do not wish to provide this information"
            hide-details
          ></v-checkbox>
          </v-col>
          <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" :value="getEthnicity()" :items="ethnicityOptions" inputTitle="Ethnicity" @change="setEthnicity" :disabled="isProvide"></Input>
          <template v-if="isOrigin">
            <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" :value="getEthnicOriginTypeValue()" :items="ethnicGroups" inputTitle="Sub Ethnic Group" @change="setEthnicityOrigin" :disabled="isProvide"></Input>
            <Input attach="attach" :value="getEthnicOtherOriginValue()" :items="ethnicGroups" inputTitle="Enter Origin" @input="setEthnicityOtherOrigin" :disabled="isProvide"></Input>
          </template>
          <v-col sm="12" cols="12"/>
          <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" :value="demographics.ULADHMDAGenderType || 'I do not wish to provide this information'" :items="sexOptions" inputTitle="Sex" @change="setSex" :disabled="isProvide"></Input>
          <v-col sm="12" cols="12" class="itemContainer">
            <v-checkbox
            :value="demographics.HMDARaceRefusalIndicator" @change="setRaceRefusal"
              class="defaultCheckbox mt-0"
            label="I do not wish to provide the information about Race"
            hide-details
          ></v-checkbox>
          </v-col>
        </v-row>
        <v-row class="form-container deleteAbleItem" v-if="!demographics.HMDARaceRefusalIndicator && races.length" v-for="(race, index) in races" :key="index">
          <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
            <v-btn dense="dense" icon="icon" @click="remove(index)">
              <v-icon small="small">mdi-close</v-icon>
            </v-btn>
          </v-col>
          <Input defaultComponent="v-combobox" :menu-props="{light: true}" :value="race.HMDARaceType ? race.HMDARaceType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''" :items="getRaceItems(raceOriginsNames)" inputTitle="Race" @change="(item) => setRaceType(item, index)" :disabled="isProvide"></Input>
          <template v-if="raceOptions[race.HMDARaceType]">
            <Input defaultComponent="v-combobox" :menu-props="{light: true}" :value="race.ULADHMDARaceDesignationType ? race.ULADHMDARaceDesignationType.replace(/([a-z])([A-Z])/g, '$1 $2'): ''" :items="getRaceItems(raceOptions[race.HMDARaceType])" inputTitle="Race Origin" @change="(item) => setRaceOrigin(item, index)" :disabled="isProvide"></input>
            <Input v-if="race.ULADHMDARaceDesignationType && race.ULADHMDARaceDesignationType.substring(0,5) === 'Other'" inputTitle="Enter Race" :value="getOtherRaceValue(race)" :disabled="isProvide" @input="(e) => setOtherRaceOrigin(e, index)"></Input>
          </template>
        </v-row>
        <v-row class="form-container deleteAbleItem" v-if="!races.length || additional">
          <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
            <v-btn dense="dense" icon="icon" @click="additional=null">
              <v-icon small="small">mdi-close</v-icon>
            </v-btn>
          </v-col>
          <Input defaultComponent="v-combobox" attach="attach" :menu-props="{light: true}" value="" :items="getRaceItems(raceOriginsNames)" inputTitle="Race" @change="(item) => setRaceType(item, races.length)" :disabled="isProvide"></Input>
        </v-row>
        <v-row class="form-container addItemBtnContainer">
          <v-col class="itemContainer" cols="12" sm="8">
            <v-btn class="addItemBtn" dense="dense" plain="plain" elevation="0" @click="addRace">
              <v-icon small="small">mdi-plus</v-icon><span class="addBtnText">Add Race</span>
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </template>
  </SummaryControl>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SummaryControl from "@/components/controls/SummaryControl";
import { ethnicityOptionConstants, ethnicGroupConstants, sexOptionConstants, raceOptionConstants } from "@/models/constants.js"

export default {
  mixins: [],
  data() {
    return {
      dataBeforeEdit: null,
      isProvide: true,
      ethnicityOptions: ethnicityOptionConstants,
      ethnicGroups: ethnicGroupConstants,
      sexOptions: sexOptionConstants,
      additional: null,
      raceOptions: raceOptionConstants,
    };
  },
  methods: {
    ...mapActions(["updateBorrower", "saveLoanPatches"]),
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.demographics));
    },
    onCancelClicked() {
      this.updateBorrower({ prop: "Demographics", value: this.dataBeforeEdit });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    },
    setEthnicity(option) {
      const clearedVal = option ? option.replace(/ /g, "") : "";
      let Demographics = { ...this.demographics };
      if (option === "I do not wish to provide this information") {
        Demographics.HMDAEthnicityRefusalIndicator = true;
        delete Demographics.Ethnicities;
      } else {
        let Ethnicities = [
          { ...this.ethnicities[0], ULADHMDAEthnicityType: clearedVal }
        ];
        const EthnicitiyOrigins = [
          {
            ...this.ethnicityOrigins[0],
            HMDAEthnicityOriginType: "",
            HMDAEthnicityOriginTypeOtherDescription: ""
          }
        ];
        Demographics = {
          ...this.demographics,
          HMDAEthnicityRefusalIndicator: false,
          Ethnicities,
          EthnicitiyOrigins
        };
      }
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    },
    setEthnicityOrigin(option) {
      const clearedVal = option ? option.replace(/ /g, "") : "";
      let EthnicitiyOrigins = [
        { ...this.ethnicityOrigins[0], HMDAEthnicityOriginType: clearedVal }
      ];
      if (option !== "Other") {
        delete EthnicitiyOrigins[0].HMDAEthnicityOriginTypeOtherDescription;
      }
      const Demographics = { ...this.demographics, EthnicitiyOrigins };
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    },
    setEthnicityOtherOrigin(value) {
      const EthnicitiyOrigins = [
        {
          ...this.ethnicityOrigins[0],
          HMDAEthnicityOriginTypeOtherDescription: value
        }
      ];
      const Demographics = { ...this.demographics, EthnicitiyOrigins };
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    },
    setSex(option) {
      let Demographics = { ...this.demographics };
      if (option === "I do not wish to provide this information") {
        Demographics.HMDAGenderRefusalIndicator = true;
        delete Demographics.ULADHMDAGenderType;
      } else {
        Demographics.ULADHMDAGenderType = option;
        Demographics.HMDAGenderRefusalIndicator = false;
      }
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    },
    setRaceRefusal({ value }) {
      let Demographics = {
        ...this.demographics,
        HMDARaceRefusalIndicator: value
      };
      delete Demographics.Races;
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    },
    setRaceType(raceType, index) {
      const clearedVal = raceType ? raceType.replace(/ /g, "") : "";
      let Races = this.races.length ? [...this.races] : [{ HMDARaceType: "" }];
      Races[index] = { HMDARaceType: clearedVal };
      let Demographics = {
        ...this.demographics,
        HMDARaceRefusalIndicator: false,
        Races
      };
      this.additional = null;
      this.updateBorrower({ prop: "Demographics", value: Demographics });

    },
    setRaceOrigin(origin, index) {
      const clearedVal = origin ? origin.replace(/ /g, "") : "";
      let Races = [...this.races];
      Races[index].ULADHMDARaceDesignationType = clearedVal;
      let Demographics = {
        ...this.demographics,
        HMDARaceRefusalIndicator: false,
        Races
      };
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    },
    setOtherRaceOrigin(val, index) {
      let Races = [...this.races];
      const prop =
        Races[index].ULADHMDARaceDesignationType === "OtherAsian"
          ? "ULADHMDARaceDesignationOtherAsianDescription"
          : "ULADHMDARaceDesignationOtherPacificIslanderDescription";
      Races[index][prop] = val;
      let Demographics = { ...this.demographics, Races };
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    },
    getEthnicity() {
      if (this.demographics.HMDAEthnicityRefusalIndicator) {
        return "I do not wish to provide this information";
      }
      return !this.ethnicities[0]
        ? ""
        : this.ethnicities[0].ULADHMDAEthnicityType
        ? this.ethnicities[0].ULADHMDAEthnicityType.replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
          )
        : "";
    },
    getEthnicOriginTypeValue() {
      return !this.ethnicityOrigins[0]
        ? ""
        : this.ethnicityOrigins[0].HMDAEthnicityOriginType
        ? this.ethnicityOrigins[0].HMDAEthnicityOriginType.replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
          )
        : "";
    },
    getEthnicOtherOriginValue() {
      return !this.ethnicityOrigins[0]
        ? ""
        : this.ethnicityOrigins[0].HMDAEthnicityOriginTypeOtherDescription
        ? this.ethnicityOrigins[0].HMDAEthnicityOriginTypeOtherDescription.replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
          )
        : "";
    },
    getRaceItems(arr) {
      const races = this.races
        .filter(item => item && item.HMDARaceType)
        .map(item => item.HMDARaceType);
      const filtered = arr.length
        ? arr.filter(item => races.indexOf(item) === -1)
        : [];
      return filtered.length
        ? filtered.map(item => item.replace(/([a-z])([A-Z])/g, "$1 $2"))
        : [];
    },
    getOtherRaceValue(race) {
      if (!race.ULADHMDARaceDesignationType) return "";
      if (race.ULADHMDARaceDesignationType === "OtherAsian") {
        return race.ULADHMDARaceDesignationOtherAsianDescription || "";
      }
      return race.ULADHMDARaceDesignationOtherPacificIslanderDescription || "";
    },
    addRace() {
      this.additional = { HMDARaceType: "" };
    },
    removeRace(index) {
      const Races = this.races.filter((item, i) => i !== index);
      let Demographics = { ...this.demographics, Races };
      this.additional = null;
      this.updateBorrower({ prop: "Demographics", value: Demographics });
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower"
    }),
    demographics() {
      return this.Borrower && this.Borrower.Demographics
        ? this.Borrower.Demographics
        : {};
    },
    ethnicities() {
      return this.demographics.Ethnicities || [];
    },
    ethnicityOrigins() {
      return this.demographics.EthnicitiyOrigins || [];
    },
    races() {
      return this.demographics.Races || [];
    },
    isOrigin() {
      if (this.demographics.HMDAEthnicityRefusalIndicator) {
        return false;
      }
      return (
        this.ethnicities[0] &&
        this.ethnicities[0].ULADHMDAEthnicityType !== "NotHispanicOrLatino"
      );
    },
    isOtherOrigin() {
      return (
        this.ethnicityOrigins[0] &&
        this.ethnicityOrigins[0].HMDAEthnicityOriginType === "Other"
      );
    },
    raceOriginsNames() {
      return Object.keys(this.raceOptions);
    }
  },
  components: {
    SummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.infoText {
  color: $gray3 !important;
}

.summary-content-container{
  padding-left: 0px;
}
</style>
