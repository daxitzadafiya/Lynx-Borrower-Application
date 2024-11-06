export default {
  data() {
    return {
      inputId: "autocomplete",
      autocomplete: "",
      componentForm: {
        street_number: "short_name",
        route: "long_name",
        locality: "long_name",
        administrative_area_level_1: "short_name",
        country: "short_name",
        postal_code: "short_name"
      },
      addressFields: {
        route: "AddressLineText",
        locality: "CityName",
        administrative_area_level_1: "StateCode",
        country: "CountryCode",
        postal_code: "PostalCode"
      },
      formattedAddress: ""
    };
  },
  methods: {
    initAutocomplete() {
      // Create the autocomplete object, restricting the search predictions to
      // geographical location types.
      this.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(this.inputId),
        { types: ["geocode"] }
      );

      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components.
      this.autocomplete.setFields(["address_component", "formatted_address"]);
      this.autocomplete.setComponentRestrictions({ country: ["us"] });
      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      this.autocomplete.addListener("place_changed", this.fillInAddress);
    },
    fillInAddress() {
      const place = this.autocomplete.getPlace();
      return this.parseAddressData(place);
    },
    parseAddressData(place) {
      if (place && place.formatted_address) {
        this.formattedAddress = place.formatted_address;
      }
      if (place && place.address_components) {
        const vm = this;
        let addressData = {};
        let streetNumber = "";
        for (let i = 0; i < place.address_components.length; i++) {
          let addressType = place.address_components[i].types[0];
          if (addressType === "street_number") {
            streetNumber = place.address_components[i]["short_name"] || "";
          } else if (vm.componentForm[addressType]) {
            const val =
              place.address_components[i][vm.componentForm[addressType]];
            addressData[this.addressFields[addressType]] = val || "";
            if (addressType === "route") {
              addressData[this.addressFields.route] = `${streetNumber} ${
                addressData[this.addressFields.route]
              }`;
            }
          }
        }
        return this.handleAddressData(addressData);
      }
      this.handleAddressData(place);
    },
    geolocate() {
      const vm = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          vm.autocomplete.setBounds(circle.getBounds());
        });
      }
    }
  },
  mounted() {
    this.initAutocomplete();
  },
  created() {
    if (this.uniqueInputId) {
      this.inputId = this.uniqueInputId;
    }
  },
  beforeDestroy() {
    this.autocomplete = "";
  }
};
