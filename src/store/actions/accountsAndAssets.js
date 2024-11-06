export const setAssets = ({ dispatch, state }, payload) => {
  const { assets, AssetTypeId } = payload;
  let allAssets =
    state.Borrower && state.Borrower.Assets
      ? JSON.parse(JSON.stringify(state.Borrower.Assets))
      : [];
  const filtered = allAssets.filter(item => {
    return !AssetTypeId ? item.AssetTypeId : item.AssetTypeId !== AssetTypeId;
  });
  allAssets = [...filtered, ...assets].sort((a, b) => {
    return (
      !b.AssetTypeId - !a.AssetTypeId ||
      -(b.AssetTypeId > a.AssetTypeId) ||
      b.AssetTypeId < a.AssetTypeId
    );
  });
  dispatch("updateBorrower", { prop: "Assets", value: allAssets });
};

export const setSellerCredits = ({ dispatch, state }, payload) => {
  const currentLoan = { ...state.currentLoan, SellerCredits: payload };
  dispatch("setCurrentLoan", currentLoan);
};

export const setPurchaseCredits = ({ dispatch, state }, payload) => {
  const currentLoan = { ...state.currentLoan, PurchaseCredits: payload };
  dispatch("setCurrentLoan", currentLoan);
};
