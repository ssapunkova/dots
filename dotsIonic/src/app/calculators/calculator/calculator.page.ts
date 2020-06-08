import { Component, OnInit, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController, ToastController } from '@ionic/angular';


import { ParamsService } from '../../services/params.service';
import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'modal-page',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss']
})

@Injectable()
export class CalculatorPage implements OnInit {

  public userValues;
  public param;  
  
  // Converting measures

  public convertToInches(cm){
    return (Math.floor(parseInt(cm) / 2.54));
  }
  public convertToLb(kg){
    return (Math.floor(parseInt(kg) * 2.204));
  }

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private translate: TranslateService,
    private alertController: AlertController,
    private errorToastAndAlert: ErrorToastAndAlertService,
    private paramsService: ParamsService
  ) { }

  ngOnInit() {
    this.param = JSON.parse(JSON.stringify(this.navParams.data)).param;
    this.userValues = JSON.parse(JSON.stringify(this.navParams.data)).userValues;
    console.log(this.param, this.userValues);
  }


  public bodyMassConstants = [];

 

  async finishCalculations(){
    console.log("User params: ", this.userValues);
    console.log("Saving results");
    
    let that = this;


    console.log(this.param);
    console.log(this.userValues[this.param.Title]);

    const alert = await this.alertController.create({
      message: that.translate.instant("ResultFromCalculations") + 
      that.translate.instant(that.param.Title) + ": " + 
        " <b>" + that.userValues[that.param.Title] + "</b>",
      buttons: [
        {  
          text: this.translate.instant("Cancel"),
          cssClass: 'secondary',
          handler: async (data) => {
            await that.modalController.dismiss();
          }
        }, 
        {
          text: this.translate.instant("Save results"),
          cssClass: 'primary',
          handler: async (data) => {
            await that.modalController.dismiss(that.userValues);
          }
        }
      ]
    });
    await alert.present();
  }

  public blocks = {
    required: [
      this.paramsService.allParams[2],      // 2 - Weight
      this.paramsService.allParams[3],      // 3 - Height
      this.paramsService.allParams[4],      // 4 - Waist
      this.paramsService.allParams[5],      // 5 - Wrist
      this.paramsService.allParams[6],      // 6 - Hips
      this.paramsService.allParams[7]       // 7 - activity (zone)
    ],
    formula: async () => {

      let values = {
        Gender: this.userValues.Gender,
        WeightInKg: this.userValues.Weight,
        Weight: this.convertToLb(this.userValues.Weight),
        Height: this.convertToInches(this.userValues.Height),
        Waist: this.convertToInches(this.userValues.Waist),
        Wrist: this.convertToInches(this.userValues.Wrist),
        Hips: this.convertToInches(this.userValues.Hips),
        PhysicalActivity: this.userValues.ActivityFactorZone
      };

      console.log("Values: ", values);

      let constants = { A: 0, B: 0, C: 0 };
      
      let that = this;
      function setConstants(){
        if(values.Gender == "F"){
          let row = that.bodyMassConstants.filter((record) => record.Hips == values.Hips)[0];
          if(row != null){
            constants.A = row.Constant;
          } 
          else{
            console.log("not standart")
          }
          constants.B = parseFloat((values.Waist / 1.406).toFixed(2));
          constants.C = parseFloat((values.Height / 1.640).toFixed(2));
          
          calculateFatAndBodyMass();
        }
        else{
          let ratio = values.Waist - values.Wrist;
          let roundedWeight = Math.ceil(values.Weight / 5) * 5;
          let row = that.bodyMassConstants.filter((record) => record.Weight == roundedWeight)[0];
          
          console.log("Row in constants: ", row);
          if(row != null){
            constants.A = row.Values[0][ratio];
            calculateFatAndBodyMass();
          } 
          else{
            console.log("not standart")
          }
          console.log(ratio);
        }
        console.log(constants);
        
        that.finishCalculations();

      }

      function calculateFatAndBodyMass(){

        // Body fat percentage
        if(values.Gender == "F") that.userValues.BodyFatPercentage = Math.floor(constants.A + constants.B - constants.C);
        else that.userValues.BodyFatPercentage = Math.floor(constants.A);

        // Calculate LeanBodyMass Weight in Lb, to use for DaylyProteinIntake
        let leanBodyMassInLb = that.convertToLb(values.WeightInKg - (values.WeightInKg * that.userValues.BodyFatPercentage / 100));

        // Dayly Protein Intake in grams
        that.userValues.DaylyProteinIntake = Math.floor(leanBodyMassInLb * values.PhysicalActivity);

        // Convert gr to protein Blocks
        that.userValues.Blocks = Math.floor(that.userValues.DaylyProteinIntake / 7);

        if(values.Gender == "F" && that.userValues.Blocks <= 11) that.userValues.Blocks = 11;
        else if(values.Gender == "M" && that.userValues.Blocks <= 14) that.userValues.Blocks = 14;

        console.log("User params: ", that.userValues);
      }

      if(this.bodyMassConstants.length == 0){
        this.paramsService.getConstants(values.Gender).subscribe((data: any) => {
          this.bodyMassConstants = data;
          setConstants();
        });
      }
      else{
        setConstants();
      }

    }
  }

  public kcalIntake = {
    required: [
      this.paramsService.allParams[2],      // 2 - Weight
      this.paramsService.allParams[3],      // 3 - Height
      this.paramsService.allParams[8]       // 8 - ActivityFactorKcal
    ],
    formula: async () => {

      console.log(this.userValues)

      let values = {
        Gender: this.userValues.Gender,
        Age: this.userValues.Age,
        Weight: this.userValues.Weight,
        Height: this.userValues.Height,
        PhysicalActivity: this.userValues.ActivityFactorKcal
      };

      console.log(values);

      // Calculate base calorie intake
      if(values.Gender == "M"){
        this.userValues.DaylyKcalIntake = 66 + (13.7 * values.Weight) + (5 * values.Height) - (6.8 * values.Age);
      }
      else{
        this.userValues.DaylyKcalIntake = 655 + (9.6 * values.Weight) + (1.8 * values.Height) - (4.7 * values.Age);
      }
      
      // Multiply by physical activity factor
      this.userValues.DaylyKcalIntake *= values.PhysicalActivity;
      
      console.log(this.userValues.DaylyKcalIntake);

      this.userValues.DaylyKcalIntake = Math.floor(this.userValues.DaylyKcalIntake);

      console.log(this.userValues.DaylyKcalIntake);

      this.finishCalculations();
    }
  }

  public sugarIntake = {
    required: [
      this.paramsService.allParams[9],      // 9 - DaylyKcalIntake
    ],
    formula: async () => {

      let values = {
        DaylyKcalIntake: this.userValues.DaylyKcalIntake,
      };
      
      this.userValues.DaylySugarIntake = Math.floor(values.DaylyKcalIntake / 40);

      this.finishCalculations();
    }
  }

  public sysBloodPressure = {
    required: [
      this.paramsService.allParams[1],      // 1 - Age
    ],
    formula: async () => {

      let values = {
        Age: this.userValues.Age,
      };
      
      this.userValues.SystolicBloodPressure = 100 + values.Age;

      this.finishCalculations();
    }
  }

  public bmi = {
    required: [
      this.paramsService.allParams[2],      // 2 - Weight
      this.paramsService.allParams[3]       // 3 - Height
    ],
    formula: async () => {

      let values = {
        Weight: this.userValues.Weight,
        Height: this.userValues.Height
      };
      
      this.userValues.BMI = Math.floor(values.Weight / Math.pow((values.Height) / 100, 2));

      this.finishCalculations();
    }
  }

  public idealWeightDevine = {
    required: [
      this.paramsService.allParams[0],      // 0 - Gender
      this.paramsService.allParams[3],      // 3 - Height
    ],
    formula: async () => {

      let values = {
        Gender: this.userValues.Gender,
        Height: this.userValues.Height
      };
      
      if(values.Gender == 0){
        this.userValues.IdealWeightDevine = Math.round(50 + 2.3*(values.Height / 2.54 - 60));
      }
      else{
        this.userValues.IdealWeightDevine = Math.round(45.5 + 2.3*(values.Height / 2.54 - 60));
      }

      this.finishCalculations();
    }
  }

  public waterIntake = {
    required: [
      this.paramsService.allParams[1],      // 1 - Age
      this.paramsService.allParams[2],      // 2 - Weight
    ],
    formula: async () => {

      let values = {
        Age: this.userValues.Age,
        Weight: this.userValues.Weight
      };
      
      this.userValues.DaylyWaterIntake = Math.round(values.Weight * 2.04 / 2.2);

      if(values.Age < 30){
        this.userValues.DaylyWaterIntake *= 40;
      }
      else if(values.Age < 55){
        this.userValues.DaylyWaterIntake *= 35;
      }
      else {
        this.userValues.DaylyWaterIntake *= 30;
      }

      this.userValues.DaylyWaterIntake = Math.round(this.userValues.DaylyWaterIntake / 28.3 / 33.8 * 100) / 100;

      this.finishCalculations();
    }
  }

   
  public calculators = {
    "Blocks": this.blocks,
    "BodyFatPercentage": this.blocks,
    "DaylyProteinIntake": this.blocks,
    "DaylyKcalIntake": this.kcalIntake,
    "DaylySugarIntake": this.sugarIntake,
    "SystolicBloodPressure": this.sysBloodPressure,
    "BMI": this.bmi,
    "IdealWeightDevine": this.idealWeightDevine,
    "DaylyWaterIntake": this.waterIntake
  }

  
  async triggerCalculation(){
    console.log(this.param, this.userValues);
    this.calculators[this.param.Title].formula();
  }


  async closeModal(){
    await this.modalController.dismiss();
  }

}
