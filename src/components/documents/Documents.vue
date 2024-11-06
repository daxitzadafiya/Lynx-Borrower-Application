<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <UploadDocument :uploadFile="uploadFile" :tokenId="tokenId" :isUploadUsingToken="isUploadUsingToken">
      </UploadDocument>
      <ManageDocuments ref="manageDocument" :tokenId="tokenId" :isUploadUsingToken="isUploadUsingToken"></ManageDocuments>
    </div>
    <div class="navigation-container">
      <NavigationButtons :HasDefaultNavigation="false" :NextClicked="nextBtnClicked"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import UploadDocument from "./UploadDocument.vue";
import ManageDocuments from "./ManageDocuments.vue";
import Vue from "vue";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    UploadDocument,
    ManageDocuments
  },
  data() {
    return {
      isScanActive: true,
      tokenId: '',
      isMobileDevice: false
    };
  },
  async created() {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      this.isMobileDevice = true
    }
    await this.tryCreateToken();
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    })
  },
  methods: {
    ...mapActions(["createToken"]),
    nextBtnClicked(){
      this.$refs.manageDocument.tryNavigating()
    },
    async tryCreateToken() {
      if (this.isUploadUsingToken) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.tokenId = urlParams.get('tokenId')
      }
      else {
        try {
          if (this.currentLoan != null && this.currentLoan.Id != null) {
            if (this.tokenId === '') {
              this.tokenId = (await this.createToken(this.currentLoan.Id)).token;
            }
          }
        } catch (err) { }
      }
    },
    async uploadFile(file) {
      await this.$refs.manageDocument.addFile(file);
    },
  },
  watch: {
    currentLoan: {
      deep: true,
      async handler(newVal) {
        if (!this.isUploadUsingToken) {
          await this.tryCreateToken();
        }
      }
    }
  },
  props: {
    isUploadUsingToken: {
      type: Boolean
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
.image-container{
  width: 100%;
}
</style>
