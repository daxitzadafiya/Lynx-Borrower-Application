import { countries } from "@/models/countries";

export const getCountryShortName = function(longName) {
  const countryInfo = countries.find(item => item.longName === longName);
  return countryInfo ? countryInfo.shortName : longName;
};

export const getCountryLongName = function(shortName) {
  const countryInfo = countries.find(item => item.shortName === shortName);
  return countryInfo ? countryInfo.longName : shortName;
};
