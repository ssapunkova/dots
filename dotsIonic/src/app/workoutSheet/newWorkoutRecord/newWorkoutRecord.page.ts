import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

import { GeneralService } from '../../services/general.service';
import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';

@Component({
  selector: 'modal-page',
  templateUrl: './newWorkoutRecord.page.html'
})

@Injectable()
export class NewWorkoutRecordPage implements OnInit {

  public fields;
  public values;
  public record = {
    SheetId: null,
    RecordId: null,
    Date: "",
    Values: [],
    Params: [],
    PercentageOfGoal: []
  };

  public isButtonDisabled = {
    addParam: false
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public generalService: GeneralService,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));

    this.record.SheetId = data.SheetId;
    this.record.RecordId = data.RecordId;
    this.record.Date = data.Date;
    this.fields = data.Fields;
    this.values = data.Values;

    for(var i = 0; i < this.fields.length; i++){
      this.record.Params.push(this.fields[i]._id);

      if(this.values == null){
        if(this.fields[i].Type != "Bool") {
          this.record.Values.push(null);
          this.record.PercentageOfGoal.push(0);
        }
        else{
          this.record.Values.push(false);
        }
      }
      else{
        this.record.Values.push(this.values[i]);
        this.record.PercentageOfGoal.push(this.generalService.calculatePercentage(this.values[i], this.fields[i].Goal))
      }
    }

  }

  async saveChanges() {

    console.log(this.record);

    if(this.record.Date == null){
      this.errorToastAndAlertService.showErrorToast("Please fill in date");
      return false;
    }
    else{
      if(this.record.Values.length < 1){
        this.errorToastAndAlertService.showErrorToast("Please fill your workout results");
        return false;
      }

      await this.modalController.dismiss(this.record);
    }

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
