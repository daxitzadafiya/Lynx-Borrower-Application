<template lang="pug">
  .uploadOuterContainer.d-flex.flex-column
    .titleText Choose Files to Upload
    div.flex-grow-1.px-5.py-5(:class="'uploadInnerContainer'+(files.length === 0?' fullHeight':'')+(isMobileDevice?' mobileDevice':'')")
      .uploadInputOuterContainer(ref='uploadContainer')
        .d-flex.flex-column.flex-grow-1.inputContainer
          .flex-grow-1.mx-auto
            inline-svg(:src="require('@/assets/images/upload-document.svg')")
          .uploadText(v-if="!isMobileDevice").mt-3.content-black-text.text-center.font-weight-medium.mx-auto
            span(v-if='!isFileBeingDragged') Drag & Drop your files here
            span(v-else-if='!mouseInsideInput && isFileBeingDragged') Drag & Drop your files over here to upload
            span(v-else-if='mouseInsideInput && isFileBeingDragged') Release the mouse to add your files
            span  or 
              a.px-0.text-decoration-underline.primary-text.bg-transparent(@clicked="browseClicked") Browse
          .browseMobileBtn.mt-3.mx-auto
            Button(
                value="Browse" 
                customClass="primary-button")

        ScanQRCode.scanQRCodeContainer(v-if="!isMobileDevice && !isUploadUsingToken" :tokenId="tokenId") 
        input(type='file' @change='fileChanged' ref='fileInput' multiple='' hidden)
    v-dialog(
        v-model="isDialogOpen"
        max-width="550"
    )
      v-card
        v-card-title.d-flex.mb-4.text-black--text.grey.lighten-2  Change Document Details
        v-card-text
            v-form(
            ref="form"
            lazy-validation
            )
              .primary-text.bold.font-weight-bold.text-center {{popupFile.actualFileName}}
              v-select(
                  :value="popupFile.documentTypeId"
                  item-text="DocumentType"
                  item-value="Id"
                  :items="documentTypes"
                  label="Document Type"
                  :rules="validation.required"
                  @change="(value) => setDocumentType(value)"
                  :menu-props="{ bottom: true, offsetY: true }"
                  )
              v-text-field(
                  label="File Name"
                  v-model="popupFile.name"
                  required
                  :rules="validation.required"
                  :disabled="nameInputDisabled"
                  )
              v-text-field(
                  label="Comment"
                  v-model="popupFile.comment"
                  )
            v-row.d-flex.justify-end.mt-3.mb-2.mr-1
                Button(
                    value="Close"
                    customClass="button-no"
                    isOutlined=true
                    @clicked="isDialogOpen=false").mr-2
                Button(
                    value="Upload"
                    customClass="button-yes"
                    @clicked="saveInfo")

</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Button from "@/components/buttons/Button";
import Vue from "vue";
import ScanQRCode from "./ScanQRCode.vue";

