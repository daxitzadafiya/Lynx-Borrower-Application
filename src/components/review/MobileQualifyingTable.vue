<template lang="pug">
    .mobile-qualifying
        v-row.text-block__row.header-row.mb-8
            v-col.text-block__col.relative.pr-2(v-for="(info, index) in borrowersData" :key="index") {{ info.name }}
                .edit(@click="$emit('setBorrowerAndRedirect', { index })")
                    v-icon.icon-color-main mdi-pencil
        v-row.text-block__row.items(v-for="(item, index2) in headers" :key="index2")
            v-col.text-block__col(v-for="(info, dataIndex) in borrowersData" :key="dataIndex")
                v-row.text-block__row.data-title {{ item }}
                v-row.text-block__row.data-value(v-if="item !== 'Income/Month' && item !== 'Include'")
                    span(v-if="isCurrency(item)") $
                    span {{ info[item.toLowerCase()] ? info[item.toLowerCase()].toLocaleString('en-US') : info[item.toLowerCase()] }}
                    span(v-if="isPercentage(item)") %
                v-row.text-block__row.data-value(v-else-if="item === 'Include'")
                    v-switch.mt-0(:input-value="info.isInclude" v-if="info.name !== 'Totals:'" @change="$emit('toggleInclude', {index: dataIndex})")
                v-row.text-block__row.data-value(v-else) 
                    span $
                    span {{ info.income.toLocaleString('en-US') }}
            v-row.totals.primary--text(v-if="isCurrency(item) || item === 'Income/Month'") 
                v-col.text-block__col(sm="" cols="2") Totals:
                v-col.text-block__col(v-if="item === 'Assets'") 
                    span $
                    span {{ totals.totalAssets ? totals.totalAssets.toLocaleString('en-US') : totals.totalAssets }}
                v-col.text-block__col(v-else-if="item === 'Liabilities'") 
                    span $
                    span {{ totals.totalAssets ? totals.totalLiabilities.toLocaleString('en-US') : totals.totalLiabilities}}
                v-col.text-block__col(v-else) 
                    span $
                    span {{ totals.totalAssets ? totals.totalIncome.toLocaleString('en-US') : totals.totalIncome}}
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
        "Status",
        "Fico",
        "Assets",
        "Income/Month",
        "Liabilities",
        "DTI",
        "Housing",
        "Include"
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
  },
  computed: {
    borrowersData() {
      return this.tableData.length
        ? this.tableData.filter(item => item.name !== "Totals:")
        : [];
    },
    totals() {
      const totals = this.tableData[this.tableData.length - 1];
      return {
        totalAssets: totals.assets,
        totalIncome: totals.income,
        totalLiabilities: totals.liabilities
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.mobile-qualifying {
  padding: 0 15px;
}

.header-row,
.data-value {
  font-weight: 500;
}

.items {
  border-bottom: 1px solid $nautical;
  padding: 15px 0;
  position: relative;
  &:last-child {
    border-bottom: none;
  }
}

.data-title {
  font-size: 12px;
}

.totals {
  margin-top: 10px;
  font-weight: 500;
}

.relative {
  position: relative;
}

.edit {
  position: absolute;
  left: 0;
  z-index: 2;
  img {
    width: 25px;
    height: 25px;
  }
}
</style>
