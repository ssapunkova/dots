import { Component, OnInit, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { NutritionService } from '../../services/nutrition.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'modal-page',
  templateUrl: './editNutritionParams.page.html'
})

@Injectable()
export class EditNutritionParamsPage implements OnInit {

  public params;
  public deletedParams;

  public goals = [];
  public customGoals = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private nutritionService: NutritionService,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));
    this.params = data.Params;
    this.goals = data.Goals;
    this.deletedParams = [];
  }


  async presentActionSheet() {

    console.log(this.nutritionService.Params, this.goals);

    let usedParamIndexes = this.params.map((param) => param.Index);
    let notUsedParams = this.nutritionService.Params.filter((param) => usedParamIndexes.indexOf(param.Index) < 0);

    if(notUsedParams.length == 0){
      this.errorToastAndAlertService.showErrorToast("AllParamsUsed");
    }
    else{
      let possibleParams = notUsedParams.map((param) => {
        return {
          text: this.translate.instant(param.Title),
          icon: 'refresh-circle',
          handler: () => {
            this.addParam(param)
          }
        }
      })

      possibleParams.push({
        text: 'Cancel',
        icon: 'close',
        handler: null
      })

      const actionSheet = await this.actionSheetController.create({
        header: 'Add goal',
        buttons: possibleParams
      });
      await actionSheet.present();
    }

  }

  async addParam(param){
    this.params.push(param);
    this.goals.push(param.Goal)
  }

  async deleteParam(index){
    this.deletedParams.push(this.params[index].Index);
    this.params.splice(index, 1);
    this.goals.splice(index, 1);
  }

  async saveChanges() {

    for(var i = 0; i < this.params.length; i++){
      let checking = this.goals[i];

      // If there is a custom goal
      console.log(this.params, i)
      if(checking != this.params[i].Goal){
        this.customGoals[i] = checking;
      }
      else {
        this.customGoals[i] = null;
      }
    }

    let results = {
      params: this.params.map((param) => param.Index),
      deletedParams: this.deletedParams,
      customGoals: this.customGoals
    }

    console.log(results);

    await this.modalController.dismiss(results);
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
