export const updatePropertyAndLoanInfoBoolean = (
  { commit, state },
  payload
) => {
  commit("UPDATE_PROPERTY_AND_LOAN_INFO_BOOLEAN", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const updatePropertyAndLoanInfo = ({ commit, state }, payload) => {
  commit("UPDATE_PROPERTY_AND_LOAN_INFO", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const updatePropertyAndLoanRadioOption = (
  { commit, state },
  payload
) => {
  commit("UPDATE_PL_RADIO_OPTION", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const setTitleInformation = ({ commit, state }, payload) => {
  commit("SET_TITLE_INFORMATION", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const updateMortgageLoanInfoBoolean = ({ commit, state }, payload) => {
  commit("UPDATE_MORTGAGE_LOAN_INFO_BOOLEAN", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const updateMortgageLoanRadioOption = ({ commit, state }, payload) => {
  commit("UPDATE_ML_RADIO_OPTION", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const updateMortgageLoanInfo = ({ commit, state }, payload) => {
  commit("UPDATE_MORTGAGE_LOAN_INFO", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const updateTransactionDetails = ({ commit, state }, payload) => {
  commit("UPDATE_TRANSACTION_DETAILS", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const updateCounselingParties = ({ commit, state }, payload) => {
  commit("UPDATE_COUNSELING_PARTIES", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};
