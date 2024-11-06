import { getCountryLongName, getCountryShortName } from "@/helpers/countries";

export default {
  methods: {
    getCountryName(shortName) {
      return getCountryLongName(shortName);
    },
    getCountryCode(longName) {
      return getCountryShortName(longName);
    }
  }
};
