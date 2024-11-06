import { states } from "@/models/us-states";

export const getStateInfo = function(stateCode) {
  return states.find(item => item.PostalAbbreviation === stateCode);
};

export const getStateIndicator = function(stateCode, indicatorName) {
  const stateInfo = states.find(item => item.PostalAbbreviation === stateCode);
  return stateInfo ? stateInfo[indicatorName] : false;
};
