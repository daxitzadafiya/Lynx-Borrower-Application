export const getLenderLoanInformation = state =>
  state.LenderLoanInformation || {};
export const getTransactionDetails = (state, getters) =>
  getters.getLenderLoanInformation.TransactionDetails || {};
export const getMortgageLoanInformation = (state, getters) =>
  getters.getLenderLoanInformation.MortgageLoanInformation || {};
export const getOtherNewMortgageLoans = (state, getters) =>
  getters.getProperty && getters.getProperty.OtherNewMortgageLoans
    ? getters.getProperty.OtherNewMortgageLoans
    : [];
export const getPurchaseCredits = (state, getters) =>
  getters.currentLoan && getters.currentLoan.PurchaseCredits
    ? getters.currentLoan.PurchaseCredits
    : [];
export const getClosingAdjustments = (state, getters) =>
  getters.getTransactionDetails.ClosingAdjustments || [];
