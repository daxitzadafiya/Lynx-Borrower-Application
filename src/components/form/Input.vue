<template>
    <v-col :cols="colsVal" :md="mdVal" :sm="smVal" :lg="lgVal" class="itemContainer">
        <div class="titleText" v-if="inputTitle">{{ inputTitle }}<span v-if="isRequired" class="red--text">*</span>:</div>
        <component :is="defaultComponent" v-on="$listeners" v-bind="mergedProps"></component>
    </v-col>
</template>
<script>
import { VTextField, VSelect, VCombobox, VTextarea } from "vuetify/lib";
export default {
    props: {
        mdVal: {
            type: Number
        },
        smVal: {
            type: [Number, String],
            default: 6
        },
        lgVal: {
            type: Number,
        },
        colsVal: {
            type: Number,
            default: 12
        },
        inputTitle: {
            type: String,
        },
        isRequired: {
            type: Boolean,
            default: false
        },
        defaultComponent: {
            type: String,
            default: "v-text-field",
        },
    },
    computed: {
        componentProps() {
            return {
                outlined: true,
                placeholder: this.inputTitle == null ? "" : (this.defaultComponent === 'v-select' || this.defaultComponent === 'v-combobox' ? "Select " : "Enter ") + this.inputTitle,
                hideDetails: 'auto',
                dense: true,
                rules: this.isRequired ? [(value) => !!value || (this.inputTitle + ' is required.')] : undefined
            }
        },
        mergedProps() {
            return {
                ...this.componentProps,
                ...this.$attrs,
            };
        }
    },
    components: {
        "v-text-field": VTextField,
        "v-select": VSelect,
        "v-combobox": VCombobox,
        "v-textarea": VTextarea
    },
    inheritAttrs: false,
}
</script>

<style lang="scss" scoped></style>