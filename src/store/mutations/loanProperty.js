export const SET_INITIAL_LOAN_AND_PROPERTY = (state, payload) => {
  const { Property, LenderLoanInformation } = payload
    ? payload
    : { Property: null, LenderLoanInformation: null };
  state.Property =
    Property && Object.entries(Property).length
      ? JSON.parse(JSON.stringify(Property))
      : Property;
  state.LenderLoanInformation =
    LenderLoanInformation && Object.entries(LenderLoanInformation).length
      ? JSON.parse(JSON.stringify(LenderLoanInformation))
      : LenderLoanInformation;
};

export const SET_PURCHASE_PRICE = (state, payload) => {
  const LenderLoanInformation = state.LenderLoanInformation || {};
  let TransactionDetails = LenderLoanInformation.TransactionDetails || {};
  TransactionDetails.SalesContractAmount = payload;
  if (!TransactionDetails.SalesContractAmount) {
    delete TransactionDetails.SalesContractAmount;
  }
  LenderLoanInformation.TransactionDetails = TransactionDetails;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const SET_PROPERTY_BUILT_YEAR = (state, payload) => {
  let LenderLoanInformation = state.LenderLoanInformation || {};
  let PropertyAndLoanInformation =
    LenderLoanInformation.PropertyAndLoanInformation || {};
  PropertyAndLoanInformation.PropertyStructureBuiltYear = payload;
  LenderLoanInformation.PropertyAndLoanInformation = PropertyAndLoanInformation;
  state.LenderLoanInformation = {
    ...state.LenderLoanInformation,
    ...LenderLoanInformation
  };
};

export const SET_LOAN_PROPERTY = (state, payload) => {
  state.Property = payload;
  state.currentLoan = { ...state.currentLoan, Property: payload };
};

export const UPDATE_LOAN_PROPERTY = (state, payload) => {
  let Property = state.Property || {};
  const { prop, value } = payload;
  Property[prop] = value;
  state.Property = { ...state.Property, ...Property };
};
