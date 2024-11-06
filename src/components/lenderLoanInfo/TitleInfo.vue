<template>
  <v-row class="flex-wrap mt-3">
    <v-col
      cols="12"
      class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom"
    >
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L2. Title Info
      </p>
    </v-col>
    <v-col cols="6" class="pa-2 loan-border-right loan-border-bottom">
      <span id="l2-1">
        Title to the Property
        <b>Will</b> be Held in What Name(s):
      </span>

      <!-- <loan-tooltip id="l2-1"></loan-tooltip> -->
      <v-text-field
        light
        dense
        class="ml-2"
        :value="titleInfo.ProposedTitleHeldBy || ''"
        @input="
          e => updateTitleInformation({ prop: 'ProposedTitleHeldBy', value: e })
        "
        placeholder="Title to the Property"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="6" class="pa-2 loan-border-bottom">
      <span id="l2-2">
        <b>For Refinance:</b> Title to the Property is <b>Currently</b> Held in
        What Name(s):
      </span>
      <!-- <loan-tooltip id="l2-2"></loan-tooltip> -->
      <v-text-field
        light
        dense
        class="ml-2"
        :value="titleInfo.CurrentTitleHeldBy || ''"
        @input="
          e => updateTitleInformation({ prop: 'CurrentTitleHeldBy', value: e })
        "
        placeholder="Currently Held Title of the Property"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="6" class="pa-2 loan-border-bottom loan-border-right">
      <span class="font-weight-bold">Estate will be held in</span>

      <div
        class="d-flex pa-0 ma-0 mx-1"
        v-for="(status, index) in propertyEstateTypes"
        :key="status.value"
      >
        <span :id="'l2-3___' + index" class="align-self-center">
          <VuetifyRadio
            class="pb-1 mx-1"
            iconGeneralClass="v-icon v-icon--dense"
            labelClass="theme--light v-label"
            :key="index"
            :label="status.text"
            :isOn="status.value === titleInfo.PropertyEstateType"
            @toggleRadio="updateRadioOption('PropertyEstateType', status.value)"
          />
        </span>
        <!-- <loan-tooltip id="l2-3" :activator="'#l2-3___'+index"></loan-tooltip> -->

        <v-menu
          light
          v-if="status.value == 'Leasehold'"
          v-model="isLeaseholdExpDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              light
              dense
              :value="leaseholdExpirationDateFormatted"
              placeholder="Leasehold Expiration Date"
              prepend-icon="date_range"
              readonly
              v-on="on"
              style="max-width:300px !important"
              hide-details
              class="ma-0 pa-0 align-self-center"
            ></v-text-field>
          </template>
          <v-date-picker
            light
            :value="titleInfo.PropertyGroundLeaseExpirationDate"
            @input="setLeaseholdDate"
          ></v-date-picker>
        </v-menu>
        <span
          class="ma-0 font-italic align-self-center"
          v-if="status.value == 'Leasehold'"
          >(mm/dd/yyyy)</span
        >
      </div>
      <span class="mt-3 font-weight-bold"
        >Manner in Which Title Will be Held</span
      >
      <div class="pa-0 ma-0 mx-1 d-flex flex-wrap">
        <v-row class="pa-0 ma-0 flex-wrap">
          <div
            :id="'l2-4___' + index"
            class="pa-0 ma-0"
            :class="{ 'col-5': index % 2 == 0, 'col-6': index % 2 == 1 }"
            v-for="(status, index) in relationshipVestingTypes"
            :key="status.value"
          >
            <VuetifyRadio
              class="pb-1 mx-1"
              iconGeneralClass="v-icon v-icon--dense"
              labelClass="theme--light v-label"
              :key="index"
              :label="status.text"
              :isOn="status.value === titleInfo.RelationshipVestingType"
              @toggleRadio="
                updateRadioOption('RelationshipVestingType', status.value)
              "
            />
            <!-- <loan-tooltip id="l2-4" :activator="'#l2-4___'+index"></loan-tooltip> -->
          </div>
        </v-row>
      </div>
    </v-col>
    <v-col cols="6" class="pa-2 loan-border-bottom d-flex flex-column">
      <span class="font-weight-bold">Trust Information</span>
      <div class="pa-0 ma-0 mx-1">
        <span
          :id="'l2-5___' + index"
          v-for="(status, index) in trustClassificationTypes"
          :key="status.value"
        >
          <VuetifyRadio
            class="pb-1 mx-1"
            iconGeneralClass="v-icon v-icon--dense"
            labelClass="theme--light v-label"
            :key="index"
            :label="status.text"
            :isOn="status.value === titleInfo.TrustClassificationType"
            @toggleRadio="
              updateRadioOption('TrustClassificationType', status.value)
            "
          />
          <!-- <loan-tooltip id="l2-5" :activator="'#l2-5___'+index"></loan-tooltip> -->
        </span>
      </div>
      <span class="mt-3 font-weight-bold">Indian Country Land Tenure</span>
      <div class="pa-0 ma-0 mx-1">
        <span
          :id="'l2-6___' + index"
          v-for="(status, index) in nativeAmericanLandsTypes"
          :key="status.value"
        >
          <VuetifyRadio
            class="pb-1 mx-1"
            iconGeneralClass="v-icon v-icon--dense"
            labelClass="theme--light v-label"
            :key="index"
            :label="status.text"
            :isOn="status.value === titleInfo.NativeAmericanLandsType"
            @toggleRadio="
              updateRadioOption('NativeAmericanLandsType', status.value)
            "
          />
          <!-- <loan-tooltip id="l2-6" :activator="'#l2-6___'+index"></loan-tooltip> -->
        </span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import VuetifyRadio from "@/components/form/VuetifyRadio";

