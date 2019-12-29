import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../errorToastAndAlertService/errorToastAndAlert.service';

@Component({
  selector: 'modal-page',
  templateUrl: './sheetConfiguration.page.html'
})

@Injectable()
export class SheetConfigurationPage implements OnInit {

  public sheet;
  public exerciseTitles = [];

  public isButtonDisabled = {
    addColumn: false
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlert: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.sheet = JSON.parse(JSON.stringify(this.navParams.data));
    this.sheet.DeletedExercisesId = [];
    console.log(this.exerciseTitles);
  }


  async presentActionSheet() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Add exercise',
      buttons: [
          {
          text: 'Count repetitons / sets',
          icon: 'refresh-circle',
          handler: () => {
            this.addColumn("Number");
          }
        },
        {
          text: 'Check Done / Not done',
          icon: 'checkmark',
          handler: () => {
            this.addColumn("Bool");
          }
        },
        {
          text: 'Count duration',
          icon: 'stopwatch',
          handler: () => {
            this.addColumn("Time");
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

  async addColumn(colType){
    this.sheet.Structure.push({ Title: "", Goal: "", Type: colType });
  }

  async deleteExercise(index){
    this.sheet.DeletedExercisesId.push(this.sheet.Structure[index]._id);
    console.log(this.sheet.DeletedExercisesId);

    this.sheet.Structure.splice(index, 1);

    console.log(this.sheet.Structure);
  }

  async saveChanges() {

    let repeatedNames = false;

    let exerciseTitles = this.sheet.Structure.map((col) => col.Title).toString();

    console.log(repeatedNames);

    // Check for name repetition and Delete empty columns
    for(var i = 0; i < this.sheet.Structure.length; i++){
      let checking = this.sheet.Structure[i];
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
        this.sheet.Structure.splice(i, 1);

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
