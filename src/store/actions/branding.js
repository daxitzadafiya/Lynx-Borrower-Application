export const setHostedBranding = ({ commit }, payload) => {
  if (self != top) {
    commit("SET_HOSTED_BRANDING", payload);
  }
};
