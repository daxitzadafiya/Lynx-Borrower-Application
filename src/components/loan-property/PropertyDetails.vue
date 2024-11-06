<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Property details for {{ address }}</div>
    </div>
    <div class="inner-content-container">
      <div class="desktop-content-wrapper pr-3">
        <div class="property-details__wrapper">
          <v-row class="form-container ml-0">
            <v-col
              class="box--right text-block__col no-padding-col py-0 px-0"
              :sm="$vuetify.breakpoint.smAndDown ? '12' : '12'"
              cols="12"
            >
              <div class="details-grid">
                <v-col class="details-card">
                  <v-icon class="icon-color-main">home</v-icon>
                  <div class="details-card-info">
                    <span>
                      Property Price
                    </span>
                    {{ PropertyPrice }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <v-icon class="icon-color-main">king_bed</v-icon>
                  <div class="details-card-info">
                    <span>Rooms</span>
                    {{ RoomsAmount }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <v-icon class="icon-color-main">bathtub</v-icon>
                  <div class="details-card-info">
                    <span>
                      Bathrooms
                    </span>
                    {{ BathroomsAmount }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <inline-svg
                    class="icon-color-main"
                    :src="require('@/assets/images/sq-ft-rulers.svg')"
                  />
                  <div class="details-card-info">
                    <span class="text-block__row-subtitle">
                      Sq.ft
                    </span>
                    {{ SqFt }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <inline-svg
                    class="icon-color-main"
                    :src="require('@/assets/images/sq-ft-lot.svg')"
                  />
                  <div class="details-card-info">
                    <span>
                      Sq.ft lot
                    </span>
                    {{ SqFtLot }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <inline-svg
                    class="icon-color-main"
                    :src="require('@/assets/images/receipt-tax.svg')"
                  />
                  <div class="details-card-info">
                    <span>
                      Taxes
                      {{ TaxYear }}
                    </span>
                    {{ TaxAmount }}
                  </div>
                </v-col>
              </div>
              <div :class="['legal-description', { active: legalDescription }]">
                <div class="legal-description-title">
                  Legal Description
                </div>
                <div
                  class="legal-description-content"
                  @click="legalDescription = !legalDescription"
                  v-if="
                    Property.PropertyDetail &&
                      Property.PropertyDetail.LegalDescription
                  "
                >
                  <p>
                    {{ Property.PropertyDetail.LegalDescription }}
                  </p>
                  <v-icon small>
                    {{ legalDescription ? "mdi-minus" : "mdi-plus" }}
                  </v-icon>
                </div>
              </div>
            </v-col>
            <v-col
              class="mobile-map-wrapper mb-5 pl-0 pt-0"
              cols="12"
              style="position: relative;"
            >
              <GmapMap
                style="height:100%;width:100%;"
                v-if="coord != null"
                :options="mapOptions"
                :center="{ lat: +coord.latitude, lng: +coord.longitude }"
                :zoom="mapZoomLevel"
              >
                <GmapMarker
                  :position="{ lat: +coord.latitude, lng: +coord.longitude }"
                ></GmapMarker>
              </GmapMap>
              <v-btn :href="fullViewHref" target="_blank" class="popout-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                  <path
                    fill="#666"
                    d="M0 0v6h2V2h4V0H0zm16 0h-4v2h4v4h2V0h-2zm0 16h-4v2h6v-6h-2v4zM2 12H0v6h6v-2H2v-4z"
                  />
                </svg>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <h3
          class="py-4 selectPropertyDetailHeader mb-5 font-weight-bold"
          xs="12"
          sm="8"
          cols="12"
        >
          Please select the Property Type and Year Built
        </h3>
        <v-row class="form-container text-block__row mr-0 mr-md-2">
          <Input
            defaultComponent="v-combobox"
            attach="attach"
            :menu-props="{ light: true }"
            :value="
              Property && Property.PropertyType
                ? Property.PropertyType.replace(/([a-z])([A-Z])/g, '$1 $2')
                : ''
            "
            :items="types"
            @change="type => setPropertyType(type)"
            inputTitle="Property Type"
          />
          <Input
            defaultComponent="v-select"
            inputTitle="Year Built"
            attach="attach"
            :items="years"
            :value="yearBuilt"
            :menu-props="{ bottom: true, offsetY: true }"
            @change="value => setDate(value)"
          />
        </v-row>
      </div>
      <div class="desktop-map-wrapper pl-3" style="position: relative;">
        <GmapMap
          style="height:100%;width:100%;"
          v-if="coord != null"
          :options="mapOptions"
          :center="{ lat: +coord.latitude, lng: +coord.longitude }"
          :zoom="mapZoomLevel"
        >
          <GmapMarker
            :position="{ lat: +coord.latitude, lng: +coord.longitude }"
          ></GmapMarker>
        </GmapMap>
        <v-btn :href="fullViewHref" target="_blank" class="popout-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
            <path
              fill="#666"
              d="M0 0v6h2V2h4V0H0zm16 0h-4v2h4v4h2V0h-2zm0 16h-4v2h6v-6h-2v4zM2 12H0v6h6v-2H2v-4z"
            />
          </svg>
        </v-btn>
      </div>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
    <v-dialog v-model="infoBoxVisible" max-width="550">
      <v-card>
        <v-card-title>Info</v-card-title>
        <v-card-text class="d-flex justify-center mb-4 body-2">
          <ul style="list-style: disc;">
            <li>
              An HO-6 policy will cover your unit’s interior, improvements
              you’ve made to the building, any additions or alterations, and all
              your personal property.
            </li>
            <li class="mt-2">
              The condo association master policy is there to protect the
              building and its inhabitants. This includes general liability for
              the association and property damage coverage for common areas.
            </li>
            <li class="mt-2">
              The condo insurance cost nationwide is $625 on average with a
              $1,000 deductible, $300,000 in liability, and $60,000 in personal
              property coverage.
            </li>
          </ul>
        </v-card-text>
        <v-card-text>
          <v-row class="justify-space-around">
            <Button
              value="Close"
              customClass="button-yes"
              width="120px"
              isOutlined="isOutlined"
              @clicked="infoBoxVisible = false"
            ></Button>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import currencyFormat from "@/mixins/currencyFormat.js";
import onlyNum from "@/mixins/onlyNum.js";
import { mapGetters, mapActions } from "vuex";
import config from "@/configs";

export default {
  mixins: [currencyFormat, onlyNum],
  data() {
    return {
      types: [
        "Single Family Detached",
        "Condominium",
        "Townhouse",
        "Co-operative",
        "Two-to-four Unit Property",
        "Multifamily",
        "Manufactured/Mobile"
      ],
      years: [],
      coord: null,
      mapOptions: {
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        mapTypeId: "hybrid"
      },
      infoBoxVisible: false,
      legalDescription: false,
      addressKeys: ["AddressLineText", "CityName", "StateCode", "PostalCode"]
    };
  },
  methods: {
    ...mapActions(["setProperty", "setExpenses", "updateMortgageLoanInfo"]),
    setDate(year) {
      const property = this.Property
        ? { ...this.Property, YearBuilt: year }
        : { YearBuilt: year };
      this.setProperty(property);
    },
    setPropertyType(type) {
      if (
        type !== "Condominium" &&
        type !== "Townhouse" &&
        type !== "Co-operative"
      ) {
        let HousingExpenses = [...this.housingExpenses];
        const expenseIndex = HousingExpenses.findIndex(
          item => item.HousingExpenseType === "ContentsInsurance"
        );
        if (HousingExpenses !== -1) {
          HousingExpenses.splice(expenseIndex, 1);
          this.updateMortgageLoanInfo({
            prop: "HousingExpenses",
            value: HousingExpenses
          });
        }
      }
      const property = this.Property
        ? { ...this.Property, PropertyType: type ? type.replace(/ /g, "") : "" }
        : { PropertyType: type ? type.replace(/ /g, "") : "" };
      this.setProperty(property);
    },
    setMapOptions() {
      if (this.address != null && this.address !== "") {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {
            address: this.address
          },
          function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              this.coord = {
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng()
              };
              return;
            }
          }.bind(this)
        );
      } else {
        this.coord = null;
      }
    },
    showInfo() {
      this.infoBoxVisible = true;
    }
  },
  watch: {
    Property() {
      this.setMapOptions();
    }
  },
  mounted() {
    this.setMapOptions();
  },
  created() {
    window.vueGoogleMapsInit();
    const currentYear = new Date().getFullYear() + 1;
    this.years = Array.from({ length: currentYear - 1799 }, (_, index) =>
      (currentYear - index).toString()
    );
  },
  computed: {
    ...mapGetters({
      Property: "getProperty",
      LoanPurposeType: "getLoanPurposeType",
      housingExpenses: "getHousingExpenses"
    }),
    mapZoomLevel() {
      return config.mapZoomLevel;
    },
    titleEnd() {
      return this.LoanPurposeType || "Purchase";
    },
    address() {
      if (this.Property) {
        return this.addressKeys.reduce((acc, cur) => {
          if (this.Property[cur]) {
            acc += `${this.Property[cur]}${cur === "PostalCode" ? " " : ", "}`;
          }
          return acc;
        }, "");
      }
      return "";
    },
    yearBuilt() {
      return this.Property != null ? this.Property.YearBuilt : null;
    },
    isNextDisabled() {
      return (
        this.Property == null ||
        this.Property.PropertyType == null ||
        this.Property.PropertyType === "" ||
        this.yearBuilt == null
      );
    },
    fullViewHref() {
      if (this.coord != null) {
        const addressParts = ["AddressLineText", "CityName"];
        let hrefForGoogleMaps = addressParts
          .map(part => {
            if (this.Property[part]) {
              const words = this.Property[part]
                .split(/(?=[A-Z])/)
                .map(word => word.trim());
              return words.join("+");
            }
            return "";
          })
          .filter(part => part !== "")
          .join("+");
        const otherKeys = this.addressKeys.filter(
          key => !addressParts.includes(key)
        );
        const otherValues = otherKeys
          .map(key => this.Property[key])
          .filter(value => value !== "")
          .join("+");
        hrefForGoogleMaps += otherValues !== "" ? "+" + otherValues : "";
        return `https://maps.google.com/maps?q=${hrefForGoogleMaps}&z=17&t=h&hl=en&gl=US&mapclient=apiv3`;
      }
      return null;
    },
    PropertyPrice() {
      return this.Property && this.Property.PropertyValuationAmount
        ? "$" + this.getFormattedValue(this.Property.PropertyValuationAmount)
        : "";
    },
    RoomsAmount() {
      return this.Property &&
        this.Property.PropertyDetail &&
        this.Property.PropertyDetail.Rooms
        ? this.Property.PropertyDetail.Bedrooms
        : "";
    },
    BathroomsAmount() {
      return this.Property &&
        this.Property.PropertyDetail &&
        this.Property.PropertyDetail.Bathrooms
        ? this.Property.PropertyDetail.Bathrooms
        : "";
    },
    SqFt() {
      return this.Property &&
        this.Property.PropertyDetail &&
        this.Property.PropertyDetail.HouseSquareFeet
        ? this.getFormattedValue(this.Property.PropertyDetail.HouseSquareFeet)
        : "";
    },
    SqFtLot() {
      return this.Property &&
        this.Property.PropertyDetail &&
        this.Property.PropertyDetail.LotSquareFeet
        ? this.getFormattedValue(this.Property.PropertyDetail.LotSquareFeet)
        : "";
    },
    TaxYear() {
      return this.Property &&
        this.Property.PropertyDetail &&
        this.Property.PropertyDetail.TaxYear
        ? this.Property.PropertyDetail.TaxYear
        : "";
    },
    TaxAmount() {
      return this.Property &&
        this.Property.PropertyDetail &&
        this.Property.PropertyDetail.Taxes
        ? "$" + this.getFormattedValue(this.Property.PropertyDetail.Taxes)
        : "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/colors.scss";
.box {
  &--left {
    width: 70%;
  }
}
.text-block {
  margin: 0;
  padding-right: 45px;
  &__icon {
    margin-right: 5px;
  }
}
.my-block {
  margin-bottom: 10px;
}

.w-100 {
  width: 100%;
}

.icon-box {
  flex-wrap: nowrap;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  padding: 5px 10px;
  margin-bottom: 10px;
}

.property-details__wrapper {
  display: flex;
  @media (max-width: 767px) {
    flex-direction: column-reverse;
  }
}
.no-wrap {
  flex-wrap: nowrap;
  @media (max-width: 1110px) {
    flex-wrap: wrap;
  }
}
.last-row {
  padding-left: 10px;
  margin-bottom: 20px;
}

.any-row {
  margin-bottom: 10px;
}

.underlined {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .main {
    &__subtitle {
      padding-left: 0;
    }
  }
}

@media (max-width: 768px) {
  .pl-10-768 {
    padding-left: 10px;
  }
}

@media (max-width: 760px) {
  .text-block {
    padding: 0 12px;
  }
  .card-header {
    margin: 0 -12px;
  }
  .pl-10-768 {
    padding-left: 0;
  }
  .last-row {
    padding-left: 0;
  }
}

.desktop-content-wrapper {
  max-width: 100%;
}
.desktop-map-wrapper {
  width: 360px;
  height: 340px;
  flex-shrink: 0;
  display: block;
  @media (max-width: 1200px) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: 767px) {
    display: none;
  }
}

.mobile-map-wrapper {
  display: none;
  @media screen and (max-width: 767px) {
    max-height: 260px;
    display: block;
    width: 250px;
    padding: 0;
    padding-left: 20px !important;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    min-height: 260px;
    padding-left: 0 !important;
  }
}

.selectPropertyDetailHeader {
  margin-left: -$content-padding-x;
  width: calc(100% + 30px);
  padding-left: $content-padding-x;
  background-color: $content-headr-bg;
  @media (max-width: 1200px) {
    margin-right: 0;
    padding-left: $content-padding-tablet-x;
    padding-right: $content-padding-tablet-x;
    width: calc(100% + 35px);
  }
  @media (max-width: $tablet-width) {
    margin-left: -$content-padding-tablet-x;
    padding-left: $content-padding-tablet-x;
    width: calc(100% + 40px);
  }
  @media (max-width: 600px) {
    width: calc(100% + 20px);
  }
}

.popout-button {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 10px !important;
  width: 37px !important;
  min-width: 1px !important;
}

.details-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 25px;
  @media (max-width: 1200px) {
    max-width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.details-card {
  box-shadow: 0px 1px 8px 0px #00000026;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  & > img {
    width: 25px;
    height: 25px;
  }
  &-info {
    font-size: 14px;
    color: #424248;
    font-weight: 500;
    span {
      font-size: 12px;
      color: #828282;
      display: block;
    }
  }
}

.legal-description {
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 20px;
  &:not(.active) {
    p {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  &-title {
    text-decoration: underline;
    margin-bottom: 8px;
  }
  &-content {
    display: flex;
    cursor: pointer;
    p {
      flex-grow: 1;
      margin-bottom: 0;
    }
    .v-icon {
      color: #424248;
      height: 16px;
      flex-shrink: 0;
    }
  }
}

.inner-content-container {
  display: flex;
}

.desktop-content-wrapper {
  width: calc(100% - 360px);
  @media (max-width: 1200px) {
    flex-grow: 1;
  }
  @media screen and (max-width: 767px) {
    padding-right: 0 !important;
    width: 100%;
    max-width: none;
  }
  .form-container {
    max-width: 100%;
    margin: 0 !important;
  }
}

:deep(.icon-color-main) {
  path {
    &[fill] {
      fill: $icon-color !important;
    }
    &[stroke] {
      stroke: $icon-color !important;
    }
  }
}
</style>
