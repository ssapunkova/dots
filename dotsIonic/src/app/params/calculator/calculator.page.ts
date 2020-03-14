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
    "blocks": 0,
    "bodyFatPercentage": 0,
    "daylyProteinIntake": 0,
    "kcal": 1,
    "sugar": 2
  }


  async finishCalculations(){
    console.log("User params: ", this.userParams);
    console.log("Saving results");
    
    let that = this;

    console.log(this.param);
    console.log(this.userParams["daylyProteinIntake"]);
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
        this.paramsService.allParams[2],      // 2 - weight
        this.paramsService.allParams[3],      // 3 - height
        this.paramsService.allParams[4],      // 4 - waist
        this.paramsService.allParams[5],      // 5 - wrist
        this.paramsService.allParams[6],      // 6 - hips
        this.paramsService.allParams[7]       // 7 - activity (zone)
      ],
      formula: async () => {

        let values = {
          gender: this.userParams.gender,
          weightInKg: this.userParams.weight,
          weight: this.convertToLb(this.userParams.weight),
          height: this.convertToInches(this.userParams.height),
          waist: this.convertToInches(this.userParams.waist),
          wrist: this.convertToInches(this.userParams.wrist),
          hips: this.convertToInches(this.userParams.hips),
          physicalActivity: this.userParams.activityFactorZone
        };

        console.log("Values: ", values);

        let constants = { A: 0, B: 0, C: 0 };
        
        let that = this;
        function setConstants(){
          if(values.gender == "F"){
            let row = that.bodyMassConstants.filter((record) => record.Hips == values.hips)[0];
            if(row != null){
              constants.A = row.Constant;
            } 
            else{
              console.log("not standart")
            }
            constants.B = parseFloat((values.waist / 1.406).toFixed(2));
            constants.C = parseFloat((values.height / 1.640).toFixed(2));
            
            calculateFatAndBodyMass();
          }
          else{
            let ratio = values.waist - values.wrist;
            let roundedWeight = Math.ceil(values.weight / 5) * 5;
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
          if(values.gender == "F") that.userParams.bodyFatPercentage = Math.floor(constants.A + constants.B - constants.C);
          else that.userParams.bodyFatPercentage = Math.floor(constants.A);

          // Calculate LeanBodyMass weight in Lb, to use for DaylyProteinIntake
          let leanBodyMassInLb = that.convertToLb(values.weightInKg - (values.weightInKg * that.userParams.bodyFatPercentage / 100));

          // Dayly Protein Intake in grams
          that.userParams.daylyProteinIntake = Math.floor(leanBodyMassInLb * values.physicalActivity);

          // Convert gr to protein blocks
          that.userParams.blocks = Math.floor(that.userParams.daylyProteinIntake / 7);

          if(values.gender == "F" && that.userParams.blocks <= 11) that.userParams.blocks = 11;
          else if(values.gender == "M" && that.userParams.blocks <= 14) that.userParams.blocks = 14;
 
          console.log("User params: ", that.userParams);
        }

        if(this.bodyMassConstants.length == 0){
          this.paramsService.getConstants(values.gender).subscribe((data: any) => {
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
        this.paramsService.allParams[2],      // 2 - weight
        this.paramsService.allParams[3],      // 3 - height
        this.paramsService.allParams[8]       // 8 - activityFactorKcal
      ],
      formula: async () => {

        let values = {
          gender: this.userParams.gender,
          age: this.userParams.age,
          weight: this.userParams.weight,
          height: this.userParams.height,
          physicalActivity: this.userParams.activityFactorKcal
        };

        console.log(values);

        // Calculate base calorie intake
        if(values.gender == "M"){
          this.userParams.kcal = 66 + (13.7 * values.weight) + (5 * values.height) - (6.8 * values.age);
        }
        else{
          this.userParams.kcal = 655 + (9.6 * values.weight) + (1.8 * values.height) - (4.7 * values.age);
        }
        
        // Multiply by physical activity factor
        this.userParams.kcal *= values.physicalActivity;
        
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
        
        this.userParams.sugar = values.kcal / 40;

        this.userParams.sugar = Math.floor(this.userParams.sugar);

        this.finishCalculations();
      }
    }
  ]


  async closeModal(){
    await this.modalController.dismiss();
  }

}
