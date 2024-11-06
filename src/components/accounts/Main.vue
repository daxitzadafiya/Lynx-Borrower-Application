<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">{{ title }}</div>
      <div class="titleSecondaryText" v-if="content">{{ content }}</div>
      <div class="titleSecondaryText" v-else>
        If you choose our
        <a href="#" @click.prevent="openPlaid">automated system</a> you can
        retrieve your account information directly from your bank. You can
        however enter your information manually if you would prefer.
      </div>
      <inline-svg
        class="titleImage"
        :src="require('@/assets/images/accounts/accountsandassets_start.svg')"
      />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import lynxApi from "@/api/lynxApi.js";

export default {
  computed: {
    ...mapGetters(["getBrandingSection", "getIsHostedMode"]),
    ...mapGetters({
      currentLoan: "getCurrentLoan"
    }),
    section() {
      return this.getBrandingSection("AccountsAndAssets");
    },
    introSlide() {
      return this.getIsHostedMode && this.section && this.section.IntroSlide;
    },
    title() {
      return (
        (this.introSlide && this.introSlide.Title) ||
        "Please take a moment and let us know about the different accounts and assets that you have "
      );
    },
    content() {
      return this.getIsHostedMode && this.introSlide && this.introSlide.Content;
    }
  },
  methods: {
    async openPlaid() {
      try {
        const linkTokenResponse = await lynxApi.getLinkToken(
          this.currentLoan.Id
        );

        const handler = Plaid.create({
          //token: linkToken,
          token: linkTokenResponse.link_token,
          onLoad: () => {
            // Optional, called when Link loads
          },
          onSuccess: (publicToken, metadata) => {
            // Send the public_token to your app server.
            // The metadata object contains info about the institution
            // the user selected and the account ID or IDs, if the
            // Account Select view is enabled.

            alert(JSON.stringify(metadata));
            console.log(JSON.stringify(metadata));

            lynxApi.addLinkItem(
              this.currentLoan.Id,
              linkTokenResponse.link_token,
              publicToken
            );
          },
          onExit: (err, metadata) => {
            // The user exited the Link flow.
            if (err != null) {
              // The user encountered a Plaid API error prior to exiting.
            }
            // metadata contains information about the institution
            // that the user selected and the most recent API request IDs.
            // Storing this information can be helpful for support.
          },
          onEvent: (eventName, metadata) => {
            // Optionally capture Link flow events, streamed through
            // this callback as your users connect an Item to Plaid.
            // For example:
            // eventName = "TRANSITION_VIEW"
            // metadata  = {
            //   link_session_id: "123-abc",
            //   mfa_type:        "questions",
            //   timestamp:       "2017-09-14T14:42:19.350Z",
            //   view_name:       "MFA",
            // }
          }
        });

        handler.open();
      } catch (error) {
        console.error("Error creating link token:", error);
      }
    }
  }
};
</script>
