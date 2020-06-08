import { Component, OnInit, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { VitalsService } from '../../services/vitals.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'modal-page',
  templateUrl: './editVitalsParams.page.html'
})

@Injectable()
export class EditVitalsCalculatorsPage implements OnInit {

  public params;
  public userValues;
  public deletedParams;

  public goals = [];
  public customGoals = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private vitalsService: VitalsService,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));
    this.params = data.Params;
    this.goals = data.Goals;
    this.userValues = data.UserValues;
    this.deletedParams = [];
  }


  async presentActionSheet() {

    console.log(this.vitalsService.Params, this.goals);

    let usedParamIndexes = this.params.map((param) => param.Index);
    console.log(usedParamIndexes);
    let notUsedParams = this.vitalsService.Params.filter((param) => usedParamIndexes.indexOf(param.Index) < 0);

    if(notUsedParams.length == 0){
      this.errorToastAndAlertService.showErrorToast("AllParamsUsed");
    }
    else{
      let possibleParams = notUsedParams.map((param) => {
        return {
          text: this.translate.instant(param.Title),
          icon: param.Icon,
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
    if(param.Goal == null){
      let position = this.userValues.Params.indexOf(param.Index);
      this.goals.push(this.userValues.Values[position]);
    }
    else{
      this.goals.push(param.Goal);
    }
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
