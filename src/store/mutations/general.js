import progressModelHandler from "@/helpers/progressModelHandler";

export const SET_ISONLAY = (state, payload) => {
  state.isOnlay = payload.isOnlay;
  state.onlayComponent = payload.onlayComponent || "";
};

export const SET_ALERT = (state, payload) => {
  const { isAlert, alertType, alertMessage } = payload;
  state.isAlert = isAlert;
  state.alertType = alertType;
  state.alertMessage = alertMessage;
};

export const SET_MAGIC_SPINNER = (state, payload) => {
  state.isMagicSpinner = payload;
};

export const SET_TIMEOUT_ID = (state, payload) => {
  state.currentTimeoutId = payload;
};

export const MODIFY_DATA_ARRAY = (state, payload) => {
  const { prop, elem } = payload;
  let arr = [...state[prop]];
  const position = arr.indexOf(elem);
  if (position === -1) {
    arr.push(elem);
  } else {
    arr.splice(position, 1);
  }
  state[prop] = [...arr];
};

export const SET_SERVER_LOAN = (state, payload) => {
  state.serverLoan = payload;
};

export const SET_CURRENT_LOAN = (state, payload) => {
  state.currentLoan = payload;
  if (state.isBroadcast) {
    state.broadcast.postMessage({ type: "setLoan", loan: state.currentLoan });
  }
};

export const SET_LOAN_PATCHES = (state, payload) => {
  state.loanPatches = payload;
};

export const SET_APP_HISTORY_LENGTH = (state, payload) => {
  state.appHistoryLength = payload;
};

export const INCREASE_REQUEST_COUNTER = state => {
  state.requestCounter++;
};

export const DECREASE_REQUEST_COUNTER = state => {
  state.requestCounter--;
  if (state.requestCounter < 0) {
    state.requestCounter = 0;
  }
};

export const SET_NEXT_BUTTONS_CONDITIONS_OVERRIDEN = (state, payload) => {
  state.nextButtonConditionsOverriden = payload;
};

export const SET_CURRENT_SECTION_AND_PAGE_DATA = (state, payload) => {
  state.currentSectionAndPageData = payload;
};

export const SET_CURRENT_SECTION = (state, payload) => {
  state.currentSection = payload;
};

export const SET_CURRENT_PAGE = (state, payload) => {
  state.currentPage = payload;
};

export const SET_CURRENT_RULE_ID = (state, payload) => {
  state.currentRuleID = payload;
};

export const SET_CURRENT_PROGRESS_MODEL = (state, payload) => {
  state.progressModel = payload;
};

export const SET_BROADCAST = (state, payload) => {
  state.broadcast = payload ? new BroadcastChannel(payload) : null;
  if (state.broadcast) {
    state.broadcast.onmessage = message => {
      if (message.data.type === "setLoan") {
        state.currentLoan = message.data.loan;
      } else if (message.data === "getLoan") {
        state.isBroadcast = true;
        state.broadcast.postMessage({
          type: "setLoan",
          loan: state.currentLoan
        });
      } else if (message.data.type === "setProgressModel") {
        state.isBroadcast = true;
        progressModelHandler.setCurrentProgressModel(
          message.data.progressModel
        );
      } else if (message.data.type === "setProgressModelFromLoanTech") {
        state.progressModel = message.data.progressModel;
      } else if (message.data === "close") {
        state.isBroadcast = false;
        if (state.broadcast) state.broadcast.close();
        state.broadcast = null;
      }
    };
  }
};

export const SET_UNDERWRITE_MESSAGE1 = (state, payload) => {
  state.underwriteMessage1 = payload;
};

export const SET_UNDERWRITE_MESSAGE2 = (state, payload) => {
  state.underwriteMessage2 = payload;
};

export const SET_FINDINGS_MESSAGES = (state, payload) => {
  state.findingsMessages = payload;
};

export const TOGGLE_TESTING_NAV = state => {
  state.isTestingNav = !state.isTestingNav;
};

export const SET_HOSTED_MODE = (state, payload) => {
  state.isHostedMode = payload;
};

export const SET_HOSTED_LOAN_ID = (state, payload) => {
  state.hostedLoanId = payload;
};

export const SET_HOSTED_TOKEN = (state, payload) => {
  state.hostedToken = payload;
};

export const SET_SHOW_NAVIGATION = (state, payload) => {
  state.showNavigation = payload;
};

export const TOGGLE_PROGRESS_MODEL = state => {
  state.progressModelActive = !state.progressModelActive;
};
