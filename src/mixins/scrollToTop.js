export default {
  mounted() {
    const element = document.querySelector(".home__container");
    if (element) {
      element.scrollTop = 0;
    }
  }
};
