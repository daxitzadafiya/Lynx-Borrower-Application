<template lang="pug">
    .sidebar-info.text-black--text
        .sidebar-info__row
            .sidebar-info__col {{ name }}
            .sidebar-info__col $1,060,658
        .sidebar-info__row
            .sidebar-info__col Co Customer
            .sidebar-info__col $195,658
        .sidebar-info__row.sidebar-info_weight-500
            .sidebar-info__col Total:
            .sidebar-info__col $1,255,658
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    name() {
      return this.user ? `${this.user.firstName} ${this.user.lastName}` : "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/sidebarAdditional.scss";

.sidebar-info {
  &__row {
    justify-content: space-between;
    margin-top: 5px;
  }
  &__col {
    margin-right: 10px;
  }
}
</style>
