export const getPropertyAndLoanInformation = (state, getters) =>
  getters.getLenderLoanInformation.PropertyAndLoanInformation || {};
export const getTitleInformation = (state, getters) =>
  getters.getLenderLoanInformation.TitleInformation || [];
export const getCounselingParties = (state, getters) =>
  getters.getLenderLoanInformation.CounselingParties || [];
