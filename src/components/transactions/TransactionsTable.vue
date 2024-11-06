<template lang="pug">
        v-expansion-panel
            v-expansion-panel-header.table-header-back(v-slot="{ open }")
                v-row.primary--text.t-header
                  v-col.table-header-text(cols="9") {{ headers[0]}}
                  v-col.table-header-text.ta-center(cols="3") {{ !open ? totalAmount.isNegative ? `-$${totalAmount.amount.toLocaleString('en-US')}` : `$${totalAmount.amount.toLocaleString('en-US')}` : headers[1] }}
            v-expansion-panel-content
                v-simple-table.t-table
                    template(v-slot:default)
                        tbody.t-table__tbody.text-black--text
                            tr.t-table__tbody-row(v-for="{ title, amount, isNegative } in tableData")
                                td.t-table__tbody-cell.t-table_width-70 {{ title }}
                                td.t-table__tbody-cell.t-table_mobile-pr-18 {{ isNegative ? `-$${amount.toLocaleString('en-US')}` : `$${amount.toLocaleString('en-US')}` }}
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    totalAmount() {
      return this.tableData[this.tableData.length - 1]
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

@mixin cell {
  height: 100%;
  padding: 15px;
  font-size: 14px;
}
.t-header{
  font-weight: 500;
}

.t-table {
  margin-bottom: 20px;
  &__thead-cell {
    @include cell;
    font-weight: 500;
  }
  &__tbody-row {
    &:last-child {
      font-weight: 500;
      .t-table__tbody-cell {
        font-size: 16px;
      }
    }
  }
  &__tbody-cell {
    @include cell;
  }
  &_width-70 {
    width: 75%;
    @media (max-width: 760px) {
      max-width: 70%;
    }
  }
}

.ta-center {
  text-align: start;
}

@media (max-width: 760px) {
  .t-table {
    &_mobile-pr-18 {
      padding: 0;
      text-align: right !important;
      padding-right: 18px;
    }
  }
}
:deep(.v-icon){
  color: $table-header-text-color !important;
}
</style>
