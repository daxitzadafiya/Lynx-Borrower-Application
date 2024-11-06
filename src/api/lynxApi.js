import axios from "axios";
import config from "@/configs";
import store from "@/store";
import responseHandler from "@/helpers/responseHandler";

export default {
  async authorize(authData) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${config.baseApi}/auth/authenticate`, authData)
        .then(response => {
          if (response.status === 401)
            reject("Wrong email/username or password");
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject("Server Connection Timed Out, Please try again");
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async signUp(signupData) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${config.baseApi}/auth/signup`, signupData)
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async signOut() {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/auth/logout`
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async recoverPassword(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/auth/recover-password`,
        data
      })
        .then(response => {
          if (response.status === 401) {
            reject("No such user");
          }
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async resetPassword(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/auth/reset-password`,
        data
      })
        .then(response => {
          if (response.status === 401) {
            reject("No such user");
          }
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async saveLoan(loanPatches, id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "PATCH",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/${id}/patch`,
        data: JSON.stringify(loanPatches)
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          console.log(error);
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getLoan(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/${id}`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getLoanPatches(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/${id}/patches`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getLoanInvitations(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/${id}/invitations`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          if (response.status === 404) {
            resolve("Not found");
          } else {
            responseHandler.getCorrectResponse(response, resolve, reject);
          }
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async sendInvitation(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/invitation/add`,
        data
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async resendLoanInvitation(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/invitation/resend`,
        data
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async cancelLoanInvitation(invitationToken) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/invitation/${invitationToken}/cancel`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getLoanCreditOrders(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/credit/loan/${id}/orders`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          if (response.status === 400) {
            reject(
              new Error("Bad request. Please check all parameters for request")
            );
          } else if (response.status === 404) {
            reject(new Error(response.data.Data));
          } else {
            resolve(response.data.Data);
          }
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getLoanCreditOrderReportDetails(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/credit/${id}/report-details`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getFullCreditReport(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        responseType: "arraybuffer",
        headers: {
          ...config.buildApiRequestHeaders("application/pdf"),
          Accept: "application/pdf"
        },
        url: `${config.baseApi}/credit/${id}/report`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          if (response.status === 400) {
            reject(
              new Error("Bad request. Please check all parameters for request")
            );
          } else if (response.status === 404) {
            reject(new Error(response.data));
          } else {
            resolve(response.data);
          }
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async createCreditOrder(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/credit/order`,
        data
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async underwriteLoan(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/${data}/underwrite`
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async underwritingResult(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/${data}/underwriting-result`
      })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getFindingsReport(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/underwriting/findings-report/${id}`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getAllUsStates() {
     return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/loan/states/details`,
        validateStatus: statusCode => {
          return !!(
            statusCode === 400 ||
            statusCode === 404 ||
            statusCode === 200
          );
        }
      })
      .then(response => {
                responseHandler.getCorrectResponse(response, resolve, reject);
              })
              .catch(error => {
                reject(responseHandler.getErrorMessage(error));
              });
    })
  },
  async createToken(loanId){
    return new Promise((resolve, reject) => {
      axios
        .post(`${config.baseApi}/document/createToken?loanId=`+loanId,{},{
        headers: config.buildApiRequestHeaders(),
        })
        .then(response => {
          if (response.status === 401)
            reject("Unauthorized. Error creating token");
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getDocuments(data){
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.baseApi}/document/getDocuments?loanId=${data.loanId}&lastDocumentId=${data.lastDocumentId==null?'':data.lastDocumentId}`,
        {
        headers: config.buildApiRequestHeaders(),
        })
        .then(response => {
          if (response.status === 401)
            reject("Unauthorized. Error fetching documents.");
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getFile(documentId){
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.baseApi}/document/getFile?documentId=`+documentId,
        {
        headers: config.buildApiRequestHeaders(),
        responseType: 'arraybuffer',
        })
        .then(response => {
          if (response.status === 401)
            reject("Unauthorized. Error fetching documents.");
          resolve(new Blob([response.data],{type: response.headers["content-type"]}))
        })
        .catch(error => {
          console.log(error)
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async getDocumentTypes(){
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.baseApi}/document/getDocumentTypes`,{
          headers: config.buildApiRequestHeaders(),
        }
        )
        .then(response => {
          if (response.status === 401)
            reject("Unauthorized. Error fetching documents.");
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async deleteDocument(Id){
    return new Promise((resolve, reject) => {
      axios
        .delete(`${config.baseApi}/document/deleteDocument?Id=`+Id,
        {
        headers: config.buildApiRequestHeaders(),
        })
        .then(response => {
          if (response.status === 401)
            reject("Unauthorized. Error deleting documents.");
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async uploadDocument(req) {
    let promise = new Promise((resolve, reject) => {
      axios
        .post(`${config.baseApi}/document/${req.loanId==null?`uploadDocumentsUsingToken?tokenId=${req.tokenId}`:`uploadDocuments?loanId=${req.loanId}`}`, req.data,
        {
          contentType: false,
          cache: false,
          processData: false,
          onUploadProgress: req.progressEvent,
          headers: config.buildApiRequestHeaders(),
        })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
    return promise;
  },
  async searchText(searchText) {
    let promise = new Promise((resolve, reject) => {
      axios
        .get(`${config.baseApi}/financial-institution/search?searchText=${searchText}`, {
          cache: false,
            headers: config.buildApiRequestHeaders()
        })
        .then(response => {
          responseHandler.getCorrectResponse(response, resolve, reject);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
    return promise;
  },
  registerWebSync(
    streamingServer,
    channel,
    onSubscriptionSuccess,
    onSubscriptionFailure,
    onReceive,
    onConnectionFailure,
    onStreamFailure
  ) {
    const streamingClient = new fm.websync.client(streamingServer);
    streamingClient.connect({
      meta: {
        token: store.state.isHostedMode
          ? store.state.hostedToken
          : store.state.currentUser.token
      },
      onSuccess: function() {
        streamingClient.subscribe({
          channel: channel,
          onSuccess: onSubscriptionSuccess,
          onFailure: onSubscriptionFailure,
          onReceive: onReceive
        });
      },
      onFailure: onConnectionFailure,
      onStreamFailure: onStreamFailure
    });

    return streamingClient;
  },
  disconnectStream(
    streamingClient,
    onDisconnectComplete,
    onDisconnectFailure,
    onDisconnectSuccess
  ) {
    streamingClient.disconnect({
      onComplete: onDisconnectComplete,
      onFailure: onDisconnectFailure,
      onSuccess: onDisconnectSuccess
    });
  },
  async getLinkToken(loanId) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/assets/${loanId}/link-token`
      })
        .then(response => {
          resolve(response.data.Data);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  },
  async addLinkItem(loanId, linkToken, publicToken) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: config.buildApiRequestHeaders(),
        url: `${config.baseApi}/assets/${loanId}/link-item-add/${linkToken}/${publicToken}`
      })
        .then(response => {
          resolve(response.data.Data);
        })
        .catch(error => {
          reject(responseHandler.getErrorMessage(error));
        });
    });
  }
};
