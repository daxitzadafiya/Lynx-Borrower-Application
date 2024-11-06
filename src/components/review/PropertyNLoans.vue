<template lang="pug">
    v-card-text.text-block
        v-row
            v-col(md="6" cols="12")
                SubjectProperty
            v-col(md="6" cols="12")
                LoanDetails
</template>

<script>
import SubjectProperty from "./SubjectProperty";
import LoanDetails from "./LoanDetails";

export default {
  components: {
    SubjectProperty,
    LoanDetails
  }
};
</script>

<style lang="scss" scoped></style>
