import { getStateIndicator } from "@/helpers/states";

export const setInitialLoanAndProperty = ({ commit }, payload) => {
  commit("SET_INITIAL_LOAN_AND_PROPERTY", payload);
};

export const setPurchasePrice = ({ commit, state }, payload) => {
  commit("SET_PURCHASE_PRICE", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const setPropertyStructureBuiltYear = ({ commit, state }, payload) => {
  commit("SET_PROPERTY_BUILT_YEAR", parseInt(payload));
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LenderLoanInformation: state.LenderLoanInformation
  });
};

export const setLoanAmount = ({ commit, state }, payload) => {
  commit("SET_CURRENT_LOAN", { ...state.currentLoan, LoanAmount: payload });
};

export const setLoanPurposeType = ({ commit, state }, payload) => {
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    LoanPurposeType: payload
  });
};

export const setProperty = ({ commit, dispatch, state }, payload) => {
  commit("SET_LOAN_PROPERTY", payload);
  if (payload.StateCode) {
    const indicator = getStateIndicator(payload.StateCode, "CommunityProperty");
    dispatch("updatePropertyAndLoanInfoBoolean", {
      prop: "CommunityPropertyStateResidentIndicator",
      value: indicator
    });
  }
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    Property: state.Property
  });
};

export const updateLoanProperty = ({ commit, state }, payload) => {
  commit("UPDATE_LOAN_PROPERTY", payload);
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    Property: state.Property
  });
};


export const setLoanStatusId = ({ commit, state }, payload) => {
  commit("SET_CURRENT_LOAN", {
    ...state.currentLoan,
    StatusId: payload
  });
};