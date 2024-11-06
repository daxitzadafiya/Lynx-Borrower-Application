import lynxApi from "@/api/lynxApi";

export const getFinancialInstitutions = async ({ dispatch }, payload) => {
  try {
    return await lynxApi.searchText(payload);
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
    throw new Error(err);
  }
};
