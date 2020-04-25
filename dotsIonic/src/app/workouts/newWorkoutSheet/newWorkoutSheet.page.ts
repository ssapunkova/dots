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

  public oldTitle;                // Track original sheet title; Used for checking if the sheet has 
                                  // a new title that matches an existing one, but not == oldTitle
                                  // because oldTitle will be in the sheetTitles list

  public sheetData = {
    _id: null,
    UserId: null,
    Title: "",
    Color: null,
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

    if(this.data.sheetData != null){
      this.sheetData = this.data.sheetData;
      this.oldTitle = this.sheetData.Title;
    }

    for(let i = 1; i < 17; i++){
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
    else if(this.sheetData.Color == null){
      this.errorToastAndAlertService.showErrorToast(this.translate.instant("ChooseASheetColor"));
      return false;
    }
    else {
      console.log(this.sheetData);
      // Show error if a sheet with this title already exists
      if(
          this.data.sheetTitles.indexOf(this.sheetData.Title) != -1 &&
          this.sheetData.Title != this.oldTitle
        ) {
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
