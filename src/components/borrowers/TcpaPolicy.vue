  <template>
  <v-card>
    <v-card-title style="word-break: break-word;" class="headline grey lighten-2">
      TCPA Communication Policy
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDialog">
        <v-icon> mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container>
        <p>
          By consenting to this TCPA Communication Policy and agreeing to
          telephone contact and messaging notifications for telemarketing
          purposes, you agree that Standard Mortgage Capital our assigns,
          successors, servicing agents, or lender/real estate partners may use
          SMS notifications, calls using artificial or prerecorded voice
          messages and automatic dialing technology for all purposes not
          prohibited by applicable law for any number or electronic or physical
          address (including email) that you have provided. This includes
          authorizing Standard Mortgage Capital and/or its affiliates to contact
          you regarding the advertising or telemarketing of our products and
          services. You certify, warrant, and represent that the telephone
          numbers that you have provided to us are your contact numbers. Your
          consent, if provided, will be effective even if the number you have
          provided is registered on any state or federal DO-Not-Call (DNC) list.
          This consent for telemarketing calls and text shall remain in effect
          until you revoke it. You may revoke your consent at any time. Your
          consent to telemarketing calls and texts may be revoked by following
          any of the unsubscribe methods described below or by any other method
          that ensures we receive the revocation. You understand that consent is
          not a condition of purchase or required to obtain a loan.
        </p>
        <br />
        <p>
          STANDARD MORTGAGE CAPITAL AND OUR AGENTS, REPRESENTATIVES, AFFILIATES,
          LENDER/REAL ESTATE PARTNERS, AND ANYONE CALLING ON BEHALF MAY USE SUCH
          MEANS OF COMMUNICATION DESCRIBED IN THIS SECTION EVEN IF YOU WILL
          INCUR COSTS TO RECEIVE SUCH PHONE MESSAGES, TEXT MESSAGES, E-MAILS, OR
          OTHER MEANS.
        </p>
        <br />
        <h2>Call Recording</h2>
        <p>
          You agree that Standard Mortgage Capital and our agents,
          representatives, affiliates, lender/real estate partners, or anyone
          calling on our behalf may contact you on a recorded line.
        </p>
        <br />
        <ol>
          <li>
            <h3>1. How to Unsubscribe:</h3>
            <p>
              You may revoke your consent to receive phone calls, other than to
              service your account or collect any amounts you may owe, by
              calling us at
              <strong>(800) 488-0361</strong> or by logging into your account
              and changing your Communication Preferences. You may withdraw your
              consent to receive SMS Account Notifications by replying with
              STOP, END, CANCEL, UNSUBSCRIBE, or QUIT or by calling us at
              <strong>(800) 488-0361.</strong> We may treat your provision of an
              invalid phone number or subsequent malfunction of a previously
              valid mobile phone number as a withdrawal of your consent to
              receive SMS Account Notifications or calls.
            </p>
            <br />
          </li>
          <li>
            <h3>
              2. To request additional information contact us by telephone at
            </h3>
            <p><strong>(800) 488-0361</strong>.</p>
          </li>
        </ol>
        <p>Standard Mortgage Capital, LLC</p>
        <p>10200 West State Road 84 #104</p>
        <p>Davie, FL 33324</p>
        <p><strong>(800) 488-0361</strong></p>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods:{
    closeDialog(){
      this.$emit('closeDialog')
    }
  }
};
</script>
  
<style lang="scss" scoped>
  h2, h3 {
    font-weight: 700;

  }
</style>