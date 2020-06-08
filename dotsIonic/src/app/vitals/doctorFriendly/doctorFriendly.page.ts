import { Component, OnInit, Injectable } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { GeneralService } from '../../services/general.service';
import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { TimeAndDateService } from 'src/app/services/timeAndDate.service';

import { TranslateService } from '@ngx-translate/core';
import { ParamsService } from 'src/app/services/params.service';

@Component({
  selector: 'modal-page',
  templateUrl: './doctorFriendly.page.html'
})

@Injectable()
export class DoctorFriendlyPage implements OnInit {

  public params;
  public records;
  public period;
  public paramsToUse = [];

  public output = "";

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public generalService: GeneralService,
    private errorToastAndAlertService: ErrorToastAndAlertService,
    private timeAndDateService: TimeAndDateService,
    public translate: TranslateService,
    private paramsService: ParamsService
  ) { }

  async ngOnInit() {
    let data = JSON.parse(JSON.stringify(this.navParams.data));

    this.period = data.Period;
    this.params = data.Params;
    this.records = data.Records;

    console.log(this.period, this.params, this.records)
  
  }

  async generateOutput(){
    
    this.output = this.translate.instant("Date").padEnd(10, " ");

    for(let p = 0; p < this.paramsToUse.length; p++){
      this.output += " | ";
      let title = this.translate.instant(this.paramsService.allParams[this.paramsToUse[p]].Title);
      this.output += title.slice(0, 14).padEnd(15, ".");
    }

    this.output += "\n";

    for(let r = 0; r < this.records.length; r++){
      let record = this.records[r];

      let string = this.timeAndDateService.formatDate(record.Date).padEnd(10, " ");

      for(let p = 0; p < record.Params.length; p++){
        if(this.paramsToUse.indexOf(record.Params[p]) > -1){

          if(record.Values[p] != null){
            string += " | " + ("" + record.Values[p]).padEnd(15, ".");
          }
          else {
            string += " | " + ("").padEnd(15, ".");
          }

        }
        

      }

      if(string.length > 5){
        this.output += string + "\n";
      }

    }

  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
