<template>
  <div class="d-contents">
    <div class="text-subtitle-1 mb-3 font-weight-bold" v-if="editable">
      If you have any mortgages, car payments, credit cards, or installment
      loans not listed, please add them using the Add New + button below.
    </div>
    <v-data-table
      :class="{
        'content-table': true,
        emptyTable: liabilities.length === 0,
        doubleActions: editable
      }"
      :headers="computedHeaders"
      :items="liabilities"
      disable-sort="disable-sort"
      disable-pagination="disable-pagination"
      hide-default-footer="hide-default-footer"
      :mobile-breakpoint="0"
    >
      <template v-slot:item.FullName="{ item }"
        ><span class="mw-220">{{ item.FullName }}</span></template
      >
      <template v-slot:item.LiabilityUnpaidBalanceAmount="{ item }"
        ><span
          >${{
            getFormattedValue(item.LiabilityUnpaidBalanceAmount) || 0
          }}</span
        ></template
      >
      <template v-slot:item.LiabilityMonthlyPaymentAmount="{ item }"
        ><span
          >${{
            getFormattedValue(item.LiabilityMonthlyPaymentAmount) || 0
          }}</span
        ></template
      >
      <template v-slot:item.LiabilityPayoffStatusIndicator="{ item }">
        <v-simple-checkbox
          :value="item.LiabilityPayoffStatusIndicator"
          color="primary"
          @input="setPayoff(item)"
        ></v-simple-checkbox>
      </template>
      <template v-slot:item.edit="{ item }">
        <div class="d-flex actionsContainer">
          <v-btn
            class="editIcon"
            icon="icon"
            small="small"
            @click="editItem(item)"
          >
            <inline-svg :src="editIcon"></inline-svg>
          </v-btn>
          <v-btn
            class="deleteIcon"
            icon="icon"
            small="small"
            @click="setRemoveIndex(item)"
          >
            <inline-svg :src="deleteIcon"></inline-svg>
          </v-btn>
        </div>
      </template>
      <template v-slot:body.append>
        <tr class="appended-row">
          <td class="addItemBtnContainer">
            <v-btn
              class="addItemBtn"
              dense="dense"
              plain="plain"
              elevation="0"
              @click="addLiability"
              v-if="editable"
            >
              <v-icon small="small">mdi-plus</v-icon
              ><span class="addBtnText">Add Other Liabilty</span>
            </v-btn>
          </td>
          <td></td>
          <td>Totals:</td>
          <td>${{ getFormattedValue(totalPayment) }}</td>
          <td>${{ getFormattedValue(totalUnpaid) }}</td>
          <td v-if="editable"></td>
        </tr>
      </template>
    </v-data-table>
    <div
      class="body-2 mt-5 pt-3 infoText"
      style="max-width:unset"
      v-if="editable"
    >
      <span
        >If you would like to provide us any additional information about a
        liability, please click the pencil </span
      ><span>
        <inline-svg :src="editIcon" class="tableInfoIcon"></inline-svg></span
      ><span>link.</span>
    </div>
    <v-dialog v-model="isDialog" max-width="290">
      <v-card>
        <v-card-title class="d-flex justify-center mb-4 text-black--text"
          >Are you sure?
        </v-card-title>
        <v-card-text>
          <v-row class="justify-space-around">
            <Button
              value="Yes"
              customClass="button-yes"
              width="120px"
              @clicked="removeLiability"
            ></Button>
            <Button
              value="No"
              width="120px"
              customClass="button-no"
              isOutlined="isOutlined"
              @clicked="isDialog = false"
            ></Button>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";
import debtToIncomeAndhousingRatios from "@/mixins/debtToIncomeAndhousingRatios.js";

export default {
  mixins: [currencyFormat, debtToIncomeAndhousingRatios],
  props: {
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Account Type",
          value: "LiabilityType",
          class: "primary--text"
        },
        { text: "Company Name", value: "FullName", class: "primary--text" },
        {
          text: "Account Number",
          value: "LiabilityAccountIdentifier",
          class: "primary--text"
        },
        {
          text: "Monthly Payment",
          value: "LiabilityMonthlyPaymentAmount",
          class: "primary--text"
        },
        {
          text: "Unpaid Balance",
          value: "LiabilityUnpaidBalanceAmount",
          class: "primary--text"
        },
        // {
        //   text: "Payoff prior to closing",
        //   value: "LiabilityPayoffStatusIndicator",
        //   align: "center",
        //   class: "primary--text"
        // },
        { text: "Action", value: "edit", class: "primary--text" }
      ],
      isDialog: false,
      removeIndex: -1,
      editIcon: require("@/assets/images/edit.svg"),
      deleteIcon: require("@/assets/images/delete.svg")
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "setEditingLiability", "updateBorrower"]),
    editItem(liability) {
      const index = this.liabilities.indexOf(liability);
      this.setEditingLiability({ liability, index });
      this.toggleIsOnlay({ onlayComponent: "editLiability", isOnlay: true });
    },
    setRemoveIndex(liability) {
      this.removeIndex = this.liabilities.indexOf(liability);
      this.isDialog = true;
    },
    removeLiability() {
      const updated = this.liabilities.filter(
        (item, index) => index !== this.removeIndex
      );
      this.updateBorrower({ prop: "Liabilities", value: updated });
      this.isDialog = false;
    },
    addLiability() {
      this.toggleIsOnlay({ onlayComponent: "addLiability", isOnlay: true });
    },
    setPayoff(liability) {
      const index = this.liabilities.indexOf(liability);
      const Liabilities = this.liabilities.map((item, i) =>
        i !== index
          ? item
          : {
              ...item,
              LiabilityPayoffStatusIndicator: !item.LiabilityPayoffStatusIndicator
            }
      );
      this.updateBorrower({ prop: "Liabilities", value: Liabilities });
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    liabilities() {
      return this.borrower && this.borrower.Liabilities
        ? this.borrower.Liabilities
        : [];
    },
    indexes() {
      return this.liabilities.length
        ? this.liabilities.map(item => item.FullName)
        : [];
    },
    totalUnpaid() {
      if (this.liabilities.length) {
        return this.liabilities.reduce(
          (acc, cur) =>
            acc +
            (!isNaN(cur.LiabilityUnpaidBalanceAmount)
              ? +cur.LiabilityUnpaidBalanceAmount
              : 0),
          0
        );
      }
      return 0;
    },
    totalPayment() {
      if (this.liabilities.length) {
        return this.liabilities.reduce(
          (acc, cur) =>
            acc +
            (!isNaN(cur.LiabilityMonthlyPaymentAmount)
              ? +cur.LiabilityMonthlyPaymentAmount
              : 0),
          0
        );
      }
      return 0;
    },
    computedHeaders() {
      return this.editable
        ? this.headers
        : this.headers.filter(x => x.value != "edit");
    }
  },
  watch: {
    isDialog: function(val) {
      if (!val) {
        this.removeIndex = -1;
      }
    },
    liabilities: {
      deep: true,
      handler() {
        this.setDebtToIncomeAndHousingRatios();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.infoText {
  color: $gray3;
}

.editIcon {
  :deep(path) {
    fill: $icon-color;
  }
}
.tableInfoIcon {
  :deep(path) {
    fill: $icon-color;
  }
}
</style>
