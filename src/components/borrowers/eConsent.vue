<template :style="`--headline-height': ${headlineHeight}px`">
  <v-dialog v-model="isOpened" fullscreen persistent :transition="false">
    <Header class="header" />
    <v-card>
      <v-card-title class="headline grey lighten-2 text-center" ref="headline">
        <v-container style="word-break: break-word">
          Your Consent To Do Business Electronically (the eDisclosure Agreement)
        </v-container>
      </v-card-title>
      <v-card-text>
        <v-container>
          <p>
            The loan for which you are applying involves various disclosures,
            records, and documents ("Loan Documents"), including this
            eDisclosure Agreement. The purpose of this eDisclosure Agreement is
            to obtain Your consent to receive certain Loan Documents from Us in
            electronic form rather than in paper form. With Your consent, You
            will also be able to sign and authorize these Loan Documents
            electronically, rather than on paper.
          </p>
          <p>
            Before We can engage in this transaction electronically, it is
            important that You understand Your rights and responsibilities.
            Please read the following and affirm Your consent to conduct
            business with Us electronically. For purposes of this eDisclosure
            Agreement, "eDisclosures" means the Loan Documents related to this
            transaction that are provided electronically, "You" and "Your" mean
            the borrower(s) under the applicable loan to which such Loan
            Documents apply, and "We", "Our" and "Us" mean the applicable
            mortgage broker(s), loan processor(s) or mortgage banker(s) with
            whom You are transacting business for such loan(s).
          </p>
          <h3>YOUR CONSENT</h3>
          <ul>
            <li>
              Your consent to participate in this transaction electronically
              will apply to all Loan Documents for the applicable loans for
              which You are applying. If You provide Your consent by clicking
              the "I agree" button at the bottom of the page, We will conduct
              this transaction electronically, instead of providing You with the
              Loan Documents in paper form.
            </li>
            <li>
              If a document related to Your loan is not available in electronic
              form, a paper copy will be provided to You free of charge.
            </li>
            <li>
              Conducting this transaction electronically is an option. If You
              choose not to accept receipt of eDisclosures, paper Loan Documents
              will be mailed to You.
            </li>
            <li>
              If You do not consent to receive these Loan Documents
              electronically, or if You subsequently withdraw consent, You will
              be provided with paper copies of the Loan Documents for which You
              did not consent to receive electronically. Additionally: <br />
              You will not be required to pay a fee for receiving paper copies
              of the Loan Documents.
            </li>
          </ul>
          <h3>WITHDRAWAL OF CONSENT</h3>
          <ul>
            <li>
              You have the right to withdraw Your consent at any time. By
              declining or revoking Your consent to receive eDisclosures, We
              will provide You with the Loan Documents in paper form.
            </li>
            <li>
              If You originally consent to receive eDisclosures, but later
              decide to withdraw Your consent, You can do so by clicking on the
              "I do not agree" button, or by notifying<br />
              Us at:<br />
              Standard Mortgage Capital, LLC<br />
              Phone:(800) 488-0361<br />
              Address:10200 West State Road 84 #104<br />
              Davie, FL 33324<br />
            </li>
            <li>
              If You originally consent to receive eDisclosures, but later
              withdraw Your consent, You will be provided with paper copies of
              the Loan Documents for which You did not consent to receive
              electronically.<br />
              You will not be required to pay a fee for withdrawing consent and
              receiving paper copies of the Loan Documents.
            </li>
          </ul>
          <h3>OBTAINING PAPER COPIES</h3>
          <ul>
            <li>
              After Your consent is given, You may request from Us paper copies
              of Your Loan Documents. Please send this request to Us at:<br />
              Standard Mortgage Capital, LLC<br />
              Phone:(800) 488-0361<br />
              Address:10200 West State Road 84 #104<br />
              Davie, FL 33324<br />
            </li>
            <li>
              If You request paper copies of the Loan Documents:<br />
              You will not be required to pay a fee for receiving paper copies
              of the Loan Documents.
            </li>
          </ul>
          <h3>SYSTEM REQUIREMENTS</h3>
          <ul>
            <li>
              In order to receive eDisclosures, You must have a computer with
              Internet access and an Internet email account and address; an
              Internet browser using 128-bit encryption or higher, Adobe Acrobat
              7.0 or higher, SSL encryption and access to a printer or the
              ability to download information in order to keep copies of Your
              eDisclosures for Your records.
            </li>
            <li>
              If the software or hardware requirements change in the future, We
              will notify You of the change. If You choose to withdraw Your
              consent upon notification of the change, You will be able to do so
              without penalty. Paper copies of such Loan Documents will be
              mailed to You if You choose to withdraw Your consent.
            </li>
          </ul>
          <h3>HOW WE CAN REACH YOU</h3>
          <ul>
            <li>
              You must promptly notify Us if there is a change in Your email
              address or in other information needed to contact You
              electronically. You can contact Us at:<br />
              Standard Mortgage Capital, LLC<br />
              Phone:(800) 488-0361<br />
              Address:10200 West State Road 84 #104<br />
              Davie, FL 33324<br />
            </li>
            <li>
              We will not assume liability for non-receipt of notification of
              the availability of eDisclosures in the event Your email address
              on file is invalid; Your email or Internet service provider
              filters the notification as "spam" or "junk mail"; there is a
              malfunction in Your computer, browser, Internet service and/or
              software; or for other reasons beyond Our control.
            </li>
          </ul>
          <br />
          <p>
            Please click the "I Consent" button to consent to do business
            electronically and to view Loan Documents electronically.
          </p>
          <NavigationButtons
            NextButtonText="I Consent"
            :NextClicked="iConsent"
            :HideProgresssAndPrevious="true"
          ></NavigationButtons>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Header from "@/components/Header.vue";
