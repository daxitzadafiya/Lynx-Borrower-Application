export const SET_EDITING_LIABILITY = (state, payload) => {
  const { liability, index } = payload;
  state.editingLiability = liability;
  state.editingLiabilityIndex = index;
};

export const SET_DEROGATORY_ITEM = (state, payload) => {
  const { derogatoryItem, index } = payload;
  state.editingDerogatoryItem = derogatoryItem;
  state.editingDerogatoryItemIndex = index;
};

export const SET_CREDIT_ORDERS = (state, payload) => {
  state.orders = payload;
};

export const SET_CREDIT_ORDER_ID = (state, payload) => {
  state.creditOrderId = payload;
};

export const SET_REPORT_DETAILS = (state, payload) => {
  state.reportDetails = payload;
};

export const SET_CREDIT_CALLED_STATUS = (state, payload) => {
  state.isHosteCreditOrderCalled = payload;
};
