export default {
  getErrorMessage({ response }) {
    if (response.data.Data != null) {
      if (response.data.Data.Message != null) {
        return response.data.Data.Message;
      }
      return response.data.Data;
    }
    return "Unknown error";
  },
  getCorrectResponse(response, resolve, reject) {
    if (response.status === 400) {
      reject(new Error("Bad request. Please check all parameters for request"));
    } else if (response.status === 404) {
      const message =
        response.data && response.data.Data
          ? response.data.Data
          : "Loan with such id not found";
      reject(new Error(message));
    } else if (response.status === 401) {
      reject("Invalid token");
    } else {
      resolve(response.data ? response.data.Data : response);
    }
  }
};
