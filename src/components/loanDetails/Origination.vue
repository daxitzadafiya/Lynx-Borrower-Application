<template lang="pug">
    v-card.origination(light)
        v-card-title Origination
        v-card-text
            v-list
                v-list-group(:ripple="false"
                    v-for="(item, index) in items"
                    v-model="item.active"
                    :key="index"
                    no-action
                    )
                    template(v-slot:activator)
                        v-list-item-content
                            v-list-item-title(v-text="item.title")
                    v-list-item(
                        :ripple="false"
                        @click=""
                        v-if="item.title === 'Organization'"
                    )
                        v-list-item-content
                            Organization
                    v-list-item(
                        :ripple="false"
                        @click=""
                        v-if="item.title === 'Originator'"
                    )
                        v-list-item-content
                            Originator
                    v-list-item(
                        :ripple="false"
                        @click=""
                        v-if="item.title === 'FHA Loans'"
                    )
                        v-list-item-content
                            FhaLoans
</template>

<script>
import Organization from "./originations/Organization";
import Originator from "./originations/Originator";
import FhaLoans from "./originations/FhaLoans";

export default {
  data() {
    return {
      items: [
        { title: "Organization", active: true },
        { title: "Originator" },
        { title: "FHA Loans" }
      ]
    };
  },
  components: {
    Organization,
    Originator,
    FhaLoans
  }
};
</script>
