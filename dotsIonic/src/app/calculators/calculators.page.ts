import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

// Services
import { ParamsService } from '../services/params.service';
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';

import { CalculatorPage } from './calculator/calculator.page';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-params',
  templateUrl: './calculators.page.html',
  styleUrls: ['./calculators.page.scss'],
})
export class CalculatorsPage implements OnInit {

 
  public userData;

  public dbData;

  public userParams = {
    Titles: [],
    Values: {},
    ParamData: []
  }

  public changedUserValues = [];
  
  constructor(
    public paramsService: ParamsService,
    public userService: UserService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private alertController: AlertController,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.loadingService.showPageLoading();

    this.userData = this.route.snapshot.data.userData;

    // Get user data from db

    this.paramsService.getUserParams(this.userData._id).subscribe( async (userParams) => {

      this.dbData = userParams;

      console.log(userParams);

      if(this.dbData != null){
        // If there is data, process it
        for(let i = 0; i < this.dbData.Params.length; i++){
          let paramIndex = this.dbData.Params[i];
          let paramData = this.paramsService.allParams[paramIndex];
          let paramValue = this.dbData.Values[i];

          this.userParams.Titles.push(paramData.Title);
          this.userParams.Values[paramData.Title] = paramValue;
          this.userParams.ParamData.push(paramData);
        }

        this.userParams.Values["Age"] = this.userData.Age;
        this.userParams.Values["Gender"] = this.userData.Gender;
      }

    })

    console.log("***UserParams: ", this.userParams);

    this.loadingService.hidePageLoading();

  }

  // Open calculator modal and pass 
  // -- the param to be calculated
  // -- userParams (needed for calculations) 
  async openModal(param){

    console.log(this.userParams);

    
    const modal = await this.modalController.create({
      component: CalculatorPage,
      componentProps: {
        param: param,
        userValues: this.userParams.Values
      }
    });
    await modal.present();

    // Get modal data and if it's not null, update params and values
    await modal.onWillDismiss().then((modalData: OverlayEventDetail) => {

      console.log("Modal data ", modalData);

      modalData = modalData.data;

      if(modalData != null){

        // Merge current and new user values
        this.userParams.Values = {
          ...this.userParams.Values,
          ...modalData
        }
        
        // Update param titles
        this.userParams.Titles = Object.keys(this.userParams.Values);

        // Update ParamData
        for(let i = 0; i < this.userParams.Titles.length; i++){
          if(this.userParams.ParamData[i] == null){
            this.userParams.ParamData[i] = this.paramsService.allParams.filter((param) => {
              param.Title == this.userParams.Titles[i]
            })[0];
          }
        }

        // Update param data in db
        this.updateUserParams();
      }

    });
  }

  // Updates userParamData according to userParamsTitles and values
  // and sends update request to db
  async updateUserParams(){

    console.log(this.dbData);

    if(this.changedUserValues){

      this.dbData = {
        Params: [],
        Values: []
      }

      for(let i = 0; i < this.userParams.Titles.length; i++){
        let paramTitle = this.userParams.Titles[i];
        if(this.userParams.ParamData[i] == null){
          this.userParams.ParamData[i] = this.paramsService.allParams.filter((param) => param.Title == paramTitle)[0];
        }
        let paramIndex = this.userParams.ParamData[i].Index;
        let paramValue = this.userParams.Values[paramTitle];

        console.log(paramTitle, this.userParams.ParamData[i], paramIndex, paramValue)

        this.dbData.Params.push(paramIndex);
        this.dbData.Values.push(paramValue);
      }

      this.sortParamsByValue();

    }

    console.log("***Updated userParams ", this.dbData);

    this.paramsService.updateUserParams(this.userData._id, this.dbData).subscribe(async (data) => {},
    error => {
      this.errorToastAndAlertService.showErrorAlert("Oups")
    })

    this.changedUserValues = [];
  }

  // Sort each param category, so that 
  // -- params that the user has calculated appear first
  // -- calculated params are ordered newer -> older
  // -- -- this happens because they are added later in userParamTitles, so their index will be greater
  async sortParamsByValue(){

    for(let i = 0; i < this.paramsService.categories.length; i++){
      let category = this.paramsService.categories[i].Id;
      this.paramsService[category].sort((a, b) => {
        return this.userParams.Titles.indexOf(b.Title) - this.userParams.Titles.indexOf(a.Title)
      })
    }
  }


}
