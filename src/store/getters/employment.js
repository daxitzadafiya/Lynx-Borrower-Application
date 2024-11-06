export const getBorrowerEmployment = state =>
  state.Borrower && state.Borrower.Employment ? state.Borrower.Employment : [];
export const getAdditionalEmployments = (state, getters) =>
  getters.getBorrowerEmployment.filter(
    item => item.EmploymentClassificationType === "Secondary"
  );
export const getOtherIncome = state =>
  state.Borrower && state.Borrower.OtherIncome
    ? state.Borrower.OtherIncome
    : [];
export const getAdditionalEmploymentIndex = state =>
  state.additionalEmploymentIndex;
