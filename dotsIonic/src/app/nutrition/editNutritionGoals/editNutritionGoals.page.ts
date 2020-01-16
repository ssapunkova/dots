import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';

@Component({
  selector: 'modal-page',
  templateUrl: './editNutritionGoals.page.html'
})

@Injectable()
export class EditNutritionGoalsPage implements OnInit {

  public goals;
  public deletedGoals;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlert: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.goals = JSON.parse(JSON.stringify(this.navParams.data)).Goals;
    this.deletedGoals = [];
    console.log(this.goals)
  }


  async presentActionSheet() {


    const actionSheet = await this.actionSheetController.create({
      header: 'Add exercise',
      buttons: [
      ]
    });
    await actionSheet.present();

  }

  async addGoal(goalIndex){
    this.goals.push(goalIndex);
  }

  async deleteExercise(index){
    this.deletedGoals.push(this.goals._id);
    console.log(this.deletedGoals);

    this.goals.splice(index, 1);

    console.log(this.goals, this.deletedGoals);
  }

  async saveChanges() {

    for(var i = 0; i < this.goals.length; i++){
      let checking = this.goals[i];
      if(checking.Type != "Bool" &&
        (checking.Goal == null || checking.Goal == "")
      ){
        this.goals.splice(i, 1);

        console.log("not needed")
      }
    }

    console.log(this.goals);

    await this.modalController.dismiss(this.goals);
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
