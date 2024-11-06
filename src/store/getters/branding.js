export const brandingPath = state =>
  state.hostedBranding ? state.hostedBranding.BrandingPath : "";
export const introSlide = state =>
  state.hostedBranding ? state.hostedBranding.IntroSlide : null;
export const brandingSections = state =>
  state.hostedBranding ? state.hostedBranding.Sections : [];
export const getBrandingSection = (state, getters) => sectionName =>
  getters.brandingSections.find(item => item.Name === sectionName);
export const brandingSectionsCount = state =>
  state.hostedBranding ? state.hostedBranding.SectionsCount : 0;
