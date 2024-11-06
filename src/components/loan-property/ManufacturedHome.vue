<template lang="pug">
    .loan-main
        .main-container
            .slide__message.primary-text Is this property a manufactured home?
            img.slide__image(:src="require('@/assets/images/loan-property/mansion.png')")
            .slide__buttons
                Button(
                    value="No" 
                    customClass="primary-button"
                    :isNotSelected="!Property ? true : Property.ConstructionMethodType !== 'SiteBuilt'"
                    @clicked="setMixedUseProp('SiteBuilt')"
                    )
                Button(
                    customClass="primary-button"
                    value="Yes"
                    :isNotSelected="!Property ? true : Property.ConstructionMethodType !== 'Manufactured'"
                    @clicked="setMixedUseProp('Manufactured')"
                    )
</template>

<script>
import Button from "@/components/buttons/Button";
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["setProperty"]),
    setMixedUseProp(val) {
      const property = this.Property
        ? { ...this.Property, ConstructionMethodType: val }
        : { ConstructionMethodType: val };
      this.setProperty(property);
      this.$emit("saveAndRedirect", { route: this.nextRoute });
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty",
      LoanPurposeType: "getLoanPurposeType"
    }),
    nextRoute() {
      return this.LoanPurposeType === "Refinance"
        ? "/loanandproperty/additional-mortgages"
        : "/loanandproperty/downpayment";
    }
  },
  components: {
    Button
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/start.scss";

.loan-main {
  @include main-generic;
}

.main-container {
  height: 480px;
  @media (max-width: 450px) {
    max-height: 400px;
  }
}

.slide {
  &__image {
    @media (max-width: 760px) {
      width: 280px;
    }
  }
}

@media (max-width: 760px) {
  .main-container {
    max-height: 400px;
  }
  .slide {
    &__image {
      width: 280px;
    }
  }
}

@media (max-width: 380px) {
  .main-container {
    max-height: 350px;
  }
}
</style>
