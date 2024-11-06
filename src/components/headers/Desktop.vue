<template>
  <v-app-bar
    id="desktop-header"
    height="88px"
    dark
    flat
    app
    class="lynx-primary"
  >
    <v-container
      fill-height
      style="height: 88px; max-width: 1441px; padding: 0 10px;"
    >
      <v-col cols="2" class="logo-col">
        <img
          class="main-logo"
          :src="require('@/assets/images/header-logo.png')"
          style="width: auto; height: auto; max-height: 60px; max-width:175px;"
          @click="toggleTestingNav"
        />
      </v-col>
      <v-col cols="8" class="list">
        <v-row
          align="center"
          justify="center"
          v-if="!isBorrowersPage"
          class="scrolled-row"
        >
          <v-col
            :style="{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              minWidth: address ? '265px' : '150px'
            }"
            :class="{ col_translated: isScrolled }"
            class="scrolled-col address-col"
          >
            <div class="item__address">
              <p class="item__data item_relative">
                <v-icon
                  class="item__address-icon header-label-text progress"
                  aria-hidden="false"
                  >home</v-icon
                >
                <span class="item__address-text pl-1" v-html="address"></span>
              </p>
            </div>
          </v-col>
          <v-col
            v-for="(item, index) in items"
            :key="index"
            :class="{ col_translated: isScrolled }"
            class="toolbar-item scrolled-col"
          >
            <div v-if="item.data">
              <span class="item__label header-label-text">{{
                item.label
              }}</span>
              <v-icon
                v-if="item.isIcon"
                class="item__icon header-label-text progress"
                aria-hidden="false"
                >help</v-icon
              >
              <p class="item__data">
                <span v-if="item.isCurrency">{{
                  item.data.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD"
                  })
                }}</span>
                <span v-else-if="item.isPercent">{{
                  (item.data / item.multiple).toLocaleString("en-US", {
                    style: "percent",
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                  })
                }}</span>
                <span v-else>{{ item.data }}</span>
              </p>
            </div>
          </v-col>
          <div class="arrow lynx-primary">
            <v-icon
              @click="isScrolled = !isScrolled"
              @blur="isScrolled = false"
              tabindex="1"
              :class="{ reversed: isScrolled }"
            >
              mdi-chevron-right
            </v-icon>
          </div>
        </v-row>
      </v-col>
      <v-col cols="2">
        <v-row align="center" justify="end" class="account-block">
          <v-text-field
            v-if="userTypeCheck"
            v-model="loanId"
            @focus="isSearch = true"
            dense
            color="white"
            @keypress="e => isOnlyNum(e)"
            @keypress.enter="toggleSearch"
            class="search-field"
          ></v-text-field>
          <div class="search d-flex align-center">
            <div class="search__icon bordered">
              <v-btn icon @click="toggleSearch" width="35" height="35">
                <v-icon size="20">mdi-magnify</v-icon>
              </v-btn>
            </div>
            <ModelsAndFormsMenu @></ModelsAndFormsMenu>
          </div>
          <AccountMenu
            :accountItems="accountItems"
            @makeAction="({ title }) => $emit('makeAction', { title })"
          ></AccountMenu>
        </v-row>
      </v-col>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import AccountMenu from "./AccountMenu";
import ModelsAndFormsMenu from "./ModelsAndFormsMenu";

export default {
  name: "Header",
  mixins: [onlyNum, currencyFormat],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    accountItems: {
      type: Array,
      default: () => []
    },
    address: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isSearch: false,
      isScrolled: false,
      loanId: "",
      isAccountMenu: false
    };
  },
  methods: {
    ...mapActions(["getLoanById", "setBroadcast", "toggleTestingNav"]),
    async toggleSearch() {
      if (this.isSearch && this.loanId) {
        return await this.getLoanById(this.loanId);
      }
      this.isSearch = true;
    },
    openTechLoanInfo() {
      if (this.currentLoan && this.currentLoan.Id) {
        const routeData = this.$router.resolve(
          `/loan-tech-info/${this.currentLoan.Id}`
        );
        const channelId = 111;
        this.setBroadcast(channelId);
        window.open(
          routeData.href,
          "_blank",
          `toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, copyhistory=no, left=0, top=0, width=1300px, height=${screen.availHeight -
            70}`
        );
      }
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      currentUser: "getCurrentUser"
    }),
    userTypeCheck: function() {
      return (
        this.currentUser.userTypeId !== 7 && this.currentUser.userTypeId !== 8
      );
    },
    isBorrowersPage() {
      return this.$route.name === "borrowers";
    }
  },
  components: {
    ModelsAndFormsMenu,
    AccountMenu
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/desktop-header.scss";
@import "@/assets/styles/headers.scss";

#desktop-header {
  z-index: 11;
  background-color: $header-back-color;
}

.item {
  &__address {
    min-height: 60px;
  }
  &__address-icon {
    position: absolute;
    top: 3px;
    left: -20px;
  }
  &__address-text {
    display: inline-block;
    padding-top: 2px;
    line-height: 1.5;
    color: $header-text-color;
  }
  &_relative {
    position: relative;
    min-height: 42px;
  }
}
</style>
