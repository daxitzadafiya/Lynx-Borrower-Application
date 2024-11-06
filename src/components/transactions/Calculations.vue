<template lang="pug">
    .calculations
        TransactionsTable(
            :headers="headers"
            :tableData="tableData"
        )
</template>

<script>
import TransactionsTable from "./TransactionsTable";

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: ["Calculation", "Amount"]
    };
  },
  components: {
    TransactionsTable
  }
};
</script>

<style lang="scss" scoped></style>
