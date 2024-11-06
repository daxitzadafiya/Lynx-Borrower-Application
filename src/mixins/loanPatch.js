import { mapActions, mapGetters } from "vuex";
import store from "@/store";

export default {
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      selectedBorrower: "getBorrower",
      borrowers: "getBorrowers",
      currentSectionObj: "getCurrentSection",
      currentPageObj: "getCurrentPage",
      currentSectionAndPageData: "getCurrentSectionAndPageData",
      progressModelActive: "getProgressModelActive",
      loanPurposeType: "getLoanPurposeType",
      getSpecificResidence: "getSpecificResidence",
      creditOrders: "getLoadedCreditOrders",
      borrowersState: "getBorrowersState",
      realEstate: "getRealEstate",
      currentRealEstateIndex: "getRealEstateEditingIndex",
      borrowerEmployment: "getBorrowerEmployment" 
    }),
    currentRealEstate() {
      return this.realEstate[this.currentRealEstateIndex] || null;
    },
    curBorrower(){
      if (this.curCoBorrower && this.curCoBorrower.Id === this.selectedBorrower.Id)
      {
        return this.borrowers.find(item => item.LinkedBorrowerId === this.selectedBorrower.Id && !item.CoBorrower );
      }
      return this.selectedBorrower;
    },
    curCoBorrower() {
      if (this.borrowers.length) {
        return this.borrowers.find(item => item.CoBorrower &&  (this.selectedBorrower.Id === item.Id ||  this.selectedBorrower.Id === item.LinkedBorrowerId));
      }
      return null;
    },
    curBorrowerCurrentEmployment(){
      return this.borrowerEmployment.find(item => item.EmploymentStatusType === "Current") || null;
    },
    curBorrowerPreviousEmployment(){
      return this.borrowerEmployment.find(item => item.EmploymentStatusType === "Previous") || null;
    },
  },
  methods: {
    ...mapActions(["saveLoanPatches"]),

    //New Routing Methods 
    //Public Method 
    async saveAndAdvance(saveLoan, requestedNextPath, preventCompletionObjectAddition)
    {

      let currentPath = this.$route.path.replace(/\/$/, '');

      let nextPath = requestedNextPath;

      let {sectionIndex, pageIndex} = this.findPageIndexAndSectionIndex(currentPath);

      //Should we still write completions even when the Progress Model is Inactive ?
      if (this.progressModelActive && !preventCompletionObjectAddition)
      {
        if( sectionIndex!=-1 && pageIndex!=-1)
        {
          this.addCompletion(this.currentLoan.LoanProgress.Sections[sectionIndex].Pages[pageIndex],
            { 
              BorrowerId: this.selectedBorrower.Id,
              CompletedWhen: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 19)
          });          
        }
      }

      if (saveLoan) {
        await this.saveLoanPatches();
      }

      //Get the next route 
      if(sectionIndex == -1)
        sectionIndex = 0;
         
      if(pageIndex == -1)
        pageIndex = 0;
      else //Advance to the next page 
        pageIndex++;

      if (!nextPath) {
        nextPath = this.getNextPath(sectionIndex, pageIndex);
      }

      if (nextPath != null && this.$route.path != nextPath)
      {
        await this.$router.push(nextPath);
        return;
      }

    },

    getNextPath(sectionIndex, pageIndex){

      let currentLoan = this.currentLoan
      if (!currentLoan)
        currentLoan = store.getters.getCurrentLoan;

      let selectedBorrower = this.selectedBorrower;
      if (!selectedBorrower)
         selectedBorrower = currentLoan.Borrowers[0];

      for (let i = sectionIndex; i < currentLoan.LoanProgress.Sections.length; i++) {
          const section = currentLoan.LoanProgress.Sections[i];
          // Iterate over pages in the section
        for (let j = pageIndex; j < section.Pages.length; j++) {
          
          const page = section.Pages[j];

          // We always navigate to Pages with Rules 3 and 4 regardless if they have already been completed. 
          switch(page.RuleId){
            //Always Show Rules 
            case 3:
            case 4:
              return "/" + page.Route;

            //Page Specific Rules
            case 5: //Borrower
            case 6: //Loan & Property
            case 7: //Credit 
            case 8: //Accounts & Assets 
            case 9: //Employment & Income
               
                switch(page.Route) {

                  // ,
                  // nextRoute() {
                  //   if (this.isNotEmployed) {
                  //     return "employmentandincome/other-income";
                  //   } else if (this.currentEmployment.EmploymentBorrowerSelfEmployedIndicator) {
                  //     return `employmentandincome/${this.routePrepend}ownership-percentage`;
                  //   } else if (this.classificationType === "Secondary") {
                  //     return `employmentandincome/${this.routePrepend}partytotransaction`;
                  //   } else {
                  //     return `employmentandincome/${this.routePrepend}employedByFamilyMember`;
                  //   }
                  // }



                  //Employment & Income

                  case "employmentandincome/employedByPartyToTransaction":

                    if((this.curBorrowerCurrentEmployment) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                  }                    

                  case "employmentandincome/employedByFamilyMember":

                    if((this.curBorrowerCurrentEmployment) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }

                  case "employmentandincome/ownership-percentage":

                    if((this.curBorrowerCurrentEmployment && this.curBorrowerCurrentEmployment.EmploymentBorrowerSelfEmployedIndicator) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }

                  case "employmentandincome/job-details":

                    if((this.curBorrowerCurrentEmployment) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }

                  case "employmentandincome/compensation-types":

                    if((this.curBorrowerCurrentEmployment) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }

                  case "employmentandincome/compensation-details":

                    if((this.curBorrowerCurrentEmployment) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }                    

                  case "employmentandincome/previous-employment":

                    if((this.curBorrowerCurrentEmployment && (this.curBorrowerCurrentEmployment.EmploymentStartDate && moment().diff( this.curBorrowerCurrentEmployment.EmploymentStartDate, "years") < 2)) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }  

                  case "employmentandincome/previous-employment-details":

                    if((this.curBorrowerCurrentEmployment && (this.curBorrowerCurrentEmployment.EmploymentStartDate && moment().diff( this.curBorrowerCurrentEmployment.EmploymentStartDate, "years") < 2)) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }  


                  case "employmentandincome/additional-employment":

                    if((this.curBorrowerCurrentEmployment && (this.curBorrowerCurrentEmployment.EmploymentStartDate && moment().diff( this.curBorrowerCurrentEmployment.EmploymentStartDate, "years") < 2)) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                    }  


                  // case "employmentandincome/other-income":

                  //   if((!this.curBorrowerCurrentEmployment) && 
                  //    !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                  //     return "/" + page.Route;
                  //   }

                  // case "employmentandincome/other-income-details":

                  //   if((!this.curBorrowerCurrentEmployment) && 
                  //    !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                  //     return "/" + page.Route;
                  //   }

                  //Accounts and Assets Section 
                  case "accountsandassets/address" :
 
                   if ((this.borrowersState.realEstateOwned)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }
            
                    break;

                  case "accountsandassets/property-status" :                     
    
                       if (this.currentRealEstate  && 
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                            return "/" + page.Route;
                        }
                
                        break;

                  case "accountsandassets/value" :

                      if ((this.currentRealEstate &&
                          (this.currentRealEstate.PropertyDispositionStatusType != "Sold" && this.currentRealEstate.PropertyDispositionStatusType != "PendingSale"))  && 
                          !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                          return "/" + page.Route;
                      }

                    break;

                  case "accountsandassets/closing-date" :

                    if ((this.currentRealEstate &&
                        (this.currentRealEstate.PropertyDispositionStatusType == "Sold" || this.currentRealEstate.PropertyDispositionStatusType === "PendingSale"))  && 
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }

                    break;                    

                  case "accountsandassets/expenses" :

                    if ((this.currentRealEstate)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }

                    break;                    

                  case "accountsandassets/expenses-details" :

                    if ((this.currentRealEstate)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }

                    break; 

                  case "accountsandassets/rental-income" :

                    if ((this.currentRealEstate)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }

                    break; 

                  case "accountsandassets/usage-types" :

                    if ((this.currentRealEstate)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }

                    break; 

                  case "accountsandassets/mortgage-details" :

                    if ((this.currentRealEstate)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }

                    break; 

                  case "accountsandassets/mortgage-details-review" :

                    if ((this.borrowersState.realEstateOwnedMortgage)  && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }

                    break; 

                  case "accountsandassets/purchase-credit-types" : 
                  case "accountsandassets/purchase-credits-details" : 

                    if ((currentLoan.ReceivingPurchaseCredits)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }
              
                    break;


                  case "accountsandassets/loan-grants-details" : 

                    if ((currentLoan.ReceivingGrants)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }
              
                    break;

                  case "accountsandassets/loan-gifts-types" : 
                  case "accountsandassets/loan-gifts-details" : 

                    if ((currentLoan.ReceivingGifts)  && 
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }
              
                    break;

                  case "accountsandassets/parties-credit" : 

                    if ((currentLoan.ReceivingSellerCredits)  && 
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }
              
                    break;

                  case "accountsandassets/deposits-details" : 

                    if ((currentLoan.DepositRequirement == "depositToBeMade" || currentLoan.DepositRequirement == "depositMade")  && 
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }
              
                    break;

                  case "accountsandassets/other-assets-details" :

                    if ((selectedBorrower.Assets.findIndex(x => x.AssetTypeId === 1) !== -1) &&
                    !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                      return "/" + page.Route;
                    }
                    break;
       
                  //Credit Section
                  case "credit/order" :

                    let borrowerCreditOrder = null;
                    if (this.creditOrders && this.creditOrders.length) {
                      borrowerCreditOrder = this.creditOrders.find(item => item.BorrowerId === selectedBorrower.Id && item.StatusCode === "COMPLETED");
                    }

                    if (!(borrowerCreditOrder && borrowerCreditOrder.StatusCode === "COMPLETED")) {
                      return "/" + page.Route;
                    }
                    break;

                  case "credit/derogatory-items" :
  
                     if ((selectedBorrower.PublicRecords  && selectedBorrower.PublicRecords.length > 0) &&
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                      return "/" + page.Route;
                    }
                    break;

                  case "credit/other-liabilities-details" :
                    

                    if ((selectedBorrower.OtherLiabilitiesAndExpenses && selectedBorrower.OtherLiabilitiesAndExpenses.findIndex(x => x.ExpenseType === "Alimony" || x.ExpenseType === "ChildSupport" || x.ExpenseType === "JobRelatedExpenses") !== -1) &&
                       !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                     return "/" + page.Route;
                   }
                   break;

                  //Loan And Property Section 
                  case "loanandproperty/purchase-price" :

                    if (currentLoan.loanPurposeType === page.LoanType && 
                        currentLoan.SalesContract &&   
                        !(page.Completions && page.Completions.length > 0)) {
                      return "/" + page.Route;
                    }
                    break;                    

                  case "loanandproperty/estimated-value" :

                    if (!currentLoan.SalesContract && 
                        !(page.Completions && page.Completions.length > 0)) {
                      return "/" + page.Route;
                    }
                    break;

                  case "loanandproperty/additional-mortgage-details" :

                    if (currentLoan.Property.HasAdditionalMortgages && 
                       !(page.Completions && page.Completions.length > 0)) {
                      return "/" + page.Route;
                    }
                    break;

                  case "loanandproperty/rental-income" :

                    if ((currentLoan.Property.PropertyType  === "Two-to-fourUnitProperty" || currentLoan.Property.PropertyType === "Investment" )  && 
                        !(page.Completions && page.Completions.length > 0)) {
                      return "/" + page.Route;
                    }
                    break;

                  //Borrower Section 
                  case "borrowers/unmarried-addendum" :

                    //Add State Check once we figure ot if its property state or current residence state
                    //const unmarriedAddIndicator = getStateIndicator(stateCode, "UnmarriedAddendumRequired" );
                    if ( selectedBorrower.MaritalStatusType === "Unmarried" && 
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                    }
                    break;
  
                  case "borrowers/military-service-details" :
                   
                    if ( selectedBorrower.SelfDeclaredMilitaryServiceIndicator && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                      return "/" + page.Route;
                    }
                    break;

                  case "borrowers/residency-rent-expense" :
                   
                    if (selectedBorrower.Residences &&  selectedBorrower.Residences[0].ResidencyBasisType === "Rent" && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                      return "/" + page.Route;
                    }
                    break;

                  case "borrowers/prior-residence" :

                    if (selectedBorrower.Residences && selectedBorrower.Residences[0].ResidencyDurationMonthsCount < 24 && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                      return "/" + page.Route;
                    }
                    break;     

                  case "borrowers/prior-residency-length" :
                    {
                      let priorResidence = this.getSpecificResidence("Prior");

                      if (Object.keys(priorResidence).length != 0 &&  
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                      }
                    }
                    
                    break;     

                  case "borrowers/prior-living-status" :
                    {
                      let priorResidence = this.getSpecificResidence("Prior");

                      if (Object.keys(priorResidence).length != 0 &&  
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                      }
                    }
                    break;     

                  case "borrowers/prior-rent-expense" :
                    {

                      let priorResidence = this.getSpecificResidence("Prior");

                      if (Object.keys(priorResidence).length != 0 && priorResidence.ResidencyBasisType === "Rent" && 
                        !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                        return "/" + page.Route;
                      }
                    }
                   
                    break;                    

                  case "borrowers/invite-co-borrower" :
                   
                    if (!currentLoan.Borrowers.some(x => x.CoBorrower === true) && 
                      !(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                      return "/" + page.Route;
                    }
                    break;     
                    
                }

                break;
            
            default:
              
            if (page.LoanType === "All" || (currentLoan.loanPurposeType === null || currentLoan.loanPurposeType === undefined ? "All" : currentLoan.loanPurposeType) === page.LoanType) {
                if (section.SectionType === "Borrower") {
                  if (!(page.Completions && page.Completions.some(x => x.BorrowerId === selectedBorrower.Id))) {
                      return "/" + page.Route;
                  }
                } else if (section.SectionType === "BorrowerPair") {
                  if (!(page.Completions && page.Completions.length > 0)) {
                    return "/" + page.Route;
                  }
                } else if (section.SectionType === "Shared") {
                  if (!(page.Completions && page.Completions.length > 0)) {
                    return "/" + page.Route;
                  }
                }
              }

              break;

          }
        }

        pageIndex = 0;

      }

    },

    addCompletion(page, completion){

      if(!page.hasOwnProperty("Completions")){
        page.Completions = [];
      }
      const index = page.Completions.findIndex(ec => ec.BorrowerId === completion.BorrowerId);

      if (index !== -1) {
          page.Completions[index] = completion;
      } else {
          page.Completions.push(completion);
      }

    },
   
    findPageIndexAndSectionIndex(route) {

      let sectionIndex = -1;
      let pageIndex = -1;

      // Find section index
      this.currentLoan.LoanProgress.Sections.find((section, index) => {
          const pageIndexInSection = section.Pages.findIndex(page => ("/" + page.Route) === route);
          if (pageIndexInSection !== -1) {
              sectionIndex = index;
              pageIndex = pageIndexInSection;
              return true;
          }
      });

      return { sectionIndex, pageIndex };
    },

  }
};
