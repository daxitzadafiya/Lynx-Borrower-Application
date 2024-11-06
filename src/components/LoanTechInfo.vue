<template lang="pug">
    .d-flex(v-if="loan")
        .item
            .item__title 
                span.item__switcher(@click="isLoan=true" :class="{'opacity-05': !isLoan}") Loan {{ loan.Id }}
                span.item__switcher(@click="isLoan=false" :class="{'opacity-05': isLoan}") Progress Model
                button.item__button( v-if="!isLoan" @click="saveProgressModel") Save
            aceEditor(v-if="isLoan"
                :value="jsonViewLoan"
                @init="aceEditorInit"
                width="650"
                height="96%"
                lang="json"
                theme="github"
                :options = "{'readOnly': true}"
                style="flex-grow:1"
            )
            aceEditor(v-else
                v-model="progressModel"
                @init="aceEditorInit"
                width="650"
                height="96%"
                lang="json"
                theme="github"
                :options = "{'readOnly': false}"
                style="flex-grow:1"
            )
        .item(v-if="loanPathces")
            .item__title Last Patches for Loan {{ loan.Id }}
                button.item__button(@click="getPatches") Refresh
            aceEditor(
                :value="lastAppliedPatches"
                @init="aceEditorInit"
                width="650"
                height="96%"
                lang="json"
                theme="github"
                :options = "{'readOnly': true}"
                style="flex-grow:1"
            )
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isLoan: true,
      progressModel: ""
    };
  },
  methods: {
    ...mapActions([
      "getPatchesById",
      "setBroadcast",
      "setCurrentProgressModel",
      "setProgressModel"
    ]),
    aceEditorInit() {
      require("brace/ext/language_tools");
      require("brace/mode/json");
      require("brace/theme/github");
    },
    async getLoan() {
      const channelId = 111;
      this.setBroadcast(channelId);
      this.broadcastChannel.postMessage("getLoan");
    },
    async getPatches() {
      const loanId = this.$route.params.loanId;
      await this.getPatchesById(loanId);
    },
    beautifyJson(obj) {
      return JSON.stringify(
        obj,
        (key, value) => {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              return value;
            } else {
              return undefined;
            }
          } else if (value != null && typeof value === "object") {
            return value;
          } else if (value !== null) return value;
          return undefined;
        },
        "\t"
      );
    },
    closeBc() {
      this.broadcastChannel.postMessage("close");
    },
    saveProgressModel() {
      this.setCurrentProgressModel(this.progressModel);
    },
    getProgressModel() {
      const storageModel = localStorage.getItem("progressModel");
      this.progressModel = storageModel
        ? this.beautifyJson(JSON.parse(storageModel))
        : "";
    }
  },
  computed: {
    ...mapGetters({
      loan: "getCurrentLoan",
      loanPathces: "getCurrentLoanPatches",
      broadcastChannel: "broadcastChannel",
      storedProgressModel: "getCurrentProgressModel"
    }),
    jsonViewLoan() {
      return this.loan ? this.beautifyJson(this.loan) : "";
    },
    lastAppliedPatches() {
      return this.loanPathces ? this.beautifyJson(this.loanPathces) : "";
    },
    progressModelJsonView() {
      return this.progressModel ? this.beautifyJson(this.progressModel) : "";
    }
  },
  watch: {
    storedProgressModel: {
      deep: true,
      handler(val) {
        this.progressModel = this.beautifyJson(JSON.parse(val));
      }
    }
  },
  components: {
    aceEditor: require("vue2-ace-editor")
  },
  mounted() {
    this.getLoan();
    this.getPatches();
    this.getProgressModel();
  },
  created() {
    window.addEventListener("beforeunload", this.closeBc);
  }
};
</script>

<style lang="scss" scoped>
.d-flex {
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.item {
  height: 100%;
  box-sizing: border-box;
  &__title {
    color: black;
    padding-left: 50px;
    font-weight: 600;
  }
  &__switcher {
    padding: 0 10px;
    cursor: pointer;
    &:first-child {
      border-right: 1px solid;
    }
  }
  &__button {
    background-color: lightGrey;
    padding: 0 5px;
    margin-left: 15px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 8px;
    box-shadow: 0 1px 5px black;
    outline: none;
    &:active {
      transform: scale(0.95);
      box-shadow: 0 0 10px black;
    }
  }
}

.opacity-05 {
  opacity: 0.5;
}
</style>
