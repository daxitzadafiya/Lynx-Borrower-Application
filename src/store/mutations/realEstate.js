export const SET_EXPENSES = (state, payload) => {
  const LenderLoanInformation = state.LenderLoanInformation || {};
  let MortgageLoanInformation =
    LenderLoanInformation.MortgageLoanInformation || {};
  MortgageLoanInformation.HousingExpenses = payload;
  LenderLoanInformation.MortgageLoanInformation = MortgageLoanInformation;
  state.LenderLoanInformation = LenderLoanInformation;
};

export const SET_EDITING_EXPENSES = (state, payload) => {
  state.editingExpenses = payload;
};

export const SET_EDITING_MORTGAGE_LOAN = (state, payload) => {
  state.editingMortgageLoan = null;
  state.editingMortgageLoan = payload;
};

export const SET_EDITING_MORTGAGE_LOAN_INDEX = (state, payload) => {
  state.editingMortgageLoanIndex = payload;
};

export const SET_EDITING_PROPERTY_DETAILS = (state, payload) => {
  state.editingPropertyDetails = payload;
};

export const SET_REAL_ESTATE_EDITING_INDEX = (state, payload) => {
  state.realEstateEditingIndex = payload;
};
