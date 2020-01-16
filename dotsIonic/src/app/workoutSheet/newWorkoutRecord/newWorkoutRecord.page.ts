import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

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
    Params: []
  };

  public isButtonDisabled = {
    addParam: false
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));

    console.log(data)

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
        }
        else{
          this.record.Values.push(false);
        }
      }
      else{
        this.record.Values.push(this.values[i]);
      }
    }

    console.log(this.fields);
  }

  async saveChanges() {

    console.log(this.record);

    if(this.record.Date == ""){
      this.errorToastAndAlertService.showErrorToast("Please fill in date");
      return false;
    }
    else{
      if(this.record.Values.length < 1){
        this.errorToastAndAlertService.showErrorToast("Please fill your workout results");
        return false;
      }
      else{
        for(var i = 0; i < this.record.Values.length; i++){
          if(this.record.Values[i] == null){
            console.log(this.record.Values[i]);
            this.errorToastAndAlertService.showErrorToast("Please fill all the fields");
            return false;
          }
        }
      }

      await this.modalController.dismiss(this.record);
    }

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
