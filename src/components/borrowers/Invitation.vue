<template>
  <v-card class="invitation d-flex flex-column" mx-auto="mx-auto" light="light">
    <v-card-title class="invitation__title dialog-header-back dialog-header-text">Invite a Co-Borrower
      <v-btn icon="icon" @click="toggleIsOnlay({isOnlay: false})">
        <v-icon class="invitation__close" color="white">mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-container class="px-0 py-0 flex-grow-1 overflow-y-auto" fluid="fluid">
      <v-card-text class="invitation__main">
        <v-row class="invitation__pending" v-if="invitations.length">
          <v-col class="invitation__label" sm="4" cols="12">Pending Invitations</v-col>
          <Input :smVal="''" defaultComponent="v-select" :value="selectedInvitee" :menu-props="{light: true, bottom: true, offsetY: true }" :items="invitationsNames" @change="setInvitee" attach="attach"></Input>
        </v-row>
        <p class="invitation__subtitle">Please let us know who you would like to invite as a co-borrower on this loan</p>
        <v-btn-toggle class="btnToggleGroup" :value="Invitee.BorrowerType" @change="Invitee.BorrowerType=item.title">
          <v-row class="invitation__row cards">
            <ToggleCard v-for="(item, index) in types" :key="index" :value="item.title">
              <inline-svg :src="item.src"></inline-svg>
              <p>{{ item.title }}</p>
            </ToggleCard>
          </v-row>
        </v-btn-toggle>
        <v-row class="invitation__row pt-5">
          <Input inputTitle="First Name" :isRequired="true" v-model="Invitee.FirstName" :rules="[rules.required]" :mdVal="6"></Input>
          <Input inputTitle="Last Name" :isRequired="true" v-model="Invitee.LastName" :mdVal="6" :rules="[rules.required]"></Input>
        </v-row>
        <v-row class="invitation__row">
          <Input :isRequired="true" :mdVal="6" inputTitle="Email" v-model="Invitee.Email" :rules="[rules.required, rules.email]"></Input>
          <Input inputTitle="Cell Phone" :value="formatted" :rules="[rules.required]" :mdVal="6" :isRequired="true" @input="(e) => Invitee.Phone = e" @keypress="(e) => validatePhone(e)"></Input>
        </v-row>
        <v-row class="invitation__row">
          <v-col class="invitation__col" sm="12" cols="12"> <span class="invitation__label">Will the co-borrower occupy the subject property?</span></v-col>
          <v-col class="invitation__col" sm="3" cols="6"> 
            <v-row class="invitation__radios">
              <div class="invitation__radio">
                <Radio :isOn="Invitee.WillOccupyProperty" label="YES" @toggleRadio="Invitee.WillOccupyProperty=!Invitee.WillOccupyProperty"></Radio>
              </div>
              <div class="invitation__radio">
                <Radio :isOn="!Invitee.WillOccupyProperty" label="NO" @toggleRadio="Invitee.WillOccupyProperty=!Invitee.WillOccupyProperty"></Radio>
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="invitation__row">
          <v-col class="invitation__col" sm="12" cols="12"> <span class="invitation__label">Does the co-borrower live at the same address as you?</span></v-col>
          <v-col class="invitation__col" sm="3" cols="6"> 
            <v-row class="invitation__radios">
              <div class="invitation__radio">
                <Radio :isOn="Invitee.LiveAtSameAddress" label="YES" @toggleRadio="Invitee.LiveAtSameAddress=!Invitee.LiveAtSameAddress"></Radio>
              </div>
              <div class="invitation__radio">
                <Radio :isOn="!Invitee.LiveAtSameAddress" label="NO" @toggleRadio="Invitee.LiveAtSameAddress=!Invitee.LiveAtSameAddress"></Radio>
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="invitation__row">
          <Input inputTitle="Message to co-borrower" placeholder="Enter your message" v-model="Message" :smVal="12"></Input>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <div class="invitation__button" v-if="isNewInvitation">
        <div class="invitation_desktop-button">
          <Button value="Send Invitation" customClass="primary-button" @clicked="sendInvitationAndClose" :isDisabled="isDisabled"></Button>
        </div>
        <div class="invitation_mobile-button">
          <Button value="Send Invitation" customClass="primary-button" width="200px" @clicked="sendInvitationAndClose" :isDisabled="isDisabled"></Button>
        </div>
      </div>
      <div class="invitation__buttons" v-else>
        <Button value="Resend Invitation" customClass="primary-button" @clicked="resendSelectedInvitation"></Button>
        <Button value="Cancel Invitation" customClass="primary-button" @clicked="cancelSelectedInvitation"></Button>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import Radio from "@/components/form/Radio";
