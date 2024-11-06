<template lang="pug">
    v-card(width="100%" light flat style="backgroundColor: transparent;" :class="{'opacity-06': isDisabled}")
        v-card-text.text-block.text-black--text
            v-row.text-block__row
                v-col.text-block__col(sm="4" cols="12")
                    v-combobox(
                        attach=true
                        outlined 
                        dense
                        :menu-props="{light: true}"
                        :value="getEthnicity()"
                        :items="ethnicityOptions"
                        label="Ethnicity"
                        @change="setEthnicity"
                        :disabled="isDisabled"
                    )
                template(v-if="isOrigin")
                    v-col.text-block__col(sm="4" cols="12")
                        v-combobox(
                            attach=true
                            outlined 
                            dense
                            :menu-props="{light: true}"
                            :value="getEthnicOriginTypeValue()"
                            :items="ethnicGroups"
                            label="Sub Ethnic Group"
                            @change="setEthnicityOrigin"
                            :disabled="isDisabled"
                        )
                    v-col.text-block__col(sm="4" cols="12" v-if="isOtherOrigin")
                        v-text-field(
                            label="Enter Origin"
                            outlined 
                            dense
                            :value="getEthnicOtherOriginValue()"
                            @input="setEthnicityOtherOrigin"
                            :disabled="isDisabled"
                        )
            v-row.text-block__row
                v-col.text-block__col(sm="5" md="4" cols="12")
                    v-combobox(
                        attach=true
                        outlined 
                        dense
                        :menu-props="{light: true}"
                        :value="demographics.ULADHMDAGenderType || 'I do not wish to provide this information'"
                        :items="sexOptions"
                        label="Sex"
                        :disabled="isDisabled"
                        @change="setSex"
                    )
            v-row.text-block__row
                v-col.text-block__col
                    v-row.align-start.align-sm-center
                        CheckBox(:isChecked="demographics.HMDARaceRefusalIndicator" @toggle="setRaceRefusal")
                        span.ml-2 I do not wish to provide the information about Race
            template(v-if="!demographics.HMDARaceRefusalIndicator")
                v-row.text-block__row.relative(v-if="races.length" v-for="(race, index) in races" :key="index")
                    v-col.text-block__col(sm="4" cols="12")
                        v-combobox(
                            outlined 
                            dense
                            :menu-props="{light: true}"
                            :value="race.HMDARaceType ? race.HMDARaceType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''"
                            :items="getRaceItems(raceOriginsNames)"
                            label="Race"
                            @change="(item) => setRaceType(item, index)"
                            :disabled="isDisabled"
                        )
                    template(v-if="raceOptions[race.HMDARaceType]")
                        v-col.text-block__col(sm="4" cols="12")
                            v-combobox(
                                outlined 
                                dense
                                :menu-props="{light: true}"
                                :value="race.ULADHMDARaceDesignationType ? race.ULADHMDARaceDesignationType.replace(/([a-z])([A-Z])/g, '$1 $2'): ''"
                                :items="getRaceItems(raceOptions[race.HMDARaceType])"
                                label="Race Origin"
                                @change="(item) => setRaceOrigin(item, index)"
                                :disabled="isDisabled"
                            )
                        v-col.text-block__col(sm="4" cols="12")
                            v-text-field(v-if="race.ULADHMDARaceDesignationType && race.ULADHMDARaceDesignationType.substring(0,5) === 'Other'"
                                outlined 
                                dense
                                label="Enter Race"
                                :value="getOtherRaceValue(race)"
                                :disabled="isDisabled"
                                @input="(e) => setOtherRaceOrigin(e, index)"
                            )
                    .remove(v-if="races.length")
                        v-icon.remove__icon(@click="removeRace(index)") mdi-close
                v-row.text-block__row.relative(v-if="!races.length || additional")
                    v-col.text-block__col(sm="4" cols="12")
                        v-combobox(
                            attach=true
                            outlined 
                            dense
                            :menu-props="{light: true}"
                            value=""
                            :items="getRaceItems(raceOriginsNames)"
                            label="Race"
                            @change="(item) => setRaceType(item, races.length)"
                            :disabled="isDisabled"
                        )
                    .remove(v-if="races.length")
                        v-icon.remove__icon(@click="additional=null") mdi-close
                v-row.text-block__row.last-row
                    v-col.text-block__col(sm="4" cols="12")
                        v-row.add-new
                            Add(
                                customClass='small' 
                                @add="addRace"
                                )
                            span.add-new__title Add Race
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Add from "@/components/buttons/Add";
import CheckBox from "@/components/form/CheckBox";

export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ethnicityOptions: [
        "Hispanic Or Latino",
        "Not Hispanic Or Latino",
        "I do not wish to provide this information"
      ],
      ethnicGroups: ["Cuban", "Mexican", "Puerto Rican", "Other"],
      sexOptions: [
        "Male",
        "Female",
        "I do not wish to provide this information"
      ],
      country: "United States",
      race: "Native Hawaiian or Other Pacific Islander",
      raceOptions: {
        AmericanIndianOrAlaskaNative: null,
        Asian: [
          "AsianIndian",
          "Chinese",
          "Filipino",
          "Japanese",
          "Korean",
          "Vietnamese",
          "OtherAsian"
        ],
        BlackOrAfricanAmerican: null,
        NativeHawaiianOrOtherPacificIslander: [
          "GuamanianOrChamorro",
          "NativeHawaiian",
          "Samoan",
          "OtherPacificIslander"
        ],
        White: null
      },
      additional: null
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
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
    Add,
    CheckBox
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.text-block {
  margin-top: 10px;
  margin-bottom: 0;
  padding-left: 0;
  padding-right: 15px;
  @media (max-width: 450px) {
    padding-right: 0;
  }
}

.opacity-06 {
  opacity: 0.6;
}

.last-row {
  margin-bottom: 20px;
}

.remove {
  cursor: pointer;
  position: absolute;
  right: 0;
}

.add-new {
  align-items: center;
  &__title {
    font-weight: 500;
    margin-left: 10px;
  }
}

.ml-2 {
  max-width: 90%;
}
</style>