export default {
  data() {
    return {
      isLeaseholdExpDateMenu: false,
      propertyEstateTypes: [
        {
          text: "Fee Simple",
          value: "FeeSimple"
        },
        {
          text: "Leasehold",
          value: "Leasehold"
        }
      ],
      relationshipVestingTypes: [
        {
          text: "Individual",
          value: "Individual"
        },
        {
          text: "Joint Tenants With Right Of Survivorship",
          value: "JointTenantsWithRightOfSurvivorship"
        },
        {
          text: "Life Estate",
          value: "LifeEstate"
        },
        {
          text: "Other",
          value: "Other"
        },
        {
          text: "Tenants By The Entirety",
          value: "TenantsByTheEntirety"
        },
        {
          text: "Tenants In Common",
          value: "TenantsInCommon"
        }
      ],
      trustClassificationTypes: [
        {
          text: "Land Trust",
          value: "LandTrust"
        },
        {
          text: "Living Trust",
          value: "LivingTrust"
        }
      ],
      nativeAmericanLandsTypes: [
        {
          text: "Fee Simple",
          value: "FeeSimple"
        },
        {
          text: "Individual Trust Land",
          value: "IndividualTrustLand"
        },
        {
          text: "Other",
          value: "Other"
        }
      ],
      currentIndex: 0
    };
  },
  methods: {
    ...mapActions(["setTitleInformation"]),
    updateTitleInformation({ prop, value }) {
      let titleInformation = this.TitleInformation.length
        ? this.TitleInformation.map((item, i) => {
            item[prop] = this.currentIndex === i ? value : item[prop];
            return item;
          })
        : [{ [prop]: value }];
      if (prop === "ProposedTitleHeldBy" || prop === "CurrentTitleHeldBy") {
        const type = prop.split("Title")[0];
        titleInformation = titleInformation.map((item, i) =>
          this.currentIndex !== i
            ? item
            : { ...item, PropertyOwnerStatusType: type }
        );
      }
      this.setTitleInformation(titleInformation);
    },
    updateRadioOption(prop, value) {
      const titleInformation = this.TitleInformation.length
        ? this.TitleInformation.map((item, i) => {
            if (this.currentIndex === i) {
              item[prop] = value === item[prop] ? null : value;
            }
            if (!item[prop]) {
              delete item[prop];
            }
            return item;
          })
        : [{ [prop]: value }];
      this.setTitleInformation(titleInformation);
    },
    setLeaseholdDate(date) {
      const formatted = moment(new Date(date)).format("YYYY-MM-DD");
      this.updateTitleInformation({
        prop: "PropertyGroundLeaseExpirationDate",
        value: formatted
      });
      this.isLeaseholdExpDateMenu = false;
    }
  },
  computed: {
    ...mapGetters({
      TitleInformation: "getTitleInformation"
    }),
    titleInfo() {
      return this.TitleInformation.length
        ? this.TitleInformation[this.currentIndex]
        : {};
    },
    leaseholdExpirationDateFormatted() {
      return this.titleInfo.PropertyGroundLeaseExpirationDate
        ? moment(
            new Date(this.titleInfo.PropertyGroundLeaseExpirationDate)
          ).format("DD/MM/YYYY")
        : "";
    }
  },
  components: {
    VuetifyRadio
  }
};
</script>
