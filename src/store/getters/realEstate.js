export const getEditingExpenses = state => state.editingExpenses;
export const getEditingMortgageLoan = state => state.editingMortgageLoan;
export const getEditingPropertyDetails = state => state.editingPropertyDetails;
export const getRealEstate = state =>
  state.Borrower && state.Borrower.RealEstate ? state.Borrower.RealEstate : [];
export const getRealEstateEditingIndex = state => state.realEstateEditingIndex;
export const getEditingMortgageLoanIndex = state =>
  state.editingMortgageLoanIndex;
export const getHousingExpenses = (state, getters) => {
  return getters.getMortgageLoanInformation &&
    getters.getMortgageLoanInformation.HousingExpenses
    ? getters.getMortgageLoanInformation.HousingExpenses
    : [];
};
