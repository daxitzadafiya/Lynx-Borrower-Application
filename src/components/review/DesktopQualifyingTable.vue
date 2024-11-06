<template lang="pug">
    v-simple-table.t-table
        template(v-slot:default)
            thead.t-table__thead
                tr.t-table__thead-row
                    th.t-table__thead-cell.table-header-text.table-header-back(v-for="header in headers") {{ header }}
            tbody.t-table__tbody
                tr.t-table__tbody-row(v-for="(item, index) in tableData")
                    td.t-table__tbody-cell {{ item.name }}
                    td.t-table__tbody-cell {{ item.status }}
                    td.t-table__tbody-cell {{ item.fico }}
                    td.t-table__tbody-cell
                        span(v-if="item.assets >= 0") $
                        span {{ item.assets ? item.assets.toLocaleString('en-US') : 0 }}
                    td.t-table__tbody-cell
                        span(v-if="item.income >= 0") $
                        span {{ item.income ? item.income.toLocaleString('en-US') : 0 }}
                    td.t-table__tbody-cell
                        span(v-if="item.liabilities >= 0") $
                        span {{ item.liabilities ? item.liabilities.toLocaleString('en-US') : 0 }}
                    td.t-table__tbody-cell {{ item.dti || 0 }}%
                    td.t-table__tbody-cell {{ item.housing || 0 }}%
                    td.t-table__tbody-cell 
                        v-switch(:input-value="item.isInclude" v-if="item.name !== 'Totals:'" @change="$emit('toggleInclude', {index})")
                    td.t-table__tbody-cell.t-table_mobile-pr-18
                        v-btn(icon v-if="item.name !== 'Totals:'" @click="$emit('setBorrowerAndRedirect', { index })")
                            v-icon.icon-color-main mdi-pencil
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        "Borrower",
        "Status",
        "Fico",
        "Assets",
        "Income/Month",
        "Liabilities",
        "DTI",
        "Housing",
        "Include",
        "Edit"
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@mixin cell {
  height: 100%;
  padding: 15px;
  font-size: 14px;
}

.t-table {
  
  margin-bottom: 20px;

  &__thead-cell {
    @include cell;
    font-weight: 500;
    vertical-align: middle;
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
</style>
