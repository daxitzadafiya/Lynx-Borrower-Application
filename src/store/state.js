import { generalState } from "./states/general";
import { borrowersState } from "./states/borrowers";
import { loanPropertyState } from "./states/loanProperty";
import { creditState } from "./states/credit";
import { employmentState } from "./states/employment";
import { realEstateState } from "./states/realEstate";
import { brandingState } from "./states/branding";
import { usStates } from "./states/usStates";
import { documentState } from "./states/document";


export default {
  ...generalState,
  ...borrowersState,
  ...loanPropertyState,
  ...creditState,
  ...employmentState,
  ...realEstateState,
  ...brandingState,
  ...usStates,
  ...documentState
};
