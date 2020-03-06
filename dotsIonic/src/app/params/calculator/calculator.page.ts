import { Component, OnInit, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';


import { ParamsService } from '../../services/params.service';
import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';

@Component({
  selector: 'modal-page',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss']
})

@Injectable()
export class CalculatorPage implements OnInit {

  public userParams;
  public param = {
    Title: null
  };  
  
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
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
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
    "bodybodyFatPercentage": 0,
    "daylyProteinIntake": 0,
    "kcal": 1,
    "sugar": 2
  }


  // public params = [
  //   {
  //     Title: "age",
  //     Unit: "y.o.",                                        // 0 - age
  //     Type: "number"
  //   },
  //   {
  //     Title: "weight",
  //     Unit: "kg",                                          // 1 - weight
  //     Type: "number"
  //   },
  //   {
  //     Title: "height",
  //     Unit: "cm",                                          // 2 - height
  //     Type: "number"
  //   },
  //   {
  //     Title: "waist",
  //     Unit: "cm",                                          // 3 - waist
  //     Type: "number"
  //   },
  //   {
  //     Title: "wrist",
  //     Unit: "cm",                                          // 4 - waist
  //     Type: "number"
  //   },
  //   {
  //     Title: "hips",
  //     Unit: "cm",                                          // 5 - hips
  //     Type: "number"
  //   },
  //   {
  //     Title: "activityFactorZone",
  //     Options: [
  //       { "Title": "seditary", "Value": 0.5 },
  //       { "Title": "light", "Value": 0.6 },    
  //       { "Title": "workout3TimesAWeek", "Value": 0.7 },   // 6 - activity factor for Zone calculations
  //       { "Title": "lightWorkoutEveryDay", "Value": 0.8 },
  //       { "Title": "heavyWorkoutEveryDay", "Value": 0.9 },
  //       { "Title": "professional", "Value": 1 }
  //     ],
  //     Type: "select"
  //   },
  //   {
  //     Title: "activityFactorKcal",
  //     Options: [
  //       { "Title": "low", "Value": 1.2 },
  //       { "Title": "average", "Value": 1.3 },              // 7 - activity factor for kcal calculations
  //       { "Title": "heavy", "Value": 1.4 },   
  //     ],
  //     Type: "select"
  //   },
  //   {
  //     Title: "kcal",
  //     Unit: "kcal",                                        // 8 - kcal intake
  //     Type: "number"
  //   },
  // ]

  async finishCalculations(){
    console.log("User params: ", this.userParams);
    console.log("Saving results");
    await this.modalController.dismiss(this.userParams);
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

        console.log(values);

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
            console.log(roundedWeight);
            console.log(row);
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

        }


        function calculateFatAndBodyMass(){

          // Body fat percentage
          if(values.gender == "F") that.userParams.bodyFatPercentage = Math.floor(constants.A + constants.B - constants.C);
          else that.userParams.bodyFatPercentage = Math.floor(constants.A);

          // Calculate LeanBodyMass weight in Lb, to use for DaylyProteinIntake
          let leanBodyMassInLb = that.convertToLb(values.weightInKg - (values.weightInKg * that.userParams.bodyFatPercentage / 100));

          // Dayly Protein Intake in grams
          that.userParams.daylyProteinIntake = leanBodyMassInLb * values.physicalActivity;

          // Convert gr to protein blocks
          that.userParams.blocks = Math.floor(that.userParams.daylyProteinIntake / 7);

          if(values.gender == "F" && that.userParams.blocks <= 11) that.userParams.blocks = 11;
          else if(values.gender == "M" && that.userParams.blocks <= 14) that.userParams.blocks = 14;
 
          console.log(that.userParams, that.userParams);
        }

        if(this.bodyMassConstants.length == 0){
          this.paramsService.getConstants(values.gender).subscribe((data: any) => {
            console.log(data);
            this.bodyMassConstants = data;
            setConstants();
          });
        }
        else{
          setConstants();
        }

        this.finishCalculations();

      }
    },
    {
      required: [
        this.paramsService.allParams[0],      // 0 - age
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

        // Calculate base calorie intake
        if(values.gender == "M"){
          this.userParams.kcal = 66 + (13.7 * values.weight) + (5 * values.height) - (6.8 * values.age);
        }
        else{
          this.userParams.kcal = 655 + (9.6 * values.weight) + (1.8 * values.height) - (4.7 * values.age);
        }
        
        // Multiply by physical activity factor
        this.userParams.kcal *= values.physicalActivity;

        this.userParams.kcal = Math.floor(this.userParams.kcal);

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
