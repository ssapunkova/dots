import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'modal-page',
  templateUrl: './editNutritionGoals.page.html'
})

@Injectable()
export class EditNutritionGoalsPage implements OnInit {

  public params;
  public deletedParams;

  public goalValues = [];
  public customGoals = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private nutritionService: NutritionService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlert: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));
    this.params = data.Params;
    this.customGoals = data.CustomGoals;
    this.deletedParams = [];
    this.goalValues = [];
    console.log(data)

    // Get goal values for all existing params
    // if there is a custom goal for current param, use it
    // else, use the default param goal
    for(var i = 0; i < this.nutritionService.Params.length; i++){
      let customGoal = this.customGoals[i];
      if(customGoal != null) this.goalValues.push(customGoal);
      else this.goalValues.push(this.nutritionService.Params[i].Goal);
    }

  }


  async presentActionSheet() {

    let usedParamIndexes = this.params.map((param) => param.Index);
    let notUsedParams = this.nutritionService.Params.filter((param) => usedParamIndexes.indexOf(param.Index) < 0);
    let possibleParams = notUsedParams.map((param) => {
      return {
        text: param.Title,
        icon: 'refresh-circle',
        handler: () => {
          this.addParam(param)
        }
      }
    })

    possibleParams.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    })

    const actionSheet = await this.actionSheetController.create({
      header: 'Add goal',
      buttons: possibleParams
    });
    await actionSheet.present();

  }

  async addParam(param){
    this.params.push(param);
  }

  async deleteParam(index){
    this.deletedParams.push(this.params[index]);
    this.params.splice(index, 1);
  }

  async saveChanges() {

    for(var i = 0; i < this.params.length; i++){
      let checking = this.goalValues[this.params[i]];

      // If value is null, then delete param
      if(checking == null || checking == ""){
        this.params.splice(i, 1);
      }

      // If there is a custom goal
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
