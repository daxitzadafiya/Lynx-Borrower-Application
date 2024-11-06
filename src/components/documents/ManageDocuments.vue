<template lang="pug">
    div.outerContainer(v-if="documentList.length>0" :style="isUploadUsingToken?'margin: 0 auto;':''")
        .innerContainer
            .documentList.mb-3
                v-data-table.content-table.tripleActions(:headers="headers"
                    :items="documentList"
                    class="elevation-1"
                    style="width:100%"
                    :hide-default-footer="true"
                    :sort-by="['UploadedDate']"
                    :sort-desc="[true]"
                    :mobile-breakpoint="0"
                    )
                    template(v-slot:item.FileSizeInKB="{ item }")
                        span.mw-220 {{ (bytesToSize(item.FileSizeInKB)) }}
                    template(v-slot:item.FileName="{ item }")
                        span.mw-220 {{ (getFormattedName(item)) }}
                    template(v-slot:item.IsUploaded="{ item }")
                            v-progress-linear(
                                v-model="item.progressPercent"
                                height="25"
                                v-if="!item.IsUploaded && !item.errorUploading"
                            )
                                template(v-slot:default="{ value }")
                                    strong(style="color:white") {{ (Math.ceil(value)+"%") }}
                            .red--text.font-weight-bold(v-else-if="item.errorUploading").danger Error
                            .d-flex(v-else)
                                span Complete
                    template(v-slot:item.Action="{ item }")
                        .d-flex.actionsContainer
                            v-btn(icon small @click="downloadFile(item.Id)" :disabled="!item.IsUploaded").downloadIcon
                                v-icon description
                            v-btn(icon small @click="editItem(item)" :disabled="!item.IsUploaded").editIcon
                                inline-svg(:src="editIcon")
                            v-btn(icon small @click="showDeletePopup(item)" :disabled="!item.IsUploaded").deleteIcon
                                        inline-svg(:src="deleteIcon")


                        
                div.singleDocument(v-for="(document, index) in documentList" :key="index" :class="index===selectedDocumentIndex?'selected singleDocument':'singleDocument'" @click="selectedDocumentIndex=index;isDialogOpen=true;" v-if="false")
                    div.imageSection
                        img(:src="document.fileURL" v-if="document.isImage")
                        v-icon(v-if="!document.isImage") description
                    div.textSection
                        div.fileName {{document.FileName}}
                        div.fileExtension {{document.FileExtension}}

        v-dialog(
            v-model="deletePopupActive"
            width="500"
            
        )
            v-card(style="background:white")
                v-card-title(class="text-h5 grey lighten-2") Delete File?
                    
                v-card-text.mt-7 Are you sure you want to delete {{getFormattedName(documentList[selectedDocumentIndex])}}?
                v-divider

                v-card-actions
                    v-spacer
                    Button(
                        value="Cancel"
                        customClass="button-no"
                        isOutlined=true
                        @clicked="deletePopupActive = false").mr-2
                    Button(
                        value="Delete"
                        customClass="button-yes"
                        @clicked="deletePopupActive = false;deleteFile(documentList[selectedDocumentIndex].Id);")
        v-dialog(
            v-model="unmountModalActive"
            width="500"
            
        )
            v-card(style="background:white")
                v-card-title(class="text-h5 grey lighten-2") Alert
                    
                v-card-text.mt-7 Some files are not uploaded completely. Please wait.
                v-divider

                v-card-actions
                    v-spacer
                    Button(
                        value="Close"
                        customClass="button-yes"
                        @clicked="unmountModalActive=false")
</template>

<script>
import Button from "@/components/buttons/Button";
import { mapActions, mapGetters } from "vuex";
import config from "@/configs";
import Vue from "vue";
import moment from "moment";

