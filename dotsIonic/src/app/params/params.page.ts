import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

// Services
import { ParamsService } from '../services/params.service';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';

import { CalculatorPage } from './calculator/calculator.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-params',
  templateUrl: './params.page.html',
  styleUrls: ['./params.page.scss'],
})
export class ParamsPage implements OnInit {

  public generalInfoAvailable = false;            // Has user entered general info needed for all calculations
  public generalInfoChanged = false;              // If gender/age info is changed
  public userParamsChanged = false;               // If other params are changed
 
  public userParamTitles = [];                    // Array of user's param titles 
  public userParamValues = {};                    // Json of user's { param: value }
  public userParamsData;                          // Raw data from db:
                                                  // Params: [array of param indexes]
                                                  // Values: [array of values]
  
  constructor(
    public paramsService: ParamsService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private alertController: AlertController,
    private errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.loadingService.showPageLoading();

    // Get user data
    this.paramsService.getUserParams().subscribe( async (data)=>
    {
      this.userParamsData = data;

      // If there is user param data in db, process it
      if(this.userParamsData == null) {
        this.userParamsData = {
          Params: [],
          Values: []
        }
        this.userParamValues= {};
      }
      else{
        for(let i = 0; i < this.userParamsData.Params.length; i++){
          let paramIndex = this.userParamsData.Params[i];
          let paramTitle = this.paramsService.allParams[paramIndex].Title;
          let paramValue = this.userParamsData.Values[i];

          this.userParamTitles.push(paramTitle);
          this.userParamValues[paramTitle] = paramValue;
        }

        if(this.userParamsData.Values[0] != null && this.userParamsData.Values[1] != null){
          this.generalInfoAvailable = true;
        }
      }

      this.sortParamsByValue();

      console.log("User params data ", this.userParamsData);
      console.log("User params ", this.userParamValues)
    },
    error => {
      this.errorToastAndAlertService.showErrorAlert("Oups")
    }
  );

    this.loadingService.hidePageLoading();
  }

  // Sort each param category, so that 
  // -- params that the user has calculated appear first
  // -- calculated params are ordered newer -> older
  // -- -- this happens because they are added later in userParamTitles, so their index will be greater
  async sortParamsByValue(){
   
    for(let i = 0; i < this.paramsService.categories.length; i++){
      let category = this.paramsService.categories[i].Id;
      this.paramsService[category].sort((a, b) => {
        return this.userParamTitles.indexOf(b.Title) - this.userParamTitles.indexOf(a.Title)
      })
    }
  }

  // Open calculator modal and pass 
  // -- the param to be calculated
  // -- userParams (needed for calculations) 
  async openModal(param){

    if(this.generalInfoAvailable){
      const modal = await this.modalController.create({
        component: CalculatorPage,
        componentProps: {
          param: param,
          userParams: this.userParamValues
        }
      });
      await modal.present();

      // Get modal data and if it's not null, update params and values
      await modal.onWillDismiss().then((modalData: OverlayEventDetail) => {
        
        console.log("Modal data ", modalData);

        if(modalData != null){
          // Merge current and new user params
          this.userParamValues= {
            ...this.userParamValues,
            ...modalData.data
          }

          this.userParamTitles = Object.keys(this.userParamValues);

          this.userParamsChanged = true;
          
          // Update param data in db
          this.updateUserParams();
        }

      });
    }
    else{

      this.errorToastAndAlertService.showErrorToast(this.translate.instant("FirstEnterGeneralParams"))

    }
  }

  // Checks if generalInfo has changed and controlls SaveChanges button
  async changingGeneralInfo(){
    if(this.userParamsData.Values != []){
      if(
        this.userParamValues["gender"] == this.userParamsData.Values[0] &&
        this.userParamValues["age"] == this.userParamsData.Values[1]
      ){
        this.generalInfoChanged = false;
      }
      else{
        this.generalInfoChanged = true;
      }
    }
    else{
      if(
        this.userParamValues["gender"] != null &&
        this.userParamValues["age"] != null
      ){
        this.generalInfoChanged = false;
      }
      else{
        this.generalInfoChanged = true;
      }
    }
  }

  // Updates userParamData according to userParamsTitles and values
  // and sends update request to db
  async updateUserParams(){

    console.log(this.userParamsData);

    if(this.userParamsData.Params.length == 0){
      this.userParamsData.Params = [0, 1];
      this.userParamTitles = ["gender", "age"];
      this.generalInfoAvailable = true;

      let alert = await this.alertController.create({
        header: this.translate.instant("NowYouCanMakeCalculations"),
        message: this.translate.instant("ChooseFromParamsCalculator"),
        buttons: [
          {
            text: "Ok"
          }
        ]
      });

      await alert.present();
    }

    if(this.userParamsChanged){

      this.userParamsData = {
        Params: [],
        Values: []
      }

      for(let i = 0; i < this.userParamTitles.length; i++){
        let paramTitle = this.userParamTitles[i];
        let paramIndex = this.paramsService.allParams.filter((param) => param.Title == paramTitle)[0].Index;
        let paramValue = this.userParamValues[paramTitle];

        this.userParamsData.Params.push(paramIndex);
        this.userParamsData.Values.push(paramValue);
      }

      this.sortParamsByValue();

    }
    else{
      this.userParamsData.Values[0] = this.userParamValues["gender"];
      this.userParamsData.Values[1] = this.userParamValues["age"];
    }

    console.log(this.userParamValues);
    console.log("***Updated userParamsData ", this.userParamsData);

    this.paramsService.updateUserParams(this.userParamsData).subscribe(async (data) => {},
    error => {
      this.errorToastAndAlertService.showErrorAlert("Oups")
    })

    this.userParamsChanged = false;
    this.generalInfoChanged = false;
  }

}
