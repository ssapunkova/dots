import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';

@Component({
  selector: 'modal-page',
  templateUrl: './editNutritionGoals.page.html'
})

@Injectable()
export class EditNutritionGoalsPage implements OnInit {

  public params;
  public deletedParams;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlert: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.params = JSON.parse(JSON.stringify(this.navParams.data)).Params;
    this.deletedParams = [];
    console.log(this.params)
  }


  async presentActionSheet() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Add goal',
      buttons: [
      ]
    });
    await actionSheet.present();

  }

  async addParam(paramIndex){
    this.params.push(paramIndex);
  }

  async deleteParam(index){
    this.deletedParams.push(this.params._id);
    console.log(this.deletedParams);

    this.params.splice(index, 1);

    console.log(this.params, this.deletedParams);
  }

  async saveChanges() {

    for(var i = 0; i < this.params.length; i++){
      let checking = this.params[i];
      if(checking.Type != "Bool" &&
        (checking.Param == null || checking.Param == "")
      ){
        this.params.splice(i, 1);

        console.log("not needed")
      }
    }

    console.log(this.params);

    await this.modalController.dismiss(this.params);
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
