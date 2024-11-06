export const getLoanAmount = state =>
  state.currentLoan ? state.currentLoan.LoanAmount : "";
export const getBaseLoanAmount = (state, getters) =>
  getters.getTransactionDetails.BaseLoanAmount || 0;
export const getLoanPurposeType = state => {
  if (state.currentLoan && state.currentLoan.LoanPurposeType) {
    return state.currentLoan.LoanPurposeType;
  } else {
    return "All";
  }
};
export const getProperty = state => state.Property;
export const getDownPaymentAmount = state =>
  state.currentLoan && state.currentLoan.DownPaymentAmount
    ? state.currentLoan.DownPaymentAmount
    : 0;
export const getDownPaymentPercentage = state =>
  state.currentLoan && state.currentLoan.DownPaymentPercentage
    ? state.currentLoan.DownPaymentPercentage
    : 0;
export const getApr = state =>
  state.currentLoan && state.currentLoan.APR ? state.currentLoan.APR : 0;
export const getPropertyLoanInformation = (state, getters) =>
  getters.getLenderLoanInformation.PropertyAndLoanInformation;
export const getPurchasePrice = (state, getters) =>
  getters.getTransactionDetails.SalesContractAmount || "";
export const getPropertyStructureBuiltYear = (state, getters) =>
  getters.getPropertyLoanInformation
    ? getters.getPropertyLoanInformation.PropertyStructureBuiltYear
    : "";
