export default {
  methods: {
    updateCount(e) {
      const regex = /^[1-9]{1}$/;
      if (!regex.test(e)) {
        return this.updateDependents({ prop: "Count", value: 0 });
      }
      this.updateDependents({ prop: "Count", value: +e });
    },
    tabToNext(e) {
      const elem = e.srcElement;
      const tidx = +elem.getAttribute("tabindex") + 1;
      const elems = document.getElementsByTagName("input");
      const maxLength = +elem.getAttribute("maxlength");
      const curLength = elem.value.length;
      if (curLength >= maxLength) {
        for (let i = elems.length; i--; ) {
          const tidx2 = +elems[i].getAttribute("tabindex");
          if (tidx2 == tidx) elems[i].focus();
        }
      }
    },
    updateAges(e, index) {
      const regex = /^[0-9]*$/;
      let Ages = this.Dependents.Ages || [];
      if (regex.test(e)) {
        Ages[index] = e;
        this.updateDependents({ prop: "Ages", value: Ages });
      }
      if (!e) {
        Ages = Ages.filter(item => item);
        this.updateDependents({ prop: "Ages", value: Ages });
      }
    }
  }
};
