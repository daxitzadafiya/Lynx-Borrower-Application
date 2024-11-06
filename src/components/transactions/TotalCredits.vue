<template lang="pug">
    .total-credits
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
      headers: ["Total Credits", "Amount"]
    };
  },
  components: {
    TransactionsTable
  }
};
</script>

<style lang="scss" scoped></style>
