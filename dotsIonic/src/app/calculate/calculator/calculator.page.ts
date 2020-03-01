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

  public userParams = {
    gender: null,
    age: null,
    height: null,
    weight: null,
    hips: null,
    wrist: null,
    waist: null,
    kcal: null,
    sugar: null,
    activityFactorKcal: null,
    activityFactorZone: null
  };
  public param = {
    Title: null
  };  

  public result = {
    kcal: null,
    fatPercentage: null,
    leanBodyMassInLb: null,
    daylyProteinIntakeInGr: null,
    daylykcal: null,
    blocksPerDay: null,
    sugar: null
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
    console.log(this.param);
  }

  async triggerCalculation(){
    console.log(this.param, this.result);
    this.formulas[this.calculators[this.param.Title]].formula();
  }

  public bodyMassConstants = [];


  public params = [
    {
      Title: "age",
      Unit: "y.o.",                                        // 0 - age
      Type: "number"
    },
    {
      Title: "weight",
      Unit: "kg",                                          // 1 - weight
      Type: "number"
    },
    {
      Title: "height",
      Unit: "cm",                                          // 2 - height
      Type: "number"
    },
    {
      Title: "waist",
      Unit: "cm",                                          // 3 - waist
      Type: "number"
    },
    {
      Title: "wrist",
      Unit: "cm",                                          // 4 - waist
      Type: "number"
    },
    {
      Title: "hips",
      Unit: "cm",                                          // 5 - hips
      Type: "number"
    },
    {
      Title: "activityFactorZone",
      Options: [
        { "Title": "Seditary", "Value": 0.5 },
        { "Title": "Light", "Value": 0.6 },    
        { "Title": "Workout3TimesAWeek", "Value": 0.7 },   // 6 - activity factor for Zone calculations
        { "Title": "LightWorkoutEveryDay", "Value": 0.8 },
        { "Title": "HeavyWorkoutEveryDay", "Value": 0.9 },
        { "Title": "Professional", "Value": 1 }
      ],
      Type: "select"
    },
    {
      Title: "activityFactorKcal",
      Options: [
        { "Title": "Low", "Value": 1.2 },
        { "Title": "Average", "Value": 1.3 },              // 7 - activity factor for kcal calculations
        { "Title": "Heavy", "Value": 1.4 },   
      ],
      Type: "select"
    },
    {
      Title: "daylykcal",
      Unit: "kcal",                                        // 8 - dayly kcal intake
      Type: "number"
    },
  ]

  public calculators = {
    "Blocks": 0,
    "BodyFatPercentage": 0,
    "DaylyProteinIntake": 0,
    "kcal": 1,
    "Sugar": 2
  }

  public formulas = [
    {
      required: [
        this.params[1],      // 1 - weight
        this.params[2],      // 2 - height
        this.params[3],      // 3 - waist
        this.params[4],      // 4 - wrist
        this.params[5],      // 5 - hips
        this.params[6]       // 6 - activity
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
            constants.A = row.Values[0][ratio];
            console.log(ratio);
            if(constants.A != null){
              calculateFatAndBodyMass();
            }
          }
          console.log(constants);

        }


        function calculateFatAndBodyMass(){

          // Body fat percentage
          if(values.gender == "F") that.result.fatPercentage = Math.floor(constants.A + constants.B - constants.C);
          else that.result.fatPercentage = Math.floor(constants.A);

          // Calculate LeanBodyMass weight in Lb, to use for DaylyProteinIntakeInGr
          that.result.leanBodyMassInLb = that.convertToLb(values.weightInKg - (values.weightInKg * that.result.fatPercentage / 100));

          // Dayly Protein Intake in grams
          that.result.daylyProteinIntakeInGr = that.result.leanBodyMassInLb * values.physicalActivity;

          // Convert gr to protein blocks
          that.result.blocksPerDay = Math.floor(that.result.daylyProteinIntakeInGr / 7);

          if(values.gender == "F" && that.result.blocksPerDay <= 11) that.result.blocksPerDay = 11;
          else if(values.gender == "M" && that.result.blocksPerDay <= 14) that.result.blocksPerDay = 14;

          that.userParams["Blocks"] = that.result.blocksPerDay;
          that.userParams["BodyFatPercentage"] = that.result.fatPercentage;
          that.userParams["DaylyProteinIntake"] = that.result.daylyProteinIntakeInGr;
 
          console.log(that.result, that.userParams);
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

      }
    },
    {
      required: [
        this.params[0],      // 0 - age
        this.params[1],      // 1 - weight
        this.params[2],      // 2 - height
        this.params[7]       // 7 - activityFactorKcal
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
          this.result.kcal = 66 + (13.7 * values.weight) + (5 * values.height) - (6.8 * values.age);
        }
        else{
          this.result.kcal = 655 + (9.6 * values.weight) + (1.8 * values.height) - (4.7 * values.age);
        }
        
        // Multiply by physical activity factor
        this.result.kcal *= values.physicalActivity;

        this.userParams.kcal = Math.floor(this.result.kcal);
        
        console.log(this.result);
      }
    },
    {
      required: [
        this.params[8],      // 8 - kcal
      ],
      formula: async () => {

        let values = {
          kcal: this.result.daylykcal,
        };

        
        this.result.sugar = values.kcal / 40;

        this.userParams.sugar = Math.floor(this.result.sugar);
        
        console.log(this.result);
      }
    }
  ]


  async closeModal(){
    await this.modalController.dismiss(this.userParams );
  }

}
