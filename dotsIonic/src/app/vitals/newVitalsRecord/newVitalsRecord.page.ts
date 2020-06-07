import { Component, OnInit, Injectable } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { GeneralService } from '../../services/general.service';
import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { TimeAndDateService } from 'src/app/services/timeAndDate.service';

@Component({
  selector: 'modal-page',
  templateUrl: './newVitalsRecord.page.html'
})

@Injectable()
export class NewVitalsRecordPage implements OnInit {

  public fields;
  public values;
  public goals;

  public record = {
    UserId: null,
    RecordId: null,
    Date: null,
    Values: [],
    Params: [],
    PercentageOfGoal: []
  };

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public generalService: GeneralService,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private timeAndDateService: TimeAndDateService
  ) { }

  async ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));

    this.record.UserId = data.UserId;
    this.record.RecordId = data.RecordId;
    this.record.Date = data.Date;
    this.record.PercentageOfGoal = [];

    this.fields = data.Fields;
    this.goals = data.Goals;

    this.values = data.Values;
  
    if(data.Date == null){
      this.record.Date = await this.timeAndDateService.getDate("today");
    }

    for(var i = 0; i < this.fields.length; i++){

      this.record.Params.push(this.fields[i].Index);

      if(this.values == null){
        this.record.Values.push(null);
        this.record.PercentageOfGoal.push(0);
      }
      else{
        this.record.Values.push(this.values[i]);
        this.record.PercentageOfGoal.push(this.generalService.calculatePercentage(this.values[i], this.goals[i]))
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
        this.errorToastAndAlertService.showErrorToast("Please fill your vitals results");
        return false;
      }

      await this.modalController.dismiss(this.record);
    }

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
