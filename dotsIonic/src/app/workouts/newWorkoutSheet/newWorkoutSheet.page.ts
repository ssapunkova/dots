import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { GeneralService } from '../../services/general.service';
import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { TimeAndDateService } from 'src/app/services/timeAndDate.service';

@Component({
  selector: 'modal-page',
  templateUrl: './newWorkoutSheet.page.html'
})

@Injectable()
export class NewWorkoutSheetPage implements OnInit {

  public colors = [];

  public data;

  public sheetData = {
    UserId: null,
    Title: "",
    Color: 1,
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private translate: TranslateService,
    public generalService: GeneralService,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private timeAndDateService: TimeAndDateService
  ) { }

  async ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));
    this.data = data;

    for(let i = 1; i < 12; i++){
      this.colors.push(i);
    }

    console.log(this.colors);

  }

  async setColor(index){
    console.log(index);
    this.sheetData.Color = index;
  }

  async saveChanges() {

    if(this.sheetData.Title == ""){
      this.errorToastAndAlertService.showErrorToast(this.translate.instant("EnterAName"));
      return false;
    }
    else {
      console.log(this.sheetData);
      // Show error if a sheet with this title already exists
      if(this.data.sheetTitles.indexOf(this.sheetData.Title) != -1) {
        this.errorToastAndAlertService.showErrorToast(this.translate.instant("ExistingSheetName"));
        return false;
      }
      else{
        // If sheet title is fine, add sheet to database

        await this.modalController.dismiss(this.sheetData);
      }
    }

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
