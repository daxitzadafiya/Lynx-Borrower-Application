<template lang="pug">
    .home-footer.py-2.d-flex
        .copyrightSection &copy; {{ new Date().getFullYear() }} SOFTWARE LYNX LLC. &trade;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        .rightsSection ALL RIGHTS RESERVED | NMLS ID, 457894 | CONTACT US
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/variables.scss";
.home-footer{
  font-size: 10px;
  @media (max-width: $tablet-width) {
    justify-content: center;
  }
  @media (max-width: $mobile-width) {
    flex-direction: column;
    text-align: center;
  }
}
.rightsSection{
  color: $gray3;
}

.copyrightSection{
  color: #424248;
}
</style>