export default {
    components:{
        Button
    },
  data() {
    return {
        headers: [
            {
            text: "Document",
            value: "FileName",
            },
            { 
                text: "Date/Time", 
                value: "formattedDate", 
            },
            {
            text: "Size",
            value: "FileSizeInKB",
            },
            {
            text: "Comment",
            value: "Comments",
            },
            {
            text: "Status",
            value: "IsUploaded",
            },
            {
            text: "Action",
            value: "Action",
            }
        ],
        documentList:[],
        selectedDocumentIndex: -1,
        validation: {
            required: [v => !!v || 'This field is required!']
        },
        deletePopupActive: false,
        documentsLoadIntervalObj: null,
        unmountModalActive: false,
        editIcon:require("@/assets/images/edit.svg"),
        deleteIcon:require("@/assets/images/delete.svg")

    };
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      documentTypes: "getDocumentTypes"
    })
  },
  async created(){
      if(!this.isUploadUsingToken){
        this.tryLoadDocuments()
      }
  },
  methods: {
    ...mapActions(["toggleIsOnlay","setAlert","getDocuments","deleteDocument","getDocumentTypes","uploadDocument","getFile"]),
    async navigateToReview(){
        if(this.isUploadUsingToken){
            this.$parent.$parent.OnFilesUploadedSuccessfully()
        }
        else{
            await this.$router.push("/review/");
        }
    },
    async tryNavigating(){
        if(this.documentList.findIndex(x=>x.Id==null)!=-1){
            this.unmountModalActive=true;
        }
        else{
            await this.navigateToReview();
        }
    },
    getFormattedName(item){
        if(item==null)
            return ''
        if(this.documentTypes.length==0)
            return item.FileName
        let documentType = this.documentTypes.find(x=>x.Id===item.DocumentTypeId)
        if(documentType==null||documentType.DocumentType==="Other"){
            return item.FileName
        }
        else{
            return documentType.DocumentType
        }
    },
    async addFile(file){
        file.isUploaded = false;
        file.UploadedDate = new Date();
        file.FileName = file.name;
        file.Comments = file.comment;
        file.DocumentTypeId = file.documentTypeId;
        file.formattedDate = moment(file.UploadedDate).format("MMMM DD, YYYY hh:mm:ss A")
        file.FileSizeInKB = parseInt(file.size/1000)
        file.progressPercent = 0;
        var formData = new FormData();
        formData.append("files[]", await fetch(file.obj).then(r => r.blob()),file.name+file.extension);
        let data = [];
        data.push({
            "FileName":file.FileName,
            "DocumentTypeId":file.DocumentTypeId,
            "Comments":file.Comments
            })
        formData.append('data',JSON.stringify(data));
        const curFileGUID = this.createUUID();
        file.GUID = curFileGUID;
        const fileIndex = this.documentList.push(file)-1;
        this.documentList[fileIndex].uploadObj = this.uploadDocument({data:formData,tokenId:this.currentLoan==null?this.tokenId:null,loanId:this.currentLoan==null?null:this.currentLoan.Id,progressEvent:function(progressEvent){
            let fileIndexFromGUID =this.documentList.findIndex(x=>x.GUID === curFileGUID)
            Vue.set(this.documentList[fileIndexFromGUID],'progressPercent',Math.min(Math.round((progressEvent.loaded * 100) / progressEvent.total),99));
            this.$forceUpdate();
        }.bind(this)});

        this.documentList[fileIndex].uploadObj.then(response=>{
            let fileIndexFromGUID =this.documentList.findIndex(x=>x.GUID === curFileGUID)
            if(this.documentList.findIndex(x=>x.Id === response[0].Id)===-1){
                let newDocument = {
                    formattedDate : moment(response[0].UploadedDate).format("MMMM DD, YYYY hh:mm:ss A"),
                    IsUploaded : true,
                    Comments : response[0].Comments,
                    DocumentTypeId : response[0].DocumentTypeId,
                    FileExtension : response[0].FileExtension,
                    FileName : response[0].FileName,
                    FileSizeInKB : response[0].FileSizeInKB,
                    Id : response[0].Id,
                    LoanId : response[0].LoanId,
                    UploadedDate : response[0].UploadedDate,
                    FileUploadCompleted : response[0].FileUploadCompleted
                }
                this.documentList.splice(fileIndexFromGUID,1,newDocument)
            }
            else{
                this.documentList.splice(fileIndexFromGUID,1)
            }
            
        }).catch(error=>{
            this.setAlert({
                isAlert: true,
                alertType: "error",
                alertMessage: "Could not Upload file "+this.documentList[fileIndex].FileName
            });
            this.documentList[fileIndex].errorUploading = true;
            this.$forceUpdate();
        })
    },
    bytesToSize(bytes) {
        var sizes = ['KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    async downloadFile(documentId){
        let blob=await this.getFile(documentId)
        let url=URL.createObjectURL(blob);
        var a = window.document.createElement("a");
        a.setAttribute("target","_blank");
        a.style = "display: none";
        window.document.body.appendChild(a);
        a.href = url;
        let document = this.documentList.find(x=>x.Id==documentId);
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            window.document.body.removeChild(a);
            }, 1000)
    },
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    async tryLoadDocuments(){
        if(this.currentLoan !=null && this.currentLoan.Id !=null){
            if(this.documentsLoadIntervalObj==null){
                this.documentsLoadIntervalObj = setInterval(this.tryLoadDocuments, config.filesPollingInterval?config.filesPollingInterval:5000)
            }
            let lastDocument = null
            if(this.documentList!=null && this.documentList.length>0){
                lastDocument = this.documentList.reduce(
                    (doc1, doc2) =>
                        (doc1.Id !=null && doc1.Id < doc2.Id)
                        ? doc2
                        : doc1
                    )
            }
            await this.getDocuments({loanId:this.currentLoan.Id,lastDocumentId:lastDocument!=null?lastDocument.Id:null}).then((res)=>{
                this.mergeDocumentList(res)
            }).catch(err=>{
                clearInterval(this.documentsLoadIntervalObj)
                
            })

        }
    },
    mergeDocumentList(newDocumentList){
        newDocumentList.forEach((document)=>{
            if(document.StatusId==1 && this.documentList.findIndex(x=>x.Id===document.Id)===-1){
                document.IsUploaded = true;
                document.formattedDate = moment(document.UploadedDate).format("MMMM DD, YYYY hh:mm:ss A")
                this.documentList.push(document);
            }
        })
    },
    getDocumentType(documentTypeId){
      if(documentTypeId!=null){
        let documentTypeIndex = this.documentTypes.findIndex(x=>x.Id==documentTypeId);
        if(documentTypeIndex!=-1){
          return this.documentTypes[documentTypeIndex].DocumentType
        }
        return ""
      }
      return ""
    },
    showDeletePopup(item){
        this.selectedDocumentIndex = this.documentList.findIndex(x=>x.Id===item.Id);
        this.deletePopupActive = true
    },
      async deleteFile(Id){
        try{
            this.toggleIsOnlay({ isOnlay: true });
                await this.deleteDocument(Id);
            this.documentList.splice(this.selectedDocumentIndex,1);
            this.selectedDocumentIndex = -1;
        }
        catch(e){
            this.setAlert({
                isAlert: true,
                alertType: "error",
                alertMessage: "Could not delete the file."
            });
        }
        finally{
            this.toggleIsOnlay({ isOnlay: false });
        }
      },
        preventNav(event) {
            if(this.documentList.findIndex(x=>x.Id==null)!=-1){
                event.preventDefault()
                event.returnValue = "Some files are not uploaded completely. Please wait."
            }
        }
    },
  watch: {
    currentLoan: {
      deep: true,
      async handler(newVal) {
        await this.tryLoadDocuments();
      }
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav)
  },
  beforeDestroy() {
      clearInterval(this.documentsLoadIntervalObj)

    window.removeEventListener("beforeunload", this.preventNav);
  },
  props: {
    tokenId: {
      type: String
    },
    loanId:{
        type: Number
    },
    isUploadUsingToken:{
        type: Boolean
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
.iconButton{
    margin: 5px;
    border-radius: 50%;
    margin-top:12px;
    min-width:unset !important;
    width:36px;
}
.largeIcon{
    font-size:48px;
}
:deep(.v-dialog){
    max-height:unset !important;
}
.vuePdf{
    width: 100%;
    height: 100%;
}
.dialogBody{
    position: relative;
    width: 100%;
    height: calc(100vh - 110px);
    display: block;
    .dialogBodyInner{
        width: 100%;
        height: 100%;
        position:absolute;
        display: flex;
        justify-content:center;
        align-items:center;
        span{
            width: 100%;
            height: 100%;

        }
    }
}
.dialogImage{
    max-width: 100%;
    max-height: 100%;
}
.parentWidth{
    width: 100%;
}
.outerContainer{
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    width: 100%;
    .innerContainer{
        width: 100%;
        .documentList{
            width: 100%;
            display: flex;
            .singleDocument{
                width: 100px;
                height: 135px;
                margin: 5px;
                padding: 5px;
                &:hover, &:focus{
                    background: adjust-color(
                        $primary-text-color,
                        $lightness: 80%
                    );
                }
                &.selected{
                    background: adjust-color(
                        $tile-selected-outline-color,
                        $lightness: 40%
                    );
                }
                .imageSection{
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    overflow: hidden;
                    img{
                        display: inline-block;
                        max-width: 100px;
                        max-height: 100px;
                        height: auto;
                        width: auto;
                    }
                    i{
                        font-size: 82px;
                    }
                }
                .textSection{
                    padding-top:5px;
                    display: flex;
                    width: 100px;
                    font-size: 14px;
                    justify-content: center;
                    .fileName {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 60px;
                    }
                    .fileExtension {
                        width: 40px;
                        flex-shrink: 0;
                    }
                }

            }
        }
        .selectedDocumentInfo{
            width: 50vw;
            border-left: 1px solid adjust-color(
            $primary-text-color,
            $lightness: 80%
            );
            padding: 5px;
            .header{
                display: flex;
                i{
                    padding-right: 10px;
                }
            }
            .documentImage{
                img{
                    width: 100%;
                    padding: 10px 0px;
                }
                i{
                    font-size: 82px;
                    padding: 10px 0px;
                }
            }
        }
        
    }
}
:deep(.secondary-button){
    background: red !important;
    margin-top: 5px;
}

.content-table{
    :deep(table){
        min-width: 700px;
    }
}
</style>