import loanPatch from "@/mixins/loanPatch.js";
import { mapGetters } from "vuex";

export default {
  mixins: [loanPatch],
  components: {
    Header
  },
  data: function() {
    return {
      isOpened: true,
      headlineHeight: null
    };
  },
  methods: {
    iConsent() {
      this.$emit("updateBorrower", { prop: "eConsent", value: true });
      this.isOpened = false;
    },
    getHeadlineHeight() {
      this.$nextTick(() => {
        const headlineElement = this.$refs.headline;
        if (headlineElement) {
          this.headlineHeight = headlineElement.offsetHeight;
          document.documentElement.style.setProperty(
            "--headline-height",
            `${this.headlineHeight}px`
          );
        }
      });
    },
    handleResize() {
      this.getHeadlineHeight();
    }
  },
  computed: {
    ...mapGetters({
      Borrower: "getBorrower"
    })
  },
  mounted() {
    this.isOpened =  true; //!this.Borrower.eConsent;
    this.getHeadlineHeight();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    document.documentElement.style.removeProperty("--headline-height");
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
h2,
h3 {
  font-weight: 700;
}
.v-card {
  margin: 25px;
}
.borrowers {
  &__button {
    width: 244px;
    margin-left: 0;
    padding: 0;
  }
}

.headline {
  width: 100%;
  position: fixed;
  top: 88px;
  z-index: 9;
  @media (max-width: 767px) {
    top: 76px;
    padding: 15px !important;
    font-size: 17px !important;
    line-height: 1.5 !important;
    .container {
      padding: 0 !important;
    }
  }
}

:deep(.v-dialog) {
  overflow: visible !important;
  margin-top: calc(88px + var(--headline-height, 0));
  height: calc(100dvh - (88px + var(--headline-height, 0)));
  @media (max-width: 767px) {
    margin-top: calc(73px + var(--headline-height, 0));
    height: calc(100dvh - (73px + var(--headline-height, 0)));
  }
  .v-card__text {
    height: 100%;
    overflow: auto;
  }
  & > .v-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
