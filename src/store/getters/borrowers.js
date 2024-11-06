export const getBorrowers = state => state.Borrowers;
export const getBorrower = state => state.Borrower;
export const getBorrowerIndex = state => state.currentBorrowerIndex;
export const getAllInvitations = state => state.invitations;
export const getDependents = state =>
  state.Borrower && state.Borrower.Dependents
    ? state.Borrower.Dependents
    : { Count: 0, Ages: [] };
export const getMilitaryServices = state =>
  state.Borrower && state.Borrower.MilitaryServices
    ? state.Borrower.MilitaryServices
    : [];
export const getResidences = state =>
  state.Borrower && state.Borrower.Residences ? state.Borrower.Residences : [];
export const getSpecificResidence = (state, getters) => type =>
  getters.getResidences.find(
    item => item && item.BorrowerResidencyType === type
  ) || {};

export const getBorrowersState = state => {
  return {
    Borrowers: state.Borrowers,
    Borrower: state.Borrower,
    currentBorrowerIndex: state.currentBorrowerIndex,
    invitations: state.invitations,
    realEstateOwned: state.realEstateOwned,
    realEstateOwnedExpenses: state.realEstateOwnedExpenses,
    realEstateOwnedMortgage: state.realEstateOwnedMortgage
  };
};
