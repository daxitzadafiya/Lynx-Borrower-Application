import store from "@/store";

export default {
  applicationId: 2, 
  baseApi: "https://staging-api.softwarelynx.com/LynxWebApi",
  //baseApi: "http://localhost:64848",
  streamingServerPath: "https://staging-api.softwarelynx.com/LynxWebSync/api/",
  brandingUrl: "https://development-borrowerapp.mymortgagelive.com/branding",
  hostedBrandingDataUrl: "https://staging-api.softwarelynx.com/MyLoanBidWebApi/bidding/branding",
  autocompleteSearchDelay: 300,
  autocompleteSearchTextMinimumLength: 3,
  mapZoomLevel: 17,
  versionNumber: "4.0",
  buildApiRequestHeaders(contentType) {
    if (
      contentType === null ||
      contentType === undefined ||
      contentType === ""
    ) {
      contentType = "application/json;charset=utf-8";
    }
    let headers = {
      "Content-type": contentType
    };
    const token = store.getters.getToken;
    if (token) {
      headers.Authorization = "bearer " + token;
    }
    return headers;
  }
};
