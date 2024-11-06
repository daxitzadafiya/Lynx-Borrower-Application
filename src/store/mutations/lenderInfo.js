export const UPDATE_PROPERTY_AND_LOAN_INFO_BOOLEAN = (state, payload) => {
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let PropertyAndLoanInformation =
    LenderLoanInformation.PropertyAndLoanInformation || {};
  if (typeof payload === "string") {
    PropertyAndLoanInformation[payload] = !PropertyAndLoanInformation[payload];
  } else {
    PropertyAndLoanInformation[payload.prop] = payload.value;
  }
  LenderLoanInformation.PropertyAndLoanInformation = PropertyAndLoanInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const UPDATE_PROPERTY_AND_LOAN_INFO = (state, payload) => {
  const { prop, value } = payload;
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let PropertyAndLoanInformation =
    LenderLoanInformation.PropertyAndLoanInformation || {};
  PropertyAndLoanInformation[prop] = value;
  if (!PropertyAndLoanInformation[prop]) {
    delete PropertyAndLoanInformation[prop];
  }
  LenderLoanInformation.PropertyAndLoanInformation = PropertyAndLoanInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const UPDATE_PL_RADIO_OPTION = (state, payload) => {
  const { prop, value } = payload;
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let PropertyAndLoanInformation =
    LenderLoanInformation.PropertyAndLoanInformation || {};
  PropertyAndLoanInformation[prop] =
    PropertyAndLoanInformation[prop] === value ? null : value;
  if (!PropertyAndLoanInformation[prop]) {
    delete PropertyAndLoanInformation[prop];
  }
  LenderLoanInformation.PropertyAndLoanInformation = PropertyAndLoanInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const SET_TITLE_INFORMATION = (state, payload) => {
  const LenderLoanInformation = {
    ...state.LenderLoanInformation,
    TitleInformation: payload
  };
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const UPDATE_MORTGAGE_LOAN_INFO_BOOLEAN = (state, payload) => {
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let MortgageLoanInformation =
    LenderLoanInformation.MortgageLoanInformation || {};
  MortgageLoanInformation[payload] = !MortgageLoanInformation[payload];
  LenderLoanInformation.MortgageLoanInformation = MortgageLoanInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const UPDATE_ML_RADIO_OPTION = (state, payload) => {
  const { prop, value } = payload;
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let MortgageLoanInformation =
    LenderLoanInformation.MortgageLoanInformation || {};
  MortgageLoanInformation[prop] =
    MortgageLoanInformation[prop] === value ? null : value;
  if (!MortgageLoanInformation[prop]) {
    delete MortgageLoanInformation[prop];
  }
  LenderLoanInformation.MortgageLoanInformation = MortgageLoanInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const UPDATE_MORTGAGE_LOAN_INFO = (state, payload) => {
  const { prop, value } = payload;
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let MortgageLoanInformation =
    LenderLoanInformation.MortgageLoanInformation || {};
  MortgageLoanInformation[prop] = value;
  if (!MortgageLoanInformation[prop]) {
    delete MortgageLoanInformation[prop];
  }
  LenderLoanInformation.MortgageLoanInformation = MortgageLoanInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const UPDATE_TRANSACTION_DETAILS = (state, payload) => {
  const { prop, value } = payload;
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let TransactionDetails = LenderLoanInformation.TransactionDetails || {};
  TransactionDetails[prop] = value;
  if (!TransactionDetails[prop]) {
    delete TransactionDetails[prop];
  }
  LenderLoanInformation.TransactionDetails = TransactionDetails;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const UPDATE_COUNSELING_PARTIES = (state, payload) => {
  const LenderLoanInformation = {
    ...state.LenderLoanInformation,
    CounselingParties: payload
  };
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};
