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

  public userParams;
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
    this.userParams = JSON.parse(JSON.stringify(this.navParams.data)).userParams;
    console.log(this.param, this.userParams);
  }

  async triggerCalculation(){
    console.log(this.param, this.userParams);
    this.formulas[this.calculators[this.param.Title]].formula();
  }

  public bodyMassConstants = [];

  
  public calculators = {
    "Blocks": 0,
    "BodyFatPercentage": 0,
    "DaylyProteinIntake": 0,
    "kcal": 1,
    "Sugar": 2
  }


  async finishCalculations(){
    console.log("User params: ", this.userParams);
    console.log("Saving results");
    
    let that = this;

    console.log(this.param);
    console.log(this.userParams[this.param.Title]);

    const alert = await this.alertController.create({
      message: that.translate.instant("ResultFromCalculations") + 
      that.translate.instant(that.param.Title) + ": " + 
        " <b>" + that.userParams[that.param.Title] + "</b>",
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
            await that.modalController.dismiss(that.userParams);
          }
        }
      ]
    });
    await alert.present();
  }


  public formulas = [
    {
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
          Gender: this.userParams.Gender,
          WeightInKg: this.userParams.Weight,
          Weight: this.convertToLb(this.userParams.Weight),
          Height: this.convertToInches(this.userParams.Height),
          Waist: this.convertToInches(this.userParams.Waist),
          Wrist: this.convertToInches(this.userParams.Wrist),
          Hips: this.convertToInches(this.userParams.Hips),
          PhysicalActivity: this.userParams.ActivityFactorZone
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
          if(values.Gender == "F") that.userParams.BodyFatPercentage = Math.floor(constants.A + constants.B - constants.C);
          else that.userParams.BodyFatPercentage = Math.floor(constants.A);

          // Calculate LeanBodyMass Weight in Lb, to use for DaylyProteinIntake
          let leanBodyMassInLb = that.convertToLb(values.WeightInKg - (values.WeightInKg * that.userParams.BodyFatPercentage / 100));

          // Dayly Protein Intake in grams
          that.userParams.DaylyProteinIntake = Math.floor(leanBodyMassInLb * values.PhysicalActivity);

          // Convert gr to protein Blocks
          that.userParams.Blocks = Math.floor(that.userParams.DaylyProteinIntake / 7);

          if(values.Gender == "F" && that.userParams.Blocks <= 11) that.userParams.Blocks = 11;
          else if(values.Gender == "M" && that.userParams.Blocks <= 14) that.userParams.Blocks = 14;
 
          console.log("User params: ", that.userParams);
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
    },
    {
      required: [
        this.paramsService.allParams[2],      // 2 - Weight
        this.paramsService.allParams[3],      // 3 - Height
        this.paramsService.allParams[8]       // 8 - ActivityFactorKcal
      ],
      formula: async () => {

        let values = {
          Gender: this.userParams.Gender,
          Age: this.userParams.Age,
          Weight: this.userParams.Weight,
          Height: this.userParams.Height,
          PhysicalActivity: this.userParams.ActivityFactorKcal
        };

        console.log(values);

        // Calculate base calorie intake
        if(values.Gender == "M"){
          this.userParams.kcal = 66 + (13.7 * values.Weight) + (5 * values.Height) - (6.8 * values.Age);
        }
        else{
          this.userParams.kcal = 655 + (9.6 * values.Weight) + (1.8 * values.Height) - (4.7 * values.Age);
        }
        
        // Multiply by physical activity factor
        this.userParams.kcal *= values.PhysicalActivity;
        
        console.log(this.userParams.kcal);

        this.userParams.kcal = Math.floor(this.userParams.kcal);

        console.log(this.userParams.kcal);

        this.finishCalculations();
      }
    },
    {
      required: [
        this.paramsService.allParams[9],      // 9 - kcal
      ],
      formula: async () => {

        let values = {
          kcal: this.userParams.kcal,
        };
        
        this.userParams.Sugar = values.kcal / 40;

        this.userParams.Sugar = Math.floor(this.userParams.Sugar);

        this.finishCalculations();
      }
    }
  ]


  async closeModal(){
    await this.modalController.dismiss();
  }

}