import Button from "@/components/buttons/Button";
import scrollToTop from "@/mixins/scrollToTop.js";
import onlyNum from "@/mixins/onlyNum.js";
import phoneFormat from "@/mixins/phoneFormat.js";
import ToggleCard from "@/components/controls/ToggleCard";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [scrollToTop, onlyNum, phoneFormat],
  data() {
    return {
      types: [
        {
          src: require("@/assets/images/borrowers/spouse.svg"),
          title: "Spouse"
        },
        {
          src: require("@/assets/images/borrowers/relative.svg"),
          title: "Relative"
        },
        {
          src: require("@/assets/images/borrowers/other.svg"),
          title: "Other"
        }
      ],
      isNewInvitation: true,
      invitationToken: "",
      Invitee: {
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        BorrowerType: "Spouse",
        WillOccupyProperty: true,
        LiveAtSameAddress: true
      },
      Message: "",
      selectedInvitee: "",
      rules: {
        required: value => !!value || "Required.",
        email: value => {
          const pattern = this.emailRegex;
          return pattern.test(value) || "Invalid e-mail.";
        }
      },
      emailRegex: /[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
    };
  },
  methods: {
    ...mapActions([
      "toggleIsOnlay",
      "inviteBorrower",
      "resendInvitation",
      "cancelInvitation"
    ]),
    validatePhone(e) {
      if (e.target.value.length === 14) {
        e.preventDefault();
        return false;
      }
      return this.isOnlyNum(e);
    },
    async sendInvitationAndClose() {
      this.Invitee.Phone = this.Invitee.Phone.replace(/\D/g, "");
      await this.inviteBorrower({
        Invitee: this.Invitee,
        Message: this.Message
      });
      this.toggleIsOnlay({ isOnlay: false });
    },
    async resendSelectedInvitation() {
      await this.resendInvitation({
        Invitee: this.Invitee,
        Message: this.Message,
        InvitationToken: this.invitationToken
      });
      this.toggleIsOnlay({ isOnlay: false });
    },
    async cancelSelectedInvitation() {
      await this.cancelInvitation(this.invitationToken);
      this.setDefaultInvitationData();
    },
    setInvitee(value) {
      if (value !== "New Invitation") {
        this.selectedInvitee = value;
        const index = this.invitationsNames.indexOf(value);
        this.Invitee = { ...this.invitations[index].Invitee };
        this.invitationToken = this.invitations[index].InvitationToken;
        this.Message = this.invitations[index].Message;
        this.isNewInvitation = false;
      } else {
        this.setEmptyData();
        this.selectedInvitee = "New Invitation";
      }
    },
    setDefaultInvitationData() {
      if (this.invitations.length) {
        this.Invitee = { ...this.invitations[0].Invitee };
        this.Message = this.invitations[0].Message;
        this.invitationToken = this.invitations[0].InvitationToken;
        this.selectedInvitee = this.invitationsNames[0];
        this.isNewInvitation = false;
      } else {
        this.setEmptyData();
      }
    },
    setEmptyData() {
      this.Invitee = {
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        BorrowerType: "Spouse",
        WillOccupyProperty: true,
        LiveAtSameAddress: true
      };
      this.invitationToken = "";
      this.Message = "";
      this.selectedInvitee = "";
      this.isNewInvitation = true;
    }
  },
  computed: {
    ...mapGetters({
      invitations: "getAllInvitations"
    }),
    formatted() {
      if (this.Invitee.Phone) {
        return this.getFormattedPhone(this.Invitee.Phone);
      }
      return "";
    },
    isDisabled() {
      return (
        !this.Invitee.FirstName ||
        !this.Invitee.LastName ||
        !this.Invitee.Phone ||
        !this.Invitee.Email ||
        !this.emailRegex.test(this.Invitee.Email)
      );
    },
    invitationsNames() {
      if (this.invitations.length) {
        const invitationsNames = this.invitations.map(
          item => `${item.Invitee.FirstName} ${item.Invitee.LastName}`
        );
        return [...invitationsNames, "New Invitation"];
      }
      return [];
    }
  },
  components: {
    Radio,
    Button,
    ToggleCard
  },
  mounted() {
    this.setDefaultInvitationData();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

.invitation {
  width: 100%;
  max-width: 705px;
  &__pending {
    align-items: center;
  }
  &__menu {
    height: 65px;
    position: relative;
    &:deep(input) {
      display: none !important;
    }
  }
  &__title {
    background-color: $primary;
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 30px;
  }
  &__main {
    padding: 20px 30px;
  }
  &__subtitle {
    font-size: 16px;
    margin-bottom: 20px;
  }
  &__radios {
    align-items: center;
    justify-content: space-around;
  }
  &__label {
    font-size: 16px;
  }
  &__buttons {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    &:deep(.button) {
      margin: 0 10px;
    }
  }
  &__button {
    width: 100%;
    margin: 20px 0;
  }
  &_desktop-button {
    margin: 0 auto;
    width: 152px;
  }
  &_mobile-button {
    margin: 0 auto;
    width: 200px;
    display: none;
  }
}

.status-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 22px;
  cursor: pointer;
  &__title {
    font-size: 18px;
    margin-top: 10px;
    color: $icon-gray;
    font-weight: bold;
  }
  &_selected {
    border: 2px solid $tile-selected-outline-color;
    background-color: white;
    .status-card__title {
      color: $primary;
    }
  }
}

@media (max-width: 760px) {
  .invitation {
    max-width: 90%;
  }
}

@media (max-width: 450px) {
  .invitation {
    &__title {
      padding: 10px 10px 10px 15px;
    }
    &__main {
      padding: 30px 15px;
    }
    &__buttons {
      &:deep(.button) {
        margin: 0 5px;
      }
    }
    &_padding-0-col {
      padding-top: 0;
      padding-bottom: 0;
    }
    &_desktop-button {
      display: none;
    }
    &_mobile-button {
      display: block;
    }
  }
  .cards {
    margin-bottom: 10px;
  }
}
</style>
