<template lang="pug">
    .borrower-due
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
      headers: ["Due From Borrowers", "Amount"]
    };
  },
  components: {
    TransactionsTable
  }
};
</script>

<style lang="scss" scoped></style>
