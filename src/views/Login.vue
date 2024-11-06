<template>
  <div class="bgImageOuterContainer">
    <div class="loginContainer">
      <h1 class="sloganText primary-text">{{ slogan }}</h1>
      <div class="loginCard d-flex flex-column align-center">
        <div class="header w-100 d-flex justify-center pt-3 pb-5 mb-2">
          <img src="@/assets/images/login-logo.png" />
        </div>
        <div class="routerView">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slogan: ""
    };
  },
  methods: {},
  mounted() {
    this.slogan = this.$lynxSlogan;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/colors.scss";

.bgImageOuterContainer {
  background-image: url("../assets/images/neighborhood-main.svg");
  min-height: 100vh;
  min-width: 100vw;
  background-position: bottom;
  background-size: auto 20%;
}

.loginContainer {
  max-width: $max-page-width;
  padding: $page-padding;
  @media (max-width: $mobile-width) {
    padding: $mobile-page-padding;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
}

.sloganText {
  font-weight: 500;
  font-size: 36px;
  line-height: 120%;
  text-align: center;
  @media (max-width: $mobile-width) {
    font-size: 26px;
  }
}

.loginCard {
  border: 1px solid #eaeaea;
  box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.05), 0px 0px 7px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  margin-top: 30px;
  margin-bottom: 60px;
  max-width: 400px;
  width: 100%;
  background-color: white;
  overflow: hidden;
}

.header {
  background-color: $header-back-color;
  width: calc(100% + 4px);
  margin-left: -2px;
  img {
    max-height: 70px;
  }
}

.routerView {
  padding: 0px 30px 16px 30px;
  width: 100%;
}
</style>
