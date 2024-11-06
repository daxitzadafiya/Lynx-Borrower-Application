<template lang="pug">
  div.scanOuterContainer
    .d-flex.scanInnerContainer
      qrcode-vue(:value='value' :size='150').flex-grow-1.d-flex.align-center
      .content-black-text.font-weight-medium.mt-3 Scan the QR code to upload with your mobile device
</template>

<script>
import Button from "@/components/buttons/Button";
import QrcodeVue from "qrcode.vue";
export default {
  components: {
    QrcodeVue,
    Button
  },
  props: {
    tokenId: {
      type: String
    }
  },
  data() {
    return {
    };
  },
  computed:{
    value(){
      return window.location.origin+"?tokenId="+this.tokenId
    }
  },
  methods:{
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.scanOuterContainer{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .scanInnerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    text-align: center;
    color: $primary-text-color;
    font-weight: 600;
  }
}

.content-black-text{
  max-width: 220px;
}
</style>
