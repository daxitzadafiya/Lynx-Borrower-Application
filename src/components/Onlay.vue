<template lang="pug">
    .onlay-wrapper
        Invitation(v-if="onlayComponent==='borrower'")
        ExpectedRentalIncome(v-if="onlayComponent==='rentalIncome'")
        EditLiabilityDialog(v-if="onlayComponent==='editLiability'")
        AddLiabilityDialog(v-if="onlayComponent==='addLiability'")
        EditDerogatoryDialog(v-if="onlayComponent==='editDerogatoryItem'")
        ExpensesDialog(v-if="onlayComponent==='expenses'")
        MortgageLoansDialog(v-if="onlayComponent==='mortgage-loan'")
        OrderPopup(v-if="onlayComponent==='creditOrder'")
        Profile(v-if="onlayComponent==='profile'")
        ChangePassword(v-if="onlayComponent==='changePassword'")
</template>

<script>
import Invitation from "./borrowers/Invitation";
import ExpectedRentalIncome from "./loan-property/ExpectedRentalIncome";
import EditLiabilityDialog from "./credit/liabilities/EditLiabilityDialog";
import AddLiabilityDialog from "./credit/liabilities/AddLiabilityDialog";
import EditDerogatoryDialog from "./credit/derogatoryItems/EditDerogatoryDialog";
import OrderPopup from "./credit/OrderPopup";
import ExpensesDialog from "./real-estate/ExpensesDialog";
import MortgageLoansDialog from "./real-estate/MortgageLoansDialog";
import Profile from "./user-account/Profile";
import ChangePassword from "./user-account/ChangePassword";
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["toggleIsOnlay"])
  },
  computed: {
    ...mapGetters({
      onlayComponent: "getOnlayComponent"
    })
  },
  components: {
    Invitation,
    ExpectedRentalIncome,
    EditLiabilityDialog,
    AddLiabilityDialog,
    OrderPopup,
    ExpensesDialog,
    MortgageLoansDialog,
    Profile,
    ChangePassword,
    EditDerogatoryDialog
  }
};
</script>

<style lang="scss" scoped>
.onlay-wrapper {
  display: flex;
  justify-content: center;
  max-width: 100%;
  max-height: 90vh;
  overflow: hidden;
  margin: auto;
}
</style>
