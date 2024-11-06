export const getAdditionalLoanInformation = (state, getters) =>
  getters.getLenderLoanInformation.AdditionalInformation || {};
