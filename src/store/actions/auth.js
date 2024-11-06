import lynxApi from "@/api/lynxApi";
import router from "@/router";



export const authenticate = async ({ dispatch }, payload) => {
  try {
    const result = await lynxApi.authorize(payload);
    dispatch("setUser", result);
    localStorage.setItem("borrowerToken", result.token);
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
    throw new Error(err);
  }
};

export const signUpAccount = async ({ dispatch }, payload) => {
  try {
    await lynxApi.signUp(payload);
    router.push("/login");
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
  }
};

export const logOut = async ({ dispatch, state }) => {
  try {
   // await lynxApi.signOut();
    if (state.isHostedMode) {
      parent.postMessage({ expired: true }, "*");
    }
    localStorage.removeItem("borrowerToken");
    dispatch("setUser", null);
    dispatch("setInitialData", null);
    window.location.href = "/login";
  } catch (err) {
    console.log(err);
  }
};

export const recoverPass = async ({ dispatch }, payload) => {
  try {
    await lynxApi.recoverPassword(payload);
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
    throw err;
  }
};

export const resetPass = async ({ dispatch }, payload) => {
  try {
    await lynxApi.resetPassword(payload);
    router.push("/login");
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
  }
};
