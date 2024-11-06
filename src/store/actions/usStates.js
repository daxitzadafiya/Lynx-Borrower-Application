import lynxApi from "@/api/lynxApi";

export const setUsStates = ({ commit }, payload) => {
    commit("SET_USSTATES", payload);
  };

  export const getUsStates = async ({ dispatch }) => {
    try {
        const result = await lynxApi.getAllUsStates();
        if (result !== "Not found") {
          dispatch("setUsStates", result);
        }
    } catch (err) {
      if (err !== "Invalid token") {
        dispatch("setAlert", {
          isAlert: true,
          alertType: "error",
          alertMessage: err
        });
        throw err;
      }
    }
  };