import lynxApi from "@/api/lynxApi";

export const createToken = async ({ dispatch }, payload) => {
    try {
      return await lynxApi.createToken(payload);
    } catch (err) {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  };

export const uploadDocument = async ({ dispatch }, payload) => {
    try {
      return await lynxApi.uploadDocument(payload);
    } catch (err) {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  };

  export const getDocuments = async ({ dispatch }, payload) => {
    try {
      return await lynxApi.getDocuments(payload);
    } catch (err) {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  };

  export const getFile = async ({ dispatch }, payload) => {
    try {
      return await lynxApi.getFile(payload);
    } catch (err) {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  };

  export const deleteDocument = async ({ dispatch }, payload) => {
    try {
      return await lynxApi.deleteDocument(payload);
    } catch (err) {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  };

  export const getDocumentTypes = async ({ commit, dispatch }, payload) => {
    try {
      let result = await lynxApi.getDocumentTypes(payload);
      commit("SET_DOCUMENT_TYPES", result);
    } catch (err) {
      dispatch("setAlert", {
        isAlert: true,
        alertType: "error",
        alertMessage: err
      });
      throw new Error(err);
    }
  };

  