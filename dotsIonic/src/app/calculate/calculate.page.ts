import { Component, OnInit } from '@angular/core';

// Services with params
import { ParamsService } from '../services/params.service';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.page.html',
  styleUrls: ['./calculate.page.scss'],
})
export class CalculatePage implements OnInit {

  // Converting measures

  public convertToInches(cm){
    return (Math.floor(parseInt(cm) / 2.54));
  }
  public convertToLb(kg){
    return (Math.floor(parseInt(kg) * 2.204));
  }

  public userParams = {
    gender: "F",
    kcal: 2000
  }

  public currentValues = {};

  public result = {};

  public userResult = {};

  public bodyMassConstants = [];
 
  public params = [
    {
      Title: "age",
      Unit: "y.o.",                                        // 0 - age
      Type: "number"
    },
    // {
    //   Title: "gender",
    //   Options: [
    //     { "Title": "male", "Value": "m" },
    //     { "Title": "female", "Value": "f" }             // 1 - gender
    //   ],
    //   Unit: "",
    //   Type: "checkbox"
    // },
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


  async triggerCalculation(param, values){
    console.log(param, values);
    this.formulas[this.calculators[param]].formula(values);
  }

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
      formula: async (input) => {

        let values = {
          gender: this.userParams.gender,
          weightInKg: input.weight,
          weight: this.convertToLb(input.weight),
          height: this.convertToInches(input.height),
          waist: this.convertToInches(input.waist),
          wrist: this.convertToInches(input.wrist),
          hips: this.convertToInches(input.hips),
          physicalActivity: input.activityFactorZone
        };

        console.log(values);

        let constants = { A: 0, B: 0, C: 0 };
        
        let that = this;
        function setConstants(){
          if(values.gender == "F"){
            constants.A = that.bodyMassConstants.filter((record) => record.Hips == values.hips)[0].Constant;
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

          that.userResult["Blocks"] = that.result.blocksPerDay;
          that.userResult["BodyFatPercentage"] = that.result.fatPercentage;
          that.userResult["DaylyProteinIntake"] = that.result.daylyProteinIntakeInGr;
 
          console.log(that.result, that.userResult);
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
      formula: async (input) => {

        let values = {
          gender: this.userParams.gender,
          age: input.age,
          weight: input.weight,
          height: input.height,
          physicalActivity: input.activityFactorKcal
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

        this.userResult.kcal = Math.floor(this.result.kcal);
        
        console.log(this.result);
      }
    },
    {
      required: [
        this.params[8],      // 8 - kcal
      ],
      formula: async (input) => {

        let values = {
          kcal: input.daylykcal,
        };

        
        this.result.sugar = values.kcal / 40;

        this.userResult.Sugar = Math.floor(this.result.sugar);
        
        console.log(this.result);
      }
    }
  ]

  public values = {
    "nutrition": []
  }

  constructor(
    public paramsService: ParamsService
  ) { }

  ngOnInit() {
  }

}
