<template lang="pug">
    .mortgage-loans-total
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
      headers: ["Total Mortgage Loans", "Amount"]
    };
  },
  components: {
    TransactionsTable
  }
};
</script>

<style lang="scss" scoped></style>
