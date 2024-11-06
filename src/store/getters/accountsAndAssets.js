export const getPurchaseCredits = state =>
  state.currentLoan && state.currentLoan.PurchaseCredits
    ? state.currentLoan.PurchaseCredits
    : [];
export const getRegularAssets = state =>
  state.Borrower && state.Borrower.Assets
    ? state.Borrower.Assets.filter(item => !item.AssetTypeId)
    : [];
export const getOtherAssets = state =>
  state.Borrower && state.Borrower.Assets
    ? state.Borrower.Assets.filter(item => item.AssetTypeId === 1)
    : [];
export const getGiftsOrGrants = state =>
  state.Borrower && state.Borrower.Assets
    ? state.Borrower.Assets.filter(item => item.AssetTypeId === 2)
    : [];
export const getSellerCredits = (state, getters) =>
  getters.getCurrentLoan && getters.getCurrentLoan.SellerCredits
    ? getters.getCurrentLoan.SellerCredits
    : [];