export default {
  components: {
    Button,
    ScanQRCode
  },
  computed: {
    ...mapGetters({
      documentTypes: "getDocumentTypes"
    })
  },
  async created() {
    if (this.documentTypes.length == 0) {
      await this.getDocumentTypes();
    }
    const ua = navigator.userAgent;
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      this.isMobileDevice = true;
    }
  },
  methods: {
    setDocumentType(value) {
      this.popupFile.documentTypeId = value;
      let documentType = this.documentTypes.find(x => x.Id === value);
      if (documentType != null) {
        if (documentType.DocumentType === "Other") {
          this.nameInputDisabled = false;
        } else {
          this.nameInputDisabled = true;
          this.popupFile.name = documentType.DefaultFileName;
        }
      }
    },
    browseClicked() {
      this.$refs.fileInput.click();
    },
    openDialog(file, index) {
      this.isDialogOpen = true;
      this.nameInputDisabled = true;
      this.openFileIndex = index;
      this.popupFile = {
        type: file.type,
        obj: file.obj,
        comment: file.comment,
        documentTypeId: file.documentTypeId,
        name: file.name,
        actualFileName: file.actualFileName
      };
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    getDocumentType(documentTypeId) {
      if (documentTypeId != null) {
        let documentTypeIndex = this.documentTypes.findIndex(
          x => x.Id == documentTypeId
        );
        if (documentTypeIndex != -1) {
          return this.documentTypes[documentTypeIndex].DocumentType;
        }
        return "";
      }
      return "";
    },
    ...mapActions(["getDocumentTypes"]),
    fileChanged(e) {
      this.files = [];
      for (var i = 0; i < e.target.files.length; i++) {
        let indexOfDot = e.target.files[i].name.lastIndexOf(".");
        this.files.push({
          actualFileName: e.target.files[i].name,
          name:
            indexOfDot == -1
              ? e.target.files[i].name
              : e.target.files[i].name.slice(0, indexOfDot),
          size: e.target.files[i].size,
          type: e.target.files[i].type,
          lastModifiedDate: e.target.files[i].lastModifiedDate,
          obj: URL.createObjectURL(e.target.files[i]),
          extension:
            indexOfDot == -1 ? "" : e.target.files[i].name.slice(indexOfDot),
          documentTypeId: null,
          comment: ""
        });
      }
      this.$refs.fileInput.value = "";
      this.mouseInsideInput = false;
      if (this.files.length > 0) {
        this.openDialog(this.files[0], 0);
      }
    },
    getDataSize(bytes) {
      if (Math.abs(bytes) < 1024) {
        return bytes + " B";
      }

      const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      let u = -1;
      const r = 10;

      do {
        bytes /= 1024;
        ++u;
      } while (
        Math.round(Math.abs(bytes) * r) / r >= 1024 &&
        u < units.length - 1
      );
      return bytes.toFixed(1) + " " + units[u];
    },
    getDate(date) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let exactDate = date.getDate();
      return (
        exactDate +
        (exactDate === 1
          ? "st"
          : exactDate == 2
          ? "nd"
          : exactDate == 3
          ? "rd"
          : "th") +
        " " +
        monthNames[date.getMonth()] +
        " " +
        date.getFullYear()
      );
    },
    removeItem(index, e) {
      this.files.splice(index, 1);
      e.stopPropagation();
      return false;
    },
    dragOverEvent(e) {
      var dt = e.dataTransfer;
      if (
        dt.types &&
        (dt.types.indexOf
          ? dt.types.indexOf("Files") != -1
          : dt.types.contains("Files"))
      ) {
        this.isFileBeingDragged = true;
        if (
          e.x > this.$refs.uploadContainer.getBoundingClientRect().left &&
          e.x < this.$refs.uploadContainer.getBoundingClientRect().right &&
          e.y > this.$refs.uploadContainer.getBoundingClientRect().top &&
          e.y < this.$refs.uploadContainer.getBoundingClientRect().bottom
        ) {
          this.mouseInsideInput = true;
        } else {
          this.mouseInsideInput = false;
        }
      } else {
        this.isFileBeingDragged = false;
      }
    },
    dragLeaveEvent() {
      this.isFileBeingDragged = false;
    },
    async saveInfo() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        Vue.set(this.files[this.openFileIndex], "name", this.popupFile.name);
        Vue.set(
          this.files[this.openFileIndex],
          "comment",
          this.popupFile.comment
        );
        Vue.set(
          this.files[this.openFileIndex],
          "documentTypeId",
          this.popupFile.documentTypeId
        );
        await this.uploadFile(this.files[this.openFileIndex]);
        this.files.splice(0, 1);
        this.isDialogOpen = false;
        if (this.files.length != 0) {
          setTimeout(() => {
            this.openDialog(this.files[0], 0);
          }, 500);
        }
      }
    }
  },
  data() {
    return {
      validation: {
        required: [v => !!v || "This field is required!"]
      },
      isMobileDevice: false,
      files: [],
      isGridView: false,
      mouseInsideInput: false,
      isFileBeingDragged: false,
      isDialogOpen: false,
      popupFile: {
        type: ""
      },
      openFileIndex: -1,
      nameInputDisabled: true,
      showErrorHighlight: false,
      isAlertDialogOpen: false
    };
  },
  mounted() {
    window.addEventListener("dragover", this.dragOverEvent);
    window.addEventListener("dragleave", this.dragLeaveEvent);
    // let url = new URL(window.location.href);
    // if(url.searchParams.get("tokenId")!=null){
    //   this.tokenId = url.searchParams.get("tokenId");
    // }
  },
  props: {
    uploadFile: {
      type: Function
    },
    tokenId: {
      type: String
    },
    isUploadUsingToken: {
      type: Boolean
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/variables.scss";
.uploadOuterContainer {
  flex-direction: column;
  height: max-content;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  .titleText {
    padding: 10px 0px;
    text-align: center;
    font-size: 24px;
    @media (max-width: $mobile-width) {
      margin: 0px;
      font-size: 14px;
      padding-bottom: 0px;
      padding-top: 20px;
      line-height: 20px;
    }
  }
  .uploadInnerContainer {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    &.fullHeight {
      height: 100%;
    }

    flex-direction: column;
  }
  .filesAddedContainer {
    padding: 10px;
    width: 100%;
    .addedFilesHeader {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid
        adjust-color($primary-text-color, $lightness: 40%);
      margin-bottom: 10px;
    }
    .viewToggle {
      .active {
        color: $primary-text-color;
      }
      button {
        cursor: pointer;
        margin: 0px 5px;
      }
    }
    .fileInnerContainer {
      display: flex;
      flex-direction: column;
      .singleFileContainer {
        display: flex;
        flex-direction: row;
        height: 130px;
        width: 100%;
        padding: 10px;
        position: relative;
        &.redBackground {
          background-color: rgba(255, 0, 0, 0.3);
        }
        &:hover,
        &:focus {
          background-color: adjust-color(
            $primary-text-color,
            $lightness: 80%,
            $alpha: 0.3
          );
        }
        .imageContainer {
          position: relative;
          height: 100%;
          width: 130px;
          display: flex;
          justify-content: center;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 5px;
            box-shadow: 0px 0px 5px 1px rgba($color: #000000, $alpha: 0.2);
          }
          i {
            font-size: 82px;
            margin-left: -10px;
            margin-top: -10px;
            margin-bottom: -10px;
            margin-right: -10px;
          }
        }
        .detailsContainer {
          flex: 1;
          margin-left: 10px;
          div {
            .dataText {
              font-weight: bold;
            }
          }
          .fileType,
          .fileSize {
            font-size: 14px;
          }
          .fileName {
            width: 100%;
            display: flex;
            :not(:first-child) {
              font-weight: bold;
            }
          }
        }
        .deleteContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background: white;
          border-radius: 50%;
          padding: 5px;
          height: 34px;
          width: 34px;
          flex-shrink: 0;
          &:hover,
          &:focus {
            i {
              color: red;
            }
          }
        }
      }
      &.gridView {
        flex-flow: wrap;
        .singleFileContainer {
          flex-direction: column;
          height: auto;
          width: auto;
          align-items: center;
          justify-content: center;
          .imageContainer {
            i {
              font-size: 130px;
            }
          }
          .detailsContainer {
            margin-left: 0px;
            .fileName {
              width: 110px;
              font-weight: bold;
              font-size: 14px;
              justify-content: center;
              .ellipsedText {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 85px;
              }
              .nonellipsedText {
                width: 24px;
                flex-shrink: 0;
              }
            }
          }
          .deleteContainer {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }
  }
  .uploadButtonContainer {
    display: flex;
    padding: 20px 0px;
    justify-content: center;
    .uploadButton {
      height: 40px;
      width: 152px;
      min-width: 64px;
      padding: 0 16px;
      border-radius: 28px;
      margin: 0 auto;
      background: $primary-text-color;
      color: white;
      width: fit-content;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i {
        color: white;
      }
    }
  }
}

.inputContainer {
  border-right: 1px solid $lightBlue;
  padding-left: 0px;
  padding-right: 25px;
  svg,
  img {
    width: 100%;
    max-width: 220px;
    height: 100%;
    max-height: 220px;
  }
}

.scanQRCodeContainer {
  padding-left: 25px;
  padding-right: 0px;
}

.uploadInputOuterContainer {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  border: 2px dashed $lightBlue;
  border-radius: 5px;
  overflow: hidden;
  pointer-events: none;
  position: relative;
  padding: 40px 25px;
  .uploadText {
    max-width: 220px;
    @media (max-width: $tablet-width) {
      display: none;
    }
  }
  @media (max-width: 550px) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: none;
    .inputContainer {
      border-right: 0px;
      border-bottom: 1px solid $lightBlue;
      padding-right: 0px;
      padding-bottom: 20px;
    }
    .scanOuterContainer {
      padding-left: 0px;
      padding-top: 20px;
    }
  }
  .browseMobileBtn {
    display: none;
    min-height: 38px;
    @media (max-width: $tablet-width) {
      display: block;
    }
  }
}
</style>
