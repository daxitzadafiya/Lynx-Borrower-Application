<template lang="pug">
    v-card.mt-3(outlined)
        v-card-title Events
        v-card-text
            v-row.mb-10
                v-col(cols="3")
                    v-select(light
                        :items="borrowersNames" 
                        label="Borrower"
                        :value="selectedBorrower"
                        @change="setBorrower"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
            v-row(v-for="(event, index) in events" :key="index")
                v-col(cols="3")
                    v-select(light
                        :items="partiesData"
                        item-text="text"
                        item-value="value" 
                        label="Counseling Party"
                        :value="event.CounselingPartyRoleIdentifier"
                        @change="(value) => setUpdatedBorrowers('CounselingPartyRoleIdentifier', value, index)"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
                v-col(cols="3")
                    v-select(light
                        :items="counselingTypes" 
                        item-text="text"
                        item-value="value" 
                        label="Counseling Type"
                        :value="event.CounselingType"
                        @change="(value) => setUpdatedBorrowers('CounselingType', value, index)"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
                v-col(cols="3")
                    v-select(light
                        :items="formatTypes" 
                        item-text="text"
                        item-value="value" 
                        label="Counseling Format"
                        :value="event.CounselingFormatType" 
                        @change="(value) => setUpdatedBorrowers('CounselingFormatType', value, index)"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
                v-col(cols="2")
                    v-menu(light
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        v-model="menus[index]"
                        )
                        template(v-slot:activator="{ on }")
                            v-text-field(light
                                label="Completion Date Format"
                                :value="formattedDate(event)"
                                prepend-icon="date_range"
                                readonly
                                v-on="on"
                                style="max-width:300px !important"
                                hide-details
                                )
                        v-date-picker(light
                            :value="event.CounselingCompletedDate"
                            @input="(date) => setDate(date, index)"
                            )
                v-col.d-flex
                    v-icon.red--text.no-background-active(style="cursor: pointer;" @click="removeEvent(index)" :ripple="false") delete
            v-row(v-if="additional")
                v-col(cols="3")
                    v-select(light
                        :items="partiesData" 
                        item-text="text"
                        item-value="value" 
                        label="Counseling Party"
                        :value="additional.CounselingPartyRoleIdentifier"
                        @change="(value) => setUpdatedBorrowers('CounselingPartyRoleIdentifier', value, events.length)"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
                v-col(cols="3")
                    v-select(light
                        :items="counselingTypes" 
                        item-text="text"
                        item-value="value" 
                        label="Counseling Type"
                        :value="additional.CounselingType" 
                        @change="(value) => setUpdatedBorrowers('CounselingType', value, events.length)"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
                v-col(cols="3")
                    v-select(light
                        :items="formatTypes" 
                        item-text="text"
                        item-value="value" 
                        label="Counseling Format"
                        :value="additional.CounselingFormatType" 
                        @change="(value) => setUpdatedBorrowers('CounselingFormatType', value, events.length)"
                        :menu-props="{light: true, bottom: true, offsetY: true }"
                        style="max-width:300px; max-height:33px"
                        )
                v-col(cols="2")
                    v-menu(light
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        v-model="additional.isMenu"
                        )
                        template(v-slot:activator="{ on }")
                            v-text-field(light
                                label="Completion Date Format"
                                :value="formattedDate(additional)"
                                prepend-icon="date_range"
                                readonly
                                v-on="on"
                                style="max-width:300px !important"
                                hide-details
                                )
                        v-date-picker(light
                            :value="additional.CounselingCompletedDate"
                            @input="(date) => setDate(date, events.length)"
                            )
                v-col.d-flex
                    v-icon.red--text.no-background-active(style="cursor: pointer;" @click="additional=null" :ripple="false") delete
            v-row.pl-3.mb-2.mt-5
                Add(
                    customClass='small'
                    @add="additional = {}"
                    )
                span.ml-2.process-green--text Add Counseling Party
</template>

<script>
import moment from "moment";
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
      selectedBorrower: "",
      selectedBorrowerId: "",
      counselingTypes: [
        { text: "Counseling", vaue: "Counseling" },
        { text: "Education", vaue: "Education" }
      ],
      formatTypes: [
        { text: "Face To Face", value: "FaceToFace" },
        { text: "Internet", value: "Internet" },
        { text: "Telephone", value: "Telephone" }
      ],
      menus: [],
      additional: null
    };
  },
  methods: {
    ...mapActions(["updateBorrowers"]),
    setBorrower(value) {
      this.selectedBorrower = value;
      const index = this.borrowersNames.findIndex(item => item === value);
      this.selectedBorrowerId = this.borrowers[index].Id;
    },
    formattedDate(event) {
      return event.CounselingCompletedDate
        ? moment(new Date(event.CounselingCompletedDate)).format("DD/MM/YYYY")
        : "";
    },
    setDate(date, index) {
      const formatted = moment(new Date(date)).format("YYYY-MM-DD");
      this.setUpdatedBorrowers("CounselingCompletedDate", formatted, index);
      this.menus[index] = false;
    },
    setUpdatedBorrowers(prop, value, index) {
      const updatedBorrowers = this.borrowers.map(item => {
        let CounselingEvents = item.CounselingEvents || [];
        if (item.Id === this.selectedBorrowerId) {
          CounselingEvents[index] = CounselingEvents.length
            ? { ...CounselingEvents[index], [prop]: value }
            : { [prop]: value };
          item.CounselingEvents = CounselingEvents;
        }
        return item;
      });
      this.updateBorrowers(updatedBorrowers);
      this.additional = null;
    },
    removeEvent(index) {
      const updatedBorrowers = this.borrowers.map(item => {
        item.CounselingEvents = item.CounselingEvents.filter(
          (el, i) => i !== index
        );
        return item;
      });
      this.updateBorrowers(updatedBorrowers);
    }
  },
  computed: {
    borrowersNames() {
      return this.borrowers && this.borrowers.length
        ? this.borrowers.map(item => `${item.FirstName} ${item.LastName}`)
        : [];
    },
    partiesData() {
      return this.parties && this.parties.length
        ? this.parties.map(item => {
            return { text: item.FullName, value: item.PartyRoleIdentifier };
          })
        : [];
    },
    events() {
      if (this.borrowers && this.borrowers.length) {
        return this.borrowers.reduce((acc, cur) => {
          return cur.CounselingEvents
            ? [...acc, ...cur.CounselingEvents]
            : [...acc];
        }, []);
      }
      return [];
    }
  },
  components: {
    Add
  },
  mounted() {
    this.selectedBorrower = this.borrowersNames[0] || "";
    this.selectedBorrowerId = this.borrowers[0] ? this.borrowers[0].Id : "";
  }
};
</script>
