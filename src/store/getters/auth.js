export const getCurrentUser = state => state.currentUser;
export const getToken = state => {
  if (state.isHostedMode) {
    return state.hostedToken;
  }
  return state.currentUser ? state.currentUser.token : "";
};
