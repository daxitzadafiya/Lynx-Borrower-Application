<template lang="pug">
    .derogatories-table
        v-card-text.text-block.text-black--text
            v-data-table#table(
                :headers="headers"
                :items="derogatories"
                disable-sort
                disable-pagination
                hide-default-footer
                class="elevation-1"
            )
                template(v-slot:item.LegalObligationAmount="{ item }")
                    span ${{ getFormattedValue(item.LegalObligationAmount) || 0 }}
                template(v-slot:item.ReportedDate="{ item }")
                    span {{ getFormattedDate(item.ReportedDate)}}
                template(v-slot:item.DispositionDate="{ item }")
                    span {{ getFormattedDate(item.DispositionDate)}}
                template(v-slot:item.DispositionType="{ item }")
                    span {{ item.DispositionType?item.DispositionType:item.DispositionTypeDescriptionOther}}
                template(v-slot:item.edit="{ item }")
                    v-icon.mr-2(small @click="editItem(item)").icon-color-main mdi-pencil

                template(v-slot:body.append)
                    tr.appended-row
                        td
                        td
                        td
                        td
                        td.appended-col.centered Total:
                        td.appended-col.centered ${{ getFormattedValue(totalObligationAmount) }}
                        td
            v-dialog(
                v-model="isDialog"
                max-width="290"
            )
                v-card
                    v-card-title.d-flex.justify-center.mb-4.text-black--text Are you sure? 
                    v-card-text
                        v-row.justify-space-around
                            Button(
                                value="Yes"
                                customClass="button-yes"
                                width="120px"
                                @clicked="removeDerogatory")
                            Button(
                                value="No"
                                width="120px"
                                isOutlined=true
                                @clicked="isDialog=false")
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Add from "@/components/buttons/Add";
import currencyFormat from "@/mixins/currencyFormat.js";
import Button from "@/components/buttons/Button";
import moment from "moment";

export default {
  mixins: [currencyFormat],
  data() {
    return {
      headers: [
        {
          text: "Action",
          value: "RecordType",
          class: "primary--text"
        },
        {
          text: "Reported Date",
          value: "ReportedDate",
          class: "primary--text"
        },
        {
          text: "Disposition",
          value: "DispositionType",
          class: "primary--text"
        },
        {
          text: "Disposition Date",
          value: "DispositionDate",
          class: "primary--text"
        },
        {
          text: "Ownership",
          value: "OwnershipType",
          align: "center",
          class: "primary--text"
        },
        {
          text: "Obligation Amount",
          value: "LegalObligationAmount",
          align: "center",
          class: "primary--text"
        },
        { text: "Edit", value: "edit", class: "primary--text" }
      ],
      isDialog: false,
      removeIndex: -1
    };
  },
  methods: {
    ...mapActions(["toggleIsOnlay", "updateBorrower", "setEditingDerogatoryItem"]),
    editItem(derogatoryItem) {
      const index = this.derogatories.indexOf(derogatoryItem);
      this.setEditingDerogatoryItem({ derogatoryItem, index });
      this.toggleIsOnlay({ onlayComponent: "editDerogatoryItem", isOnlay: true });
    },
    getFormattedDate(date) {
      return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
    },
    setRemoveIndex(liability) {
      this.removeIndex = this.derogatories.indexOf(liability);
      this.isDialog = true;
    },
    removeDerogatory() {
      const updated = this.derogatories.filter(
        (item, index) => index !== this.removeIndex
      );
      this.updateBorrower({ prop: "PublicRecords", value: updated });
      this.isDialog = false;
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    derogatories() {
      return this.borrower && this.borrower.PublicRecords
        ? this.borrower.PublicRecords
        : [];
    },
    totalObligationAmount() {
      if (this.derogatories.length) {
        return this.derogatories.reduce(
          (acc, cur) =>
            acc +
            (!isNaN(cur.LegalObligationAmount)
              ? +cur.LegalObligationAmount
              : 0),
          0
        );
      }
      return 0;
    }
  },
  watch: {
    isDialog: function(val) {
      if (!val) {
        this.removeIndex = -1;
      }
    }
  },
  components: {
    Button,
    Add
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
@import "@/assets/styles/colors.scss";

.derogatories-table {
  &__footer {
    border-top: thin solid rgba(0, 0, 0, 0.12);
    padding: 10px;
  }
}

.appended-row {
  font-weight: 600;
}

#table {
  margin-bottom: 40px;
  &:deep(th) {
    padding: 10px;
    font-weight: 500;
  }
  &:deep(td) {
    padding: 10px;
  }
  &:deep(.centered) {
    text-align: center !important;
  }
}

.mw-220 {
  display: inline-block;
  min-width: 152px;
}

.mr-2 {
  cursor: pointer;
}

.v-input__slot {
  margin-bottom: 0 !important;
}
:deep(th) {
  background-color: $table-header-back-color;
  span {
    color: $table-header-text-color !important;
  }
}
</style>
