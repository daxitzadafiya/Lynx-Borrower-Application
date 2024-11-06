<template>
  <v-form class="fast-fail form-outer-container">
    <v-row
      class="form-container deleteAbleItem"
      v-for="(credit, index) in earnstMoneyCredits"
      :key="index"
    >
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="removeItem(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input
        defaultComponent="v-select"
        :smVal="12"
        outlined="outlined"
        dense="dense"
        attach="attach"
        :value="credit.SourceAccount"
        :menu-props="{ bottom: true, offsetY: true }"
        @change="account => setCreditProp('SourceAccount', account, index)"
        :items="accountOptions"
        inputTitle="Choose Account"
      />
      <v-col class="itemContainer" sm="12" md="6" lg="4">
        <v-radio-group
          class="radioGroup isHorizontal mt-0 mt-md-5 pt-0 pt-md-4"
          row
          hide-details
          :value="credit.Status"
          @change="
            val => {
              setCreditProp('Status', val, index);
            }
          "
        >
          <v-radio label="To Be Made" :value="'ToBeMade'"></v-radio>
          <v-radio label="Made" :value="'Made'"></v-radio>
        </v-radio-group>
      </v-col>
      <Input
        :smVal="12"
        :mdVal="6"
        :lgVal="4"
        prefix="$"
        inputTitle="Deposit Amount"
        :value="getFormattedValue(credit.PurchaseCreditAmount) || ''"
        @input="
          e =>
            setCreditProp('PurchaseCreditAmount', +e.replace(/,/g, ''), index)
        "
        @keypress="e => isOnlyNum(e, true)"
        :rules="[checkCreditAmountValidation(credit)]"
      />
      <v-col
        class="itemContainer"
        sm="12"
        md="6"
        lg="4"
        v-if="credit.Status === 'Made'"
      >
        <v-radio-group
          class="radioGroup isHorizontal mt-0 mt-lg-5 pt-0 pt-lg-4"
          row
          hide-details
          :value="credit.Cleared"
          @change="
            val => {
              setCreditProp('Cleared', val, index);
            }
          "
        >
          <v-radio label="Cleared" :value="true"></v-radio>
          <v-radio label="Not Cleared" :value="false"></v-radio>
        </v-radio-group>
      </v-col>
      <Input
        auto-grow="auto-grow"
        outlined="outlined"
        v-if="credit.SourceAccount === 'Other'"
        rows="2"
        :smVal="12"
        defaultComponent="v-textarea"
        inputTitle="Please describe where the funds for the deposit will come from"
        :value="credit.Explanation"
        @input="e => setCreditProp('Explanation', e, index)"
        placeholder=""
      />
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional = null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input
        defaultComponent="v-select"
        :smVal="12"
        attach="attach"
        :value="additional.PurchaseCreditType"
        @change="type => setAdditionalType(type)"
        :items="accountOptions"
        inputTitle="Choose Account"
        :menu-props="{ bottom: true, offsetY: true }"
      />
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="6">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addAccount"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add additional deposit</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="6" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
    <v-dialog v-model="isFixDialog" max-width="290">
      <v-card>
        <v-card-title class="d-flex justify-center mb-4 text-black--text"
          >Please fix the form error(s).</v-card-title
        >
        <v-card-text>
          <v-row class="justify-space-around">
            <Button
              value="OK"
              customClass="button-yes"
              width="120px"
              :isOutlined="true"
              @clicked="isFixDialog = false"
            ></Button>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
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
              @clicked="removeCredit"
            ></Button>
            <Button
              value="No"
              customClass="button-no"
              width="120px"
              :isOutlined="true"
              @clicked="isDialog = false"
            ></Button>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      additional: {},
      isDialog: false,
      isFixDialog: false,
      removeIndex: -1
    };
  },
  methods: {
    ...mapActions(["setPurchaseCredits"]),
    removeCredit() {
      const credits = this.earnstMoneyCredits.filter(
        (item, i) => i !== this.removeIndex
      );
      this.updateCredits(credits);
      this.isDialog = false;
      this.removeIndex = -1;
      this.validateForm();
    },
    removeItem(index) {
      this.removeIndex = index;
      this.isDialog = true;
    },
    addAccount() {
      this.additional = { AssetType: "" };
    },
    setAdditionalType(account) {
      if (!account) return;
      const credits = [
        ...this.earnstMoneyCredits,
        {
          PurchaseCreditType: "EarnestMoney",
          SourceAccount: account
        }
      ];
      this.updateCredits(credits);
      this.additional = null;
      this.validateForm();
    },
    setCreditProp(prop, value, index) {
      const credits = this.earnstMoneyCredits.map((item, i) =>
        index !== i ? item : { ...item, [prop]: value }
      );
      this.updateCredits(credits);
      this.validateForm();
    },
    updateCredits(credits) {
      const filtered = this.PurchaseCredits.filter(
        ({ PurchaseCreditType }) => PurchaseCreditType !== "EarnestMoney"
      );
      this.setPurchaseCredits([...filtered, ...credits]);
    },
    getDataValidation() {
      if (!this.earnstMoneyCredits.length) {
        return true;
      }
      for (let i = 0; i < this.earnstMoneyCredits.length; i++) {
        const credit = this.earnstMoneyCredits[i];
        if (
          this.checkCreditAmountValidation(credit) !== true ||
          !this.validateStatus(credit) ||
          credit.PurchaseCreditAmount <= 0 ||
          (credit.SourceAccount === "Other" && !credit.Explanation)
        ) {
          return true;
        }
      }
      return false;
    },
    checkCreditAmountValidation(val) {
      let assetIndex = this.accountOptions.findIndex(
        x => x === val.SourceAccount
      );
      if (val.SourceAccount !== "Other" && assetIndex !== -1) {
        if (
          this.Assets[assetIndex].AssetCashOrMarketValueAmount <
          val.PurchaseCreditAmount
        ) {
          return "Deposit Amount should not exceed Selected Account Balance";
        }
      }
      return true;
    },
    validateStatus(credit) {
      if (
        credit.Status === "Made" &&
        credit.Cleared !== null &&
        credit.Cleared !== undefined
      ) {
        return true;
      } else if (credit.Status === "ToBeMade") {
        return true;
      }
    },
    validateForm() {
      const isValid = this.getDataValidation();
      this.$emit("validation-status", isValid);
    }
  },
  computed: {
    ...mapGetters({
      Assets: "getRegularAssets",
      PurchaseCredits: "getPurchaseCredits"
    }),
    total() {
      return this.earnstMoneyCredits.length
        ? this.earnstMoneyCredits.reduce(
            (acc, cur) =>
              (acc += !isNaN(cur.PurchaseCreditAmount)
                ? +cur.PurchaseCreditAmount
                : 0),
            0
          )
        : 0;
    },
    earnstMoneyCredits() {
      return this.PurchaseCredits.length
        ? this.PurchaseCredits.filter(
            ({ PurchaseCreditType }) => PurchaseCreditType === "EarnestMoney"
          )
        : [];
    },
    accountOptions() {
      return this.Assets && this.Assets.length
        ? [
            ...this.Assets.map(
              item =>
                `${item.FullName}${
                  item.AssetAccountIdentifier
                    ? " (*" + item.AssetAccountIdentifier + ")"
                    : ""
                }${
                  item.AssetCashOrMarketValueAmount
                    ? " - $" +
                      this.getFormattedValue(item.AssetCashOrMarketValueAmount)
                    : ""
                }`
            ),
            "Other"
          ]
        : ["Other"];
    }
  },
  mounted() {
    if (
      (this.earnstMoneyCredits.length && !this.$route.query.yes) ||
      this.$route.name === "accountsandassets-summary"
    ) {
      this.additional = null;
    }
    this.validateForm();
  }
};
</script>
