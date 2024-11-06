export const updateAdditionalInfo = ({ commit, state }, payload) => {
  commit("UPDATE_ADDITIONAL_INFO", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};
