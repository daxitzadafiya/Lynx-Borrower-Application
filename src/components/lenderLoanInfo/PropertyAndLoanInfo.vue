<template>
  <v-row class="property-and-loaninfo flex-wrap mt-3">
    <v-col
      cols="12"
      class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom"
    >
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L1. Property and Loan Information
      </p>
    </v-col>
    <v-col cols="12" class="pa-0">
      <v-row class="pa-0 ma-0">
        <v-col
          cols="6"
          class="pa-2 d-flex flex-column loan-border-right loan-border-bottom"
        >
          <span class="mb-1 font-weight-bold">Community Property State</span>
          <span id="l1-1">
            <v-checkbox
              light
              label="At least one borrower lives in a community property state."
              :input-value="
                PropertyAndLoanInformation.CommunityPropertyStateResidentIndicator
              "
              @change="
                updatePropertyAndLoanInfoBoolean(
                  'CommunityPropertyStateResidentIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>

          <!-- <loan-tooltip id="l1-1"></loan-tooltip> -->
          <span id="l1-2">
            <v-checkbox
              light
              label="The property is in a community property state."
              :input-value="
                PropertyAndLoanInformation.CommunityPropertyStateIndicator
              "
              @change="
                updatePropertyAndLoanInfoBoolean(
                  'CommunityPropertyStateIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details="true"
            ></v-checkbox>
          </span>
          <!-- <loan-tooltip id="l1-2"></loan-tooltip> -->

          <span class="mb-1 mt-3 font-weight-bold">Transaction Detail</span>
          <span id="l1-3-1">
            <v-checkbox
              light
              label="Conversion of Contract for Deed or Land Contract"
              :input-value="
                PropertyAndLoanInformation.ConversionOfContractForDeedIndicator
              "
              @change="
                updatePropertyAndLoanInfoBoolean(
                  'ConversionOfContractForDeedIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details="true"
            ></v-checkbox>
          </span>
          <!--
              <ToolTipLabel
                fr="L1-3-1"
                text="Conversion of Contract for Deed or Land Contract"
                id="l1-3-1"
          />-->
          <!-- <loan-tooltip id="l1-3-1"></loan-tooltip> -->

          <span id="l1-3-2">
            <v-checkbox
              light
              label="Renovation"
              :input-value="PropertyAndLoanInformation.RenovationLoanIndicator"
              @change="
                updatePropertyAndLoanInfoBoolean('RenovationLoanIndicator')
              "
              class="ma-0 pa-0"
              dense
              hide-details="true"
            ></v-checkbox>
          </span>
          <!-- <loan-tooltip id="l1-3-2"></loan-tooltip> -->

          <v-checkbox
            light
            label="Construction-Conversion/Construction-to-Permanent"
            :input-value="PropertyAndLoanInformation.ConstructionLoanIndicator"
            @change="
              updatePropertyAndLoanInfoBoolean('ConstructionLoanIndicator')
            "
            class="ma-0 pa-0"
            dense
            hide-details="true"
            id="l1-3-3"
          ></v-checkbox>
          <!-- <loan-tooltip id="l1-3-3"></loan-tooltip> -->
          <div class="d-flex">
            <span
              v-for="(status, index) in constructionToPermanentClosingTypes"
              :key="status.value"
              :id="'l1-3-3-1___' + index"
            >
              <VuetifyRadio
                class="mr-3 mt-1 ml-6"
                iconGeneralClass="v-icon v-icon--dense"
                labelClass="theme--light v-label"
                :key="index"
                :label="status.text"
                :isOn="
                  status.value ===
                    PropertyAndLoanInformation.ConstructionToPermanentClosingType
                "
                @toggleRadio="
                  updatePropertyAndLoanRadioOption({
                    prop: 'ConstructionToPermanentClosingType',
                    value: status.value
                  })
                "
              />
              <!-- <loan-tooltip id="l1-3-3-1" :activator="'#l1-3-3-1___'+index"></loan-tooltip> -->
            </span>
          </div>

          <div class="d-flex mr-5">
            <p class="align-self-center ma-0 mt-1" id="l1-4">
              Construction/Improvement Costs
            </p>
            <v-text-field
              light
              dense
              class="ml-4"
              :value="
                getFormattedValue(
                  PropertyAndLoanInformation.ConstructionImprovementCostsAmount
                ) || ''
              "
              @input="
                e =>
                  updatePropertyAndLoanInfo({
                    prop: 'ConstructionImprovementCostsAmount',
                    value: +e.replace(/,/g, '')
                  })
              "
              @keypress="e => isOnlyNum(e, true)"
              placeholder="Construction/Improvement Costs"
              prefix="$"
              hide-details
            ></v-text-field>
            <!-- <loan-tooltip id="l1-4"></loan-tooltip> -->
          </div>
          <div class="d-flex align-center">
            <p class="ma-0 mr-3" id="l1-5">Lot Acquired Date</p>
            <!-- <loan-tooltip id="l1-5"></loan-tooltip> -->

            <v-menu
              light
              v-model="lotAcquiredModal"
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
                  :value="lotAcquiredDateFormatted"
                  placeholder="Lot Acquired Date"
                  prepend-icon="date_range"
                  readonly
                  v-on="on"
                  style="max-width:300px !important"
                  hide-details
                  class="ma-0 pa-0"
                ></v-text-field>
              </template>
              <v-date-picker
                light
                :value="PropertyAndLoanInformation.PropertyAcquiredDate"
                @input="setPropertyAcquiredDate"
              ></v-date-picker>
            </v-menu>
            <p class="ma-0 font-italic">(mm/dd/yyyy)</p>
          </div>
          <div class="d-flex mb-2 mr-5">
            <p class="align-self-center ma-0 mt-1" id="l1-6">
              Original Cost of Lot
            </p>
            <!-- <loan-tooltip id="l1-6"></loan-tooltip> -->
            <v-text-field
              light
              dense
              class="ml-4"
              :value="
                getFormattedValue(
                  PropertyAndLoanInformation.LandOriginalCostAmount
                ) || ''
              "
              @input="
                e =>
                  updatePropertyAndLoanInfo({
                    prop: 'LandOriginalCostAmount',
                    value: +e.replace(/,/g, '')
                  })
              "
              @keypress="e => isOnlyNum(e, true)"
              placeholder="Original Cost of Lot"
              prefix="$"
              hide-details
            ></v-text-field>
          </div>
        </v-col>
        <v-col class="pa-0 d-flex flex-column loan-border-bottom">
          <v-row class="ma-0 flex-wrap">
            <v-col cols="5" class="pa-2">
              <span class="font-weight-bold">Refinance Type</span>
              <div>
                <span
                  v-for="(status, index) in refinanceCashOutDeterminationTypes"
                  :key="status.value"
                  :id="'l1-7___' + index"
                >
                  <VuetifyRadio
                    class="pb-1 mx-1"
                    iconGeneralClass="v-icon v-icon--dense"
                    labelClass="theme--light v-label"
                    :key="index"
                    :label="status.text"
                    :isOn="
                      status.value ===
                        PropertyAndLoanInformation.RefinanceCashOutDeterminationType
                    "
                    @toggleRadio="
                      updatePropertyAndLoanRadioOption({
                        prop: 'RefinanceCashOutDeterminationType',
                        value: status.value
                      })
                    "
                  />
                  <!-- <loan-tooltip id="l1-7" :activator="'#l1-7___'+index"></loan-tooltip> -->
                </span>
              </div>
            </v-col>
            <v-col cols="7" class="pa-2">
              <span class="font-weight-bold">Refinance Program</span>

              <v-radio-group
                light
                dense
                :value="PropertyAndLoanInformation.GovernmentRefinanceType"
                class="pa-0 ma-0 mx-1"
                hide-details
              >
                <div
                  class="d-flex"
                  v-for="(status, index) in governmentRefinanceTypes"
                  :key="status.value"
                >
                  <span :id="'l1-8___' + index">
                    <VuetifyRadio
                      class="pb-1 mx-1"
                      iconGeneralClass="v-icon v-icon--dense"
                      labelClass="theme--light v-label"
                      :key="index"
                      :label="status.text"
                      :isOn="
                        status.value ===
                          PropertyAndLoanInformation.GovernmentRefinanceType
                      "
                      @toggleRadio="
                        updatePropertyAndLoanRadioOption({
                          prop: 'GovernmentRefinanceType',
                          value: status.value
                        })
                      "
                    />
                  </span>
                  <!-- <loan-tooltip id="l1-8" :activator="'#l1-8___'+index"></loan-tooltip> -->

                  <v-text-field
                    light
                    dense
                    class="my-0 ml-4"
                    :value="
                      PropertyAndLoanInformation.GovernmentRefinanceTypeOtherDescription
                    "
                    @input="
                      e =>
                        updatePropertyAndLoanInfo({
                          prop: 'GovernmentRefinanceTypeOtherDescription',
                          value: e
                        })
                    "
                    placeholder="Other"
                    hide-details
                    v-if="status.value == 'Other'"
                  ></v-text-field>
                </div>
              </v-radio-group>
            </v-col>
            <v-col cols="12" class="pa-2 mt-8">
              <span class="font-weight-bold">Energy Improvement</span>
              <span id="l1-9">
                <v-checkbox
                  light
                  label="Mortgage loan will finance energy-related improvements."
                  :input-value="
                    PropertyAndLoanInformation.EnergyRelatedImprovementsIndicator
                  "
                  @change="
                    updatePropertyAndLoanInfoBoolean(
                      'EnergyRelatedImprovementsIndicator'
                    )
                  "
                  class="ma-0 pa-0"
                  dense
                  hide-details="true"
                ></v-checkbox>
              </span>
              <!-- <loan-tooltip id="l1-9"></loan-tooltip> -->

              <div class="d-flex align-start" id="l1-10">
                <v-checkbox
                  light
                  label
                  :input-value="
                    PropertyAndLoanInformation.PropertyExistingCleanEnergyLienIndicator
                  "
                  @change="
                    updatePropertyAndLoanInfoBoolean(
                      'PropertyExistingCleanEnergyLienIndicator'
                    )
                  "
                  class="ma-0 pa-0"
                  dense
                  hide-details="true"
                ></v-checkbox>

                <span class="mt-1">
                  Property is currently subject to a lien that could take
                  priority over the first mortgage lien, such as a clean energy
                  lien paid through property taxes
                  <span class="font-italic"
                    >(e.g., the Property Assessed Clean Energy program).</span
                  >
                </span>
                <!-- <loan-tooltip id="l1-10"></loan-tooltip> -->
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="pl-2 loan-border-bottom d-flex">
      <span class="font-weight-bold align-self-center">Project Type</span>
      <span id="l1-11___0">
        <v-checkbox
          light
          label="Condominium"
          :input-value="
            PropertyAndLoanInformation.ProjectLegalStructureType ===
              'Condominium'
          "
          @change="
            e =>
              updatePropertyAndLoanInfo({
                prop: 'ProjectLegalStructureType',
                value: e ? 'Condominium' : null
              })
          "
          class="ma-0 pa-0 ml-8"
          dense
          hide-details
        ></v-checkbox>
      </span>
      <!-- <loan-tooltip id="l1-11" activator="#l1-11___0"></loan-tooltip> -->
      <span id="l1-11___1">
        <v-checkbox
          light
          label="Cooperative"
          :input-value="
            PropertyAndLoanInformation.ProjectLegalStructureType ===
              'Cooperative'
          "
          @change="
            e =>
              updatePropertyAndLoanInfo({
                prop: 'ProjectLegalStructureType',
                value: e ? 'Cooperative' : null
              })
          "
          class="ma-0 pa-0 ml-8"
          dense
          hide-details
        ></v-checkbox>
      </span>
      <!-- <loan-tooltip id="l1-11" activator="#l1-11___1"></loan-tooltip> -->
      <span id="l1-12">
        <v-checkbox
          light
          label="Planned Unit Development (PUD)"
          :input-value="PropertyAndLoanInformation.PUDIndicator"
          @change="updatePropertyAndLoanInfoBoolean('PUDIndicator')"
          class="ma-0 pa-0 ml-8"
          dense
          hide-details
        ></v-checkbox>
      </span>
      <!-- <loan-tooltip id="l1-12"></loan-tooltip> -->
      <span id="l1-13">
        <v-checkbox
          light
          label="Property is not located in a project"
          :input-value="PropertyAndLoanInformation.PropertyInProjectIndicator"
          @change="
            updatePropertyAndLoanInfoBoolean('PropertyInProjectIndicator')
          "
          class="ma-0 pa-0 ml-8"
          dense
          hide-details
        ></v-checkbox>
      </span>
      <!-- <loan-tooltip id="l1-13"></loan-tooltip> -->
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VuetifyRadio from "@/components/form/VuetifyRadio";
import moment from "moment";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      lotAcquiredModal: false,
      constructionToPermanentClosingTypes: [
        {
          text: "One Closing",
          value: "OneClosing"
        },
        {
          text: "Two Closing",
          value: "TwoClosing"
        }
      ],
      refinanceCashOutDeterminationTypes: [
        {
          text: "Cash Out",
          value: "CashOut"
        },
        {
          text: "Limited Cash Out",
          value: "LimitedCashOut"
        },
        {
          text: "No Cash Out",
          value: "NoCashOut"
        }
      ],
      governmentRefinanceTypes: [
        {
          text: "Full Documentation",
          value: "FullDocumentation"
        },
        {
          text: "Interest Rate Reduction Refinance Loan",
          value: "InterestRateReductionRefinanceLoan"
        },
        {
          text: "Other",
          value: "Other"
        },
        {
          text: "Prior FHA",
          value: "PriorFHA"
        },
        {
          text: "Streamline With Appraisal",
          value: "StreamlineWithAppraisal"
        },
        {
          text: "Streamline Without Appraisal",
          value: "StreamlineWithoutAppraisal"
        }
      ]
    };
  },
  methods: {
    ...mapActions([
      "updatePropertyAndLoanInfoBoolean",
      "updatePropertyAndLoanInfo",
      "updatePropertyAndLoanRadioOption"
    ]),
    setPropertyAcquiredDate(date) {
      const formatted = moment(new Date(date)).format("YYYY-MM-DD");
      this.updatePropertyAndLoanInfo({
        prop: "PropertyAcquiredDate",
        value: formatted
      });
      this.lotAcquiredModal = false;
    }
  },
  computed: {
    ...mapGetters({
      PropertyAndLoanInformation: "getPropertyAndLoanInformation"
    }),
    lotAcquiredDateFormatted() {
      return this.PropertyAndLoanInformation.PropertyAcquiredDate
        ? moment(
            new Date(this.PropertyAndLoanInformation.PropertyAcquiredDate)
          ).format("DD/MM/YYYY")
        : "";
    }
  },
  components: {
    VuetifyRadio
  }
};
</script>
