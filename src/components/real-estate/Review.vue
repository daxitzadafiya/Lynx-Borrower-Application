<template lang="pug">
    Review(@clicked="$router.push('/accountsandassets/summary')")
</template>

<script>
import Review from "@/components/Review";

export default {
  components: {
    Review
  }
};
</script>

<style lang="scss" scoped></style>
