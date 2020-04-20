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

    for(let i = 1; i < 12; i++){
      this.colors.push(i);
    }

  }

  async saveChanges() {

    console.log(this.record);

    // if(this.record.Date == null){
    //   this.errorToastAndAlertService.showErrorToast(this.translate.instant("FillInDate"));
    //   return false;
    // }
    // else{
    //   if(this.record.Values.length < 1){
    //     this.errorToastAndAlertService.showErrorToast(this.translate.instant("FillInResults"));
    //     return false;
    //   }

    //   await this.modalController.dismiss(this.record);
    // }

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
