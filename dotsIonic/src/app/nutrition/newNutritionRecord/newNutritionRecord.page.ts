import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'modal-page',
  templateUrl: './newNutritionRecord.page.html'
})

@Injectable()
export class NewNutritionRecordPage implements OnInit {

  public fields;
  public values;
  public goals;
  // public customGoals;
  public record = {
    RecordId: null,
    Date: "",
    Values: [],
    Params: []
  };

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private nutritionService: NutritionService,
    private errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));

    console.log(data);

    this.record.RecordId = data.RecordId;
    this.record.Date = data.Date;

    this.fields = data.Fields;
    this.goals = data.Goals;
    // this.customGoals = data.CustomGoals;
    this.values = data.Values;

    console.log(this.record);

    // if(typeof this.customGoals == "undefined"){
    //   this.customGoals = [];
    // }

    for(var i = 0; i < this.fields.length; i++){

      this.record.Params.push(this.fields[i].Index);

      if(this.values == null){
        this.record.Values.push(null);
      }
      else{
        this.record.Values.push(this.values[i]);
      }
      console.log(this.fields[i]);
      console.log(this.record)
      // console.log(this.customGoals[i]);
      // console.log(this.customGoals);

    }

    console.log(this);
  }

  async saveChanges() {

    console.log(this.record);

    if(this.record.Date == null){
      this.errorToastAndAlertService.showErrorToast("Please fill in date");
      return false;
    }
    else{
      if(this.record.Values.length < 1){
        this.errorToastAndAlertService.showErrorToast("Please fill your nutrition results");
        return false;
      }

      await this.modalController.dismiss(this.record);
    }

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
