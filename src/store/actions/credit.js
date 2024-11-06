import lynxApi from "@/api/lynxApi";
import router from "../../router";

export const setEditingLiability = ({ commit }, payload) => {
  commit("SET_EDITING_LIABILITY", payload);
};

export const setEditingDerogatoryItem = ({ commit }, payload) => {
  commit("SET_DEROGATORY_ITEM", payload);
};

export const setDefaultsOfCreditOrderData = ({ commit }) => {
  commit("SET_CREDIT_ORDERS", null);
  commit("SET_CREDIT_ORDER_ID", undefined);
  commit("SET_REPORT_DETAILS", null);
};

export const sendOrderRequest = async ({ commit, dispatch, state }) => {
  try {
    let PrimaryBorrowerId = state.Borrower.Id;
    let JointRequest = state.Borrower.CoBorrower || false;
    if (state.Borrower.CoBorrower) {
      const borrower = state.Borrowers.find(
        item => item.LinkedBorrowerId === state.Borrower.Id && !item.CoBorrower
      );
      PrimaryBorrowerId = borrower ? borrower.Id : PrimaryBorrowerId;
    } else {
      JointRequest = !!state.Borrowers.find(
        item => item.LinkedBorrowerId === PrimaryBorrowerId && item.CoBorrower
      );
    }
    const data = {
      LoanId: state.currentLoan.Id,
      PrimaryBorrowerId,
      JointRequest
    };
    const result = await lynxApi.createCreditOrder(data);
    if (!result) {
      // return router.push("/credit/order");
    }
    commit("SET_CREDIT_ORDER_ID", result.CreditOrderId);
    const currentBorrowerIndex = state.currentBorrowerIndex;
    await dispatch("getLoanById", state.currentLoan.Id);
    dispatch("setCurrentBorrower", currentBorrowerIndex);
    await dispatch("getOrderReportDetails", result.CreditOrderId);
    router.push("/credit/score-and-accounts-review");
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
    throw err;
  } finally {
    dispatch("setMagicSpinner", false);
  }
};

export const getCreditOrders = async ({ commit, dispatch, state }, payload) => {
  const isNotRedirect = payload;
  if (!state.currentLoan || !state.currentLoan.Id) {
    return router.history.current.name !== "credit-order" && !isNotRedirect
      ? router.push("/credit/order")
      : true;
  }
  try {
    const result = await lynxApi.getLoanCreditOrders(state.currentLoan.Id);
    if (!result) {
      dispatch("setDefaultsOfCreditOrderData");
      return router.history.current.name !== "credit-order" && !isNotRedirect
        ? router.push("/credit/order")
        : true;
    }
    commit("SET_CREDIT_ORDERS", result);
    const matched = result.find(item => {
      return (
        item.StatusCode === "COMPLETED" &&
        (item.BorrowerId === state.Borrower.Id ||
          (item.BorrowerId === state.Borrower.LinkedBorrowerId &&
            state.Borrower.CoBorrower))
      );
    });
    if (!matched) {
      dispatch("setDefaultsOfCreditOrderData");
      if (router.history.current.path !== "/credit/summary" && !isNotRedirect) {
        if (router.history.current.name !== "credit-order")
          router.push("/credit/order");
      }
    } else {
      commit("SET_CREDIT_ORDER_ID", matched.Id);
      await dispatch("getOrderReportDetails", matched.Id);
      if (
        (router.history.current.path === "/credit" ||
          router.history.current.path === "/credit/") &&
        !isNotRedirect
      ) {
        router.push("/credit/response");
      }
    }
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
    throw err;
  }
};

export const getOrderReportDetails = async ({ commit, dispatch }, payload) => {
  try {
    const result = await lynxApi.getLoanCreditOrderReportDetails(payload);
    commit("SET_REPORT_DETAILS", result);
  } catch (err) {
    dispatch("setAlert", {
      isAlert: true,
      alertType: "error",
      alertMessage: err
    });
    throw err;
  }
};

export const setHostedModeOrdersStatus = ({ commit }, payload) => {
  commit("SET_CREDIT_CALLED_STATUS", payload);
};
