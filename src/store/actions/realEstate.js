export const setExpenses = ({ commit, state }, payload) => {
  commit("SET_EXPENSES", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const setEditingExpenses = ({ commit }, payload) => {
  commit("SET_EDITING_EXPENSES", payload);
};

export const setEditingMortgageLoan = ({ commit }, payload) => {
  const { loan, loanIndex } = payload;
  commit("SET_EDITING_MORTGAGE_LOAN", loan);
  commit("SET_EDITING_MORTGAGE_LOAN_INDEX", loanIndex);
};

export const setEditingPropertyDetails = ({ commit }, payload) => {
  commit("SET_EDITING_PROPERTY_DETAILS", payload);
};

export const setRealEstateEditingIndex = ({ commit }, payload) => {
  commit("SET_REAL_ESTATE_EDITING_INDEX", payload);
};

export const setMortgageLoan = (
  { commit, dispatch, state, getters },
  payload
) => {
  const { realEstateEditingIndex } = state;
  const { prop, value, loanIndex } = payload;
  const RealEstate = getters.getRealEstate
    ? Array.from(getters.getRealEstate)
    : [];
  const currentRealEstate = RealEstate[realEstateEditingIndex] || {};
  let MortgageLoans = currentRealEstate.MortgageLoans || [];
  MortgageLoans[loanIndex] = { ...MortgageLoans[loanIndex], [prop]: value };
  commit("SET_EDITING_MORTGAGE_LOAN", MortgageLoans[loanIndex]);
  RealEstate[realEstateEditingIndex] = { ...currentRealEstate, MortgageLoans };
  dispatch("setRealEstate", RealEstate);
};

export const setRealEstate = ({ dispatch }, payload) => {
  dispatch("updateBorrower", { prop: "RealEstate", value: payload });
};
