import { getStateIndicator } from "@/helpers/states";
import { getCountryShortName } from "@/helpers/countries";

export const SET_INITIAL_BORROWERS = (state, payload) => {
  if (payload) {
    state.Borrowers = [...payload];
  } else {
    state.Borrowers = [{ Id: 1 }];
  }
};

export const SET_CURRENT_BORROWER = (state, payload) => {
  const index = payload !== undefined ? payload : state.currentBorrowerIndex;
  state.Borrower = JSON.parse(JSON.stringify(state.Borrowers[index]));
  state.currentBorrowerIndex = index;
};

export const UPDATE_BORROWER = (state, payload) => {
  if (Array.isArray(payload)) {
    let borrower = {
      ...JSON.parse(JSON.stringify(state.Borrower))
    };
    for (var i = 0; i < payload.length; i++) {
      if (payload[i].prop.indexOf("Phone") !== -1 && payload[i].value) {
        payload[i].value = payload[i].value.replace(/[()]|-| /g, "");
      }
      borrower[payload[i].prop] = payload[i].value;
      if (
        payload[i].prop === "CitizenshipResidencyType" &&
        payload[i].value === "USCitizen"
      ) {
        delete borrower.VisaType;
      }
    }
    state.Borrower = { ...borrower };
  } else {
    let { prop, value } = payload;
    if (prop.indexOf("Phone") !== -1) {
      value = value.replace(/[()]|-| /g, "");
    }
    let borrower = {
      ...JSON.parse(JSON.stringify(state.Borrower)),
      [prop]: value
    };
    if (prop === "CitizenshipResidencyType" && value === "USCitizen") {
      delete borrower.VisaType;
    }
    state.Borrower = { ...borrower };
    state.Borrowers = [
      ...state.Borrowers.map(item =>
        item.Id !== state.Borrower.Id ? item : { ...item, ...state.Borrower }
      )
    ];
  }
};

export const UPDATE_BORROWERS = (state, payload) => {
  state.Borrowers = payload;
  state.Borrower = state.Borrowers.find(item => item.Id === state.Borrower.Id);
};

export const UPDATE_DEPENDENTS = (state, payload) => {
  const { prop, value } = payload;
  let Dependents = state.Borrower.Dependents
    ? JSON.parse(JSON.stringify(state.Borrower.Dependents))
    : {};
  if (prop === "Count" && !value) {
    Dependents = { Count: 0, Ages: [] };
  } else {
    Dependents[prop] = value;
  }
  state.Borrower = { ...state.Borrower, Dependents };
  state.Borrowers = [
    ...state.Borrowers.map(item =>
      item.Id !== state.Borrower.Id ? item : { ...item, ...state.Borrower }
    )
  ];
};

export const UPDATE_MILITARY = (state, payload) => {
  state.Borrower = { ...state.Borrower, MilitaryServices: [...payload] };
  state.Borrowers = [
    ...state.Borrowers.map(item =>
      item.Id !== state.Borrower.Id ? item : { ...item, ...state.Borrower }
    )
  ];
};

export const UPDATE_RESIDENCE = (state, payload) => {
  const { type, value } = payload;
  let Residences = state.Borrower.Residences
    ? Array.from(state.Borrower.Residences)
    : [];
  let residencyType = Residences.find(
    item => item && item.BorrowerResidencyType === type
  );
  if (!residencyType) {
    Residences = [...Residences, { BorrowerResidencyType: type, ...value }];
  } else {
    residencyType = { ...residencyType, ...value };
    Residences = Residences.filter(item => item.BorrowerResidencyType !== type);
    Residences = [
      ...Residences,
      { BorrowerResidencyType: type, ...residencyType }
    ];
  }
  state.Borrower = { ...state.Borrower, Residences };
  if (type === "Current" && value.StateCode) {
    const CommunityPropertyStateResidentIndicator = getStateIndicator(
      value.StateCode,
      "CommunityProperty"
    );
    state.Borrower = {
      ...state.Borrower,
      CommunityPropertyStateResidentIndicator
    };
  }
  state.Borrowers = [
    ...state.Borrowers.map(item =>
      item.Id !== state.Borrower.Id ? item : { ...item, ...state.Borrower }
    )
  ];
};

