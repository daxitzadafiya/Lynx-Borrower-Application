<template>
  <div class="accounts-data">
    <Assets></Assets>
    <SellerCredits></SellerCredits>
    <Deposits></Deposits>
    <Gifts></Gifts>
    <Grants></Grants>
    <PurchaseCredits></PurchaseCredits>
    <PropertyOwn></PropertyOwn>
    <div class="d-flex w-100 justify-end mt-5 pt-3">
      <NavigationButtons 
        NextButtonText="Go to next section"
       :HideProgresssAndPrevious="true"
      ></NavigationButtons>
    </div>
  </div>
</template>

<script>
import Assets from "./summaries/Assets";
import SellerCredits from "./summaries/SellerCredits";
import Deposits from "./summaries/Deposits";
import Gifts from "./summaries/Gifts";
import Grants from "./summaries/Grants";
import PurchaseCredits from "./summaries/PurchaseCredits";
import PropertyOwn from "../real-estate/summaries/PropertyOwn";
import loanPatch from "@/mixins/loanPatch.js";
import Button from "@/components/buttons/Button";

export default {
  mixins: [loanPatch],
  components: {
    Assets,
    SellerCredits,
    Deposits,
    Gifts,
    Grants,
    PurchaseCredits,
    PropertyOwn,
    Button
  }
};
</script>