export const UPDATE_ADDITIONAL_INFO = (state, payload) => {
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let AdditionalInformation = LenderLoanInformation.AdditionalInformation || {};
  AdditionalInformation[payload.prop] = payload.value;
  LenderLoanInformation.AdditionalInformation = AdditionalInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};
