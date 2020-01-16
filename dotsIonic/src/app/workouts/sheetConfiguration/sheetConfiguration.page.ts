import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';

@Component({
  selector: 'modal-page',
  templateUrl: './sheetConfiguration.page.html'
})

@Injectable()
export class SheetConfigurationPage implements OnInit {

  public MAX_SHEET_EXERCISES = 15;

  public sheet;
  public exerciseTitles = [];

  public isButtonDisabled = {
    addParam: false
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlert: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.sheet = JSON.parse(JSON.stringify(this.navParams.data));
    this.sheet.DeletedExercisesId = [];
    console.log(this.exerciseTitles);
  }


  async presentActionSheet() {

    console.log(this.sheet.Params.length, this.MAX_SHEET_EXERCISES)
    if(this.sheet.Params.length < this.MAX_SHEET_EXERCISES){

      const actionSheet = await this.actionSheetController.create({
        header: 'Add exercise',
        buttons: [
          {
            text: 'Count repetitons / sets',
            icon: 'refresh-circle',
            handler: () => {
              this.addParam("Number");
            }
          },
          {
            text: 'Check Done / Not done',
            icon: 'checkmark',
            handler: () => {
              this.addParam("Bool");
            }
          },
          {
            text: 'Count duration',
            icon: 'stopwatch',
            handler: () => {
              this.addParam("Time");
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    }
    else{
      let alert = await this.alertController.create({
        header: 'Too many exercises',
        message: 'You can have <b> no more than ' + this.MAX_SHEET_EXERCISES + ' exercises in one sheet </b>. But you can have <a href="/workouts">more sheets!</a>',
        buttons: [
          {
            text: 'Ok'
          }
        ]
      })
      await alert.present();
    }
  }

  async addParam(colType){
    let col = { Title: "", Goal: "", Type: colType };
    if(colType == "Bool"){
      col.Goal = "true";
    }
    this.sheet.Params.push(col);
  }

  async deleteExercise(index){
    this.sheet.DeletedExercisesId.push(this.sheet.Params[index]._id);
    console.log(this.sheet.DeletedExercisesId);

    this.sheet.Params.splice(index, 1);

    console.log(this.sheet.Params);
  }

  async saveChanges() {

    let repeatedNames = false;

    let exerciseTitles = this.sheet.Params.map((col) => col.Title).toString();

    console.log(repeatedNames);

    // Check for name repetition and Delete empty params
    for(var i = 0; i < this.sheet.Params.length; i++){
      let checking = this.sheet.Params[i];
      var regex = new RegExp(checking.Title, 'g');
      if(exerciseTitles.match(regex).length > 1){
        repeatedNames = true;
        checking.NameRepeated = true;
        setTimeout (() => {
           checking.NameRepeated = false;
        }, 1000);
      }

      if(
        checking.Title.length < 1 ||
        (checking.Type != "Bool" &&
          (checking.Goal == null || checking.Goal == "")
        )
      ){
        this.sheet.Params.splice(i, 1);

        console.log("not needed")
      }
    }

    console.log(this.sheet);

    if(repeatedNames == true){
      this.errorToastAndAlert.showErrorToast("Exercise titles shouldn't repeat");
      return false;
    }
    await this.modalController.dismiss(this.sheet);
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
