import lynxApi from "@/api/lynxApi";
import { loanStreamingService } from "@/services/LoanStreamingService";
import objectsHandler from "@/helpers/objectsHandler";
import patchHelper from "@/helpers/patchHelper";
import hostedModeHelper from "@/helpers/hostedModeHelper";
import router from "@/router";

export const toggleIsOnlay = ({ commit }, payload) => {
  commit("SET_ISONLAY", payload);
};

export const setMagicSpinner = ({ commit }, payload) => {
  commit("SET_MAGIC_SPINNER", payload);
};

export const setAlert = ({ commit, state }, payload) => {
  commit("SET_ALERT", payload);
  if (state.currentTimeoutId) {
    clearTimeout(state.currentTimeoutId);
  }
  const timeoutId = setTimeout(() => {
    commit("SET_ALERT", { isAlert: false, alertType: "", alertMessage: "" });
    commit("SET_MAGIC_SPINNER", false);
  }, 5000);
  commit("SET_TIMEOUT_ID", timeoutId);
};

export const modifyDataArray = ({ commit }, payload) => {
  commit("MODIFY_DATA_ARRAY", payload);
};

export const setUser = ({ commit }, payload) => {
  commit("SET_USER", payload);
};

export const setInitialData = ({ commit, dispatch, state }, payload) => {
  commit("SET_SERVER_LOAN", payload);
  const clonnedLoan =
    payload && payload.Id ? JSON.parse(JSON.stringify(payload)) : null;
  commit("SET_CURRENT_LOAN", clonnedLoan);
  const Borrowers =
    state.serverLoan && state.serverLoan.Borrowers
      ? state.serverLoan.Borrowers
      : null;
  dispatch("setInitialBorrowers", Borrowers);
  commit("SET_INITIAL_LOAN_AND_PROPERTY", payload);

};

export const getLoanById = async ({ dispatch, state }, payload) => {
  try {
    const loan = await lynxApi.getLoan(payload);

    await dispatch("setInitialData", loan);
    if (state.currentUser.userTypeId != 1) {
      if (loan.StatusId > 7) {
        dispatch("underwrite", true);
      }
    }
    //if (!state.isHostedMode) {
    //  dispatch("setAlert", {
    //    isAlert: true,
    //    alertType: "success",
    //     alertMessage: `Succesfully loaded Loan ${loan.Id}`
    //});
    //}
    loanStreamingService.unSubscribeAndSubscribe(loan.Id);

    if (state.isHostedMode) {
      const headerData = await hostedModeHelper.getHostingHeaderData(
        state.currentLoan
      );
      parent.postMessage(headerData, "*");
    }
    dispatch("updateSectionAndPageData", window.location.pathname);
  } catch (err) {
    if (err !== "Invalid token") {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
    }
  }
};

export const setCurrentLoan = ({ commit, state }, payload) => {
  commit("SET_CURRENT_LOAN", payload);
  if (state.isBroadcast) {
    state.broadcast.postMessage({ type: "setLoan", loan: payload });
  }
};

export const updateSectionAndPageData = ({ commit, state }, payload) => {

  let curPath = payload.replace(/^\/|\/$/g, "");

  if (state.currentLoan != null && state.currentLoan.LoanProgress != null) {

    for (var index = 0; index < state.currentLoan.LoanProgress.Sections.length; index++) 
    {
      let section = state.currentLoan.LoanProgress.Sections[index];

      let pageIndex = section.Pages.findIndex(x => x.Route === curPath);

      if (pageIndex != -1) 
      {
        commit("SET_CURRENT_SECTION_AND_PAGE_DATA", {
          Section: section,
          PageIndex: pageIndex,
          SectionIndex: index
        });
        commit("SET_CURRENT_SECTION", section);
        commit("SET_CURRENT_PAGE", section.Pages[pageIndex]);
        commit("SET_CURRENT_RULE_ID", section.Pages[pageIndex].RuleId);
        commit("SET_NEXT_BUTTONS_CONDITIONS_OVERRIDEN", section.Pages[pageIndex].RuleId === 2 || section.Pages[pageIndex].RuleId === 4);
        return;
      }
    }
  }
  commit("SET_CURRENT_SECTION_AND_PAGE_DATA", {});
  commit("SET_CURRENT_SECTION", {});
  commit("SET_CURRENT_PAGE", {});
  commit("SET_CURRENT_RULE_ID", -1);
  commit("SET_NEXT_BUTTONS_CONDITIONS_OVERRIDEN", false);
};

export const setProgressModel = ({ commit }, payload) => {
  commit("SET_CURRENT_PROGRESS_MODEL", JSON.stringify(payload));
};

export const setAppHistoryLength = ({ commit }, payload) => {
  commit("SET_APP_HISTORY_LENGTH", payload);
};

export const setCurrentProgressModel = ({ state }, payload) => {
  state.broadcast.postMessage({
    type: "setProgressModel",
    progressModel: payload
  });
};

export const getPatchesById = async ({ commit }, payload) => {
  try {
    const pathces = await lynxApi.getLoanPatches(payload);
    commit("SET_LOAN_PATCHES", pathces);
  } catch (err) {
    console.log(err);
  }
};

export const increaseRequestCounter = ({ commit }) => {
  commit("INCREASE_REQUEST_COUNTER");
};

