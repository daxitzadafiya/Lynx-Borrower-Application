<template lang="pug">
    v-card(outlined)
        v-card-title Parties
        v-card-text
            v-row(v-for="(party, index) in parties" :key="index")
                v-col(cols="3")
                    v-text-field(
                        label="Counseling Party Name"
                        :value="party.FullName"
                        @input="(value) => updateParty('FullName', value, index)"
                    )
                v-col(cols="3")
                    v-text-field(
                        label="Counseling Party Identifier"
                        :value="party.PartyRoleIdentifier"
                        @input="(value) => updateParty('PartyRoleIdentifier', value, index)"
                    )
                v-col(cols="3")
                    v-select(light
                        :items="types" 
                        label="Counseling Party Type"
                        item-text="text" 
                        item-value="value"
                        :value="party.PartyRoleType"
                        @change="(value) => updateParty('PartyRoleType', value, index)"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.d-flex(v-if="partyRoleIdentifiers.indexOf(party.PartyRoleIdentifier) === -1")
                    v-icon.red--text.no-background-active(style="cursor: pointer;" @click="removeParty(index)") delete
            v-row(v-if="additional")
                v-col(cols="3")
                    v-text-field(
                        label="Counseling Party Name"
                        @change="(value) => addNewParty('FullName', value)"
                    )
                v-col(cols="3")
                    v-text-field(
                        label="Counseling Party Identifier"
                        @change="(value) => addNewParty('PartyRoleIdentifier', value)"
                    )
                v-col(cols="3")
                    v-select(light
                        :items="types" 
                        label="Counseling Party Type"
                        item-text="text" 
                        item-value="value" 
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        @change="(value) => addNewParty('PartyRoleType', value)"
                        style="max-width:300px; max-height:33px"
                        )
                v-col.d-flex
                    v-icon.red--text.no-background-active(style="cursor: pointer;" @click="additional = null") delete
            v-row.pl-3.mb-2
                Add(
                    customClass='small'
                    @add="additional = {}"
                    )
                span.ml-2.process-green--text Add Counseling Party
</template>

<script>
import { mapActions } from "vuex";
import Add from "@/components/buttons/Add";

export default {
  props: {
    parties: {
      type: Array,
      default: () => []
    },
    borrowers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      types: [
        {
          text: "Housing Counseling Agency",
          value: "HousingCounselingAgency"
        },
        {
          text: "Other",
          value: "Other"
        }
      ],
      additional: null
    };
  },
  methods: {
    ...mapActions(["updateCounselingParties"]),
    updateParty(prop, value, index) {
      const counselingParties = this.parties.map((item, i) => {
        if (i === index) {
          item[prop] = value;
        }
        return item;
      });
      this.updateCounselingParties(counselingParties);
    },
    addNewParty(prop, value) {
      const counselingParties = [...this.parties, { [prop]: value }];
      this.updateCounselingParties(counselingParties);
      this.additional = null;
    },
    removeParty(index) {
      const counselingParties = this.parties.filter((item, i) => i !== index);
      this.updateCounselingParties(counselingParties);
    }
  },
  computed: {
    partyRoleIdentifiers() {
      if (this.borrowers && this.borrowers.length) {
        return this.borrowers.reduce((acc, cur) => {
          let identifiers = [];
          if (cur.CounselingEvents) {
            identifiers = cur.CounselingEvents.map(
              item => item.CounselingPartyRoleIdentifier
            );
          }
          return [...acc, ...identifiers];
        }, []);
      }
      return [];
    }
  },
  components: {
    Add
  }
};
</script>
