import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';

@Component({
  selector: 'modal-page',
  templateUrl: './editWorkoutParams.page.html'
})

@Injectable()
export class EditWorkoutCalculatorsPage implements OnInit {

  public MAX_SHEET_EXERCISES = 15;

  public sheet;
  public exerciseTitles = [];

  public isButtonDisabled = {
    addParam: false
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private translate: TranslateService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlert: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.sheet = JSON.parse(JSON.stringify(this.navParams.data));
    this.sheet.DeletedExercisesId = [];
    console.log(this);
  }


  async presentActionSheet() {

    console.log(this.sheet.Params.length, this.MAX_SHEET_EXERCISES)
    if(this.sheet.Params.length < this.MAX_SHEET_EXERCISES){

      const actionSheet = await this.actionSheetController.create({
        header: this.translate.instant("AddExercise"),
        buttons: [
          {
            text: this.translate.instant("CountRepetitionsOption"),
            icon: 'refresh',
            handler: () => {
              this.addParam("Number");
            }
          },
          {
            text: this.translate.instant("CheckBoolOption"),
            icon: 'checkmark',
            handler: () => {
              this.addParam("Bool");
            }
          },
          {
            text: this.translate.instant("CountDurationOption"),
            icon: 'stopwatch',
            handler: () => {
              this.addParam("Time");
            }
          },
          {
            text: this.translate.instant("Cancel"),
            icon: 'close',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    }
    else{
      let alert = await this.alertController.create({
        header: this.translate.instant("ReachedExerciseNumberLimit"),
        message: this.translate.instant("NoMoreThanPt1") + this.MAX_SHEET_EXERCISES + this.translate.instant("NoMoreThanPt2") + '<a href="/workouts">' + this.translate.instant("MoreSheets") + '</a>',
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

    let exerciseTitles = this.sheet.Params.map((col) => col.Title);

    console.log(repeatedNames, exerciseTitles);

    // Check for name repetition and Delete empty params
    for(var i = 0; i < this.sheet.Params.length; i++){
      let checking = this.sheet.Params[i];
      
      let haveThisTitle = exerciseTitles.filter((title) => title == checking.Title);

      if(haveThisTitle.length > 1){
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
      this.errorToastAndAlert.showErrorToast(this.translate.instant("RepeatingExerciseNames"));
      return false;
    }
    await this.modalController.dismiss(this.sheet);
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