export const decreaseRequestCounter = ({ commit }) => {
  commit("DECREASE_REQUEST_COUNTER");
};

export const setBroadcast = ({ commit }, payload) => {
  commit("SET_BROADCAST", payload);
};

export const applyPatchesFromStream = (
  { commit, dispatch, state },
  payload
) => {
  let currentLoan = JSON.parse(JSON.stringify(state.currentLoan));
  let clonnedAndCleared = objectsHandler.cleanObj(
    objectsHandler.clone(currentLoan)
  );
  patchHelper.applyJsonPatch(clonnedAndCleared, payload);
  commit("SET_CURRENT_LOAN", clonnedAndCleared);
  commit("SET_SERVER_LOAN", JSON.parse(JSON.stringify(clonnedAndCleared)));
  const Borrowers = clonnedAndCleared.Borrowers || null;
  dispatch("setInitialBorrowers", Borrowers);
  commit("SET_INITIAL_LOAN_AND_PROPERTY", clonnedAndCleared);
  if (state.isBroadcast) {
    state.broadcast.postMessage({ type: "setLoan", loan: clonnedAndCleared });
  }
};

export const saveLoanPatches = async ({ commit, dispatch, state }) => {
  try {
    if (state.serverLoan && state.serverLoan.Id) {
      const clonnedAndCleared = objectsHandler.cleanObj(
        objectsHandler.clone(state.currentLoan)
      );
      const loanPatches = patchHelper.createJsonPatch(
        state.serverLoan,
        clonnedAndCleared
      );
      if (loanPatches.length) {
        await lynxApi.saveLoan(loanPatches, state.serverLoan.Id);
        commit("SET_SERVER_LOAN", clonnedAndCleared);
        if (state.isHostedMode) {
          const headerData = await hostedModeHelper.getHostingHeaderData(
            state.currentLoan
          );
          parent.postMessage(headerData, "*");
        }
      }
    }
  } catch (err) {
    if (err !== "Invalid token") {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  }
};


export const sidebarRedirectToUnfinished = ({ state }, payload) => {
  const borrowerId = state.Borrower.Id;
};

export const setFindingsMessages = ({ commit }, payload) => {
  commit("SET_FINDINGS_MESSAGES", payload);
};

export const setUnderwriteMessage1 = ({ commit }, payload) => {
  commit("SET_UNDERWRITE_MESSAGE1", payload);
};

export const setUnderwriteMessage2 = ({ commit }, payload) => {
  commit("SET_UNDERWRITE_MESSAGE2", payload);
};

export const underwrite = async ({ dispatch, state }, getResultOnly) => {
  if (!state.currentLoan.Id) return;
  // dispatch("setMagicSpinner", true);
  try {
    let result = null;
    if (getResultOnly === true) {
      result = await lynxApi.underwritingResult(state.currentLoan.Id);
    } else {
      result = await lynxApi.underwriteLoan(state.currentLoan.Id);
    }
    if (result.StatusId === 1) {
      await dispatch("setUnderwriteMessage1", result.Message1);
      await dispatch("setFindingsMessages", result.FindingsMessages);
      await dispatch("setUnderwriteMessage2", result.Message2);
      if (result.NewLoanStatusId) {
        await dispatch("setLoanStatusId", result.NewLoanStatusId);
      }
      if (router.currentRoute.path !== "/approved") {
        router.push("/approved");
      }
    } else {
      var splitErrorResponse = result.Message1.split("\r\n");
      dispatch("setUnderwriteMessage1", splitErrorResponse[0]);
      if (splitErrorResponse.length >= 2) {
        dispatch("setUnderwriteMessage2", splitErrorResponse[1]);
      } else {
        dispatch("setUnderwriteMessage2", "");
      }
      if (router.currentRoute.path !== "/error") {
        router.push("/error");
      }
      // dispatch("setAlert", {
      //   isAlert: true,
      //   alertType: "error",
      //   alertMessage: result.Message1
      // });
    }
  } catch (err) {
    if (err !== "Invalid token") {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  } finally {
    // dispatch("setMagicSpinner", false);
  }
};

// export const getReportText = async ({ dispatch }, payload) => {
//   try {
//     const report = payload.find(
//       item => item.ReportType === "Text Format Findings"
//     );
//     if (report) {
//       const result = await lynxApi.getFindingsReport(report.Id);
//       dispatch("setFindingsMessages", result);
//       router.push("/approved");
//     }
//   } catch (err) {
//     if (err !== "Invalid token") {
//       dispatch("setAlert", {
//         isAlert: true,
//         alertType: "error",
//         alertMessage: err
//       });
//       throw new Error(err);
//     }
//   }
// };

export const toggleTestingNav = ({ commit }) => {
  commit("TOGGLE_TESTING_NAV");
};

export const setHostedData = ({ commit }, payload) => {
  const { token, loanId, isHostedMode } = payload;
  commit("SET_HOSTED_TOKEN", token);
  commit("SET_HOSTED_MODE", isHostedMode);
  commit("SET_HOSTED_LOAN_ID", loanId);
};

export const setShowNavigation = ({ commit }, payload) => {
  commit("SET_SHOW_NAVIGATION", payload);
};

export const toggleProgressModelActive = ({ commit }) => {
  commit("TOGGLE_PROGRESS_MODEL");
};
