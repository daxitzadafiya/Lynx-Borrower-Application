<template>
  <v-col
    :cols="colsVal"
    :md="mdVal"
    :sm="smVal"
    :lg="lgVal"
    class="itemContainer"
  >
    <div class="titleText">
      {{ inputTitle }}<span v-if="isRequired" class="red--text">*</span>:
    </div>
    <v-menu
      content-class="picker-menu"
      light="light"
      v-model="isMenu"
      :close-on-content-click="false"
      :value="selectedDate"
      transition="scale-transition"
      offset-y=""
      width="270px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          outlined="outlined"
          :value="selectedDate"
          :placeholder="placeholder"
          v-on="on"
          dense
          hide-details="auto"
          :rules="rules"
          @keyup.delete="
            () => {
              $emit('dateCleared');
            }
          "
          @keyup.backspace="
            () => {
              $emit('dateCleared');
            }
          "
        >
          <template v-slot:append>
            <v-icon class="calendar" v-on="on"
              >mdi-calendar-blank-outline
            </v-icon>
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        class="picker"
        @change="
          e => {
            $emit('dateUpdated', e);
          }
        "
        no-title=""
        scrollable=""
        width="270px"
        :value="date"
        :max="maxDate"
      ></v-date-picker>
      <v-spacer></v-spacer>
      <div class="d-flex justify-end py-2 px-2">
        <v-btn text="" color="primary" @click="$emit('dateCleared')"
          >Clear</v-btn
        >
        <v-btn text="" color="primary" @click="isMenu = false">OK</v-btn>
      </div>
    </v-menu>
    <slot />
  </v-col>
</template>
<script>
import moment from "moment";

export default {
  props: {
    mdVal: {
      type: [String, Number]
    },
    smVal: {
      type: [String, Number],
      default: 6
    },
    lgVal: {
      type: [String, Number]
    },
    colsVal: {
      type: Number,
      default: 12
    },
    inputTitle: {
      type: String
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    defaultComponent: {
      type: String,
      default: "v-text-field"
    },
    value: {
      type: String,
      default: null
    },
    maxDate: {
      type: String,
      default: null
    },
    inputTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isMenu: false
    };
  },
  computed: {
    selectedDate() {
      return this.value ? moment(this.value).format("MMMM DD, YYYY") : "";
    },
    date() {
      return this.value
        ? moment(new Date(this.value)).format("YYYY-MM-DD")
        : this.maxDate;
    },
    placeholder() {
      return this.inputTitle == null ? "" : "Enter " + this.inputTitle;
    },
    rules() {
      return this.isRequired
        ? [value => !!value || this.inputTitle + " is required."]
        : [];
    }
  }
};
</script>

<style lang="scss" scoped>
.picker-menu {
  min-width: unset !important;
  background-color: white;
}
</style>
