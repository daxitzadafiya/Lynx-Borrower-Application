<template lang="pug">
    v-simple-table.t-table
        template(v-slot:default)
            tbody.t-table__tbody
                tr.t-table__tbody-row(v-for="(item, index) in headers" :class="index === 0 ? 'table-header-text table-header-back' : ''")
                    td.t-table__tbody-cell.primary-text {{ item }}
                    template(v-for="(info, dataIndex) in tableData")
                        td.t-table__tbody-cell(v-if="item === 'Borrower'")
                            span {{ info.name }}
                        td.t-table__tbody-cell(v-else-if="item !== 'Income/Month' && item !== 'Include' && item !== 'Edit'") 
                            span(v-if="isCurrency(item)") $
                            span {{ info[item.toLowerCase()] ? info[item.toLowerCase()].toLocaleString('en-US') : info[item.toLowerCase()] }}
                            span(v-if="isPercentage(item)") %
                        td.t-table__tbody-cell(v-else-if="item === 'Include'")
                            v-switch(:input-value="info.isInclude" v-if="info.name !== 'Totals:'" @change="$emit('toggleInclude', {index: dataIndex})")
                        td.t-table__tbody-cell(v-else-if="item === 'Edit'")
                            v-btn(icon v-if="info.name !== 'Totals:'" @click="$emit('setBorrowerAndRedirect', {index: dataIndex})")
                                v-icon.icon-color-main mdi-pencil
                        td.t-table__tbody-cell(v-else) 
                            span $
                            span {{ info.income >= 0 ? info.income.toLocaleString('en-US') : ''}}
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
  },
  methods: {
    isCurrency(item) {
      return ["Assets", "Liabilities"].indexOf(item) !== -1;
    },
    isPercentage(item) {
      return ["DTI", "Housing"].indexOf(item) !== -1;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.t-table {
  margin-bottom: 20px;
  &__tbody-cell {
    height: 100%;
    padding: 15px;
    font-size: 14px;
    &:first-child,
    &:last-child {
      font-weight: 500;
    }
    &:last-child {
      font-size: 16px;
    }
  }
}
:deep(.table-header-text) {
  td {
    color: $table-header-text-color !important;
  }
}
</style>