export const UPDATE_RESIDENCE_PROP = (state, payload) => {
  let { type, prop, value } = payload;
  if (prop === "CountryCode") {
    value = getCountryShortName(value);
  }
  let Residences = state.Borrower.Residences
    ? Array.from(state.Borrower.Residences)
    : [];
  const residencyType = Residences.find(
    item => item && item.BorrowerResidencyType === type
  );
  if (!residencyType) {
    Residences = [
      ...Residences,
      { BorrowerResidencyType: type, [prop]: value }
    ];
  } else {
    Residences = Residences.map(item => {
      if (item.BorrowerResidencyType === type) {
        if (value) {
          item = { ...item, [prop]: value };
        } else {
          delete item[prop];
        }
      }
      return item;
    });
  }
  Residences = Residences.filter(item => Object.keys(item).length > 1);
  state.Borrower = { ...state.Borrower, Residences };
  if (type === "Current" && prop === "StateCode") {
    const CommunityPropertyStateResidentIndicator = getStateIndicator(
      value,
      "CommunityProperty"
    );
    state.Borrower = {
      ...state.Borrower,
      CommunityPropertyStateResidentIndicator
    };
  }
  state.Borrowers = [
    ...state.Borrowers.map(item =>
      item.Id !== state.Borrower.Id ? item : { ...item, ...state.Borrower }
    )
  ];
};

export const SET_INITIAL_MAILING_RESIDENCE = (state, payload) => {
  const type = payload || "Current";
  let Residences = state.Borrower.Residences
    ? Array.from(state.Borrower.Residences)
    : [];
  const mailingResidence = Residences.find(
    item => item && item.BorrowerResidencyType === "Mailing"
  );
  const donorResidence = Residences.find(
    item => item && item.BorrowerResidencyType === type
  );
  if (mailingResidence || !donorResidence) return;
  const mailingKeys = [
    "AddressLineText",
    "AddressUnitIdentifier",
    "CityName",
    "CountryCode",
    "PostalCode",
    "StateCode"
  ];
  let copiedMailingResidence = mailingKeys.reduce((acc, cur) => {
    if (donorResidence[cur]) {
      acc[cur] = donorResidence[cur];
    }
    return { ...acc };
  }, {});
  copiedMailingResidence.BorrowerResidencyType = "Mailing";
  Residences = [...Residences, copiedMailingResidence];
  state.Borrower = { ...state.Borrower, Residences };
  state.Borrowers = [
    ...state.Borrowers.map(item =>
      item.Id !== state.Borrower.Id ? item : { ...item, ...state.Borrower }
    )
  ];
};

export const REMOVE_RESIDENCE = (state, payload) => {
  let Residences = state.Borrower.Residences
    ? Array.from(state.Borrower.Residences)
    : [];
  if (Residences.length) {
    Residences = Residences.filter(
      item => item.BorrowerResidencyType !== payload
    );
    state.Borrower = { ...state.Borrower, Residences };
    state.Borrowers = [
      ...state.Borrowers.map(item =>
        item.Id !== state.Borrower.Id ? item : { ...item, ...state.Borrower }
      )
    ];
  }
};

export const SET_INVITATIONS = (state, payload) => {
  state.invitations = payload;
};

export const SET_REALESTATE_OWNED = (state, payload) => {
  state.realEstateOwned = payload;
};

export const SET_REALESTATE_OWNED_EXPENSES = (state, payload) => {
  state.realEstateOwnedExpenses = payload;
};

export const SET_REALESTATE_OWNED_MORTGAGE = (state, payload) => {
  state.realEstateOwnedMortgage = payload;
};
