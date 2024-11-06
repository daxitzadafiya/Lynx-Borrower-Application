<template lang="pug">
    .real-estate-data
        v-card.main__card(width='100%' light)
            PropertyOwn
            v-divider
            .main__button
                router-link(to="/declarations")
                    .main_desktop-button
                        Button(value="Next" customClass="primary-button")
                    .main_mobile-button
                        Button(value="Next" customClass="primary-button" width="200px")
</template>

<script>
import PropertyOwn from "./summaries/PropertyOwn";
import Button from "@/components/buttons/Button";
import scrollToTop from "@/mixins/scrollToTop.js";

export default {
  mixins: [scrollToTop],
  components: {
    PropertyOwn,
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/summary.scss";

.real-estate-data {
  @include main-data;
}

@media (max-width: 760px) {
  .v-divider {
    margin-top: 15px;
  }
}
</style>
