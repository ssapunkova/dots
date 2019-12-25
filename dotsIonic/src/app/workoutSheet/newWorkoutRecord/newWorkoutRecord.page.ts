import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

import { ToastService } from '../../toastService/toast.service';

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
    Columns: []
  };

  public isButtonDisabled = {
    addColumn: false
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));

    this.record.SheetId = data.sheetId;
    this.record.RecordId = data.recordId;
    this.record.Date = data.date;
    this.fields = data.fields;
    this.values = data.values;

    for(var i = 0; i < this.fields.length; i++){
      this.record.Columns.push(this.fields[i]._id);

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
      this.toastService.showErrorToast("Please fill in date");
      return false;
    }
    else{
      if(this.record.Values.length < 1){
        this.toastService.showErrorToast("Please fill your workout results");
        return false;
      }
      else{
        for(var i = 0; i < this.record.Values.length; i++){
          if(this.record.Values[i] == null){
            console.log(this.record.Values[i]);
            this.toastService.showErrorToast("Please fill all the fields");
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