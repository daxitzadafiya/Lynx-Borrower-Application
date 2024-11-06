<template lang="pug">
  div.outerContainer
    Documents(:isUploadUsingToken="true" v-if="!successMessageVisible")
    div.messageContainer(v-if="successMessageVisible")
        v-icon(color="black") done
        div Files Uploaded Successfully. Please continue in your desktop device.
</template>

<script>
import Documents from "./Documents.vue";

export default {
  data() {
    return {
      successMessageVisible: false
    };
  },
  components: {
    Documents
  },
  created() {},
  methods: {
    OnFilesUploadedSuccessfully() {
      this.successMessageVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.outerContainer {
  width: 100%;
}
:deep() {
  .uploadOuterContainer {
    height: 100%;
    margin: 0 auto;
    max-width: 1200px;
  }
}
.messageContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
