export const getIsOnlay = state => state.isOnlay;
export const getOnlayComponent = state => state.onlayComponent;
export const getRequestCounter = state => state.requestCounter;
export const getIsAlert = state => state.isAlert;
export const getAlertType = state => state.alertType;
export const getAlertMessage = state => state.alertMessage;
export const getServerLoan = state => state.serverLoan;
export const getCurrentLoan = state => state.currentLoan;
export const getCurrentLoanPatches = state => state.loanPatches;
export const getIsBroadcast = state => state.isBroadcast;
export const broadcastChannel = state => state.broadcast;
export const getIsMagicSpinner = state => state.isMagicSpinner;
export const getCurrentProgressModel = state => state.progressModel;
export const getUnderwriteMessage1 = state => state.underwriteMessage1;
export const getUnderwriteMessage2 = state => state.underwriteMessage2;
export const getFindingsMessages = state => state.findingsMessages;
export const getIsTestingNav = state => state.isTestingNav;
export const getIsHostedMode = state => state.isHostedMode;
export const getHostedLoanId = state => state.hostedLoanId;
export const getShowNavigation = state => state.showNavigation;
export const getIsNextButtonConditionsOverriden = state =>
  state.nextButtonConditionsOverriden;
export const getCurrentSectionAndPageData = state =>
  state.currentSectionAndPageData;
export const getCurrentSection = state => state.currentSection;
export const getCurrentPage = (state) => {
  console.log("state",state.currentPage);
  return state.currentPage;
}
export const getCurrentRuleID = state => state.currentRuleID;
export const getAppHistoryLength = state => state.appHistoryLength;
export const getProgressModelActive = state => state.progressModelActive;
