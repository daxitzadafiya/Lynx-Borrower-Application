import lynxApi from "@/api/lynxApi";
import objectsHandler from "@/helpers/objectsHandler";
import progressModelHandler from "@/helpers/progressModelHandler";
import router from "@/router";
import { BorrowerSections } from "@/models/borrowerSections";

export const setInitialBorrowers = ({ commit }, payload) => {
  commit("SET_INITIAL_BORROWERS", payload);
  commit("SET_CURRENT_BORROWER", 0);
};

export const setCurrentBorrower = ({ commit, dispatch, state }, payload) => {
  commit("SET_CURRENT_BORROWER", payload);
  dispatch("updateCurrentLoan");
  const progressModel = localStorage.getItem("progressModel");
  if (progressModel) {
    const routeName = progressModelHandler.getRouteName(
      JSON.parse(progressModel),
      state.Borrower.Id
    );
    if (routeName && routeName !== router.history.current.name)
      router.push({ name: routeName });
  }
};

export const updateBorrower = ({ commit, dispatch }, payload) => {
  commit("UPDATE_BORROWER", payload);
  dispatch("updateCurrentLoan");
};

export const updateBorrowers = ({ commit, dispatch }, payload) => {
  commit("UPDATE_BORROWERS", payload);
  dispatch("updateCurrentLoan");
};

export const updateDependents = ({ commit, dispatch }, payload) => {
  commit("UPDATE_DEPENDENTS", payload);
  dispatch("updateCurrentLoan");
};

export const updateMilitary = ({ commit, dispatch }, payload) => {
  commit("UPDATE_MILITARY", payload);
  dispatch("updateCurrentLoan");
};

export const updateResidence = ({ commit, dispatch }, payload) => {
  console.log(payload)
  commit("UPDATE_RESIDENCE", payload);
  dispatch("updateCurrentLoan");
};

export const updateResidenceProp = ({ commit, dispatch }, payload) => {
  commit("UPDATE_RESIDENCE_PROP", payload);
  dispatch("updateCurrentLoan");
};

export const setInitialMailingResidence = ({ commit, dispatch }, payload) => {
  commit("SET_INITIAL_MAILING_RESIDENCE", payload);
  dispatch("updateCurrentLoan");
};

export const removeResidence = ({ commit, dispatch }, payload) => {
  commit("REMOVE_RESIDENCE", payload);
  dispatch("updateCurrentLoan");
};

export const updateCurrentLoan = ({ commit, state }) => {
  if (!state.currentLoan) return;
  const currentLoan = { ...state.currentLoan, Borrowers: state.Borrowers };
  commit(
    "SET_CURRENT_LOAN",
    objectsHandler.cleanObj(objectsHandler.clone(currentLoan))
  );
  if (state.isBroadcast) {
    commit("SET_BROADCAST", 111);
    state.broadcast.postMessage({ type: "setLoan", loan: state.currentLoan });
  }
};

export const setInvitations = ({ commit }, payload) => {
  commit("SET_INVITATIONS", payload);
};

export const getInvitations = async ({ dispatch, state }) => {
  try {
    if (!state.currentLoan || !state.currentLoan.Id) return;
    const loanId = state.currentLoan.Id;
    if (loanId) {
      const result = await lynxApi.getLoanInvitations(loanId);
      if (result !== "Not found") {
        dispatch(
          "setInvitations",
          result.filter(x => x.Status === "0")
        );
      } else {
        dispatch("setInvitations", []);
      }
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

export const resendInvitation = async ({ dispatch, state }, payload) => {
  try {
    const { Invitee, Message, InvitationToken } = payload;
    const UserId = state.currentUser.userId;
    const LoanId = state.serverLoan.Id;
    if (state.serverLoan.Id) {
      await lynxApi.resendLoanInvitation({
        LoanId,
        Message,
        Inviter: { UserId },
        Invitee,
        InvitationToken
      });
      dispatch("setAlert", {
        isAlert: true,
        alertType: "success",
        alertMessage: "Invitation has been resent"
      });
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

export const cancelInvitation = async ({ dispatch, state }, payload) => {
  try {
    if (state.serverLoan.Id) {
      await lynxApi.cancelLoanInvitation(payload);
      await dispatch("getInvitations");
      dispatch("setAlert", {
        isAlert: true,
        alertType: "success",
        alertMessage: `Invitation cancelled`
      });
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

export const inviteBorrower = async ({ dispatch, state }, payload) => {
  try {
    const { Invitee, Message } = payload;
    const UserId = state.currentUser.userId;
    const LoanId = state.serverLoan.Id;
    if (UserId && LoanId) {
      const result = await lynxApi.sendInvitation({
        LoanId,
        Message,
        Inviter: { UserId },
        Invitee
      });
      const {
        FirstName,
        LastName,
        Email,
        Phone: MobilePhoneNumber
      } = result.Invitee;
      const InvitationToken = result.InvitationToken;
      const Id = state.Borrowers.length + 1;
      let invitedBorrower = {
        Id,
        FirstName,
        LastName,
        Email,
        MobilePhoneNumber,
        InvitationToken
      };
      if (Invitee.BorrowerType === "Spouse") {
        invitedBorrower.CoBorrower = true;
        invitedBorrower.LinkedBorrowerId = state.Borrower.Id;
        dispatch("updateBorrower", { prop: "LinkedBorrowerId", value: Id });
      }
      const borrowers = [...state.Borrowers, invitedBorrower];
      dispatch("updateBorrowers", borrowers);
      dispatch("setCurrentLoan", { ...state.currentLoan, BorrowerCount: Id });
      await dispatch("saveLoanPatches");
      let progressModel = localStorage.getItem("progressModel");
      if (progressModel) {
        // const { Template } = await lynxApi.getProgressModelBorrowerTemplate();
        progressModel = JSON.parse(progressModel);
        progressModel.Borrowers.push({ Id, BorrowerSections });
        // progressModel.Borrowers.push({ ...Template, Id });
        localStorage.setItem("progressModel", JSON.stringify(progressModel));
        // await lynxApi.saveProgressModel(state.currentLoan.Id, progressModel);
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

export const setRealEstateOwned = ({ commit }, payload) => {
  commit("SET_REALESTATE_OWNED", payload);
};

export const setRealEstateOwnedExpenses = ({ commit }, payload) => {
  commit("SET_REALESTATE_OWNED_EXPENSES", payload);
};

export const setRealEstateOwnedMortgage = ({ commit }, payload) => {
  commit("SET_REALESTATE_OWNED_MORTGAGE", payload);
};
